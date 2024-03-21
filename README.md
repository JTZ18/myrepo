# myrepo
htx technical assessment

## Setup

Before you start, make sure you have Python 3.10 installed on your machine.

First, create a virtual environment.

```bash
python3 -m venv venv
```

This creates a new directory venv

To activate the virtual environment, run:
```bash
# on linux or mac run
source venv/bin/activate

# on windows run
.\venv\Scripts\activate
```

Your shell prompt will change to show the name of the activated environment.

Next, install the Python dependencies:
```bash
pip install -r requirements.txt
```

To run the server, use the `uvicorn` command:
```bash
uvicorn asr.asr-api:app --reload
```

## Downloading the Data

The `setup.sh` script is used to download the necessary data for Task 2d. This includes the sample audio files for `cv-valid-dev`.

To run the script, use the following command from the root directory of the project:

```bash
./setup.sh
```
This will download a data.zip file, unzip it to create a data directory, and then delete the data.zip file. If the data directory already exists, the script will not download anything.

## Testing the Server

Once the server is up and running, you can test if it's working correctly by pinging the `/ping` endpoint. Use the following `curl` command:
`For Task 2b`

```bash
curl http://127.0.0.1:8000/ping
```
This should return a response "pong" indicating that the server is running correctly.

## Testing the ASR Endpoint

You can test the ASR endpoint by sending a POST request with a file. A sample audio file `sample.mp3` has been provided. Use the following `curl` command:
`For Task 2c`

```bash
curl -X POST "http://127.0.0.1:8000/asr" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "file=@./sample.mp3"
```

A json response similar to this will be returned:
```json
{
  "transcription": "I THINK JOHN TEYLOR IS E YOUNG CAPABLE A I ENGINEER HE WOULD MAKE A GREAT FIT FOR ST S",
  "duration": "6.635125"
}
```

## Running the Dataset Through the ASR Endpoint

You can run the `cv-decode.py` script to process each sample file in the `data` directory through the localhost server. This script will generate transcriptions for each file and create a new `cv-valid-dev-updated.csv` file in the `/asr` directory.

The `cv-valid-dev-updated.csv` is already in the directory for `Task 2d`

If you would like to run the script, use the following command from the root directory of the project:

```bash
python asr/cv-decode.py
```

## Task 2e: Containerizing the FastAPI App

For Task 2e, we containerize the FastAPI app using a Dockerfile. To build, run, and test the image, follow the steps below:

1. Build the Docker image:

```bash
docker build -t asr-api .
```

2. Run the Docker container:
```bash
docker run -p 80:80 asr-api
```

3. Test the API:
```bash
curl http://localhost:80/ping
```
```bash
curl -X POST "http://localhost:80/asr" -H "accept: application/json" -H "Content-Type: multipart/form-data" -F "file=@./sample.mp3"
```

**Note:** Since we are using FastAPI's `UploadFile` class, the files uploaded to the API are temporary files that will be discarded after each API call has finished execution.


