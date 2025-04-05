# MindEase

MindEase is an AI-powered mental wellness platform that helps users manage their emotional wellbeing, schedule tasks, and get personalized support.

## Overview

MindEase combines AI conversation capabilities with practical tools to support mental health and productivity. The application features an emotional AI twin that users can talk to, as well as planning and scheduling capabilities.

## Features

- **AI Emotional Twin**: Have conversations with an AI assistant that responds to your emotional needs
- **Voice Interaction**: Speak to the AI and have responses read back to you
- **Task Planning**: The system can identify when you're trying to schedule something and help create calendar entries
- **Personalized Experience**: User profiles store information to provide more tailored responses
- **Google Calendar Integration**: Easily add events to your Google Calendar

## Tech Stack

### Frontend
- React with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- Lucide React for icons
- Speech recognition and text-to-speech capabilities

### Backend
- Node.js
- Express.js
- Google Generative AI (Gemini 2.0 Flash model)
- MongoDB for data storage

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Google Generative AI API key
- (Optional) Murf AI API key for enhanced text-to-speech

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/mindease.git
   cd mindease
   ```

2. Install dependencies
   ```
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Environment Setup
   - Create a `.env` file in the server directory
   ```
   GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the application
   ```
   # Start the server
   cd server
   npm start

   # In a new terminal window, start the client
   cd client
   npm start
   ```

## Project Structure

```
k:\MindEase\
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── utils/          # Helper functions
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Node.js/Express application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
└── README.md               # Project documentation
```

## Usage

1. Navigate to http://localhost:5173 in your web browser
2. Create an account or log in
3. Start a conversation with your AI Emotional Twin
4. Use voice commands by clicking the microphone icon
5. For scheduling tasks, simply tell the AI what you want to schedule

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT License](LICENSE)

## Acknowledgments

- Google Generative AI for providing the Gemini model
- [List any other resources, inspiration, etc.]
