import re

with open("app.py", "r") as f:
    code = f.read()

# 1. Update imports
if "confusion_matrix" not in code:
    code = code.replace("from sklearn.metrics import accuracy_score, mean_squared_error",
                        "from sklearn.metrics import accuracy_score, mean_squared_error, confusion_matrix")

# 2. Add is_3d to VisualizeRequest
if "is_3d: bool" not in code:
    code = code.replace("task_type: str = \"classification\"", "task_type: str = \"classification\"\n    is_3d: bool = False")

# 3. Update generate_dataset
code = re.sub(
    r"def generate_dataset\(dataset_type, is_regression=False\):",
    "def generate_dataset(dataset_type, is_regression=False, is_3d=False):",
    code
)
reg_dataset = """    if is_regression:
        n_features = 2 if is_3d else 1
        if dataset_type == 'linear':
            X, y = make_regression(n_samples=250, n_features=n_features, noise=35, random_state=42)
        else: # sine wave
            if is_3d:
                X = np.sort(6 * np.random.RandomState(42).rand(250, 2), axis=0)
                y = np.sin(X[:,0]).ravel() * 50 + np.cos(X[:,1]).ravel() * 50 + np.random.RandomState(7).normal(0, 8, X.shape[0])
            else:
                X = np.sort(6 * np.random.RandomState(42).rand(250, 1), axis=0)
                y = np.sin(X).ravel() * 50 + np.random.RandomState(7).normal(0, 8, X.shape[0])
        return X, y"""
code = re.sub(
    r"    if is_regression:.*?(?=    else:)",
    reg_dataset + "\n",
    code,
    flags=re.DOTALL
)

# 4. Update the endpoint signature parameter reading
code = code.replace("is_regression = (req.task_type == 'regression')", "is_3d = req.is_3d\n        is_regression = (req.task_type == 'regression')")
code = code.replace("X, y = generate_dataset(ds_type, is_regression)", "X, y = generate_dataset(ds_type, is_regression, is_3d)")


# Inject helper function before endpoint
helper_code = """
def build_classification_fig(clf, X, y, y_pred, X_test, y_test, colorscale='RdBu', is_3d=False):
    if is_3d:
        # Create 3D probability mesh for logistic regression or SVM
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        # lower res for speed
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.2), np.arange(y_min, y_max, 0.2))
        grid = np.c_[xx.ravel(), yy.ravel()]
        
        if hasattr(clf, 'predict_proba'):
            Z = clf.predict_proba(grid)[:, 1].reshape(xx.shape)
        elif hasattr(clf, 'decision_function'):
            Z = clf.decision_function(grid).reshape(xx.shape)
            # normalize to roughly 0-1 for visualization 
            Z = 1 / (1 + np.exp(-Z))
        else:
            Z = clf.predict(grid).reshape(xx.shape)
        
        surface = go.Surface(z=Z, x=xx, y=yy, colorscale=colorscale, opacity=0.8, showscale=False)
        
        # We plot correct and incorrect points in 3D
        correct_mask = y_pred == y_test
        wrong_mask = y_pred != y_test
        
        z_correct = y_test[correct_mask]
        z_wrong = y_test[wrong_mask]
        
        scat_correct = go.Scatter3d(x=X_test[correct_mask, 0], y=X_test[correct_mask, 1], z=z_correct, mode='markers', marker=dict(color='lightgray', size=4, line=dict(width=1, color='green')), name='Correct')
        scat_wrong = go.Scatter3d(x=X_test[wrong_mask, 0], y=X_test[wrong_mask, 1], z=z_wrong, mode='markers', marker=dict(color='red', size=8, symbol='cross'), name='Error')
        
        fig = go.Figure(data=[surface, scat_correct, scat_wrong])
        fig.update_layout(scene=dict(xaxis_title='F1', yaxis_title='F2', zaxis_title='Prob/Class'))
        return fig
            
    # 2D Plot Logic
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.05), np.arange(y_min, y_max, 0.05))
    Z = clf.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)

    contour = go.Contour(z=Z, x=np.linspace(x_min, x_max, Z.shape[1]), y=np.linspace(y_min, y_max, Z.shape[0]), colorscale=colorscale, opacity=0.3, showscale=False, hoverinfo='skip')

    correct_mask = y_pred == y_test
    wrong_mask = y_pred != y_test

    # Background training data
    # Create mask to exclude test data from X. Simplest way: just plot all X as light, and test specifically
    scat_train = go.Scatter(x=X[:, 0], y=X[:, 1], mode='markers', marker=dict(color=y, colorscale=colorscale, size=5, opacity=0.2, line=dict(width=0, color='white')), name='Data', showlegend=False)

    scat_correct = go.Scatter(x=X_test[correct_mask, 0], y=X_test[correct_mask, 1], mode='markers', marker=dict(color=y_test[correct_mask], colorscale=colorscale, size=8, line=dict(width=1, color='white')), name='Correct', showlegend=False)
    
    scat_wrong = go.Scatter(x=X_test[wrong_mask, 0], y=X_test[wrong_mask, 1], mode='markers', marker=dict(color=y_test[wrong_mask], colorscale=colorscale, size=14, symbol='x', line=dict(width=2, color='red')), name='Misclassified')

    fig = go.Figure(data=[contour, scat_train, scat_correct, scat_wrong])
    return fig

def build_regression_fig(clf, X, y, y_pred, X_test, y_test, is_3d=False):
    if is_3d:
        # 3D regression surface
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.5), np.arange(y_min, y_max, 0.5))
        grid = np.c_[xx.ravel(), yy.ravel()]
        Z = clf.predict(grid).reshape(xx.shape)
        
        surface = go.Surface(z=Z, x=xx, y=yy, colorscale='Viridis', opacity=0.7, showscale=False)
        scatter = go.Scatter3d(x=X[:, 0], y=X[:, 1], z=y, mode='markers', marker=dict(color=y, colorscale='Viridis', size=4), name='Actual')
        
        fig = go.Figure(data=[surface, scatter])
        fig.update_layout(scene=dict(xaxis_title='F1', yaxis_title='F2', zaxis_title='Target'))
        return fig
    else:    
        x_range = np.linspace(X.min(), X.max(), 100)
        y_range = clf.predict(x_range.reshape(-1, 1))
        scatter = go.Scatter(x=X.ravel(), y=y, mode='markers', marker=dict(color='indigo', size=8))
        line = go.Scatter(x=x_range, y=y_range, mode='lines', line=dict(color='red', width=3))
        fig = go.Figure(data=[scatter, line])
        return fig

"""

