import json
import joblib # Install via: pip install joblib
import os
import numpy as np

__locations = None
__data_columns = None
__model = None

def get_estimated_price(location, sqft, bath, bhk):
    global __model
    global __data_columns
    
    if __model is None:
        return 0
    
    try:
        # Match the lowercase column names from your JSON
        loc_index = __data_columns.index(location.lower())
    except (ValueError, AttributeError):
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    # Ensure result is a standard float for JSON serialization
    prediction = __model.predict([x])[0]
    return round(float(prediction), 2)

def get_location_names():
    return __locations

def load_saved_artifacts():
    print("Loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    base_path = os.path.dirname(__file__)
    
    # Load Columns JSON
    json_path = os.path.join(base_path, "artifacts", "columns.json")
    with open(json_path, "r") as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

    # Load Model using Joblib
    model_path = os.path.join(base_path, "artifacts", "banglore_home_price_model.pickle")
    
    # Critical: Use joblib.load to prevent the 'LinearRegression' attribute error
    if os.path.exists(model_path):
        __model = joblib.load(model_path)
        print("Model loaded successfully using joblib.")
    else:
        print(f"ERROR: Model file not found at {model_path}")

    print("Loading saved artifacts...done")

if __name__ == '__main__':
    load_saved_artifacts()