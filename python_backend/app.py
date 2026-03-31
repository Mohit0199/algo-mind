from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from sklearn.datasets import make_classification, make_moons, make_circles, make_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, plot_tree
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, AdaBoostClassifier, AdaBoostRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
from sklearn.cluster import KMeans, DBSCAN
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VisualizeRequest(BaseModel):
    algorithm: str
    dataset: str
    task_type: str = "classification"  # Added task type support (classification vs regression)
    hyperparameters: dict

def generate_dataset(dataset_type, is_regression=False):
    if is_regression:
        if dataset_type == 'linear':
            # Moderate noise so regression line is visible but not trivially perfect
            X, y = make_regression(n_samples=250, n_features=1, noise=35, random_state=42)
        else: # sine wave
            X = np.sort(6 * np.random.RandomState(42).rand(250, 1), axis=0)
            y = np.sin(X).ravel() * 50 + np.random.RandomState(7).normal(0, 8, X.shape[0])
        return X, y
    else:
        if dataset_type == 'moons':
            # High noise — makes it very hard so depth matters
            X, y = make_moons(n_samples=350, noise=0.35, random_state=42)
        elif dataset_type == 'circles':
            # Tight factor + high noise — extreme challenge
            X, y = make_circles(n_samples=350, noise=0.25, factor=0.4, random_state=42)
        else: # blobs — overlapping 3 classes instead of 2, low separation
            from sklearn.datasets import make_blobs
            X, y = make_blobs(n_samples=350, centers=3, cluster_std=1.8, random_state=42)
            # Limit to 2 classes for binary classifiers
            mask = y < 2
            X, y = X[mask], y[mask]
        return X, y

def generate_clustering_dataset(dataset_type):
    """Dedicated dataset for unsupervised algorithms — intentionally ambiguous."""
    from sklearn.datasets import make_blobs
    if dataset_type == 'moons':
        # Two interleaved arcs — great for DBSCAN
        X, _ = make_moons(n_samples=400, noise=0.12, random_state=42)
    else:  # blobs (default for clustering)
        # 4 overlapping blobs — so K=2,3,4 all look meaningfully different
        X, _ = make_blobs(n_samples=400, centers=[
            [-2.5, -2.5], [2.5, -2.5], [0, 2.5], [0, -0.5]
        ], cluster_std=[0.8, 0.8, 0.8, 1.4], random_state=42)
    return X


