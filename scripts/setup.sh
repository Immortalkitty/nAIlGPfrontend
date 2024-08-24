sudo apt-get update
sudo apt-get install -y python3-pip python3-dev nginx
pip3 install virtualenv

virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
