# Taxi Trip Optimizer

A full-stack web application that analyzes taxi trip data to identify the best times and pickup zones for highest fares.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Flask + PySpark
- **Analysis**: Apache Spark for distributed data processing

## Features

- 📁 CSV file upload with drag-and-drop support
- ⏰ Identifies peak hours with highest average fares
- 📍 Analyzes top 20 pickup zones by profitability
- 📊 Interactive results display with sortable tables
- 📥 Downloadable CSV results
- 🎨 Modern, responsive UI

## Project Structure

```
taxi-optimization/
├── backend/
│   ├── app.py              # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── FileUpload.css
│   │   │   ├── Results.jsx
│   │   │   └── Results.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload a CSV file containing taxi trip data
3. Wait for the analysis to complete
4. View results showing:
   - Best hours for highest fares
   - Top pickup zones by profitability
5. Download results as CSV files

## CSV Format

Your CSV file should include the following columns:

### Required Columns:
- `pickup_datetime` (or `tpep_pickup_datetime`, `lpep_pickup_datetime`) - Timestamp of pickup
- `fare_amount` (or `total_amount`, `fare`) - Fare amount in dollars

### Optional Columns:
- `PULocationID` (or `pickup_zone`, `pickup_location_id`) - Pickup zone identifier

### Example CSV:
```csv
pickup_datetime,fare_amount,PULocationID
2023-01-01 08:30:00,15.50,161
2023-01-01 09:15:00,22.00,237
2023-01-01 14:45:00,18.75,161
```

## API Endpoints

### GET `/api/health`
Health check endpoint
- Returns: `{"status": "healthy", "spark": "<version>"}`

### POST `/api/analyze`
Analyze uploaded taxi trip CSV file
- Body: `multipart/form-data` with `file` field
- Returns: JSON with `best_hours` and `best_zones` arrays

### POST `/api/download`
Download analysis results as CSV
- Body: `{"type": "best_hours|best_zones", "results": [...]}`
- Returns: CSV file download

## Development Notes

- The PySpark analysis automatically detects common column names from different taxi datasets (NYC Taxi, etc.)
- Analysis includes average fare, trip count, and total fare metrics
- Top 3 results are highlighted in the UI for quick identification
- CORS is enabled for local development

## Troubleshooting

**Backend not starting:**
- Ensure Java is installed (required for PySpark)
- Check if port 5000 is available

**Frontend can't connect to backend:**
- Verify backend is running on port 5000
- Check CORS settings in `app.py`

**CSV upload fails:**
- Ensure CSV has required columns (pickup_datetime, fare_amount)
- Check file size (large files may take longer to process)

## License

MIT
