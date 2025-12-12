import { useState } from 'react'
import axios from 'axios'
import './FileUpload.css'

function FileUpload({ onAnalysisComplete, onError, setLoading }) {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      onError(null)
    } else {
      onError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      onError('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      onAnalysisComplete(response.data)
    } catch (error) {
      onError(error.response?.data?.error || 'Failed to analyze file. Please check your backend server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="file-upload-container">
      <div className="upload-card">
        <h2>Upload Taxi Trip Data</h2>
        <p className="upload-instructions">
          Upload a CSV file containing taxi trip data with columns like pickup_datetime and fare_amount
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input"
              accept=".csv"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              <div className="upload-icon">📁</div>
              {file ? (
                <div className="file-info">
                  <strong>{file.name}</strong>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ) : (
                <div>
                  <p className="drag-text">Drag & drop your CSV file here</p>
                  <p className="or-text">or</p>
                  <button type="button" className="browse-btn">Browse Files</button>
                </div>
              )}
            </label>
          </div>

          {file && (
            <button type="submit" className="analyze-btn">
              Analyze Trips
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default FileUpload
