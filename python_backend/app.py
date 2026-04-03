from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from sklearn.datasets import make_classification, make_moons, make_circles, make_regression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, confusion_matrix
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.svm import SVC, SVR
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor, plot_tree
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, AdaBoostClassifier, AdaBoostRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.naive_bayes import GaussianNB
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
    task_type: str = "classification"
    is_3d: bool = False
    hyperparameters: dict

def generate_dataset(dataset_type, is_regression=False, is_3d=False):
    if is_regression:
        n_features = 2 if is_3d else 1
        if dataset_type == 'linear':
            X, y = make_regression(n_samples=250, n_features=n_features, noise=35, random_state=42)
        else: # sine wave
            if is_3d:
                X = np.sort(6 * np.random.RandomState(42).rand(250, 2), axis=0)
                y = (np.sin(X[:,0]).ravel() * 50 + np.cos(X[:,1]).ravel() * 50) + np.random.RandomState(7).normal(0, 8, X.shape[0])
            else:
                X = np.sort(6 * np.random.RandomState(42).rand(250, 1), axis=0)
                y = np.sin(X).ravel() * 50 + np.random.RandomState(7).normal(0, 8, X.shape[0])
        return X, y
    else:
        if dataset_type == 'moons':
            X, y = make_moons(n_samples=350, noise=0.35, random_state=42)
        elif dataset_type == 'circles':
            X, y = make_circles(n_samples=350, noise=0.25, factor=0.4, random_state=42)
        else:
            from sklearn.datasets import make_blobs
            X, y = make_blobs(n_samples=350, centers=3, cluster_std=1.8, random_state=42)
            mask = y < 2
            X, y = X[mask], y[mask]
        return X, y

def generate_clustering_dataset(dataset_type):
    from sklearn.datasets import make_blobs
    if dataset_type == 'moons':
        X, _ = make_moons(n_samples=400, noise=0.12, random_state=42)
    else: 
        X, _ = make_blobs(n_samples=400, centers=[
            [-2.5, -2.5], [2.5, -2.5], [0, 2.5], [0, -0.5]
        ], cluster_std=[0.8, 0.8, 0.8, 1.4], random_state=42)
    return X

def build_classification_fig(clf, X, y, y_pred, X_test, y_test, colorscale='RdBu', is_3d=False):
    if is_3d:
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        # Step size is increased for 3D speed visually
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.2), np.arange(y_min, y_max, 0.2))
        grid = np.c_[xx.ravel(), yy.ravel()]
        
        if hasattr(clf, 'predict_proba'):
            Z = clf.predict_proba(grid)[:, 1].reshape(xx.shape)
        elif hasattr(clf, 'decision_function'):
            Z = clf.decision_function(grid).reshape(xx.shape)
            Z = 1 / (1 + np.exp(-Z))  # normalize to 0-1 range approx for visuals
        else:
            Z = clf.predict(grid).reshape(xx.shape)
            
        surface = go.Surface(z=Z, x=xx, y=yy, colorscale=colorscale, opacity=0.8, showscale=False)
        
        correct_mask = y_pred == y_test
        wrong_mask = y_pred != y_test
        
        z_correct = y_test[correct_mask]
        z_wrong = y_test[wrong_mask]
        
        scat_correct = go.Scatter3d(x=X_test[correct_mask, 0], y=X_test[correct_mask, 1], z=z_correct, mode='markers', marker=dict(color=z_correct, colorscale=colorscale, size=4, line=dict(width=1, color='green')), name='Correct')
        scat_wrong = go.Scatter3d(x=X_test[wrong_mask, 0], y=X_test[wrong_mask, 1], z=z_wrong, mode='markers', marker=dict(color='yellow', size=8, symbol='cross', line=dict(width=2, color='red')), name='Misclassified')
        
        fig = go.Figure(data=[surface, scat_correct, scat_wrong])
        fig.update_layout(scene=dict(xaxis_title='Feature 1', yaxis_title='Feature 2', zaxis_title='Target Prob'), margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=True)
        return fig
    else:
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
        Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
        
        contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale=colorscale, opacity=0.4, showscale=False, hoverinfo='skip')
        
        # Train points (Dimmed)
        scat_train = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale=colorscale, size=5, opacity=0.15, line=dict(width=0.5, color='gray')), name='Train Data')
        
        correct_mask = y_pred == y_test
        wrong_mask = y_pred != y_test
        
        scat_correct = go.Scatter(x=X_test[correct_mask, 0], y=X_test[correct_mask, 1], mode='markers', marker=dict(color=y_test[correct_mask], colorscale=colorscale, size=8, line=dict(width=1, color='white')), name='Correctly Classified')
        scat_wrong = go.Scatter(x=X_test[wrong_mask, 0], y=X_test[wrong_mask, 1], mode='markers', marker=dict(color=y_test[wrong_mask], colorscale=colorscale, size=12, symbol='circle-open', line=dict(width=3, color='red')), name='False Predict (Error)')
        
        fig = go.Figure(data=[contour, scat_train, scat_correct, scat_wrong])
        fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1))
        return fig

