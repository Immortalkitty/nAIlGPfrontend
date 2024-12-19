import axios from 'axios';
import config from "./config";

export const uploadAndPredictImage = async (file, setImage, setError, appendResults, nextId) => {
    setError(null);

    try {
        const base64Image = await fileToBase64(file);
        console.log("Converted base64 image:", base64Image);

        const payload = {
            image: base64Image
        };

        const response = await axios.post(`${config.API_BASE_URL}/predictions/predict`, payload, {
            withCredentials: true,
        });
        console.log("Prediction response received:", response.data);
        const {title, confidence, image_src, filename, message, prediction_id, text_detected} = response.data;

        const newImage = {
            id: `${nextId++}-${Date.now()}`,
            src: image_src,
            title: capitalizeFirstLetter(title),
            confidence: parseFloat(confidence).toFixed(2),
            filename,
            prediction_id
        };
        setImage(newImage);
        appendResults([newImage]);
        console.log(message);

        const showTextWarning = () => {
            alert("Warning: The submitted photo contains data that may affect the prediction, the results may be unreliable!");
        };

        if (text_detected) {
            showTextWarning(); // Show the pop-up window if true
        }

    } catch (err) {
        handleErrorResponse(err, setError);
    }
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const handleErrorResponse = (err, setError) => {
    if (err.response) {
        const {status, data} = err.response;
        switch (status) {
            case 400:
                setError('Bad request. Please ensure the file is correct and try again.');
                break;
            case 401:
                setError('Unauthorized. Please log in and try again.');
                break;
            case 403:
                setError('Forbidden. You do not have permission to perform this action.');
                break;
            case 500:
                setError('Server error. Please try again later.');
                break;
            default:
                setError(`Unexpected error occurred (status code: ${status}). Please try again.`);
        }

    } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your network connection and try again.');
    } else {
        console.error('Error:', err.message);
        setError(`Prediction failed: ${err.message}. Please try again.`);
    }
    
};
