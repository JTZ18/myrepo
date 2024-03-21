from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import torch
import librosa

# load model and processor
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-large-960h")
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-large-960h")

# Check if a GPU is available and if not, use a CPU
device = torch.device("cuda:0" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu")

# Move the model to the device
model = model.to(device)

# Define response model
class ASRResponse(BaseModel):
    transcription: str
    duration: str


app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/ping")
async def root():
    return "pong"

@app.post("/asr", response_model=ASRResponse)
async def asr(file: UploadFile = File(...)):
    # Read file
    audio, _ = librosa.load(file.file, sr=16000) # sample rate 16kHz

    # Tokenize
    input_values = processor(audio, return_tensors="pt", padding="longest").input_values # batch size 1

    # Get transcription
    input_values = input_values.to(device)
    logits = model(input_values).logits
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]

    # Get duration
    duration = str(len(audio) / 16000)

    return ASRResponse(transcription=transcription, duration=duration)