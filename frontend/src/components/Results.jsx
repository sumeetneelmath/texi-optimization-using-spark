import { useState } from 'react'
import axios from 'axios'
import './Results.css'

function Results({ results, onReset }) {
  const [downloading, setDownloading] = useState(false)

  const downloadCSV = async (type, data) => {
    setDownloading(true)
    try {
      const response = await axios.post(
        'http://localhost:5000/api/download',
        { type, results: data },
        { responseType: 'blob' }
      )

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_analysis.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Failed to download CSV: ' + (error.message || 'Unknown error'))
    } finally {
      setDownloading(false)
    }
  }

  const formatNumber = (num) => {
    return typeof num === 'number' ? num.toFixed(2) : num
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>📊 Analysis Results</h2>
        <button onClick={onReset} className="reset-btn">
          Upload New File
        </button>
      </div>

      {/* Best Hours Section */}
      {results.best_hours && results.best_hours.length > 0 && (
        <div className="results-section">
          <div className="section-header">
            <h3>⏰ Best Hours for Highest Fares</h3>
            <button
              onClick={() => downloadCSV('best_hours', results.best_hours)}
              className="download-btn"
              disabled={downloading}
            >
              📥 Download CSV
            </button>
          </div>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Hour of Day</th>
                  <th>Average Fare ($)</th>
                  <th>Trip Count</th>
                  <th>Total Fare ($)</th>
                </tr>
              </thead>
              <tbody>
                {results.best_hours.map((row, idx) => (
                  <tr key={idx} className={idx < 3 ? 'highlight' : ''}>
                    <td>{row.pickup_hour}:00</td>
                    <td>${formatNumber(row.avg_fare)}</td>
                    <td>{row.trip_count.toLocaleString()}</td>
                    <td>${formatNumber(row.total_fare)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Best Zones Section */}
      {results.best_zones && results.best_zones.length > 0 && (
        <div className="results-section">
          <div className="section-header">
            <h3>📍 Top 20 Pickup Zones by Fare</h3>
            <button
              onClick={() => downloadCSV('best_zones', results.best_zones)}
              className="download-btn"
              disabled={downloading}
            >
              📥 Download CSV
            </button>
          </div>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Zone ID</th>
                  <th>Average Fare ($)</th>
                  <th>Trip Count</th>
                  <th>Total Fare ($)</th>
                </tr>
              </thead>
              <tbody>
                {results.best_zones.map((row, idx) => {
                  const zoneKey = Object.keys(row).find(
                    key => !['avg_fare', 'trip_count', 'total_fare'].includes(key)
                  )
                  return (
                    <tr key={idx} className={idx < 3 ? 'highlight' : ''}>
                      <td>{row[zoneKey]}</td>
                      <td>${formatNumber(row.avg_fare)}</td>
                      <td>{row.trip_count.toLocaleString()}</td>
                      <td>${formatNumber(row.total_fare)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="insights">
        <h4>💡 Key Insights</h4>
        <ul>
          <li>
            <strong>Peak Hour:</strong> Hour {results.best_hours?.[0]?.pickup_hour} shows the highest average fare
            of ${formatNumber(results.best_hours?.[0]?.avg_fare)}
          </li>
          {results.best_zones && results.best_zones.length > 0 && (
            <li>
              <strong>Top Zone:</strong> The most profitable pickup zone generates an average fare
              of ${formatNumber(results.best_zones?.[0]?.avg_fare)}
            </li>
          )}
          <li>
            <strong>Tip:</strong> Focus on highlighted rows (top 3) for maximum profitability
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Results
