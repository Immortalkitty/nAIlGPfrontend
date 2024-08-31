import axios from 'axios';

export const uploadAndPredictImage = async (file, setImage, setError, setResults, nextId) => {
    setError(null); // Reset error state

    const fileURL = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('http://localhost:5000/predictions/predict', formData, {
            withCredentials: true,
        });

        const { title, confidence, id, image_src } = response.data;

        const newImage = {
            id: id || nextId++,
            src: fileURL,
            title: capitalizeFirstLetter(title),
            confidence: parseFloat(confidence).toFixed(2)
        };

        setImage(newImage);

        try {
            const saveResponse = await axios.post('http://localhost:5000/predictions/save', {
                title,
                confidence,
                image_src,
            }, {
                withCredentials: true,
            });

            console.log('Prediction saved:', saveResponse.data);
        } catch (saveError) {
            if (saveError.response && saveError.response.status === 401) {
                console.warn('Prediction not saved: User not authenticated.');
                setError('Result not saved. Log in to save your predictions.');
            } else {
                console.error('Error saving prediction:', saveError);
                setError('Error saving prediction.');
            }
        }

        setResults(prevResults => [...prevResults, newImage]);

    } catch (err) {
        console.error('Error during prediction:', err);
        setError('Prediction failed. Please try again.');
    }
};

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
