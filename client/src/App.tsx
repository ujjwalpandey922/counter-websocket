import { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

const address = 'http://localhost:5000';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    fetch(`${address}/count`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Update the count with the response from the server
      setCount(data.count);
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const fetchCount = async () => {
    try {
      const response = await fetch(`${address}/count`);
      const data = await response.json();
      setCount(data.count);
    } catch (error) {
      console.error('Error fetching count:', error);
    }
  };

  useEffect(() => {
    // Fetch initial count when component mounts
    fetchCount();

    const socket = io(address);

    socket.on('connect', () => {
      console.log('WebSocket connection established');
    });

    socket.on('countUpdate', (newCount) => {
      setCount(newCount);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div>
        Count is: {count}
      </div>
      <h1>Click To Add 20 Points</h1>
      <div className="card">
        <button onClick={handleClick}>
          CLICK HERE...!!!!
        </button>
      </div>
    </div>
  );
}

export default App;
