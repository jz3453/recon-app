from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})
# CORS(app, resources={
#     r"/post_opportunity": {
#         "origins": "*",
#         "methods": ["POST", "OPTIONS"]
#     },
#     r"/get_opportunities": {
#         "origins": "*",
#         "methods": ["GET", "OPTIONS"]
#     },
#     r"/get_applications/*": {
#         "origins": "*",
#         "methods": ["GET", "OPTIONS"]
#     },
#     r"/update_status/*": {
#         "origins": "*",
#         "methods": ["PUT", "OPTIONS"]
#     }
# })

opportunitiesData = [
  {
    "active": True,
    "applicationInstructions": "",
    "applicationType": "inside",
    "eligibility": {
      "years": [
        "Sophomore",
        "Junior",
        "Senior"
      ],
      "experience": True,
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
        "questionType": "Checklist",
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
        "questionType": "Checklist",
        "required": True,
        "wordLimit": 0
      },
      {
        "questionId": 3,
        "checkboxChoices": [],
        "topLabel": "Excellent",
        "bottomLabel": "Poor",
        "topNum": 5,
        "bottomNum": 1,
        "questionText": "How would you rate your experience?",
        "questionType": "Linear Scale",
        "required": True,
        "wordLimit": 0
      },
      {
        "questionId": 4,
        "checkboxChoices": [],
        "topLabel": "",
        "bottomLabel": "",
        "topNum": 5,
        "bottomNum": 1,
        "questionText": "Why are you interested in this opportunity?",
        "questionType": "Paragraph",
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
    "applyDate": "2023-11-26T13:45:30.000Z",
    "notes": "",
    "name": "Jenny Park",
    "email": "jp1234@columbia.edu",
    "school": "Columbia College",
    "major": "Computer Science",
    "grad_year": "2025",
    "eligibility": {
      "year": "Junior",
      "experience": True,
    },
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
      },
      {
        "questionId": 3,
        "answer": 5
      },
      {
        "questionId": 4,
        "answer": "The prospect of engaging in Augmented Reality (AR) and Virtual Reality (VR) research ignites my curiosity and enthusiasm for technology's potential impact. I'm eager to delve into the practical applications of AR and VR, unraveling new possibilities for human interaction and problem-solving. Joining a team dedicated to exploring these technologies aligns perfectly with my goal of contributing to cutting-edge research while learning from experienced professionals."
      }
    ],
    "documents": [
      {
        "type": "Resume",
        "document_title": "Jenny-Park_Resume.pdf"
      },
      {
        "type": "Transcript",
        "document_title": "Jenny-Park_Transcript_Fall2023.pdf"
      }
    ]
  }, 
  {
    "id": 2,
    "opportunityId": 1,
    "status": "pending",
    "applyDate": "2023-11-27T12:35:30.000Z",
    "notes": "",
    "name": "Sam Thorpe",
    "email": "sm3456@columbia.edu",
    "school": "School of Engineering and Applied Science",
    "major": "Computer Science",
    "grad_year": "2025",
    "eligibility": {
      "year": "Junior",
      "experience": False,
    },
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
      },
      {
        "questionId": 3,
        "answer": 4
      },
      {
        "questionId": 4,
        "answer": "The realm of Augmented Reality (AR) and Virtual Reality (VR) holds an irresistible allure for me due to its transformative potential across industries. Exploring uncharted territories within this dynamic field and contributing to pioneering research efforts aligns perfectly with my passion for innovation and problem-solving. Your organization's commitment to pushing the boundaries of AR and VR resonates deeply with my desire to be part of a team dedicated to shaping the future through technology."
      }
    ],
    "documents": [
      {
        "type": "Resume",
        "document_title": "SamThorpeResume.pdf"
      },
      {
        "type": "Transcript",
        "document_title": "SamThorpeTranscript-23.pdf"
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
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
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

@app.route('/get_opportunity/<int:opportunity_id>', methods=['GET'])
def get_opportunity(opportunity_id):
    opportunity = next((opp for opp in opportunitiesData if opp["id"] == opportunity_id), None)

    if opportunity:
        return jsonify(opportunity), 200
    else:
        return jsonify({'error': 'Opportunity not found'}), 404

@app.route('/get_applications/<int:opportunity_id>', methods=['GET', 'OPTIONS'])
def get_applications(opportunity_id):
    filtered_applications = [app for app in applicationsData if app['opportunityId'] == opportunity_id]
    return jsonify(filtered_applications)

@app.route('/get_application/<int:application_id>', methods=['GET'])
def get_application(application_id):
    application = next((app for app in applicationsData if app["id"] == application_id), None)

    if application:
        return jsonify(application), 200
    else:
        return jsonify({'error': 'Application not found'}), 404

@app.route('/update_status/<int:application_id>', methods=['PUT', 'OPTIONS'])
def update_status(application_id):
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'PUT')
        return response
    
    update_data = request.json
    application = next((app for app in applicationsData if app["id"] == application_id), None)

    if application:
        if application['status'] == 'pending' and update_data.get('status') != 'pending':
            application['status'] = update_data.get('status', application['status'])
            opportunityId = application['opportunityId']
            opportunity = next((opp for opp in opportunitiesData if opp["id"] == opportunityId), None)
            if opportunity and opportunity['pendingApplications'] > 0:
                opportunity['pendingApplications'] -= 1
            return jsonify({'message': 'Application status updated successfully'})
        else :
            application['status'] = update_data.get('status', application['status'])
            return jsonify({'message': 'Application status updated successfully'})
    else:
        return jsonify({'error': 'Application not found'}), 404


@app.route('/update_notes/<int:application_id>', methods=['PUT', 'OPTIONS'])
def update_notes(application_id):
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'PUT')
        return response
    
    update_data = request.json
    application = next((app for app in applicationsData if app["id"] == application_id), None)

    if application:
        application['notes'] = update_data.get('notes', application['notes'])
        return jsonify({'message': 'Application notes updated successfully'})
    else:
        return jsonify({'error': 'Application not found'}), 404
    
# @app.after_request
# def after_request(response):
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#   response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#   return response


if __name__ == '__main__':
    app.run(debug=True)