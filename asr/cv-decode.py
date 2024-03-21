import pandas as pd
import requests
import os
from tqdm import tqdm

def transcribe(file_path):
  url = "http://127.0.0.1:8000/asr"
  files = {'file': open(file_path, 'rb')}
  response = requests.post(url, files=files)

  # Check if the response is a valid JSON document
  try:
    transcription = response.json()['transcription']
  except ValueError:
    print(f"Invalid response for file {file_path}: {response.text}")
    transcription = None

  return transcription

df = pd.read_csv('cv-valid-dev.csv')

for index, row in tqdm(df.iterrows(), total=df.shape[0]):
  file_path = os.path.join('./data', 'cv-valid-dev', row['filename'])
  df.loc[index, 'generated_text'] = transcribe(file_path)

df.to_csv('cv-valid-dev-updated.csv', index=False)