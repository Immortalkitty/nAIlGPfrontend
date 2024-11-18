const content = {
    title: "How to Use?",
    description: "Welcome to the nail fungus preliminary diagnosis system! Follow these steps to analyze your nail condition:",
    manual: [
        {
            title: "1. Upload an Image",
            content: [
                "Take a clear photo of your nail:",
                "• Ensure the nail is clean, free from polish, and well-lit.",
                "• Click 'Upload and Analyze' and select your image.",
                "• Supported formats: JPEG, JPG, PNG.",
            ],
        },
        {
            title: "2. View Results",
            content: [
                "The result will show either Infected or Healthy.",
                "A confidence bar will indicate AI's confidence.",

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
        "• This system is for screening purposes only. Always consult a doctor for confirmation.",
        "• Ensure your image is clear for accurate results.",
    ],
    examples: [
        {
            label: "Incorrect ❌",
            imgSrc: "/IncorrectExample.jpg",
        },
        {
            label: "Correct ✅",
            imgSrc: "/CorrectExample.jpg",
        },
        {
            label: "Incorrect ❌",
            imgSrc: "/IncorrectExample2.jpg",
        },
    ],
};

export default content;
