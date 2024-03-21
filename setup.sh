#!/bin/bash

# Set the URL of the data.zip file
URL="https://storage.googleapis.com/htx-ta/data.zip"

# Check if the data directory exists
if [ ! -d "data" ]; then
    # If the data directory does not exist, download the zip file
    curl $URL --output data.zip

    # Unzip the file
    unzip data.zip

    # Delete the zip file
    rm data.zip
fi