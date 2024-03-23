# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD ./asr-api.py /app
ADD ./requirements.txt /app

# Install libsndfile1
RUN apt-get update -y && apt-get install -y --no-install-recommends build-essential gcc \
                                        libsndfile1

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME asr-api

# Run asr-api.py when the container launches
CMD ["uvicorn", "asr-api:app", "--host", "0.0.0.0", "--port", "80"]