@app.post("/api/visualize")
async def visualize_algorithm(req: VisualizeRequest):
    try:
        algo = req.algorithm
        ds_type = req.dataset
        params = req.hyperparameters
        
        is_regression = (req.task_type == 'regression')
        X, y = generate_dataset(ds_type, is_regression)
        
        metrics = {}
        fig = None
        tree_img_base64 = None
        
        # -----------------------------
        # 1. Decision Tree (Classification & Regression)
        # -----------------------------
        if algo == 'decision_tree':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=9)
            
            is_regression_task = (req.task_type == 'regression')
            ModelClass = DecisionTreeRegressor if is_regression_task else DecisionTreeClassifier
            
            clf = ModelClass(
                criterion=params.get('criterion', 'squared_error' if is_regression_task else 'gini'),
                max_depth=params.get('max_depth', None) if params.get('max_depth', 0) > 0 else None,
                min_samples_split=params.get('min_samples_split', 2),
                min_samples_leaf=params.get('min_samples_leaf', 1)
            )
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                
                # Plot regression line
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='indigo', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='red', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                
                # Meshgrid for background contour
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='RdBu', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='RdBu', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')
            
            # Generate Base64 tree plot from matplotlib
            plt_fig, ax = plt.subplots(figsize=(10, 8))
            try:
                plot_tree(clf, filled=True, ax=ax, feature_names=["F1", "F2"] if not is_regression_task else ["X"], class_names=["Class0", "Class1"] if not is_regression_task else None)
                buffer = BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight')
                plt.close(plt_fig)
                buffer.seek(0)
                tree_img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
            except Exception:
                tree_img_base64 = None

        # -----------------------------
        # 2. Random Forest
        # -----------------------------
        elif algo == 'random_forest':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=9)
            
            is_regression_task = (req.task_type == 'regression')
            ModelClass = RandomForestRegressor if is_regression_task else RandomForestClassifier
            
            clf = ModelClass(
                n_estimators=params.get('n_estimators', 100),
                criterion=params.get('criterion', 'squared_error' if is_regression_task else 'gini'),
                max_depth=params.get('max_depth', None) if params.get('max_depth', 0) > 0 else None,
                min_samples_split=params.get('min_samples_split', 2),
                min_samples_leaf=params.get('min_samples_leaf', 1),
                bootstrap=params.get('bootstrap', "True") == "True"  # Simple string conversion from UI
            )
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='teal', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='orange', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Viridis', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Viridis', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 3. K-Nearest Neighbors (KNN)
        # -----------------------------
        elif algo == 'knn':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            
            is_regression_task = (req.task_type == 'regression')
            ModelClass = KNeighborsRegressor if is_regression_task else KNeighborsClassifier
            
            clf = ModelClass(
                n_neighbors=int(params.get('n_neighbors', 5)),
                weights=params.get('weights', 'uniform'),
                algorithm=params.get('algorithm', 'auto'),
                p=int(params.get('p', 2))
            )
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='magenta', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='yellow', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Plasma', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Plasma', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 4. Support Vector Machine (SVM)
        # -----------------------------
        elif algo == 'svm':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            
            is_regression_task = (req.task_type == 'regression')
            ModelClass = SVR if is_regression_task else SVC
            
            # Gamma can be "scale", "auto", or float. Slider provides float. 
            # We map strings if needed, but our UI maps to floats
            gamma_val = params.get('gamma', 0.1)
            if str(gamma_val).lower() in ['scale', 'auto']:
                gamma_val = str(gamma_val).lower()
                
            clf = ModelClass(
                C=float(params.get('C', 1.0)),
                kernel=params.get('kernel', 'rbf'),
                degree=int(params.get('degree', 3)),
                gamma=gamma_val
            )
            
            if is_regression_task:
                clf.epsilon = float(params.get('epsilon', 0.1))
                
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='gray', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='cyan', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='RdBu', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='RdBu', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 5. AdaBoost
        # -----------------------------
        elif algo == 'adaboost':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            
            is_regression_task = (req.task_type == 'regression')
            ModelClass = AdaBoostRegressor if is_regression_task else AdaBoostClassifier
            
            clf = ModelClass(
                n_estimators=int(params.get('n_estimators', 50)),
                learning_rate=float(params.get('learning_rate', 1.0)),
                random_state=42
            )
            
            if is_regression_task:
                clf.loss = params.get('loss', 'linear')
                
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='pink', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='red', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Inferno', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Inferno', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 6. Naive Bayes
        # -----------------------------
        elif algo == 'naive_bayes':
            from sklearn.naive_bayes import GaussianNB
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            
            clf = GaussianNB(var_smoothing=float(params.get('var_smoothing', 1e-9)))
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
            
            x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
            y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
            xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
            Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
            
            contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Cividis', opacity=0.3, showscale=False, hoverinfo='skip')
            scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Cividis', size=8, line=dict(width=1, color='white')))
            fig = go.Figure(data=[contour, scatter])
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 7. XGBoost
        # -----------------------------
        elif algo == 'xgboost':
            try:
                from xgboost import XGBClassifier, XGBRegressor
            except ImportError:
                # Fallback if xgboost somehow failed to install or isn't available
                from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
                XGBClassifier = GradientBoostingClassifier
                XGBRegressor = GradientBoostingRegressor
                
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            is_regression_task = (req.task_type == 'regression')
            ModelClass = XGBRegressor if is_regression_task else XGBClassifier
            
            # Map parameters intelligently between XGBoost and GradientBoosting fallback
            if ModelClass.__name__.startswith("XGB"):
                clf = ModelClass(
                    n_estimators=int(params.get('n_estimators', 100)),
                    learning_rate=float(params.get('learning_rate', 0.1)),
                    max_depth=int(params.get('max_depth', 3)),
                    gamma=float(params.get('gamma', 0.0)),
                    reg_alpha=float(params.get('reg_alpha', 0.0)),
                    reg_lambda=float(params.get('reg_lambda', 1.0)),
                    subsample=float(params.get('subsample', 1.0)),
                    eval_metric='rmse' if is_regression_task else 'logloss'
                )
            else:
                clf = ModelClass(
                    n_estimators=int(params.get('n_estimators', 100)),
                    learning_rate=float(params.get('learning_rate', 0.1)),
                    max_depth=int(params.get('max_depth', 3)),
                    subsample=float(params.get('subsample', 1.0))
                )
                
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='lightgreen', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='darkgreen', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Greens', opacity=0.3, showscale=False, hoverinfo='skip')
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Greens', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 8. Logistic Regression



        # -----------------------------
        elif algo == 'logistic_regression':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            penalty = params.get('penalty', 'l2')
            if penalty == 'none': penalty = None
            clf = LogisticRegression(C=params.get('C', 1.0), penalty=penalty, solver='lbfgs' if penalty != 'l1' else 'liblinear', max_iter=params.get('max_iter', 100))
            clf.fit(X_train, y_train)
            
            metrics['Accuracy'] = float(accuracy_score(y_test, clf.predict(X_test)))
            
            x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
            y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
            xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
            Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
            
            contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Viridis', opacity=0.3, showscale=False)
            scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Viridis', size=8, line=dict(width=1, color='white')))
            fig = go.Figure(data=[contour, scatter])
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 3. K-Means
        # -----------------------------
        elif algo == 'kmeans_clustering':
            n_clusters = int(params.get('n_clusters', 3))
            # Use clustering-specific dataset for dramatic visual differences
            X_clust = generate_clustering_dataset(ds_type)
            clf = KMeans(n_clusters=n_clusters, init=params.get('init', 'k-means++'), max_iter=int(params.get('max_iter', 100)), n_init=10, random_state=42)
            cluster_labels = clf.fit_predict(X_clust)
            
            metrics['Inertia (Error)'] = float(round(clf.inertia_, 2))
            metrics['Clusters'] = n_clusters
            
            x_min, x_max = X_clust[:, 0].min() - 1, X_clust[:, 0].max() + 1
            y_min, y_max = X_clust[:, 1].min() - 1, X_clust[:, 1].max() + 1
            xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.08), np.arange(y_min, y_max, 0.08))
            Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
            
            contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Rainbow', opacity=0.2, showscale=False)
            scatter = go.Scatter(x=X_clust[:, 0], y=X_clust[:, 1], mode='markers', marker=dict(color=cluster_labels, colorscale='Rainbow', size=8, line=dict(width=1, color='white')))
            centroids = go.Scatter(x=clf.cluster_centers_[:, 0], y=clf.cluster_centers_[:, 1], mode='markers', marker=dict(color='white', symbol='x', size=16, line=dict(width=3, color='white')), name='Centroids')
            
            fig = go.Figure(data=[contour, scatter, centroids])
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')

        # -----------------------------
        # 4. Linear Regression
        # -----------------------------
        elif algo == 'linear_regression':
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            clf = LinearRegression()
            clf.fit(X_train, y_train) # note: hyperparameters like 'noise' actually affected the dataset generation, which we aren't hooking up perfectly here yet but will later
            
            y_pred = clf.predict(X_test)
            metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
            
            x_range = np.linspace(X.min(), X.max(), 100)
            y_range = clf.predict(x_range.reshape(-1, 1))
            
            scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='indigo', size=8))
            line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='red', width=3))
            
            fig = go.Figure(data=[scatter, line])
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)
        
        # -----------------------------
        # 9. DBSCAN (Clustering)
        # -----------------------------
        elif algo == 'dbscan':
            # Use clustering-specific dataset for dramatic visual eps sensitivity
            X_clust = generate_clustering_dataset(ds_type)
            clf = DBSCAN(
                eps=float(params.get('eps', 0.5)),
                min_samples=int(params.get('min_samples', 5)),
                metric=params.get('metric', 'euclidean')
            )
            labels = clf.fit_predict(X_clust)
            
            # Compute stats (-1 is noise)
            unique_labels = set(labels)
            n_clusters_ = len(unique_labels) - (1 if -1 in labels else 0)
            n_noise_ = list(labels).count(-1)
            
            metrics['Estimated Clusters'] = n_clusters_
            metrics['Noise Points'] = n_noise_
            
            fig = go.Figure()
            
            # Plot Noise as grey crosses
            noise_mask = (labels == -1)
            if noise_mask.any():
                fig.add_trace(go.Scatter(
                    x=X_clust[noise_mask, 0], y=X_clust[noise_mask, 1],
                    mode='markers', marker=dict(color='rgba(150, 150, 150, 0.5)', size=6, symbol='x'),
                    name='Noise', hoverinfo='none'
                ))
            
            clusters = list(unique_labels - {-1})
            CLUSTER_COLORS = ['rgba(99,102,241,0.9)','rgba(52,211,153,0.9)','rgba(251,146,60,0.9)','rgba(244,63,94,0.9)','rgba(34,211,238,0.9)','rgba(167,139,250,0.9)','rgba(234,179,8,0.9)','rgba(236,72,153,0.9)','rgba(20,184,166,0.9)','rgba(245,158,11,0.9)']
            if len(clusters) > 0:
                for idx, k in enumerate(clusters):
                    class_mask = (labels == k)
                    rgba = CLUSTER_COLORS[idx % len(CLUSTER_COLORS)]
                    fig.add_trace(go.Scatter(
                        x=X_clust[class_mask, 0], y=X_clust[class_mask, 1],
                        mode='markers', marker=dict(color=rgba, size=9, line=dict(width=1, color='white')),
                        name=f'Cluster {k}', hoverinfo='none'
                    ))
                    
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        # -----------------------------
        # 10. Agglomerative Clustering
        # -----------------------------
        elif algo == 'agglomerative_clustering':
            from sklearn.cluster import AgglomerativeClustering
            
            linkage = params.get('linkage', 'ward')
            metric = params.get('metric', 'euclidean')
            
            # Ward only accepts euclidean
            if linkage == 'ward' and metric != 'euclidean':
                metric = 'euclidean'
                
            clf = AgglomerativeClustering(
                n_clusters=int(params.get('n_clusters', 2)),
                linkage=linkage,
                metric=metric
            )
            
            cluster_labels = clf.fit_predict(X)
            
            # Compute stats
            unique_labels = set(cluster_labels)
            n_clusters_ = len(unique_labels)
            
            metrics['Formed Clusters'] = n_clusters_
            
            fig = go.Figure()
            
            CLUSTER_COLORS = ['rgba(99,102,241,0.9)','rgba(52,211,153,0.9)','rgba(251,146,60,0.9)','rgba(244,63,94,0.9)','rgba(34,211,238,0.9)','rgba(167,139,250,0.9)','rgba(234,179,8,0.9)','rgba(236,72,153,0.9)','rgba(20,184,166,0.9)','rgba(245,158,11,0.9)']
            clusters = list(unique_labels)
            if len(clusters) > 0:
                for idx, k in enumerate(clusters):
                    class_mask = (cluster_labels == k)
                    rgba = CLUSTER_COLORS[idx % len(CLUSTER_COLORS)]
                    fig.add_trace(go.Scatter(
                        x=X[class_mask, 0], y=X[class_mask, 1],
                        mode='markers', marker=dict(color=rgba, size=9, line=dict(width=1, color='white')),
                        name=f'Cluster {k}', hoverinfo='none'
                    ))
                    
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        # -----------------------------
        # 11. Gradient Boosting
        # -----------------------------
        elif algo == 'gradient_boosting':
            from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
            
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
            is_regression = (req.task_type == 'regression')
            
            if is_regression:
                clf = GradientBoostingRegressor(
                    n_estimators=int(params.get('n_estimators', 100)),
                    learning_rate=float(params.get('learning_rate', 0.1)),
                    max_depth=int(params.get('max_depth', 3)),
                    subsample=float(params.get('subsample', 1.0)),
                    loss=params.get('loss', 'squared_error'),
                    random_state=42
                )
            else:
                clf = GradientBoostingClassifier(
                    n_estimators=int(params.get('n_estimators', 100)),
                    learning_rate=float(params.get('learning_rate', 0.1)),
                    max_depth=int(params.get('max_depth', 3)),
                    subsample=float(params.get('subsample', 1.0)),
                    min_samples_split=int(params.get('min_samples_split', 2)),
                    min_samples_leaf=int(params.get('min_samples_leaf', 1)),
                    random_state=42
                )
            
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                x_range = np.linspace(X.min(), X.max(), 100)
                y_range = clf.predict(x_range.reshape(-1, 1))
                
                scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='teal', size=8))
                line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='orange', width=3))
                fig = go.Figure(data=[scatter, line])
            else:
                metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1), np.arange(y_min, y_max, 0.1))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Spectral', opacity=0.3, showscale=False)
                scatter = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale='Spectral', size=8, line=dict(width=1, color='white')))
                fig = go.Figure(data=[contour, scatter])
                
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        else:
            raise HTTPException(status_code=400, detail="Algorithm visualization not mapped dynamically yet.")
            
        
        # Convert figure to JSON safely without numpy array serialization crashes
        import json
        fig_json = json.loads(fig.to_json()) if fig else None
        
        return {
            "metrics": metrics,
            "plotly_json": fig_json,
            "extra_graphics": {"tree_base64": tree_img_base64} if tree_img_base64 else None
        }

    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"{str(e)}\n{traceback.format_exc()}")
