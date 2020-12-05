import json
import os
import sys

youtube_plus_list_path = str(sys.argv[1])
if youtube_plus_list_path is False:
    print("Must provide a file path")

if not os.path.exists(youtube_plus_list_path):
    print("File does not exist")
    exit(1)

with open(youtube_plus_list_path, 'r') as file:
    old_list = json.load(file)

new_list = list(old_list.values())
with open("new_list.json", 'w+') as file:
    json.dump(new_list, file, indent=4)

print("Done")
