#!/bin/bash

# Update packages and Install git, git-lfs, docker
sudo yum update -y
sudo yum install git -y
sudo yum install docker -y

# Start and enable docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -a -G docker $(whoami)
newgrp docker


# Install docker-compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose



# Download Miniconda installer
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# Make the installer executable
chmod +x Miniconda3-latest-Linux-x86_64.sh

# Run the installer in silent mode
./Miniconda3-latest-Linux-x86_64.sh -b -p $HOME/miniconda

# Add conda to PATH
echo ". $HOME/miniconda/etc/profile.d/conda.sh" >> ~/.bashrc
source ~/.bashrc

# Create a new conda environment with Python 3.10
conda create -n py310 python=3.10 -y

# Activate the new environment
echo "conda activate py310" >> ~/.bashrc
source ~/.bashrc

# DOWLOAD DATA FOLDER
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