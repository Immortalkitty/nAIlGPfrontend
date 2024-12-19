const content = {
    title: "How to Use?",
    description: "Welcome to the breast cancer diagnosis system! Follow these steps to analyze your mammography image:",
    manual: [
        {
            title: "1. Upload an Image",
            content: [
                "Take a clear mammography image:",
                "• Ensure the image is clear, properly scanned, and well-lit.",
                "• Click 'Upload and Analyze' and select your image.",
                "• Supported formats: JPEG, JPG, PNG.",
            ],
        },
        {
            title: "2. View Results",
            content: [
                "The result will show either Malignant or Benign.",
                "A confidence bar will indicate the AI's confidence level.",
            ],
        },
        {
            title: "3. Previous Predictions",
            content: [
                "Click the profile icon in the top-right corner to log in and track your past predictions.",
            ],
        },
    ],
    notes: [
        "• This system is for preliminary screening purposes only. Always consult a healthcare professional for confirmation.",
        "• Ensure your image is clear for accurate results.",
    ],
};

export default content;
