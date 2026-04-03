export const algorithms = [
  {
    id: "linear_regression",
    title: "Linear Regression",
    supportedTypes: ["regression"],
    regression: {
      summary: "A foundational statistical algorithm that maps the relationship between input variables and a continuous output by fitting a straight line.",
      explanation: "Linear Regression acts like an intuitive guesser. Imagine trying to guess someone's weight based exclusively on their height. You intuitively know that taller people tend to weigh more. Linear Regression draws a literal straight line through historical examples (the training data) trying to minimize the distance between the line itself and every single data point. Once that line is drawn, if someone tells you a new height, the model simply looks at where the line sits for that height to predict the weight.",
      analogy: "Like stretching a rubber band across a scatter of thumbtacks on a corkboard. The rubber band snaps into a straight line that rests as evenly as possible among all the tacks.",
      steps: [
        "Initialize a random straight line (random slope and intercept).",
        "Calculate the Mean Squared Error (MSE) between the line and actual data points.",
        "Use Gradient Descent (or ordinary least squares) to adjust the slope and intercept.",
        "Repeat adjustments until the error reaches its absolute minimum.",
        "Output the final line equation for making future predictions."
      ],
      interviewQs: [
        { q: "What is the difference between Simple and Multiple Linear Regression?", a: "Simple uses one independent variable (x) to predict (y), forming a 2D line. Multiple uses two or more independent variables, forming a 3D plane or n-dimensional hyperplane." },
        { q: "What does the R-squared metric indicate?", a: "R-squared represents the proportion of the variance in the dependent variable that is predictable from the independent variables. 1.0 is perfect prediction." },
        { q: "What are the common assumptions of Linear Regression?", a: "Linearity, Independence of errors, Homoscedasticity (constant variance of errors), and Normal distribution of error residuals." },
        { q: "How does it handle outliers?", a: "Linear regression is highly sensitive to outliers because it minimizes squared errors; a single extreme outlier can drastically pull the line towards it." },
        { q: "What is multicollinearity?", a: "When independent variables are highly correlated with each other, it makes it difficult for the model to estimate the individual coefficient of each variable." }
      ],
      hyperparameters: {
        fit_intercept: { label: "Fit Intercept", options: ["True", "False"], default: "True", desc: "Whether to calculate the intercept or force it through the origin." }
      }
    }
  },
  {
    id: "logistic_regression",
    title: "Logistic Regression",
    supportedTypes: ["classification"],
    classification: {
      summary: "A classification algorithm that predicts the probability of an instance belonging to a specific class.",
      explanation: "Despite the word 'regression' in its name, Logistic Regression is used for classification. Instead of predicting a continuous number (like predicting price), it predicts a probability between 0 and 1. It does this by taking the standard linear equation and wrapping it in a mathematical 'S-curve' called a Sigmoid function. This curve squashes any giant positive or negative number down into a neat percentage.",
      analogy: "Imagine an exam grading system where there are no letter grades, only Pass or Fail. The linear part totals up your score (like 85/100). The Sigmoid part acts as the decider: converting 85 into a '99% chance of Passing'.",
      steps: [
        "Calculate a weighted sum of inputs.",
        "Pass the sum through the Sigmoid activation function.",
        "Map the resulting value (between 0 and 1) to a probability.",
        "Assign the prediction to Class 1 if the probability is >= 0.5, else Class 0.",
        "Adjust weights using gradient descent by minimizing Log Loss."
      ],
      interviewQs: [
        { q: "Why use Logistic Regression instead of Linear Regression for classification?", a: "Linear Regression predictions can extend beyond 0 and 1, making them meaningless as probabilities. The Sigmoid function safely constrains the output between 0 and 1." },
        { q: "What is Log Loss (Cross-Entropy)?", a: "It is the cost function used to evaluate Logistic Regression. It heavily penalizes confident but incorrect predictions." },
        { q: "How does Logistic Regression handle multi-class problems?", a: "It uses One-vs-Rest (OvR), training a separate binary classifier for each class, or Multinomial Logistic Regression (Softmax)." },
        { q: "Is Logistic Regression a linear classifier?", a: "Yes. While the output is wrapped in a non-linear sigmoid curve, the underlying decision boundary it draws between classes is a strictly straight line (or plane)." },
        { q: "What purpose does regularization serve here?", a: "Regularization (L1 or L2) prevents the weights from becoming excessively large, which forces the model to stay simple and prevents it from overfitting to noise in the training data." }
      ],
      hyperparameters: {
        penalty: { label: "Penalty", options: ["l2", "none"], default: "l2", desc: "Type of regularization to apply." },
        C: { label: "Inverse Reg. (C)", min: 0.01, max: 10.0, step: 0.1, default: 1.0, desc: "Smaller values specify stronger regularization." },
        max_iter: { label: "Max Iterations", min: 50, max: 1000, step: 50, default: 100, desc: "Maximum iterations for the solver to converge." }
      }
    }
  },
  {
    id: "kmeans_clustering",
    title: "K-Means Clustering",
    supportedTypes: ["clustering"],
    clustering: {
      summary: "K-Means is an unsupervised clustering algorithm that divides unlabeled data into a specified number of groups (clusters) of equal variance. It works by minimizing a criterion known as the inertia, or the within-cluster sum-of-squares.",
      explanation: "Often referred to as Lloyd’s algorithm, K-Means aims to partition N samples into K disjoint clusters, where each cluster is described by the mean of the samples within it, known as the centroid. The algorithm optimizes the model by attempting to choose centroids that minimize the inertia. Conceptually, K-Means is equivalent to the expectation-maximization algorithm utilizing a small, all-equal, diagonal covariance matrix. Because inertia makes the strict assumption that clusters are convex and isotropic, K-Means responds poorly to elongated clusters, or manifolds with irregular, non-flat shapes. While the algorithm is guaranteed to converge given enough time, it may get stuck in a local minimum depending heavily on the initial placement of the centroids.",
      analogy: "Imagine you are the manager of a delivery company and you need to place 3 new dispatch hubs in a massive city to ensure the shortest possible drive times for your drivers. Initially, you just drop the 3 hubs at random locations. You then assign every house in the city to its closest hub. Once assigned, you calculate the exact geographic center of all the houses assigned to Hub A, and move Hub A to that new center. You do the same for Hubs B and C. Because the hubs have moved, some houses are now closer to a different hub, so you re-assign the houses to the new closest hubs. You repeat this process of moving the hubs to the center of their assigned houses and re-assigning the houses until the hubs simply stop moving.",
      steps: [
        "Choose the initial centroids. The most basic method is to randomly choose k samples from the dataset to act as the starting centers.",
        "Assign each sample in the dataset to its nearest centroid.",
        "Create new centroids by calculating the mean value of all the samples that were assigned to each previous centroid.",
        "Repeat the assignment and updating steps until a stopping criterion is fulfilled—specifically, until the centroids do not move more than a defined tolerance value."
      ],
      interviewQs: [
        { q: "What is the primary objective function that K-Means attempts to minimize?", a: "It minimizes the inertia, which is the within-cluster sum-of-squares (a measure of how internally coherent the clusters are)." },
        { q: "What implicit assumptions does K-Means make about the geometry of the clusters?", a: "It assumes that clusters are convex and isotropic (e.g., spherical). Consequently, it struggles to properly cluster elongated shapes or irregular manifolds." },
        { q: "How does the k-means++ initialization improve upon standard random initialization?", a: "The k-means++ scheme initializes the centroids so that they are generally distant from one another. This leads to provably better results than completely random initialization and helps prevent the algorithm from converging to a poor local minimum." },
        { q: "Why is it often recommended to apply a dimensionality reduction technique like PCA before running K-Means?", a: "K-Means relies on Euclidean distances to assign points to centroids. In very high-dimensional spaces, Euclidean distances tend to become inflated due to the 'curse of dimensionality.' PCA can alleviate this inflation and also drastically speed up computations." },
        { q: "How does K-Means determine when to stop iterating?", a: "While traditional descriptions often state the algorithm stops when the relative decrease in the objective function between iterations falls below a tolerance, the standard implementation specifically stops when the centroids themselves move less than the tolerance value." }
      ],
      hyperparameters: {
        n_clusters: { label: "Number of Clusters", min: 2, max: 10, step: 1, default: 3, desc: "The desired number of disjoint clusters to form." },
        init: { label: "Initialization", options: ["k-means++", "random"], default: "k-means++", desc: "The initialization scheme for the centroids." },
        max_iter: { label: "Max Iterations", min: 10, max: 300, step: 10, default: 100, desc: "The maximum number of iterations the algorithm is allowed to run." }
      }
    }
  },
  {
    id: "decision_tree",
    title: "Decision Tree",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "A flowchart-like model that predicts a category by learning simple if-then decision rules from your data.",
      explanation: "A Decision Tree recursively cuts your data into smaller and smaller groups. At each step, it looks at all the features and finds the single best question (e.g., 'Is age > 30?') that cleanly separates the data into the most 'pure' groups possible. It repeats this splitting process until it hits a maximum depth or the groups consist entirely of one category.",
      analogy: "Imagine playing a game of '20 Questions.' To guess an object, you ask a series of yes/no questions (e.g., 'Is it a mammal?'). Each question mathematically perfectly halves the remaining possibilities based on the answers.",
      steps: [
        "Start with the entire training dataset at the root node.",
        "Evaluate all features to find the split that maximizes purity.",
        "Partition the data into left and right child nodes based on the threshold.",
        "Repeat this splitting process recursively.",
        "Stop when maximum depth is reached or nodes are completely pure."
      ],
      interviewQs: [
        { q: "What are the primary advantages and disadvantages of using a Decision Tree?", a: "Advantages: Simple, interpretable 'white box' model that requires almost no data scaling. Disadvantages: Highly prone to severe overfitting and very unstable to tiny data changes." },
        { q: "Which algorithm is used to build decision trees?", a: "The standard implementation uses an optimized version of the CART algorithm, which strictly constructs binary trees (Yes/No splits only)." },
        { q: "How does a decision tree select the best split?", a: "It calculates 'impurity' metrics like Gini or Entropy. The split that results in the largest drop in impurity (Information Gain) is chosen." },
        { q: "How does a Decision Tree handle missing values?", a: "The standard implementation does not support missing values inherently, requiring you to impute them beforehand." },
        { q: "How do you prevent a decision tree from overfitting?", a: "You use regularization hyperparameters such as restricting the max_depth, increasing min_samples_split, or post-pruning the tree." }
      ],
      hyperparameters: {
        criterion: { label: "Split Criterion", options: ["gini", "entropy"], default: "gini", desc: "Mathematical function to measure split purity." },
        max_depth: { label: "Max Depth", min: 0, max: 20, step: 1, default: 5, desc: "0 = Unlimited. Restricts how deep the tree can grow to prevent overfitting." },
        min_samples_split: { label: "Min Samples Split", min: 2, max: 50, step: 1, default: 2, desc: "Min samples required to split a node." },
        min_samples_leaf: { label: "Min Samples Leaf", min: 1, max: 50, step: 1, default: 1, desc: "Min samples required to form a leaf." }
      }
    },
    regression: {
      summary: "A tree model that predicts continuous numbers by learning rules to group data into average values.",
      explanation: "Instead of clustering data by category, the regressor looks for splits that group data with similar numerical output values. It finds the split that minimizes the overall continuous error (like Mean Squared Error). When predicting a new sample, it follows the rules down to a final leaf, and simply predicts the average numerical target of all the training samples that ended up in that same leaf.",
      analogy: "Guessing the price of a used car by mentally splitting them into 'older than 5 years' vs 'newer'. Then splitting by 'high mileage' vs 'low mileage'. To guess the price, you follow the rules to land in a bucket, and simply guess the average price of the comparable cars.",
      steps: [
        "Begin with the full dataset.",
        "Test various split thresholds to divide data.",
        "Calculate the Mean Squared Error (MSE) for the new splits.",
        "Choose the split that creates the lowest combined error.",
        "Prediction is the mean average of targets in the final leaf."
      ],
      interviewQs: [
        { q: "How is the impurity calculated in a Regressor compared to a Classifier?", a: "While a classifier evaluates impurity using Gini (categorical misclassification), a regressor evaluates impurity using continuous variance or error metrics like Mean Squared Error." },
        { q: "What happens if you do not restrict the max_depth of a Decision Tree Regressor?", a: "The tree will memorize the noise in the training data perfectly, resulting in a completely overfitted, staircase-like prediction line that acts terribly on unseen data." },
        { q: "What is the computational complexity of querying a balanced decision tree?", a: "The query time for a balanced decision tree is logarithmic, specifically O(log(n))." },
        { q: "Why is the prediction line of a regression tree jagged rather than smooth?", a: "Because trees don't interpolate between points; they output constant average values for specified ranges (leaves), resulting in horizontal steps." },
        { q: "Are Decision Tree regressors affected by outliers?", a: "Yes, because the default MSE criterion squares errors, it will aggressively adjust splits to accommodate extreme outliers." }
      ],
      hyperparameters: {
        criterion: { label: "Error Metric", options: ["squared_error", "absolute_error"], default: "squared_error", desc: "Measures continuous error." },
        max_depth: { label: "Max Depth", min: 0, max: 20, step: 1, default: 5, desc: "Restricts how deep the tree can grow." },
        min_samples_split: { label: "Min Samples Split", min: 2, max: 50, step: 1, default: 2, desc: "Min samples required to split a node." },
        min_samples_leaf: { label: "Min Samples Leaf", min: 1, max: 50, step: 1, default: 5, desc: "Smooths the model and avoids over-fit leaves." }
      }
    }
  },
  {
    id: "random_forest",
    title: "Random Forest",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "A powerful 'ensemble' model that trains dozens of individual decision trees and averages their votes to prevent overfitting.",
      explanation: "A single Decision Tree tends to overfit and act whimsically. A Random Forest builds 100+ separate decision trees. To ensure they don't all memorize the exact same patterns, the algorithm forces diversity: each tree is trained on a random subset of the data (bootstrapping), and at each split, the tree is only allowed to look at a random subset of the features. The final prediction is just an average of all the trees' votes.",
      analogy: "Imagine asking one doctor for a complex diagnosis—they might be biased by their limited past experiences. Instead, you consult 100 doctors. Each gets slightly different chunks of your medical history and only looks at a random subset of symptoms. Averaging their diagnoses yields a highly reliable result.",
      steps: [
        "Draw a random 'bootstrap' sample of data.",
        "Grow a decision tree from this sample.",
        "At each node, evaluate only a random subset of features to find the split.",
        "Repeat to build hundreds of trees.",
        "Average the probabilistic predictions of all trees."
      ],
      interviewQs: [
        { q: "What are the two main sources of randomness in a Random Forest?", a: "Bootstrap sampling (drawing training samples with replacement) and selecting a random subset of features when making a split. This decouples the trees so their errors don't correlate." },
        { q: "How are predictions combined in a Random Forest?", a: "Instead of hard majority voting, the standard approach averages the probabilistic confidence of every tree to make the final classification (soft voting)." },
        { q: "What is an Out-of-Bag (OOB) estimate?", a: "When using bootstrap sampling, roughly one-third of the data is left out for each tree. The model's accuracy can be validated on these left-out samples without needing a separate validation test set." },
        { q: "Does Random Forest need feature scaling?", a: "No, tree-based models make splits based on relative ordering of values, so they are completely immune to differences in feature scales." },
        { q: "What does 'Feature Importance' mean in a Random Forest?", a: "It measures how much a feature consistently decreased the impurity across all the trees. Features that frequently split the data cleanly are ranked higher." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "More trees = better performance, but slower compute." },
        criterion: { label: "Split Criterion", options: ["gini", "entropy"], default: "gini", desc: "Function to measure split purity." },
        max_depth: { label: "Max Depth", min: 0, max: 20, step: 1, default: 5, desc: "Maximum depth of the individual trees." },
        min_samples_split: { label: "Min Samples Split", min: 2, max: 20, step: 1, default: 2, desc: "Min samples required to split." },
        min_samples_leaf: { label: "Min Samples Leaf", min: 1, max: 20, step: 1, default: 1, desc: "Min samples required at a leaf." },
        bootstrap: { label: "Bootstrap", options: ["True", "False"], default: "True", desc: "Whether to randomly sample data for each tree." }
      }
    },
    regression: {
      summary: "Trains a multitude of individual regression trees and averages out their continuous numerical predictions.",
      explanation: "Just like the classifier, the regressor builds a forest of diverse decision trees using random data subsets and random features. The only difference is that instead of predicting a probability of a class, every individual tree guesses a specific number (like a price). The final ensemble prediction is the arithmetic mean of all 100 trees' guesses, which beautifully cancels out the noise.",
      analogy: "Estimating the weight of a pumpkin at a fair. One person might guess wildly wrong. But if you ask 100 people viewing it from different angles, and average their continuous numeric guesses together, the errors perfectly cancel out to reveal an incredibly precise final weight.",
      steps: [
        "Draw a bootstrap sample.",
        "Build a decision tree expecting continuous outputs.",
        "Evaluate random subsets of features to minimize MSE.",
        "Repeat until all n_estimators are trained.",
        "Compute the mean of the numeric outputs across the forest."
      ],
      interviewQs: [
        { q: "What is a good default for max_features in Regression vs Classification?", a: "Empirically, considering all features (max_features=None) works best for regression problems, while using the square root of features works best for classification." },
        { q: "How does a Random Forest Regressor predict a new value?", a: "It computes the predicted target as the mathematical mean of the predicted targets generated by all the individual trees in the forest." },
        { q: "Why might reducing max_features not always be beneficial in regression?", a: "Lowering max_features reduces variance, but it increases bias. In regression, evaluating all features ensures important continuous thresholds aren't missed." },
        { q: "Can a Random Forest Regressor extrapolate?", a: "No. Tree-based regressors can never predict a value outside the minimum or maximum values they observed in the training data." },
        { q: "Is a Random Forest prone to overfitting like a normal Decision Tree?", a: "Generally no, the ensemble averaging massively reduces the overfitting risk, though excessively deep trees with very few samples can still overfit slightly." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "The number of trees to average." },
        criterion: { label: "Error Metric", options: ["squared_error", "absolute_error"], default: "squared_error", desc: "Measures continuous error." },
        max_depth: { label: "Max Depth", min: 0, max: 20, step: 1, default: 5, desc: "Maximum depth." },
        min_samples_split: { label: "Min Samples Split", min: 2, max: 20, step: 1, default: 2, desc: "Min samples to split." },
        min_samples_leaf: { label: "Min Samples Leaf", min: 1, max: 20, step: 1, default: 1, desc: "Min samples at a leaf." },
        bootstrap: { label: "Bootstrap", options: ["True", "False"], default: "True", desc: "Randomize data." }
      }
    }
  },
  {
    id: "knn",
    title: "K-Nearest Neighbors",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "An incredibly simple 'lazy' learning model that classifies a new data point by looking at what its closest neighbors are.",
      explanation: "KNN literally just memorizes the training data. There is no complex 'training' algorithm. When asked to classify a new point, it calculates the physical distance (usually Euclidean) between that point and every other point it memorized. It finds the 'K' closest points, and takes a simple majority vote. If K=5, and 3 out of 5 closest points are blue, it classifies the new point as blue.",
      analogy: "Imagine moving to a new city and wanting to know the local politics. You knock on the doors of your 5 geographically closest neighbors. If 3 vote for Party A and 2 for Party B, you assume your immediate neighborhood leans Party A.",
      steps: [
        "Simply store the raw training data into memory.",
        "When queried, calculate the distance between the query and all training points.",
        "Sort the training points to find the 'K' nearest points.",
        "Look at the classification labels of those K neighbors.",
        "Take a majority vote to assign the final class."
      ],
      interviewQs: [
        { q: "What is 'lazy' or instance-based learning?", a: "It means the algorithm doesn't actually 'learn' an abstract model mapping during training. It simply memorizes the data and delays all computation until a prediction is physically requested." },
        { q: "What is the 'Curse of Dimensionality'?", a: "As you add more features (dimensions), the volume of space explodes. Data points become so incredibly spread out that the concept of 'nearest' neighbors loses mathematical meaning." },
        { q: "Why is scaling data an absolute requirement for KNN?", a: "Because KNN relies on physical distance metrics. If 'Height' is measured in feet (range 4-7) and 'Income' in dollars (range 20K-100K), income will completely dominate the distance math." },
        { q: "How do you pick the optimal K value?", a: "Usually via cross-validation. A small K (like 1) is sensitive to noise and highly irregular. A very large K smooths things out but might ignore local boundary nuances." },
        { q: "What is a KD-Tree or Ball-Tree?", a: "Data structures used to quickly index training data spatially, so KNN doesn't have to brute-force check every single point to find the nearest neighbor." }
      ],
      hyperparameters: {
        n_neighbors: { label: "Neighbors (K)", min: 1, max: 50, step: 1, default: 5, desc: "How many nearest points to poll for a vote." },
        weights: { label: "Voting Weights", options: ["uniform", "distance"], default: "uniform", desc: "If 'distance', closer neighbors get more highly weighted votes." },
        p: { label: "Distance Metric (p)", min: 1, max: 2, step: 1, default: 2, desc: "1 = Manhattan Distance. 2 = Euclidean Distance." },
        algorithm: { label: "Search Algorithm", options: ["auto", "brute", "kd_tree", "ball_tree"], default: "auto", desc: "The spatial tree structure used to find neighbors fast." }
      }
    },
    regression: {
      summary: "Predicts continuous numbers by simply averaging the numeric values of its closest neighbors.",
      explanation: "Exactly identical to the classifier, KNN Regressor locates the 'K' physically closest neighbors. But instead of taking a categorical vote, it simply calculates the mathematical mean (average) of their continuous target values. If you instruct it to use 'distance weighting', it will give proportionally higher weight to the neighbors that are physically closer, resulting in a much smoother regression output.",
      analogy: "Estimating the fair market price of a house you are selling. You physically look at the 5 houses geographically closest to yours. You simply average their recent sale prices to guess what your house is worth.",
      steps: [
        "Store the training data.",
        "Calculate the distance to all points when queried.",
        "Retrieve the K closest training points.",
        "Extract their continuous numeric target values.",
        "Return the average (mean) of those target values."
      ],
      interviewQs: [
        { q: "How does the prediction mechanism differ from the classifier?", a: "The regressor computes the mean average of the neighboring continuous labels, whereas the classifier calculates a majority mode of discrete categories." },
        { q: "When should you use distance weighting over uniform weighting?", a: "When your training points are unevenly distributed. Distance weighting ensures that a neighbor physically right next to the query influences the outcome more than a neighbor at the edge of the radius." },
        { q: "Is KNN regression robust to outliers?", a: "No. If one of the nearest neighbors is a massive outlier, the simple averaging mechanism will be heavily skewed, dragging the prediction towards the anomaly." },
        { q: "Why might the 'brute force' algorithm be faster than a spatial KD-Tree?", a: "Building the spatial tree costs heavy upfront overhead. If you're only making a tiny handful of predictions, it's actually faster to just brute force calculate the raw distances." },
        { q: "Can KNN Regressor extrapolate outside its training bounds?", a: "Absolutely not. Since it just averages known surrounding points, it can never predict a number higher than the maximum training point it memorized." }
      ],
      hyperparameters: {
        n_neighbors: { label: "Neighbors (K)", min: 1, max: 50, step: 1, default: 5, desc: "How many nearest points to average." },
        weights: { label: "Distance Weighting", options: ["uniform", "distance"], default: "uniform", desc: "If 'distance', physically closer neighbors impact the average more heavily." },
        p: { label: "Distance Metric (p)", min: 1, max: 2, step: 1, default: 2, desc: "1 = Manhattan. 2 = Euclidean." },
        algorithm: { label: "Search Algorithm", options: ["auto", "brute", "kd_tree", "ball_tree"], default: "auto", desc: "The spatial tree used for looking up neighbors." }
      }
    }
  },
  {
    id: "svm",
    title: "Support Vector Machine",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "Finds the widest 'street' or margin that perfectly separates differing classes in high-dimensional space.",
      explanation: "SVM tries to draw a straight line (or plane) between two classes. But it specifically searches for the line that has the absolute maximum margin (distance) to the closest data points. The data points that sit exactly on the edge of this margin are called 'Support Vectors'. If the data cannot be split with a straight line, it mathematically catapults the data into a 3D or higher-dimensional space using the 'Kernel Trick', making it possible to drop a flat sheet of plane right through them.",
      analogy: "There are red and blue marbles on a table. You want to place a stick between them. The best placement is one that stays as far away as possible from both colors. If the colors are hopelessly mixed, you throw all the marbles into the air, and suddenly, you can slide a flat sheet of cardboard cleanly between the red and blue group while they are suspended in 3D.",
      steps: [
        "Standardize the data so dimensions scale uniformly.",
        "Apply a kernel mapping to push the data into a higher dimension if non-linear.",
        "Calculate the boundary that maximizes the gap (margin) between the classes.",
        "Penalize errors via the 'C' parameter to allow for soft margins.",
        "Predict classes by measuring which side of the boundary a new point falls on."
      ],
      interviewQs: [
        { q: "What are 'support vectors'?", a: "They are the small, critical subset of training points that lie exactly on the edge of the decision margin. They literally 'support' the mathematical placement of the boundary." },
        { q: "What is the 'Kernel Trick' and why is it magical?", a: "It allows SVM to securely compute the mathematical dot product of vectors in a vastly higher dimensional space without actually expensively transforming the underlying data. It simulates infinite dimensions efficiently." },
        { q: "Why must you scale your data before feeding it into an SVM?", a: "SVM optimization relies strictly on geometrical distance calculations. If one feature is spanning 100,000 and another is spanning decimals, the larger feature will violently dominate the objective function." },
        { q: "What does the 'C' regularization parameter do?", a: "A low C makes the margin huge and sloppy (allowing misclassifications to create a smoother boundary). A high C makes the margin razor-thin to strictly classify every training point perfectly, risking overfitting." },
        { q: "How does SVM handle multi-class predictions?", a: "The standard approach implements 'One-vs-One'. If you have 3 classes, it builds 3 separate binary classifiers pitting them against each other, and uses a voting scheme to declare the final winner." }
      ],
      hyperparameters: {
        kernel: { label: "Kernel Function", options: ["linear", "poly", "rbf", "sigmoid"], default: "rbf", desc: "The trick used to warp the data into higher dimensions." },
        C: { label: "Regularization (C)", min: 0.1, max: 100.0, step: 0.1, default: 1.0, desc: "A high C strictly penalizes errors; a low C allows errors for a smoother boundary." },
        gamma: { label: "Gamma Kernel Width", min: 0.01, max: 5.0, step: 0.01, default: 0.1, desc: "Defines the radius of influence of a single training example for non-linear kernels." },
        degree: { label: "Poly Degree", min: 2, max: 5, step: 1, default: 3, desc: "Degree of the polynomial function (for poly kernel only)." }
      }
    },
    regression: {
      summary: "Predicts continuous numbers by mapping a flat 'paved path' that aims to fit the maximum number of data points inside it.",
      explanation: "While ordinary regression penalizes every single error, Support Vector Regression (SVR) creates a tolerant 'tube' or margin (called Epsilon). It says: 'As long as your data point falls anywhere inside this epsilon-tube, I consider it a perfect prediction'. The model only spends its computational power trying to fix the points that fall totally outside the tube. Just like the classifier, it can use the kernel trick to twist this tube into wild, non-linear shapes to fit complex curves.",
      analogy: "Imagine acting as a contractor building a paved hiking trail through a bumpy valley of data points. Instead of making a jagged path that hits every single point, you build a path with a wide, fixed width. As long as a point lands anywhere on the pavement, you ignore its exact coordinate error. You only adjust the path for points that land way off in the dirt.",
      steps: [
        "Scale the continuous problem variables significantly.",
        "Define the width of the epsilon-insensitive tube.",
        "Apply the chosen kernel (linear/RBF).",
        "Optimize a flat boundary that minimizes the points falling outside the tube.",
        "Predict numerical targets based on the final derived hyperplane."
      ],
      interviewQs: [
        { q: "What does the epsilon-insensitive tube accomplish?", a: "It provides a robust margin of tolerance around the predicted function. Any point inside the tube mathematically contributes absolute zero error, forcing the model to only care about large outlying deviations." },
        { q: "How does the 'epsilon' parameter influence model sparsity?", a: "A larger epsilon means a wider tube, which means more points are ignored and deemed 'perfect'. This results in far fewer support vectors, making the final model mathematically lighter." },
        { q: "What is the primary difference in loss function between SVR and standard Ridge Regression?", a: "Ridge regression heavily penalizes all squared errors no matter how tiny. SVR totally ignores errors within the epsilon threshold, optimizing only the absolute errors that fall outside." },
        { q: "Why is an SVR prediction faster than a KNN prediction?", a: "SVR learns a sparse, fixed formula that only relies on a tiny subset of support vectors. KNN is lazy and must expensively calculate distance to all training data points for every single prediction." },
        { q: "Why is the RBF kernel the standard default?", a: "The Radial Basis Function smoothly handles non-linear relationships by implicitly mapping the inputs into an infinite-dimensional feature space, making it highly versatile for unknown continuous data." }
      ],
      hyperparameters: {
        kernel: { label: "Kernel Function", options: ["linear", "poly", "rbf", "sigmoid"], default: "rbf", desc: "The function to warp the continuous space." },
        C: { label: "Regularization (C)", min: 0.1, max: 100.0, step: 0.1, default: 1.0, desc: "Penalizes data points that fall completely outside the epsilon tube." },
        epsilon: { label: "Epsilon Width", min: 0.0, max: 2.0, step: 0.1, default: 0.1, desc: "The tolerance margin. Errors inside this width are completely ignored." },
        gamma: { label: "Gamma Kernel Width", min: 0.01, max: 5.0, step: 0.01, default: 0.1, desc: "Defines the influence radius for RBF/Poly kernels." }
      }
    }
  },
  {
    id: "adaboost",
    title: "AdaBoost",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "A boosting ensemble that trains dozens of weak models in sequence, forcing each new model to aggressively focus on the mistakes of the previous one.",
      explanation: "AdaBoost (Adaptive Boosting) starts by training a 'weak learner'—typically a tiny, highly simplistic decision tree stump. It then looks at which data points the stump guessed wrong. It massively increases the mathematical weight of those failed points. The second weak learner is now forced to obsess over those difficult points. This repeats down the line, with each model patching the holes of the previous model. The final prediction is a weighted vote from the entire chain of corrected models.",
      analogy: "A study group taking a practice exam. The first student takes it and gets several math questions wrong. The tutor highlights these, and tells the second student to focus entirely on learning those specific math formulas. The second student fixes the math, but fails the history points. In the end, the group takes the real test together, letting the combined expertise form the perfect answer.",
      steps: [
        "Initialize equal weights for every training sample.",
        "Train a tiny weak learner (like a 1-depth decision stump).",
        "Evaluate predictions to find the wrong answers.",
        "Drastically increase the importance weights of the wrongly predicted samples.",
        "Re-train the next learner on the freshly weighted data, repeating N times.",
        "Combine the chain using a weighted majority vote."
      ],
      interviewQs: [
        { q: "How does AdaBoost contrast with Bagging (Random Forest)?", a: "Random forests build independent trees completely in parallel to reduce variance. AdaBoost builds dependent trees sequentially in a chain to correct bias." },
        { q: "What kind of base estimator is AdaBoost traditionally paired with?", a: "Weak learners. These are models slightly better than a random coin flip, predominantly Decision Tree 'stumps' (trees cut off at a max depth of just 1)." },
        { q: "Why does AdaBoost constantly adjust training weights?", a: "By increasing the weights of misclassified records and decreasing correctly classified ones, the algorithm forces subsequent learners to hone in entirely on the hardest edge-case data points." },
        { q: "How is the final prediction derived from the sequence?", a: "The predictions from all sequential models are combined via a weighted vote. Models that made fewer errors heavily out-vote models that made large errors." },
        { q: "Is AdaBoost sensitive to noise or outliers?", a: "Extremely. Because it obsessively increases the weight of incorrect data points, it will spend useless iterations desperately trying to perfectly fit a massive data anomaly or mislabeled outlier." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Iterations", min: 10, max: 300, step: 10, default: 50, desc: "How many sequential weak learners to chain together." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 2.0, step: 0.01, default: 1.0, desc: "Shrinks the contribution of each individual estimator. Lower means you need more iterations." }
      }
    },
    regression: {
      summary: "Predicts continuous numbers sequentially by forcing new regressors to patch up the absolute magnitude errors of the preceding models.",
      explanation: "Just like the classifier, AdaBoost Regressor builds models in a chain, constantly correcting past errors. However, instead of correct/incorrect binary states, it evaluates continuous numeric errors (residuals). If the first model was off by a massive margin (e.g. predicted 10, actual was 100), the algorithm massively inflates the weight of that sample. The subsequent weak regressors then pivot entirely to minimize those largest remaining residuals. The final answer is a merged aggregation of the entire sequence.",
      analogy: "A team trying to guess the weight of a pumpkin. The first person guesses a baseline. The judge notes the guess was way off because it ignored the pumpkin's density. The second person is instructed to heavily prioritize density to correct the error. This repeats, sequentially correcting biases, until the weighted average produces a highly pure guess.",
      steps: [
        "Assign equal weights to all training samples.",
        "Train a weak base tree regressor.",
        "Calculate the continuous prediction error loss (MSE or MAE) for every point.",
        "Update the sample weights, elevating ones with extreme error magnitudes.",
        "Train the next sequential regressor on this intensely reweighted dataset.",
        "Aggregate the predictions via a weighted sum or median."
      ],
      interviewQs: [
        { q: "Which specific algorithm does AdaBoostRegressor use?", a: "It utilizes the AdaBoost.R2 algorithm tailored for continuous numeric errors rather than discrete classes." },
        { q: "What is the tradeoff between learning_rate and n_estimators?", a: "They are inversely tied. A very low learning rate means each tree makes incredibly tiny corrections, meaning you need a massive amount of sequential trees (n_estimators) to see results." },
        { q: "If your AdaBoost ensemble is overfitting, what should you primarily tune?", a: "You should lower n_estimators (stopping the chain earlier) or lower the complexity capability of the base estimator (such as the max depth allowed in the weak trees)." },
        { q: "What does the loss function parameter primarily dictate?", a: "It dictates how severely a continuous error penalty scales. A linear loss scales penalties evenly, while a square or exponential loss geometrically punishes massive outliers during the weight update phase." },
        { q: "Does AdaBoost Regressor extrapolate nicely outside training boundaries?", a: "No. Since its base estimators are just tiny decision tree stumps, it is locked within the bounds of the original training minimums and maximums." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Iterations", min: 10, max: 300, step: 10, default: 50, desc: "How many regressors to stack in the chain." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 2.0, step: 0.01, default: 1.0, desc: "Scales the impact of each iteration." },
        loss: { label: "Loss Function", options: ["linear", "square", "exponential"], default: "linear", desc: "How heavily to penalize severe regression errors during weight updates." }
      }
    }
  },
  {
    id: "xgboost",
    title: "XGBoost",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "An incredibly fast, highly optimized ensemble algorithm that uses strict mathematical formulas to perfectly correct the errors of its sequence of trees.",
      explanation: "Extreme Gradient Boosting (XGBoost) works like a genius team of detectives sequentially sketching a suspect. The first draws a rough sketch. Instead of the second detective just looking at the difference between the sketch and the real suspect (standard gradient), they use calculus (second-order derivatives) to precisely measure the exact angle and curve of the remaining errors. Furthermore, the chief imposes strict rules: if adding a detail doesn't massively improve the sketch, it is immediately erased (regularization). This creates an incredibly powerful, perfectly tuned sequence of models.",
      analogy: "Like navigating a rocket to the moon. Your initial thrust gets you into orbit. Every subsequent thruster burn is calculated not just by looking at how far off course you are, but by computing the exact curvature of the gravity pulling you away. To save fuel, you are restricted from firing the thrusters unless it corrects the trajectory by a massive, undeniable margin.",
      steps: [
        "Initialize the model with a baseline prediction.",
        "Calculate the perfect mathematical trajectory needed to fix current errors (Hessians).",
        "Build a decision tree designed strictly to follow this calculated corrective trajectory.",
        "Prune the tree aggressively via gamma thresholds and L1/L2 regularization.",
        "Scale the correction down by a learning rate and add it to the ensemble.",
        "Repeat for hundreds of ultra-optimized iterations."
      ],
      interviewQs: [
        { q: "What fundamentally makes XGBoost mathematically superior to standard Gradient Boosting?", a: "Standard GBMs optimize using regular gradient descent (first-order derivatives). XGBoost uses a Newton-expansion, looking at both first and second-order derivatives (Hessians) to find optimal step sizes." },
        { q: "How does XGBoost natively handle missing data?", a: "When encountering a feature split with missing values, it mathematically calculates whether sending the blanks left or right yields a better global error reduction, and hardcodes that default path." },
        { q: "Why is XGBoost so incredibly fast?", a: "Unlike standard boosting which builds trees fully sequentially, XGBoost utilizes in-memory block structures to pre-sort data columns, allowing it to evaluate all possible feature splits entirely in parallel." },
        { q: "What does the Gamma hyperparameter do?", a: "Gamma acts as a strict complexity control. A node simply will not split unless the resulting reduction in mathematical loss strictly eclipses the defined Gamma threshold, triggering early pruning." },
        { q: "How does regularization differ in XGBoost compared to Random Forest?", a: "XGBoost natively injects explicit L1 (Lasso) and L2 (Ridge) penalties directly into the core objective function to aggressively suppress weak or noisy leaf weights." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "Total iterations in the sequence." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 1.0, step: 0.01, default: 0.1, desc: "Step size shrinkage. Low values require more trees." },
        max_depth: { label: "Max Depth", min: 1, max: 15, step: 1, default: 3, desc: "Restricts the complexity of each sequential tree." },
        gamma: { label: "Gamma Penalty", min: 0.0, max: 5.0, step: 0.1, default: 0.0, desc: "Minimum required loss reduction to trigger a split." },
        reg_lambda: { label: "L2 Penalty", min: 0.0, max: 10.0, step: 0.1, default: 1.0, desc: "Ridge regularization on leaf weights to smoothly shrink predictions." },
        reg_alpha: { label: "L1 Penalty", min: 0.0, max: 10.0, step: 0.1, default: 0.0, desc: "Lasso regularization forcing weak leaf weights to absolute zero." },
        subsample: { label: "Data Subsample", min: 0.1, max: 1.0, step: 0.1, default: 1.0, desc: "Fraction of rows to randomly sample per tree, preventing memorization." }
      }
    },
    regression: {
      summary: "Predicts continuous numbers using second-order gradients and heavy regularization to build incredibly robust regression curves.",
      explanation: "Just like the classifier, XGBoost Regressor sequentially calculates exact mathematical gradients to patch errors. But instead of generating probabilities, the terminal leaves generate continuous numerical weights. To prevent the predictions from randomly spiking and overfitting an outlier, XGBoost slams the leaf weights with heavy L2 regularization (Lambda), forcing the final regression curve to remain butter-smooth and highly accurate against unseen data.",
      analogy: "Like a sculptor chiseling a block of marble. The first heavy swing gets the rough shape. Instead of randomly hitting the block from there, the sculptor uses ultra-precise micrometers to calculate the exact remaining depth needed on every corner. But the sculptor also wears a dampener glove (regularization), ensuring they never swing harder than perfectly necessary, preventing them from accidentally destroying the masterpiece.",
      steps: [
        "Initialize a baseline continuous output (like the mean target value).",
        "Calculate continuous squared error gradients.",
        "Grow a regression tree relying on subsampled data and features.",
        "Calculate optimal continuous leaf weights constrained by L2/L1 penalties.",
        "Shrink the tree's contribution via the learning rate.",
        "Iterate the sequence aggressively."
      ],
      interviewQs: [
        { q: "If an XGBRegressor is overfitting the training data flawlessly but failing on testing, what hyperparameters must you adjust?", a: "You must immediately decrease max_depth, slash the learning_rate while bumping n_estimators, and heavily increase gamma and reg_lambda to force the algorithm into submission." },
        { q: "What does colsample_bytree accomplish in XGBoost?", a: "Borrowed from Random Forest concepts, it restricts each tree to only viewing a random fraction of the features. This prevents a single hyper-dominant feature from dictating the structure of the entire sequence." },
        { q: "What is the crucial difference between reg_alpha and reg_lambda?", a: "Alpha acts as L1 regularization, which violently pushes weak leaf weights entirely to zero (creating sparse models). Lambda acts as L2 regularization, which gently smooths all leaf weights simultaneously." },
        { q: "Can XGBRegressor extrapolate continuous trends entirely beyond its training limits?", a: "Absolutely not. Because its base learners are standard decision trees, XGBoost's maximum possible output is physically locked to the largest continuous value it ever saw during training." },
        { q: "How is feature importance calculated internally for mathematical regression?", a: "It ranks features by 'Gain' (the average training error wiped out by relying on that feature), or 'Coverage' (the sheer volume of data rows filtered by that specific feature)." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "Total iterations in the sequence." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 1.0, step: 0.01, default: 0.1, desc: "Step shrinkage to suppress overfitting." },
        max_depth: { label: "Max Depth", min: 1, max: 15, step: 1, default: 3, desc: "Tree depth complexity." },
        gamma: { label: "Gamma Penalty", min: 0.0, max: 5.0, step: 0.1, default: 0.0, desc: "Minimum reduction to trigger split." },
        reg_lambda: { label: "L2 Penalty", min: 0.0, max: 10.0, step: 0.1, default: 1.0, desc: "Smooths extreme continuous prediction values." },
        reg_alpha: { label: "L1 Penalty", min: 0.0, max: 10.0, step: 0.1, default: 0.0, desc: "Forces weak contributions to zero." },
        subsample: { label: "Data Subsample", min: 0.1, max: 1.0, step: 0.1, default: 1.0, desc: "Adds stochastic noise during training jumps." }
      }
    }
  },
  {
    id: "naive_bayes",
    title: "Naive Bayes",
    supportedTypes: ["classification"],
    classification: {
      summary: "An incredibly fast classification algorithm grounded in probability theory that completely ignores how different features relate to each other.",
      explanation: "Naive Bayes uses classic probability to predict a class. The algorithm is called 'naive' because to calculate probabilities at lightning speed, it assumes that every single piece of data (feature) is entirely independent of every other piece of data. Even though this assumption is mathematically incorrect for almost all real-world data, the algorithm miraculously still manages to generate fantastic classification boundaries, making it heavily utilized for text classification and spam filtering.",
      analogy: "Imagine an intense security guard sorting bags into 'Safe' or 'Dangerous'. They look at a checklist. Does it have batteries? Does it have wires? Normally, a battery next to a wire is a massive red flag. But a 'naive' guard completely ignores context! They just see a battery (adds 10% danger), and an entirely unrelated wire (adds 10% danger), totally failing to realize they connect to form a bomb. Yet statistically, looking quickly at the raw checklist without deep thinking is usually fast enough to catch most banned items.",
      steps: [
        "Gather the training data.",
        "Calculate the baseline prior probabilities (e.g., 60% of emails are spam).",
        "Calculate the independent probability of every single feature belonging to each class.",
        "When queried, multiply the prior probability with the product of all independent feature probabilities.",
        "Return the class with the highest resulting mathematical probability."
      ],
      interviewQs: [
        { q: "What fundamentally separates GaussianNB, MultinomialNB, and BernoulliNB?", a: "They change how they interpret the data. Gaussian assumes data points are plotted on a continuous 'bell curve'. Multinomial demands numerical counts (like word frequencies). Bernoulli demands strict binary 'yes/no' checklists." },
        { q: "Why is the naive assumption mathematically incorrect but functionally brilliant?", a: "It is incredibly rare for real-world variables to be completely independent of each other. But by ignoring complex covariance matrix calculations, the algorithm circumvents the curse of dimensionality, executing infinitely faster than deep models." },
        { q: "How does MultinomialNB handle an entirely unknown word that has 0% probability in its dataset?", a: "If a probability hits exactly absolute zero, multiplying the whole chain kills the entire equation. MultinomialNB injects 'smoothing' (like Alpha Laplace smoothing) to forcefully bump absolute zeroes into microscopic decimals." },
        { q: "How does BernoulliNB handle continuous numerical data?", a: "Because Bernoulli purely acts on a Boolean checking system (is the value present or not?), if it is handed continuous numbers, it will blindly binarize them into 0s and 1s using a strict manual threshold." },
        { q: "Is Naive Bayes a reliable probability estimator?", a: "No. While it cleanly ranks which class is most likely (excelling at classification accuracy), the actual outputted percentage probability numbers it generates are notoriously unreliable and highly skewed toward false confidence." }
      ],
      hyperparameters: {
        var_smoothing: { label: "Variance Smoothing", min: 0.000000001, max: 0.1, step: 0.001, default: 0.000000001, desc: "Artificially adds a tiny fraction of variance to suppress mathematical instability when dealing with decimals near zero." }
      }
    }
  },
  {
    id: "dbscan",
    title: "DBSCAN",
    supportedTypes: ["clustering"],
    clustering: {
      summary: "An incredibly versatile unsupervised algorithm that groups dense clouds of data points into clusters, actively ignoring isolated noise regardless of the cluster's shape.",
      explanation: "Density-Based Spatial Clustering of Applications with Noise (DBSCAN) fundamentally rethinks clustering. Instead of assuming clusters are perfect circles like K-Means does, it defines a cluster as a contiguous region of high density. It picks a core data point and spreads out like paint, absorbing neighboring points into the cluster as long as they meet a strict density threshold. This spreading allows it to trace highly irregular, wildly bending shapes (like a crescent moon or a donut). Any points left isolated in low-density space are hard-labeled as 'Noise' and completely ignored.",
      analogy: "Imagine mapping urban city limits using a satellite at night. You make a rule: if you find 10 illuminated buildings (min_samples) within a 1-mile radius of each other (eps), that's an 'urban core'. You group all overlapping urban cores together to draw the massive, sprawling, irregular city limits. A random lonely cabin out in the dark woods doesn't meet the density rule, so it is actively ignored as 'background noise'.",
      steps: [
        "Select a random, unvisited data point.",
        "Check how many neighboring points exist within a set radius (eps).",
        "If there are enough neighbors (min_samples), mark it as a core point and start a cluster.",
        "Recursively expand the cluster by checking the neighbors of the neighbors.",
        "Once a dense cluster can literally spread no further, pick a new unvisited point.",
        "Any leftover points that never met the density threshold are marked as outlier noise (-1)."
      ],
      interviewQs: [
        { q: "How does DBSCAN fundamentally differ from K-Means regarding cluster structure?", a: "K-Means strictly assumes clusters are spherical/convex and forces every single outlier into a group. DBSCAN defines clusters strictly by continuous density, allowing it to easily map highly irregular, non-convex shapes while actively throwing away noise." },
        { q: "What exactly are Core, Fringe, and Noise points?", a: "A Core point has at least min_samples neighbors within the eps radius. A Fringe point is within eps of a Core point but lacks the density to be a Core itself. Noise points are utterly isolated and belong to no cluster." },
        { q: "Is DBSCAN a fully deterministic algorithm?", a: "No. The designation of what is core vs noise is 100% deterministic, but fringe points that fall exactly between the borders of two competing clusters will be assigned to whichever cluster the algorithm arbitrarily evaluated first." },
        { q: "How do you intuitively tune the 'eps' and 'min_samples' parameters?", a: "If eps is too small, everything is flagged as noise. If eps is too large, the algorithm acts like a massive blob, merging distinct clusters into one. min_samples acts as a noise filter; higher values require intense density to form a cluster." },
        { q: "What is the primary memory bottleneck for DBSCAN?", a: "For dense data, spatial trees (KD-Trees) make local neighbor searches fast. But for massive, sparse datasets, building a pairwise similarity matrix blows up the memory complexity to O(N^2) unless you pass a precomputed sparse matrix." }
      ],
      hyperparameters: {
        eps: { label: "Radius (eps)", min: 0.1, max: 2.0, step: 0.1, default: 0.5, desc: "The maximum distance radius to count neighbors. Highly sensitive to data scale." },
        min_samples: { label: "Minimum Samples", min: 2, max: 20, step: 1, default: 5, desc: "How many points must exist in the radius to trigger a core cluster." },
        metric: { label: "Distance Metric", options: ["euclidean", "manhattan", "chebyshev"], default: "euclidean", desc: "The mathematical formula to calculate physical distance between points." }
      }
    }
  },
  {
    id: "agglomerative_clustering",
    title: "Agglomerative Clustering",
    supportedTypes: ["clustering"],
    clustering: {
      summary: "AgglomerativeClustering is a hierarchical, bottom-up unsupervised learning method. It builds nested clusters by starting with each observation in its own individual cluster, and successively merging the most similar pairs of clusters together based on a specified linkage criterion until a stopping condition is met.",
      explanation: "Hierarchical clustering algorithms build a hierarchy of clusters that can be represented as a tree (or dendrogram), where the leaves are individual data samples and the root is a single cluster containing all samples. Agglomerative clustering specifically takes a 'bottom-up' approach by iteratively merging clusters together. At each step, the algorithm evaluates all possible merges and combines the two clusters that minimize a specified linkage criterion. Because it evaluates all pairs, it can be computationally expensive for a large number of samples. To scale the algorithm and impose local data structure, users can provide a connectivity matrix.",
      analogy: "Imagine organizing a massive tournament of individual tennis players into groups. At first, everyone is in a group of 1 (bottom-up approach). The organizers look for the two players who have the most similar play styles (shortest distance) and merge them into a 2-person group. Next, they find the next most similar pair and merge them. They recursively repeat this process of merging the most similar remaining groups until they end up with the exact number of large groups requested, or until the differences between the remaining groups exceed a specific threshold.",
      steps: [
        "Initialize the algorithm by placing each training observation into its own individual cluster.",
        "Evaluate the pairwise distances (or affinities) between all active clusters using the chosen metric.",
        "Identify the pair of clusters that minimizes the chosen linkage criterion.",
        "Merge this optimal pair into a single, larger cluster, moving one step up the hierarchical tree.",
        "Repeat iteratively until the desired n_clusters is reached, or until the distance threshold is exceeded."
      ],
      interviewQs: [
        { q: "What is the difference between Agglomerative and Divisive hierarchical clustering?", a: "Agglomerative clustering is a bottom-up approach where each observation starts in its own cluster and they are iteratively merged. Divisive clustering is a top-down approach where all observations start in a single massive cluster, which is recursively split down the hierarchy." },
        { q: "What are the linkage criteria available in AgglomerativeClustering?", a: "1) Ward minimizes the sum of squared differences within all clusters. 2) Complete minimizes the maximum distance between observations in pairs of clusters. 3) Average minimizes the average distance between all observations of pairs of clusters. 4) Single minimizes the distance between the closest observations of pairs of clusters." },
        { q: "What is the 'rich get richer' behavior in Agglomerative Clustering?", a: "It is a percolation instability where a few clusters grow very quickly and become macroscopically occupied, while other clusters remain almost empty. Single linkage is the most susceptible to this, whereas Ward linkage tends to give the most regular and even sizes." },
        { q: "Why might you choose average linkage over Ward linkage?", a: "While Ward linkage is highly effective, it strictly requires the use of the Euclidean distance metric. If your data requires a non-Euclidean metric (like cosine distance or Manhattan distance), average linkage is a good alternative." },
        { q: "How do connectivity constraints affect the algorithm?", a: "A connectivity matrix restricts the algorithm so that only adjacent clusters can be merged together. This makes the algorithm much faster for large datasets, but can worsen the 'rich getting richer' uneven clustering behavior for some linkages." }
      ],
      hyperparameters: {
        n_clusters: { label: "Number of Clusters", min: 2, max: 10, step: 1, default: 3, desc: "The desired number of clusters to find." },
        linkage: { label: "Linkage Criterion", options: ["ward", "complete", "average", "single"], default: "ward", desc: "Determines the merge strategy (ward requires euclidean metric)." },
        metric: { label: "Distance Metric", options: ["euclidean", "manhattan", "cosine"], default: "euclidean", desc: "The pairwise distance metric used." }
      }
    }
  },
  {
    id: "gradient_boosting",
    title: "Gradient Boosting",
    supportedTypes: ["classification", "regression"],
    classification: {
      summary: "The GradientBoostingClassifier is an accurate and effective ensemble method that builds an additive model in a forward stage-wise fashion.",
      explanation: "Gradient Tree Boosting uses decision trees of a fixed size as weak learners. The algorithm builds an additive model in a greedy fashion. At each stage, the newly added tree tries to minimize the loss given the previous ensemble. It solves this minimization problem numerically via steepest descent: the steepest descent direction is the negative gradient of the loss function evaluated at the current model. Even though this is a classification task, the weak learners induced at each step are always regression trees that predict the continuous negative gradients.",
      analogy: "Imagine you are playing miniature golf. Your first stroke (the initial model) gets the ball close to the hole, but misses by a certain distance and angle (the residual error). Instead of taking the first shot again, you take your second stroke from where the ball landed, specifically aiming to correct the remaining distance and angle to the hole (fitting a tree to the negative gradient). Each subsequent stroke is a highly focused attempt to correct the remaining error of the combined previous strokes.",
      steps: [
        "Initialize the model with a problem-specific value.",
        "Compute the negative gradient of the loss function evaluated at the current model for all training samples.",
        "Fit a regression tree to these negative gradients.",
        "Compute the step length using a line search to minimize the loss function.",
        "Update the model by adding the newly fitted tree, scaled by a regularization parameter (learning rate).",
        "Repeat for the specified number of boosting stages (n_estimators)."
      ],
      interviewQs: [
        { q: "What type of base estimator is used in a Gradient Boosting Classifier?", a: "Even for classification tasks, Gradient Tree Boosting uses regression trees as its weak learners. These trees are fit to predict the continuous negative gradients of the loss function." },
        { q: "How does Gradient Boosting optimize its loss function?", a: "It solves the minimization problem numerically via steepest descent. The negative gradient of the loss function evaluated at the current model serves as the steepest descent direction." },
        { q: "What is Stochastic Gradient Boosting?", a: "It occurs when you use a fraction of the available training data (controlled by the subsample parameter) to fit the individual base learners, drawn without replacement, which reduces variance and increases bias." },
        { q: "How does it handle multi-class classification?", a: "For multi-class classification, it uses the multinomial deviance loss function. At each iteration, it constructs n_classes separate regression trees, meaning the total number of trees induced is n_classes * n_estimators." },
        { q: "What is shrinkage in Gradient Boosting?", a: "Shrinkage is a regularization strategy that scales the contribution of each newly added weak learner by a factor (the learning_rate) to help prevent overfitting." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "The number of boosting stages to perform." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 1.0, step: 0.01, default: 0.1, desc: "Shrinks the contribution of each tree. Interacts strongly with n_estimators." },
        max_depth: { label: "Max Depth", min: 1, max: 10, step: 1, default: 3, desc: "Maximum depth of the individual regression estimators." },
        subsample: { label: "Subsample", min: 0.1, max: 1.0, step: 0.1, default: 1.0, desc: "Fraction of samples used for fitting trees (Stochastic Gradient Boosting)." },
        min_samples_split: { label: "Min Samples Split", min: 2, max: 20, step: 1, default: 2, desc: "Minimum number of samples required to split an internal node." },
        min_samples_leaf: { label: "Min Samples Leaf", min: 1, max: 20, step: 1, default: 1, desc: "Minimum number of samples required to be at a leaf node." }
      }
    },
    regression: {
      summary: "The GradientBoostingRegressor is a boosting ensemble method designed for continuous regression tasks.",
      explanation: "Like its classification counterpart, it builds an additive model in a forward stage-wise fashion, fitting a sequence of regression trees to the negative gradient of an arbitrary differentiable regression loss function. The algorithms for regression and classification only differ in the concrete loss function used. For regression, the default is least squares ('ls'/'squared_error'), but it supports robust losses like absolute error ('lad') or huber.",
      analogy: "Imagine an assembly line of artists trying to paint a perfectly accurate landscape. The first artist paints a rough, basic background. The second artist looks only at the differences between the real landscape and the rough background, and paints a translucent layer that specifically adds the missing details (fitting the residual errors). The third artist looks at the remaining flaws and adds another corrective layer. After 100 artists, the final stacked painting is wonderfully accurate.",
      steps: [
        "Initialize the model with a baseline average prediction.",
        "Calculate the residuals (the negative gradient) for the current model predictions.",
        "Fit a regression tree to these negative gradients.",
        "Determine the step length to minimize the loss.",
        "Update the ensemble by adding the scaled tree to the existing model.",
        "Iterate until the specified limit is reached."
      ],
      interviewQs: [
        { q: "What is the relationship between learning_rate and n_estimators in Gradient Boosting?", a: "They strongly interact. Smaller values of learning_rate require progressively larger numbers of n_estimators to maintain constant training error, but generally favor better test error." },
        { q: "How can you control the level of variable interactions captured?", a: "By controlling the size of the regression tree base learners. A tree of depth h (set via max_depth) can capture feature interactions of order h." },
        { q: "What is the alternative to max_depth for controlling tree size?", a: "You can use max_leaf_nodes, which grows trees using a best-first search expanding nodes with the highest impurity improvement first." },
        { q: "How are Out-of-Bag (OOB) estimates computing?", a: "When subsample < 1.0, the algorithm leaves out a fraction of data during tree training. The improvement in deviance on these out-of-bag samples can measure optimal iterations without a separate validation set." },
        { q: "What does the loss criteria 'huber' do?", a: "It is a robust combination of least squares and least absolute deviation that makes the model less sensitive to massive outliers in the target variable." }
      ],
      hyperparameters: {
        n_estimators: { label: "Number of Trees", min: 10, max: 200, step: 10, default: 100, desc: "The number of boosting stages to perform." },
        learning_rate: { label: "Learning Rate", min: 0.01, max: 1.0, step: 0.01, default: 0.1, desc: "Shrinks the contribution of each tree." },
        max_depth: { label: "Max Depth", min: 1, max: 10, step: 1, default: 3, desc: "Maximum depth of the estimators." },
        subsample: { label: "Subsample (Stochastic)", min: 0.1, max: 1.0, step: 0.1, default: 1.0, desc: "Fraction of data samples used per tree." },
        loss: { label: "Loss Function", options: ["squared_error", "absolute_error", "huber", "quantile"], default: "squared_error", desc: "The loss to be optimized." }
      }
    }
  },
  {
    id: "pca",
    title: "Principal Component Analysis (PCA)",
    supportedTypes: ["dimensionality_reduction"],
    dimensionality_reduction: {
      summary: "An unsupervised linear transformation technique that reduces the dimensionality of data while retaining the maximum possible variance.",
      explanation: "Imagine a 3D cloud of data points shaped like a pancake. PCA looks at this cloud and mathematically determines the axes (components) where the data gets stretched the most. It then squashes the points down onto those main axes. The resulting first component holds the most 'information' (variance), the second holds the next most, and so on. It intentionally throws away the dimensions where the data is thickest/noisiest, making it vastly easier for models like K-Means or Random Forest to process.",
      analogy: "Like shining a flashlight on a translucent 3D object and looking at the 2D shadow it casts on the wall. PCA rotates the object until it finds the exact angle that casts the widest, most detailed shadow possible.",
      steps: [
        "Standardize the dataset so all features are on the same heavily balanced scale.",
        "Compute the Covariance Matrix to understand how features relate to each other.",
        "Calculate the Eigenvectors (directions) and Eigenvalues (magnitude) of the matrix.",
        "Sort the Eigenvectors by highest Eigenvalue to find the Principal Components.",
        "Project the original high-dimensional data onto the new, lower-dimensional axes."
      ],
      interviewQs: [
        { q: "Is PCA supervised or unsupervised?", a: "Unsupervised. It only looks at the features (X) to maximize variance, it completely ignores the target labels (Y)." },
        { q: "Why is feature scaling/standardization heavily required before running PCA?", a: "Because PCA calculates variance. If one feature is measured in millions (like Salary) and one in decimals (like BMI), the algorithm will wrongly determine the vast Salary feature as the only important Principal Component." },
        { q: "What is 'Explained Variance'?", a: "It dictates how much of the original dataset's total spread (information) is captured by a specific Principal Component." },
        { q: "Does PCA select the best existing features?", a: "No, PCA performs Feature Extraction, not Selection. It creates entirely new mathematical dimensions that are linear combinations of all the original features." }
      ],
      hyperparameters: {
        n_components: { label: "Components (Dimensions)", min: 1, max: 3, step: 1, default: 2, desc: "The number of dimensions to crush the data down into." },
        svd_solver: { label: "SVD Solver", options: ["auto", "full", "randomized"], default: "auto", desc: "The solver used to calculate the Singular Value Decomposition." }
      }
    }
  },
  {
    id: "t_sne",
    title: "t-SNE",
    supportedTypes: ["dimensionality_reduction"],
    dimensionality_reduction: {
      summary: "A powerful, non-linear technique specifically engineered for visualizing extremely high-dimensional datasets into 2D or 3D plots.",
      explanation: "Unlike PCA which cares globally about large variance, t-Distributed Stochastic Neighbor Embedding (t-SNE) cares locally about 'neighborhoods'. It maps high dimensional points by converting their physical distances into conditional probabilities. It then creates an identical probability map in a 2D space. Finally, it slowly shuffles the 2D points around using Gradient Descent until the 2D neighborhood groups perfectly match the High-Dimensional neighborhood groups.",
      analogy: "Imagine having a massive, chaotic family tree where everyone is scattered. t-SNE acts like a party planner arranging seating at a wedding: they ensure that close siblings sit right next to each other locally, while distant cousins sit far apart, completely ignoring the global architecture of the building.",
      steps: [
        "Measure the high-dimensional distances between all data points.",
        "Convert those distances into a bell-curve (Gaussian) probability distribution.",
        "Create a random layout of those same points in a 2D space using a Heavy-Tailed (Student-t) distribution.",
        "Measure the distances in the 2D space and compare against the high-dimensional probabilities.",
        "Adjust the 2D points using Kullback-Leibler divergence until the structures match."
      ],
      interviewQs: [
        { q: "What does the 'Perplexity' hyperparameter control?", a: "Perplexity balances attention between local and global aspects of your data. Think of it roughly as the number of close neighbors each point looks at. A very low perplexity creates lots of dense little clumps; high perplexity creates a more uniform 'soup'." },
        { q: "Can t-SNE be used for clustering, like K-Means?", a: "No. While t-SNE produces visually beautiful clusters, the distances between clusters are mathematically meaningless and heavily distorted. It is strictly for human visualization." },
        { q: "Why use t-SNE instead of PCA?", a: "PCA only captures linear relationships. t-SNE can capture highly non-linear, twisted manifolds (like an unraveling swiss roll) and preserves local structural integrity much better." },
        { q: "Does t-SNE generate a reusable mathematical model?", a: "No. Unlike PCA, you cannot save a t-SNE model and 'transform' new incoming data points later. Every time you run t-SNE, it recalculates the entire map from scratch." }
      ],
      hyperparameters: {
        perplexity: { label: "Perplexity", min: 5, max: 50, step: 5, default: 30, desc: "The number of nearest neighbors that is used in other manifold learning algorithms. Larger datasets require a larger perplexity." },
        learning_rate: { label: "Learning Rate", options: ["auto", "10", "100", "500"], default: "auto", desc: "How aggressively the algorithm adjusts the points in 2D space per iteration." },
        n_iter: { label: "Iterations", min: 250, max: 1000, step: 50, default: 1000, desc: "Maximum number of iterations for the optimization." }
      }
    }
  },
  {
    id: "lda",
    title: "Linear Discriminant Analysis (LDA)",
    supportedTypes: ["dimensionality_reduction"],
    dimensionality_reduction: {
      summary: "A supervised dimensionality reduction and classification tool that maximizes the separability between known categories.",
      explanation: "While PCA blindly tries to spread the data out as much as possible, LDA actually looks at the answer key (the labels). It measures the spread of the data *inside* each class and compares it to the distance *between* the different classes. It then draws new axes that intentionally squash the points of the same class together, while pushing the different classes as far apart as possible.",
      analogy: "If PCA is a photographer taking a wide panoramic shot of a crowded room to capture everything, LDA is a bouncer who forces everyone wearing red shirts into the left corner of the room, and blue shirts into the right corner, to make them easy to identify.",
      steps: [
        "Calculate the mean and variance for every individual class.",
        "Calculate the within-class scatter (how spread out same-class points are).",
        "Calculate the between-class scatter (how far apart the class centers are).",
        "Construct a mathematical axis that maximizes the between-class scatter while minimizing the within-class scatter.",
        "Project the data onto this new highly-discriminative axis."
      ],
      interviewQs: [
        { q: "What is the core difference between PCA and LDA?", a: "PCA is unsupervised and maximizes global variance. LDA is supervised and maximizes the distance between the means of classes while minimizing the spread within each class." },
        { q: "What are the limitations of LDA's dimensions?", a: "The number of components LDA can extract is fundamentally limited to at maximum (Number of Classes - 1). If you only have 2 classes, LDA can strictly only reduce the data down to 1 single dimension." },
        { q: "What assumption does LDA make about the data distribution?", a: "LDA assumes that the data is normally distributed (Gaussian) and that all classes share the exact same covariance matrix." },
        { q: "Can LDA be used as a classifier?", a: "Yes. In addition to reducing dimensionality, the axes it draws can be used to directly predict which class new data belongs to." }
      ],
      hyperparameters: {
        solver: { label: "Solver", options: ["svd", "eigen"], default: "svd", desc: "The solver engine used to calculate the discrimination." },
        n_components: { label: "Components (Dims)", min: 1, max: 2, step: 1, default: 2, desc: "Cannot exceed Number of Classes minus 1." }
      }
    }
  }
];
