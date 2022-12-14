import pandas as pd
import json


df = pd.read_csv('./scripts/reports.csv')
data = {}

data["y"] = df['open_rate'].to_list()
data["type"] = 'histogram'
data["marker"] = { 'color': "rgba(255, 100, 102, 0.7)",
  'line': {
    'color':  "rgba(255, 100, 102, 1)",
    'width': 2
  }
}

data["layout"] = {
  'bargap': 0.05,
  'bargroupgap': 0.2,
  'barmode': "overlay",
  'title': "Open Rate Distribution",
  'xaxis': {'title': "Open Rate Occurences"},
  'yaxis': {'title': "Open Rate %"}
}
print(json.dumps(data))