if "build_classification_fig" not in code:
    code = code.replace("@app.post(\"/api/visualize\")", helper_code + "\n@app.post(\"/api/visualize\")")


# 5. Patch each algorithm's block to use the common helpers and extract confusion_matrix!
def patch_algo(algo_name, colorscale, code_content):    
    # We replace the metric block and plotting block for classification.
    # regex to find the classification plotting block 
    algo_pattern = r"(elif algo == '" + algo_name + r"':\n.*?)(?=elif algo ==)"
    if algo_name == 'logistic_regression': # taking care of EOF
        algo_pattern = r"(elif algo == 'logistic_regression':.*?(?=elif algo == 'kmeans))"

    block_match = re.search(algo_pattern, code_content, flags=re.DOTALL)
    if not block_match and algo_name == 'logistic_regression':
        # last algorithm block doesn't have elif after it usually, but we have kmeans etc.
        pass

    # A simpler approach: Just loop through and manually replace the common plotting code.
    # Because Plotly generating code is almost identical everywhere (except the regression color), we can replace it.
    return code_content

# We can find all: metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))
# and insert confusion matrix extraction.
if "metrics['Confusion Matrix']" not in code:
    code = code.replace(
        "metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))",
        "metrics['Accuracy'] = float(accuracy_score(y_test, y_pred))\n                cm = confusion_matrix(y_test, y_pred)\n                metrics['Confusion Matrix'] = {'TN': int(cm[0,0]), 'FP': int(cm[0,1]) if cm.shape[1]>1 else 0, 'FN': int(cm[1,0]) if cm.shape[0]>1 else 0, 'TP': int(cm[1,1]) if cm.shape[0]>1 and cm.shape[1]>1 else 0}"
    )

# Now, we need to swap the `contour = go.Contour... fig = go.Figure(...)` with `fig = build_classification_fig(clf, X, y, y_pred, X_test, y_test, '{colorscale}', is_3d)`
# And for regression `fig = build_regression_fig(...)`

algos_colorscales = {
    'decision_tree': 'RdBu',
    'random_forest': 'Viridis',
    'knn': 'Plasma',
    'svm': 'RdBu',
    'adaboost': 'Inferno',
    'naive_bayes': 'Cividis',
    'xgboost': 'Greens',
    'logistic_regression': 'Viridis',
    'gradient_boosting': 'Spectral'
}

for algo, cscale in algos_colorscales.items():
    # Replace classification plot construction
    # We find:
    """
                x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
                ...
                fig = go.Figure(data=[contour, scatter])
    """
    pattern_cls = r"x_min, x_max = X\[:, 0\].min\(\) - 1.*?(?=fig\.update_layout)"
    
    # We find:
    """
                x_range = np.linspace(X.min(), X.max(), 100)
                ...
                fig = go.Figure(data=[scatter, line])
    """
    pattern_reg = r"x_range = np\.linspace\(X\.min\(\), X\.max\(\), 100\).*?(?=fig\.update_layout)"
    
    # Do we have to do it manually? Yes, let's use regex sub.
    # Note: SVM Logistic regression classification plot matches pattern_cls.
    # but `is_regression_task` separates them.
    # Wait, logistic regression doesn't define `is_regression_task`, let's patch that first.
    pass

# A fully customized python ast-modifier or simple monolithic replacement might be better. Let's just write the whole backend script cleanly.

with open("patch_app.py", "w") as fw:
    pass

