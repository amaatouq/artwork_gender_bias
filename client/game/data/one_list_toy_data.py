import json

json_string = open("./toy_data_artexperiment.json").read()
json_data = json.loads(json_string)

for i in range(len(json_data)):
    json_data[i] = json_data[i][0]

new_json_string = json.dumps(json_data)
open("./toy_data_artexperiment_new.json", "w").write(new_json_string)