def build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d=False):
    if is_3d:
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.4), np.arange(y_min, y_max, 0.4))
        grid = np.c_[xx.ravel(), yy.ravel()]
        Z = clf.predict(grid).reshape(xx.shape)
        
        surface = go.Surface(z=Z, x=xx, y=yy, colorscale='Viridis', opacity=0.7, showscale=False)
        scatter = go.Scatter3d(x=X[:, 0], y=X[:, 1], z=y, mode='markers', marker=dict(color=y, colorscale='Viridis', size=4), name='Actual Data')
        
        fig = go.Figure(data=[surface, scatter])
        fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)
        return fig
    else:    
        x_range = np.linspace(X.min(), X.max(), 100)
        y_range = clf.predict(x_range.reshape(-1, 1))
        scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='indigo', size=8), name='Data')
        line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='red', width=3), name='Prediction')
        fig = go.Figure(data=[scatter, line])
        fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=True)
        return fig

@app.post("/api/visualize")
async def visualize_algorithm(req: VisualizeRequest):
    try:
        algo = req.algorithm
        ds_type = req.dataset
        params = req.hyperparameters
        is_3d = req.is_3d
        is_regression_task = (req.task_type == 'regression')
        
        X, y = generate_dataset(ds_type, is_regression_task, getattr(req, 'is_3d', False))
        
        metrics = {}
        fig = None
        tree_img_base64 = None
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

        def set_classification_metrics(yt, yp):
            metrics['Accuracy'] = float(accuracy_score(yt, yp))
            cm = confusion_matrix(yt, yp)
            # Safe parsing for binary classification matrices
            metrics['Confusion Matrix'] = {
                'TN': int(cm[0,0]) if cm.size > 0 else 0, 
                'FP': int(cm[0,1]) if cm.shape[1] > 1 else 0, 
                'FN': int(cm[1,0]) if cm.shape[0] > 1 else 0, 
                'TP': int(cm[1,1]) if cm.shape[0] > 1 and cm.shape[1] > 1 else 0
            }

        # 1. Decision Tree
        if algo == 'decision_tree':
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
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'RdBu', is_3d)
                
            plt_fig, ax = plt.subplots(figsize=(10, 8))
            try:
                plot_tree(clf, filled=True, ax=ax, feature_names=["F1", "F2"] if not is_regression_task else (["X1", "X2"] if is_3d else ["X"]), class_names=["Class0", "Class1"] if not is_regression_task else None)
                buffer = BytesIO()
                plt.savefig(buffer, format='png', bbox_inches='tight')
                plt.close(plt_fig)
                buffer.seek(0)
                tree_img_base64 = base64.b64encode(buffer.read()).decode('utf-8')
            except Exception:
                tree_img_base64 = None

        # 2. Random Forest
        elif algo == 'random_forest':
            ModelClass = RandomForestRegressor if is_regression_task else RandomForestClassifier
            clf = ModelClass(
                n_estimators=int(params.get('n_estimators', 100)),
                criterion=params.get('criterion', 'squared_error' if is_regression_task else 'gini'),
                max_depth=params.get('max_depth', None) if params.get('max_depth', 0) > 0 else None,
                min_samples_split=int(params.get('min_samples_split', 2)),
                min_samples_leaf=int(params.get('min_samples_leaf', 1)),
                bootstrap=params.get('bootstrap', "True") == "True"
            )
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Viridis', is_3d)

        # 3. K-Nearest Neighbors
        elif algo == 'knn':
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
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Plasma', is_3d)

        # 4. Support Vector Machine
        elif algo == 'svm':
            ModelClass = SVR if is_regression_task else SVC
            gamma_val = params.get('gamma', 0.1)
            clf = ModelClass(
                C=float(params.get('C', 1.0)),
                kernel=params.get('kernel', 'rbf'),
                degree=int(params.get('degree', 3)),
                gamma=str(gamma_val).lower() if str(gamma_val).lower() in ['scale', 'auto'] else float(gamma_val),
            )
            if not is_regression_task:
                clf.probability = True # Required for 3D probability mapping
            else:
                clf.epsilon = float(params.get('epsilon', 0.1))
                
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'RdBu', is_3d)

        # 5. AdaBoost
        elif algo == 'adaboost':
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
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Inferno', is_3d)

        # 6. Naive Bayes
        elif algo == 'naive_bayes':
            clf = GaussianNB(var_smoothing=float(params.get('var_smoothing', 1e-9)))
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            set_classification_metrics(y_test, y_pred)
            fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Cividis', is_3d)

        # 7. XGBoost
        elif algo == 'xgboost':
            from xgboost import XGBClassifier, XGBRegressor
            ModelClass = XGBRegressor if is_regression_task else XGBClassifier
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
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            if is_regression_task:
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Greens', is_3d)

        # 8. Logistic Regression
        elif algo == 'logistic_regression':
            penalty = params.get('penalty', 'l2')
            if penalty == 'none': penalty = None
            clf = LogisticRegression(C=float(params.get('C', 1.0)), penalty=penalty, solver='lbfgs' if penalty != 'l1' else 'liblinear', max_iter=int(params.get('max_iter', 100)))
            clf.fit(X_train, y_train)
            y_pred = clf.predict(X_test)
            
            set_classification_metrics(y_test, y_pred)
            fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Viridis', is_3d)

        # 9. KMeans Clustering
        elif algo == 'kmeans_clustering':
            n_clusters = int(params.get('n_clusters', 3))
            X_clust = generate_clustering_dataset(ds_type)
            clf = KMeans(n_clusters=n_clusters, init=params.get('init', 'k-means++'), max_iter=int(params.get('max_iter', 100)), n_init=10, random_state=42)
            cluster_labels = clf.fit_predict(X_clust)
            
            metrics['Inertia (Error)'] = float(round(clf.inertia_, 2))
            metrics['Clusters'] = n_clusters
            
            if is_3d:
                scatter = go.Scatter3d(x=X_clust[:, 0], y=X_clust[:, 1], z=cluster_labels, mode='markers', marker=dict(color=cluster_labels, colorscale='Rainbow', size=6, line=dict(width=1, color='white')))
                centroids = go.Scatter3d(x=clf.cluster_centers_[:, 0], y=clf.cluster_centers_[:, 1], z=np.arange(n_clusters), mode='markers', marker=dict(color='white', symbol='x', size=10, line=dict(width=2, color='white')), name='Centroids')
                fig = go.Figure(data=[scatter, centroids])
                fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)')
            else:
                x_min, x_max = X_clust[:, 0].min() - 1, X_clust[:, 0].max() + 1
                y_min, y_max = X_clust[:, 1].min() - 1, X_clust[:, 1].max() + 1
                xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.08), np.arange(y_min, y_max, 0.08))
                Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
                contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale='Rainbow', opacity=0.2, showscale=False)
                scatter = go.Scatter(x=X_clust[:, 0], y=X_clust[:, 1], mode='markers', marker=dict(color=cluster_labels, colorscale='Rainbow', size=8, line=dict(width=1, color='white')))
                centroids = go.Scatter(x=clf.cluster_centers_[:, 0], y=clf.cluster_centers_[:, 1], mode='markers', marker=dict(color='white', symbol='x', size=16, line=dict(width=3, color='white')), name='Centroids')
                fig = go.Figure(data=[contour, scatter, centroids])
                fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        # 10. DBSCAN
        elif algo == 'dbscan':
            X_clust = generate_clustering_dataset(ds_type)
            clf = DBSCAN(eps=float(params.get('eps', 0.5)), min_samples=int(params.get('min_samples', 5)), metric=params.get('metric', 'euclidean'))
            labels = clf.fit_predict(X_clust)
            
            unique_labels = set(labels)
            n_clusters_ = len(unique_labels) - (1 if -1 in labels else 0)
            metrics['Estimated Clusters'] = n_clusters_
            metrics['Noise Points'] = list(labels).count(-1)
            
            fig = go.Figure()
            if is_3d:
                scatter = go.Scatter3d(x=X_clust[:, 0], y=X_clust[:, 1], z=labels, mode='markers', marker=dict(color=labels, colorscale='Rainbow', size=6, line=dict(width=1, color='white')))
                fig.add_trace(scatter)
            else:
                noise_mask = (labels == -1)
                if noise_mask.any():
                    fig.add_trace(go.Scatter(x=X_clust[noise_mask, 0], y=X_clust[noise_mask, 1], mode='markers', marker=dict(color='rgba(150, 150, 150, 0.5)', size=6, symbol='x'), name='Noise'))
                for k in list(unique_labels - {-1}):
                    fig.add_trace(go.Scatter(x=X_clust[labels == k, 0], y=X_clust[labels == k, 1], mode='markers', marker=dict(size=9, line=dict(width=1, color='white')), name=f'Cluster {k}'))
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        # 11. Agglomerative Clustering
        elif algo == 'agglomerative_clustering':
            linkage = params.get('linkage', 'ward')
            metric = params.get('metric', 'euclidean')
            if linkage == 'ward' and metric != 'euclidean': metric = 'euclidean'
            clf = AgglomerativeClustering(n_clusters=int(params.get('n_clusters', 2)), linkage=linkage, metric=metric)
            cluster_labels = clf.fit_predict(X)
            metrics['Formed Clusters'] = len(set(cluster_labels))
            
            fig = go.Figure()
            if is_3d:
                fig.add_trace(go.Scatter3d(x=X[:, 0], y=X[:, 1], z=cluster_labels, mode='markers', marker=dict(color=cluster_labels, colorscale='Rainbow', size=6)))
            else:
                for k in list(set(cluster_labels)):
                    fig.add_trace(go.Scatter(x=X[cluster_labels == k, 0], y=X[cluster_labels == k, 1], mode='markers', marker=dict(size=9, line=dict(width=1, color='white')), name=f'Cluster {k}'))
            fig.update_layout(margin=dict(l=0, r=0, t=0, b=0), plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', showlegend=False)

        # 12. Gradient Boosting
        elif algo == 'gradient_boosting':
            if is_regression_task:
                clf = GradientBoostingRegressor(n_estimators=int(params.get('n_estimators', 100)), learning_rate=float(params.get('learning_rate', 0.1)), max_depth=int(params.get('max_depth', 3)), random_state=42)
                clf.fit(X_train, y_train)
                y_pred = clf.predict(X_test)
                metrics['MSE'] = float(mean_squared_error(y_test, y_pred))
                fig = build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d)
            else:
                clf = GradientBoostingClassifier(n_estimators=int(params.get('n_estimators', 100)), learning_rate=float(params.get('learning_rate', 0.1)), max_depth=int(params.get('max_depth', 3)), random_state=42)
                clf.fit(X_train, y_train)
                y_pred = clf.predict(X_test)
                set_classification_metrics(y_test, y_pred)
                fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, 'Spectral', is_3d)
                
        else:
            raise HTTPException(status_code=400, detail="Algorithm visualization not mapped dynamically yet.")
            
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
