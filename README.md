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
NOTE: Due to relative import errors, please run the script from the root directory of the project.

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
NOTE: Due to relative import errors, please run the script from the root directory of the project.

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

## Task 3: Deployment Design
PDF report can be found in the `deployment-design/design.pdf` file.

## Task 4: Elasticsearch Backend
A docker compose file spins up an Elasticsearch cluster with two nodes. The `cv-index.py` script indexes the `asr/cv-valid-dev-updated.csv` file into the Elasticsearch cluster.

#### Step 1: Spin up the Elasticsearch cluster
```bash
cd elastic-backend
docker-compose up
```

#### Step 2: Index the data
```bash
cd ..
python elastic-backend/cv-index.py
```
NOTE: Due to relative import errors, please run the script from the root directory of the project.

## Task 5: Search UI
The Search UI is a react app taken from the search-ui [docs](https://docs.elastic.co/search-ui/tutorials/elasticsearch#step-4-setup-cra-for-search-ui). The docs provided a sample template found [here](https://codeload.github.com/elastic/app-search-reference-ui-react/tar.gz/master) for searching a movie database. The app config has been modified for our use case of `cv-transcriptions`. A docker-compose file has been added to the to spin up the Search UI and Elasticsearch cluster together.

#### Step 1: Launching the Services
Navigate to the `search-ui` directory of the project where the `docker-compose.yaml` file is located. Execute the following command to start the services:
```bash
docker-compose up
```

#### Step 2: Indexing Data
Once the Elasticsearch service is running, it's necessary to index the dataset into Elasticsearch for the search functionality to work. Navigate to the project root directory and run the following command:
```bash
python elastic-backend/cv-index.py
```
This script indexes the CSV file data into the Elasticsearch service, ensuring that the search functionality is operational.

NOTE: Due to relative import errors, please run the script from the root directory of the project.

#### Step 4: Accessing the Frontend Application
After the services are up and the data has been indexed, the frontend application will be accessible at `http://localhost:3000`. This URL serves the Search-UI React app, through which users can perform search operations on the indexed data.


## Task 6: Cloud Deployment

### Overview
This document provides an improved overview of the cloud deployment process for a scalable and highly available application. While a more detailed and complex deployment strategy is outlined in the `deployment-design/design.pdf` document, this guide focuses on a simplified approach for the technical assessment with limited cloud resources.

### Deployment Strategy
Due to resource constraints, we've opted for a straightforward deployment utilizing Docker Compose on a single Amazon EC2 instance. This method allows us to demonstrate the application's functionality in a cloud environment without the complexity and cost associated with a full-scale deployment.

### Project Structure
The core components of our application are divided as follows:
- **Frontend:** A React application serving as the user interface, configured to communicate with the Elasticsearch backend.
- **Backend:** A 2-node Elasticsearch cluster responsible for indexing and searching data efficiently.

The `docker-compose.yaml` file, located in the root directory of the project, orchestrates the setup and interconnection of these components.

### Deployment Process

#### Step 1: Preparing the Environment
Ensure that Docker and Docker Compose are installed on your EC2 instance. Clone the project repository to your instance to get started.

- Be sure to also change the env variable `REACT_APP_ELASTICSEARCH_URL` in the `docker-compose.yaml` file to the public IP of the EC2 instance.
- Be sure to change the endpoint in the `search-ui/src/config/engine.json` file to the public IP of the EC2 instance.

#### Step 2: Launching the Services
Navigate to the root directory of the project where the `docker-compose.yaml` file is located. Execute the following command to start the services:
```bash
docker-compose up
```

#### Step 3: Indexing Data
Once the Elasticsearch service is running, it's necessary to index the dataset into Elasticsearch for the search functionality to work. Run the following command:
```bash
python elastic-backend/cv-index.py
```
This script indexes the CSV file data into the Elasticsearch service, ensuring that the search functionality is operational.

NOTE: Due to relative import errors, please run the script from the root directory of the project.

#### Step 4: Accessing the Frontend Application
After the services are up and the data has been indexed, the frontend application will be accessible at `http://localhost:3000`. This URL serves the Search-UI React app, through which users can perform search operations on the indexed data.

## Task 7: Cloud Deployment Link
The final project has been deployed on an AWS EC2 instance. You can access the application using the following link: [here](http://ec2-54-79-211-193.ap-southeast-2.compute.amazonaws.com:3000)