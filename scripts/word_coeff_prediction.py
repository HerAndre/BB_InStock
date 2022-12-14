import pandas as pd
import numpy as np
import sys

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import CountVectorizer

import json

df = pd.read_csv('./scripts/reports.csv')
data = {}

or_mean = df['open_rate'].mean()
df['open_rate_flag'] = np.where(df['open_rate'] >= or_mean, 1, 0)
df['subject_line']= df['subject_line'].astype(str)

stop_numbers = []
counter = 0

for i in range(0, 2023):
    stop_numbers.append(str(counter))
    counter+=1

def strip_subject(words):
    filtered_sentence = []
    stop = (stopwords.words('english'))
    stop.extend(stop_numbers)
    word_tokens = word_tokenize(words)

    for w in word_tokens:
        if w not in stop:
            filtered_sentence.append(w)
    return ' '.join(filtered_sentence)

df['tokenized_subject'] = df['subject_line'].apply(strip_subject)

train_df, test_df = train_test_split(df, test_size=0.2, random_state=123)
X_train, y_train = train_df['tokenized_subject'], train_df['open_rate_flag']
X_test, y_test = test_df['tokenized_subject'], test_df['open_rate_flag']

model = LogisticRegression()
pipe_lr = make_pipeline(
    CountVectorizer(stop_words="english"),
    model,
)

pipe_lr.fit(X_train, y_train)

feature_names = np.array(pipe_lr.named_steps["countvectorizer"].get_feature_names_out())
coeffs = pipe_lr.named_steps["logisticregression"].coef_.flatten()

pd.set_option('display.max_rows', None)
word_coeff_df = pd.DataFrame(coeffs, index=feature_names, columns=["Coefficient"])
word_coeff_df.sort_values(by='Coefficient', ascending=False, inplace=True)

#INPUT SAMPLE SUBJECT HEADLINE
subject = sys.argv[1]

prediction = pipe_lr.predict_proba([subject])
data["prediction"] = {
  'below_average_probability': prediction[0][0],
  'above_average_probability': prediction[0][1],
  'words': word_coeff_df.index.to_list(),
  'coeffs': word_coeff_df['Coefficient'].to_list(),
  'object': word_coeff_df.to_dict(),
  "subject": sys.argv[1]
}

print(json.dumps(data))