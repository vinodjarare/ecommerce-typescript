import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getTokenFCM } from './firebase';

function App() {
  const [token, setToken] = React.useState<any>('');
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const res = await getTokenFCM();
      setToken(res);
    } else if (permission === 'denied') {
      console.log('Notification permission denied.');
    }
  }

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{color:"white", width:"200px", fontSize:"14px"}}>{token}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
