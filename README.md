# reCon App

## Description
An application that extends (Columbia's Undergraduate Research Opportunities website)[https://undergrad.research.columbia.edu/jobs/search]

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
The app supports the process for creating a custom application form. Begin the process by accessing http://localhost:3000/. As you navigate through the steps, your selections and inputs will be stored within an opportunity object. Upon completion of the final step and clicking 'Complete,' the object will be sent to the server and saved. Currently, the most effective method to viewing and verifying the newly created opportunity is by visiting http://127.0.0.1:5000/get_opportunities.

To review your recently created opportunity, navigate to your profile or access it directly via http://localhost:3000/dashboard. You will find the newly created opportunity listed under 'Active Applications'. For exploring an existing opportunity pre-populated with applications, select the opportunity named 'Research in AR and VR' posted on '11/26'. Note that the applications within this opportunity are hard-coded in the backend as we are yet to implement application submission functionalities. Nevertheless, you can update the statuses of existing applications, and these changes will reflect in both the backend and frontend. For a more detailed view of an application, click on the respective application.
