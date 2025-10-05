# AI Personality Twin Chatbot

A beautiful, dark-mode chatbot interface powered by Google's Gemini 2.5 Flash, designed to represent your AI personality twin.

## Features

- 🎨 Modern dark mode UI with gradient accents
- 💬 Real-time chat interface
- 🚀 Built with Next.js 15 and TypeScript
- ⚡ Powered by Gemini 2.5 Flash
- 📱 Fully responsive design
- 🎯 Easy deployment to Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

3. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Customize the AI personality:
   - Open `app/api/chat/route.ts`
   - Edit the `SYSTEM_PROMPT` variable to match your personality, communication style, and traits

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your chatbot.

### Customizing Your AI Twin

To make the chatbot truly represent your personality, edit the system prompt in `app/api/chat/route.ts`:

```typescript
const SYSTEM_PROMPT = `You are an AI twin of [Your Name]...`;
```

Include details like:
- Your communication style
- Your interests and expertise
- Your values and perspectives
- How you typically respond to questions
- Your sense of humor
- Any specific phrases or expressions you use

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add your environment variable:
   - Go to Project Settings → Environment Variables
   - Add `GEMINI_API_KEY` with your API key value

4. Deploy!

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash
- **Deployment**: Vercel

## Project Structure

```
AI-PERSONALITY/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API endpoint for Gemini
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main chat interface
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## License

MIT

## Support

If you encounter any issues or have questions, feel free to open an issue in the repository.

---

Built with ❤️ using Next.js and Gemini AI

