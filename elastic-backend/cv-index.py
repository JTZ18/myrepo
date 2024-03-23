from elasticsearch import Elasticsearch, helpers
import csv
import os

# Change the working directory to the directory of the script
os.chdir(os.path.dirname(os.path.abspath(__file__)))



es = Elasticsearch(hosts=["http://localhost:9200"])

def load_csv(file_name):
  with open(file_name, 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
      yield {
        "_index": "cv-transcriptions",
        "_source": row,
      }

helpers.bulk(es, load_csv('../asr/cv-valid-dev-updated.csv'))