import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from joblib import dump

data = pd.read_csv("C:\Work\ProjectSoundEnglish\WebApplication\Service\Tools\Profanity_Model\data\clean_data_edit.csv")
texts = data["text"].astype(str)
y = data["is_offensive"]

vectorizer = TfidfVectorizer(stop_words="english", min_df=0.0001)
X = vectorizer.fit_transform(texts)

model = LinearSVC(class_weight="balanced", dual=False, tol=1e-2, max_iter=1e5)
cclf = CalibratedClassifierCV(base_estimator=model)
cclf.fit(X, y)

dump(vectorizer, "vectorizer_edit3.joblib")
dump(cclf, "model_edit3.joblib")


