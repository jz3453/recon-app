# reCon App

## Description

## Installation
Clone this repository.

### Backend (Flask Server)
1. Make sure you have python installed
2. cd into the `flask-server` directory
3. Set up a virtual environment with the command `python3 -m venv venv`
4. Activate the virtual environment:
  - On Windows: `venv\Scripts\activate`
  - On macOS and Linus: `source venv/bin/activate`
5. Install the required packages: 
  - `pip3 install flask`
  - `pip3 install flask_cors`
6. Start the Flask server: `python3 server.py`

The server should be running on http://127.0.0.1:5000/

### Frontend (React App)
1. Make sure you have Node.js and npm installed
2. Navigate to the `client` directory
3. Install dependencies: `npm install`
4. Start the React app: `npm start`

The client should be running on http://localhost:3000/

## Usage
The app supports the process for creating a custom application form. The process starts from http://localhost:3000/. As you go throught the process, your selections and inputs will be saved in an opportunity object. Once you hit 'Complete' on the last step, the object will be sent to the server and saved. Currently, the best way to view the newly created opportunity is by visiting http://127.0.0.1:5000/get_opportunities.

If you visit your profile, you can see your newly created opportunity under 'Active Applications' (or visit http://localhost:3000/dashboard). To view an existing opportunity that we populated with applications, you can click the opportunity titled 'Research in AR and VR' posted on '11/26'. These applications are hardcoded in the backend as we currently haven't implemented the functionalities for submitting an application. However, you can update the statuses of the existing applications, and it will be registered in the backend and frontend. You can view an application in more detail by clicking on it.