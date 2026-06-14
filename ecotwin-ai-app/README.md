🌍 EcoTwin AI — Sustainability Intelligence Platform

EcoTwin AI is an advanced AI-powered sustainability platform designed to help individuals and organizations monitor, analyze, and improve their environmental impact through intelligent digital twins, real-time analytics, simulations, and actionable insights.

Built with modern full-stack technologies, EcoTwin AI combines AI-driven sustainability assessment, carbon footprint tracking, predictive climate simulation, and personalized eco-action recommendations in a single immersive dashboard.

---

🚀 Live Vision

The mission of EcoTwin AI is simple:

«Measure. Understand. Simulate. Improve.»

Users can track their carbon footprint, visualize climate impact, simulate future environmental outcomes, and take measurable actions toward sustainability.

---

✨ Core Features

1. 📊 Smart Dashboard

A real-time analytics dashboard showing:

- Carbon Footprint Tracking
- Emission Trends
- Sustainability Score
- Eco Progress Metrics
- Activity Insights
- Climate Health Indicators

Features:

- Interactive charts
- Real-time updates
- Responsive design
- Animated widgets

---

2. 🤖 Climate Twin

An AI-powered digital twin representing the user’s environmental behavior.

Climate Twin provides:

- AI avatar representation
- Entity health status
- Sustainability growth progression
- XP & level system
- Milestone tracking
- Behavioral analytics

This module gamifies sustainability by converting eco-actions into growth metrics.

---

3. 📝 Assessment Engine

A detailed sustainability assessment system.

Tracks:

- Transport habits
- Energy usage
- Food patterns
- Waste generation
- Lifestyle emissions

Assessment output includes:

- Carbon footprint score
- Environmental risk score
- Improvement recommendations

---

4. 🌎 Future Earth Simulator

An advanced climate simulation engine.

Users can manipulate:

- Solar expansion
- Wind energy adoption
- Coal phase-out
- Battery storage scaling
- Global sustainability policies

Simulation predicts impact on:

- Temperature delta
- Biodiversity
- Carbon emissions
- Future projections

---

5. 🌱 Nurture Twin

Action-based sustainability improvement system.

Users can log eco-actions such as:

- Zero-emission transit
- Plant-based meals
- Custom eco actions

System updates:

- Carbon savings
- Environmental impact
- Progress tracking
- Recent activities

---

6. 🔐 Secure Authentication

Production-ready authentication system powered by Firebase.

Includes:

- Sign Up
- Login
- Logout
- Session Persistence
- Protected Routes
- User-Isolated Data

Each user gets:

- Private dashboard
- Separate data storage
- Personalized analytics

---

🧠 AI Capabilities

EcoTwin AI integrates intelligent sustainability modeling for:

- Carbon prediction
- Impact analysis
- Climate simulation
- Recommendation systems
- Digital twin progression

AI helps users understand:

- Current impact
- Future risks
- Best next eco-actions

---

🛠 Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand

Backend / Cloud

- Firebase Authentication
- Firestore Database
- Firebase Storage

Deployment

- GitHub
- Vercel

---

🎨 UI / UX Highlights

EcoTwin AI features a premium modern UI:

- Glassmorphism
- Dark sustainability theme
- Smooth animations
- Micro-interactions
- Responsive layouts
- Professional dashboards

Optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

---

📂 Project Structure

ecotwin-ai-app/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── hooks/
│   ├── assets/
│   ├── services/
│   └── firebase.ts
│
├── public/
├── package.json
├── vercel.json
└── README.md

---

⚙️ Installation

Clone the repository:

git clone https://github.com/Samiullah548/ecotwin-ai.git

Go to project directory:

cd ecotwin-ai

Install dependencies:

npm install

Run development server:

npm run dev

---

🔐 Environment Variables

Create ".env" file:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

---

🚀 Deployment

Deploy on Vercel

1. Push project to GitHub
2. Import repository into Vercel
3. Configure environment variables
4. Deploy

Build settings:

Framework Preset: Vite
Build Command: npm run build
Output Directory: dist

---

🧪 Testing Checklist

Before production deployment:

- Authentication flow tested
- Protected routes verified
- Charts rendering validated
- Mobile responsiveness tested
- Console errors checked
- Firestore persistence verified

---

🔥 Key Challenges Solved

During development, major engineering challenges included:

- Multi-user state isolation
- Firebase integration
- Chart rendering bugs
- Protected routing
- Responsive authentication UI
- Deployment optimization
- Route refresh 404 handling

---

📈 Future Improvements

Planned upgrades:

- AI chatbot assistant
- Real-time climate API integration
- Team collaboration dashboards
- Carbon credit marketplace
- Advanced sustainability reports
- ML-based prediction engine

---

👨‍💻 Developer

Samiullah Khan
B.Tech Computer Science Student
AI & Frontend Developer 
Passionate about building impactful AI-powered solutions.

GitHub: https://github.com/Samiullah548

---

🏆 Vision Statement

EcoTwin AI is more than a dashboard.

It is a step toward a future where AI helps humanity make better environmental decisions.

«“Small actions, multiplied by millions, can change the planet.”»

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
