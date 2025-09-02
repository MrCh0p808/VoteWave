Step 1: Install Requirements

i. Python 3.8+

--> Install dependencies:

	- pip install -r requirements.txt

--> requirements.txt includes:

ii. Flask

iii. Flask-SocketIO

iv. gunicorn
_____________________________________________________________________________

Step 2: Running Locally (Development)

i .Clone this repo:

	- git clone https://github.com/<your-username>/tymmbc.git
	- cd tymmbc

ii. Install requirements:

	- pip install -r requirements.txt

iii Start server:

	- python app.py

--> Note: Server runs at http://127.0.0.1:5000
_____________________________________________________________________________

Step 3: Running in Production (Gunicorn + WSGI)

i. Use wsgi.py with gunicorn:

	- gunicorn --bind 0.0.0.0:8000 wsgi:app

ii. For SocketIO, include eventlet or gevent for async workers:

	- pip install eventlet
	- gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:8000 wsgi:app

--> Deploying on AWS EC2 (with our Terraform setup)

1. Provision Infra
Use the Terraform configs (main.tf, ec2.tf, network.tf) to create:
VPC, subnet, SG, EC2 instance

	- terraform init
	- terraform apply -auto-approve

2. SSH into EC2

	- ssh -i mykey.pem ec2-user@<EC2_PUBLIC_IP>

3. Install prerequisites

	- sudo yum update -y         # Amazon Linux
	- sudo yum install git -y
	- sudo yum install python3-pip -y

4. Clone repo & install

	- git clone https://github.com/<your-username>/tymmbc.git
	- cd tymmbc
	- pip3 install -r requirements.txt

5. Run app (production)

	- gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:8000 wsgi:app

Access the app
Visit:
	- http://<Our EC2 Public IP>:8000

------------------------------------Notes------------------------------------

-- This app uses in-memory storage → messages & rooms vanish if the server restarts.

-- For production, replace with Redis / DB backend.

-- Don’t forget to open port 8000 (or your chosen port) in your EC2 Security Group.
