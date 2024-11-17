# Kuhseng's AI Chat

A real-time chat application with AI-powered features, built with Svelte and Firebase.

## Features

- **Real-time Chat**
  - Instant message delivery
  - User authentication with Google
  - Message persistence across sessions
  - Responsive design for mobile and desktop

- **AI Features**
  - `$joke` - Get contextual jokes based on chat history
  - `$summary` - Generate chat summaries
  - `&&` - Generate AI images from chat context using DALL-E 3
  - Random emoji reactions with witty comments

- **User Experience**
  - Dark/Light mode support
  - Push notifications for new messages
  - Full-screen background image on login
  - Modern, responsive UI

## Technologies Used

- **Frontend**
  - Svelte/SvelteKit
  - Firebase SDK
  - OpenAI API

- **Backend Services**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Cloud Messaging
  - Firebase Hosting

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd kuhsengs-chat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Firebase and OpenAI credentials:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Deploy to Firebase:
```bash
firebase deploy
```

## Project Structure

```
kuhsengs-chat/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Auth.svelte
│   │   │   ├── Chat.svelte
│   │   │   ├── Kuhilligence.svelte
│   │   │   └── Message.svelte
│   │   ├── services/
│   │   │   └── notifications.js
│   │   └── firebase.js
│   └── routes/
│       ├── +layout.svelte
│       └── +page.svelte
├── static/
│   ├── firebase-messaging-sw.js
│   └── notification-icon.svg
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
