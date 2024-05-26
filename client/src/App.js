import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import BaseLayout from './components/BaseLayout';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('/api')
            .then(response => {
                setMessage(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div className="App">
            <BaseLayout />
        </div>
    );
}

export default App;
