import { useState } from 'react';

/**
 * A debug panel component that can be toggled to display debugging information
 * in development environments.
 */
const DebugPanel = ({ apiUrl, data, title = "Debug Info" }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        maxWidth: '400px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '12px',
        opacity: 0.9
      }}
    >
      <div 
        onClick={toggleVisibility}
        style={{ 
          cursor: 'pointer',
          padding: '5px',
          marginBottom: isVisible ? '10px' : '0',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isVisible ? '1px solid #ddd' : 'none',
        }}
      >
        <span>{title}</span>
        <span>{isVisible ? '▲' : '▼'}</span>
      </div>

      {isVisible && (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <strong>API URL:</strong> {apiUrl}
          </div>
          
          <div>
            <strong>Data:</strong>
            <pre style={{ 
              maxHeight: '300px', 
              overflow: 'auto', 
              whiteSpace: 'pre-wrap',
              backgroundColor: '#f1f1f1',
              padding: '5px',
              fontSize: '11px'
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;