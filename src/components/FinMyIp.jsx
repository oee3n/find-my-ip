import React, { useEffect, useState } from 'react';

function isValidIP(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = Number(part);
    return part !== '' && !isNaN(num) && num >= 0 && num <= 255;
  });
}

const FinMyIp = () => {
  const [ip, setIp] = useState('');
  const [ipInput, setIpInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [ipData, setIpData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState('');

  const ShowDetails = () => {
    const targetIP = ipInput || ip;
    if (!isValidIP(targetIP)) {
      setError('IP is not correct ❌');
      setIpData(null);
      return;
    }

    setShowDetails(!showDetails);
    fetch(`https://ipapi.co/${targetIP}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setIpData(data);
        setLoading(false);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to fetch IP data:', err);
        setError('Failed to fetch IP data:');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => {
        setIp(data.ip);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching IP:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  document.body.setAttribute('data-bs-theme', 'dark');
  }, []);

  return (
    <>
  <div className="container text-center mt-5">
    <h1 className="mb-4">🌐 Find My IP</h1>
    {loading ? (
      <div className="spinner-border text-primary" role="status" />
    ) : (
      <div className="p-3 text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3">
        Your IP Address: <strong>{ip}</strong>
      </div>
    )}
    <div className="mt-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter The IP Manually (Optional)"
        value={ipInput}
        onChange={(e) => setIpInput(e.target.value)}
      />
    </div>
    <button className="btn btn-outline-primary mt-3" onClick={ShowDetails}>
      {showDetails ? 'Hide Details 🔼' : 'Show Details 🔽'}
    </button>
    {error && <div className="alert alert-danger mt-3">{error}</div>}
  </div>

  <div className="container mt-3">
    {loading ? (
      <div className="spinner-border text-primary" role="status" />
    ) : ipData ? (
      showDetails && (
        <div className="row align-items-center">
            <div className="card p-4 text-start h-100">
              <div className='card-header text-center'>
                <h4>📍 IP Information</h4>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-6 text-start'>
                    <p><strong>Country:</strong> {ipData.country_name}</p>
                    <p><strong>City:</strong> {ipData.city}</p>
                    <p><strong>Area:</strong> {ipData.region}</p>
                   <p><strong>Time Zone:</strong> {ipData.timezone}</p>
                   <p><strong>Latitude:</strong> {ipData.latitude}</p>
                   <p><strong>Longitude:</strong> {ipData.longitude}</p>
                   <p><strong>ISP:</strong> {ipData.org}</p>
                   <p><strong>Postal Code:</strong> {ipData.postal}</p>
                  </div> 
                  <div className="col-md-6 ">
                    <iframe
                     title="Map"
                     width="100%"
                     height="100%"
                     style={{ border: 0, borderRadius: '12px', minHeight: '350px' }}
                     loading="lazy"
                     allowFullScreen
                     src={`https://maps.google.com/maps?q=${ipData.latitude},${ipData.longitude}&z=14&output=embed`}
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          

          
          
        </div>
      )
    ) : (
      <div className="p-3 text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-3 text-center">
        No Data To Display 👀
      </div>
    )}
  </div>
</>
  );
};

export default FinMyIp;
