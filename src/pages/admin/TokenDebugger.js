import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TokenDebugger = () => {
  const { user } = useAuth();
  const [token, setToken] = useState('');
  
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || 'No token found');
  }, []);

  return (
    <div>
      <h1>Token Debugger</h1>
      <div>
        <h2>Current User Info:</h2>
        <pre>{user ? JSON.stringify(user, null, 2) : 'Not logged in'}</pre>
      </div>
      <div>
        <h2>Authentication Token:</h2>
        <p>(First few characters only for security)</p>
        <pre>{token ? `${token.substring(0, 20)}...` : 'No token'}</pre>
      </div>
    </div>
  );
};

export default TokenDebugger;