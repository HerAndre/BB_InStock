import pandas as pd
import json


df = pd.read_csv('./scripts/reports.csv')
data = {}

data["x"] = df['send_month'].dropna().to_list()
data["y"] = df['open_rate'].dropna().to_list()
data["type"] = 'lines'
data['line'] = {
  'color': 'rgb(219, 64, 82)',
  'width': 3
}
data["transforms"] = [{
  "type": 'aggregate',
  "groups": df['send_month'].dropna().to_list(),
  "aggregations": [
    {"target": 'y', "func": 'avg', "enabled": True},
  ]
}]

data["layout"] = {
  'title': "Open Rate per Month",
  'xaxis': {'title': "Month"},
  'yaxis': {'title': "Open Rate %"}

}

print(json.dumps(data))