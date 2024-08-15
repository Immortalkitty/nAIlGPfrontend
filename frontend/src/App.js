import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import BaseLayout from './components/BaseLayout';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api')
            .then(response => {
                setMessage(response.data.message);  // Assuming Flask sends { "message": "your message" }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="App">
            <BaseLayout />
            {message && <p>{message}</p>}  {/* Display the fetched message */}
        </div>
    );
}

export default App;
