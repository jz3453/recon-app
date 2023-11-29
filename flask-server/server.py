from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={
    r"/post_opportunity": {
        "origins": "*",
        "methods": ["POST", "OPTIONS"]
    },
    r"/get_opportunities": {
        "origins": "*",
        "methods": ["GET", "OPTIONS"]
    },
    r"/get_applications/*": {
        "origins": "*",
        "methods": ["GET", "OPTIONS"]
    }
})

opportunitiesData = [
  {
    "active": True,
    "applicationInstructions": "",
    "applicationType": "inside",
    "eligibility": {
      "year": [
        "Sophomore",
        "Junior",
        "Senior"
      ]
    },
    "id": 1,
    "opportunityTitle": "Research in AR and VR",
    "opportunityType": "project",
    "pendingApplications": 2,
    "postDate": "2023-11-26T12:45:30.000Z",
    "questions": [
      {
        "questionId": 1,
        "checkboxChoices": [
          "COMS W4160 (Computer Graphics)",
          "COMS W4170 (User Interface Design)",
          "COMS W4172 (3D User Interfaces and Augmented Reality)",
          "COMS E6178 (Human Computer Interaction)",
          "COMS E6998 (Topics in VR and AR)"
        ],
        "topLabel": "",
        "bottomLabel": "",
        "topNum": 5,
        "bottomNum": 1,
        "questionText": "Please check all of the following courses that you have taken:",
        "questionType": "checklist",
        "required": True,
        "wordLimit": 0
      },
      {
        "questionId": 2,
        "checkboxChoices": [
          "Yes",
          "No"
        ],
        "topLabel": "",
        "bottomLabel": "",
        "topNum": 5,
        "bottomNum": 1,
        "questionText": "Do you have Unity experience?",
        "questionType": "checklist",
        "required": True,
        "wordLimit": 0
      }
    ],
    "requiredDocuments": [
      {
        "type": "Resume"
      },
      {
        "type": "Transcript"
      }
    ]
  }
]

applicationsData = [
  {
    "id": 1,
    "opportunityId": 1,
    "status": "pending",
    "answers": [
      {
        "questionId": 1,
        "answer": [
          "COMS W4160 (Computer Graphics)",
          "COMS W4170 (User Interface Design)",
          "COMS W4172 (3D User Interfaces and Augmented Reality)",
          "COMS E6178 (Human Computer Interaction)",
          "COMS E6998 (Topics in VR and AR)"
        ]
      },
      {
        "questionId": 2,
        "answer": [
          "Yes"
        ]
      }
    ],
    "documents": [
      {
        "type": "Resume",
      },
      {
        "type": "Transcript",
      }
    ]
  }, 
  {
    "id": 2,
    "opportunityId": 1,
    "status": "pending",
    "answers": [
      {
        "questionId": 1,
        "answer": [
          "COMS W4170 (User Interface Design)",
          "COMS W4172 (3D User Interfaces and Augmented Reality)",
          "COMS E6998 (Topics in VR and AR)"
        ]
      },
      {
        "questionId": 2,
        "answer": [
          "Yes"
        ]
      }
    ],
    "documents": [
      {
        "type": "Resume",
      },
      {
        "type": "Transcript",
      }
    ]
  }
]

@app.route('/post_opportunity', methods=['POST', 'OPTIONS'])
# @cross_origin()
def post_application():
  if request.method == 'OPTIONS':
        # Handle CORS preflight request
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3002')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
  json_data = {}
  json_data = request.get_json()  # Get the JSON data sent from the frontend

  new_id = len(opportunitiesData) + 1

  json_data['id'] = new_id

  opportunitiesData.append(json_data)

  return jsonify({'message': 'Opportunity added successfully'})

@app.route('/get_opportunities', methods=['GET', 'OPTIONS'])
def get_opportunities():
    return jsonify(opportunitiesData)

@app.route('/get_applications/<int:opportunity_id>', methods=['GET', 'OPTIONS'])
def get_applications(opportunity_id):
    filtered_applications = [app for app in applicationsData if app['opportunityId'] == opportunity_id]
    return jsonify(filtered_applications)

# @app.after_request
# def after_request(response):
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#   response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#   return response


if __name__ == '__main__':
    app.run(debug=True)