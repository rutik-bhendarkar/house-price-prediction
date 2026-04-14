from flask import Flask, request, jsonify
from flask_cors import CORS 
from server import util

app = Flask(__name__)
# Allow all origins specifically for local development
CORS(app, resources={r"/*": {"origins": "*"}}) 

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    # Use request.form.get to prevent errors if a field is missing
    total_sqft = float(request.form.get('total_sqft', 0))
    location = request.form.get('location', '')
    bhk = int(request.form.get('bhk', 0))
    bath = int(request.form.get('bath', 0))

    response = jsonify({
        "estimated_price": util.get_estimated_price(location, total_sqft, bath, bhk)
    })
    return response

if __name__ == '__main__':
    print("Initializing Artifacts...")
    util.load_saved_artifacts() 
    print("Starting Python Flask Server...")
    # debug=True can sometimes cause issues with pickle loading during restart; 
    # setting use_reloader=False makes it more stable for model loading.
    app.run(port=5000, debug=True, use_reloader=False)