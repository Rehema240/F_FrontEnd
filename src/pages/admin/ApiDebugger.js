import { useEffect, useState } from 'react';

const ApiDebugger = () => {
  const [apiUrl, setApiUrl] = useState('');
  
  useEffect(() => {
    setApiUrl(process.env.REACT_APP_API_URL || 'Not set');
  }, []);

  return (
    <div>
      <h1>API Configuration Debugger</h1>
      <div>
        <h2>API URL:</h2>
        <pre>{apiUrl}</pre>
      </div>
    </div>
  );
};

export default ApiDebugger;