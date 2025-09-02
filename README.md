VoteWave – Release_Notes 1.0.0
___________________________________________________________________________________________________________________
Introduction

VoteWave is a simple polling application built using Flask. It lets people register themselves, create polls, and cast votes in real time. This project is still in its first phase, so it stores everything in memory. That means when you restart the server, all users, polls, and votes are cleared out.

The idea is to give a foundation that you can later expand by connecting to a database, adding authentication, or even hosting it at scale.
___________________________________________________________________________________________________________________
How It Works

⦁	A user registers with a chosen username.
⦁	Once registered, they can create a poll by asking a question and providing multiple options.
⦁	Other users can see that poll and vote for one of the options.
⦁	Results are updated immediately by increasing the count of the selected option.
___________________________________________________________________________________________________________________
Application Code Overview (app.py)

⦁	Flask App: The heart of the project.
⦁	Routes:

1.		/ – a simple welcome message.
2.		/register – register a new user by sending a JSON body with a username.
3.		/poll – create a poll if you are registered (simulated authentication through request headers).
4.		/poll/<id> – fetch details of a poll by its ID.
5.		/vote/<id> – cast a vote for a poll option.

All the logic is kept lightweight and stored in a dictionary in memory.
___________________________________________________________________________________________________________________
Requirements (requirements.txt)

The app only needs one Python library:

⦁	Flask==2.2.2


You can install it with:

⦁	pip install -r requirements.txt
___________________________________________________________________________________________________________________
Running Locally

1.	Clone the project to your computer.
2.	Create a virtual environment (optional but recommended).
3.	Install the requirements.
4.	Start the app --->> python app.py
5.	Visit http://127.0.0.1:5000 in your browser to confirm it is running.

___________________________________________________________________________________________________________________
Docker Setup (Dockerfile)

A Dockerfile is included so you can package the application into a container.

1.	It pulls a lightweight Python image.
2.	Copies the project files into the container.
3.	Installs Flask.
4.	Runs the application on port 5000.

To build and run the image:

⦁		docker build -t votewave .

⦁		docker run -p 5000:5000 votewave

Now the app will be available on http://localhost:5000.
___________________________________________________________________________________________________________________
Infrastructure with Terraform

The project also includes Terraform files (main.tf, network.tf, ec2.tf) that set up the cloud environment on AWS. Here is what each piece does:

1.	VPC and Subnet: Creates a private network where your resources live.
2.	Internet Gateway and Route Table: Allow the EC2 instance to communicate with the internet.
3.	Security Group: Acts like a firewall. It allows SSH access only from your current IP and opens port 5000 so the Flask app can be reached from outside.
4.	EC2 Instance: A virtual machine where the Dockerized Flask app will run.
To apply these steps:

⦁		terraform init

⦁		terraform plan

⦁		terraform apply


Once applied, AWS will launch your instance and network setup.
___________________________________________________________________________________________________________________
Deployment Steps on AWS EC2

1.	Use Terraform to create the EC2 instance and networking.
2.	Connect to the EC2 instance with SSH.
3.	Install Docker if it’s not already installed.
4.	Clone the VoteWave repository inside the instance.
5.	Build and run the Docker container using the commands shared earlier.
6.	Open your browser with the EC2’s public IP on port 5000 to test the app.
___________________________________________________________________________________________________________________
Security Considerations

1.	The current setup keeps user information and polls in memory, which is fine for learning but not safe for real deployments.
2.	The security group restricts SSH to your own IP, which prevents others from logging into your instance.
3.	The app itself should eventually be secured with proper user authentication and HTTPS.
___________________________________________________________________________________________________________________
Future Improvements

1.	Replace the in-memory dictionary with a persistent database like PostgreSQL or DynamoDB.
2.	Add user login with sessions or tokens.
3.	Expand Docker usage to include Docker Compose or Kubernetes for orchestration.
4.	Set up continuous deployment with GitHub Actions or Jenkin
