from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
import tempfile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_taxi_data(file_path):
    """Analyze taxi trip data using Pandas"""
    try:
        # Read CSV file
        df = pd.read_csv(file_path)
        
        # Identify common column names (handle different taxi dataset formats)
        columns = df.columns.tolist()
        
        # Find fare column
        fare_col = None
        for col_name in ['fare_amount', 'total_amount', 'fare', 'Fare_amount']:
            if col_name in columns:
                fare_col = col_name
                break
        
        # Find pickup time column
        time_col = None
        for col_name in ['pickup_datetime', 'tpep_pickup_datetime', 'lpep_pickup_datetime', 'pickup_time']:
            if col_name in columns:
                time_col = col_name
                break
        
        # Find pickup zone column
        zone_col = None
        for col_name in ['PULocationID', 'pickup_zone', 'pickup_location_id', 'pickup_location']:
            if col_name in columns:
                zone_col = col_name
                break
        
        if not fare_col or not time_col:
            return None, "Required columns not found. Please ensure CSV has fare and pickup time columns."
        
        # Convert pickup time to datetime and extract hour
        df[time_col] = pd.to_datetime(df[time_col])
        df['pickup_hour'] = df[time_col].dt.hour
        
        # Analysis 1: Best hours for highest fares
        hourly_analysis = df.groupby('pickup_hour').agg(
            avg_fare=(fare_col, 'mean'),
            trip_count=(fare_col, 'count'),
            total_fare=(fare_col, 'sum')
        ).reset_index()
        hourly_analysis = hourly_analysis.sort_values('avg_fare', ascending=False)
        
        results = {
            'best_hours': hourly_analysis.to_dict('records')
        }
        
        # Analysis 2: Best pickup zones (if zone column exists)
        if zone_col:
            zone_analysis = df.groupby(zone_col).agg(
                avg_fare=(fare_col, 'mean'),
                trip_count=(fare_col, 'count'),
                total_fare=(fare_col, 'sum')
            ).reset_index()
            zone_analysis = zone_analysis.sort_values('avg_fare', ascending=False).head(20)
            
            results['best_zones'] = zone_analysis.to_dict('records')
        
        return results, None
        
    except Exception as e:
        return None, str(e)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'engine': 'pandas'})

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Only CSV files are allowed'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Analyze data
        results, error = analyze_taxi_data(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    try:
        data = request.json
        analysis_type = data.get('type', 'best_hours')
        results = data.get('results', [])
        
        # Create CSV file
        df = pd.DataFrame(results)
        
        output_path = os.path.join(UPLOAD_FOLDER, f'{analysis_type}_analysis.csv')
        df.to_csv(output_path, index=False)
        
        return send_file(
            output_path,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'{analysis_type}_analysis.csv'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
