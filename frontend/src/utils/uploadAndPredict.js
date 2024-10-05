import axios from 'axios';
import config from "./config";

export const uploadAndPredictImage = async (file, setImage, setError, appendResults, nextId) => {
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(`${config.API_BASE_URL}/predictions/predict`, formData, {
            withCredentials: true,
        });

        const { title, confidence, id, image_src } = response.data;
        const newImage = {
            id: id || `${nextId++}-${Date.now()}`,  // Use timestamp if id is missing to ensure uniqueness
            src: image_src,
            title: capitalizeFirstLetter(title),
            confidence: parseFloat(confidence).toFixed(2),
        };

        setImage(newImage);
        appendResults([newImage]);  // Append new result to existing results
        console.log('Prediction response received:', response.data);

        // Save the prediction to the backend
        try {
            const saveResponse = await axios.post(`${config.API_BASE_URL}/predictions/save`, {
                title: newImage.title,
                confidence: newImage.confidence,
                image_src: newImage.src,
            }, {
                withCredentials: true,
            });

            console.log('Prediction saved:', saveResponse.data);
        } catch (saveError) {
            if (saveError.response && saveError.response.status === 401) {
                console.warn('Prediction not saved: User not authenticated.');
                setError('Result not saved. Log in to save your predictions.');
            } else {
                console.error('error saving prediction:', saveError);
                setError('error saving prediction.');
            }
        }
    } catch (err) {
        console.error('error during prediction:', err);
        setError('Prediction failed. Please try again.');
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
