# Brainfeed Magazine - Next.js + Express

A full-stack educational magazine platform built with Next.js frontend and Express backend.

## Project Structure

```
.
├── app/                    # Next.js App Router pages and components
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── article/[slug]/    # Dynamic article pages
│   ├── category/[slug]/   # Dynamic category pages
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility libraries
├── server/                # Express backend
│   ├── index.ts          # Express server entry
│   ├── routes.ts         # API routes
│   └── db.ts             # Database configuration
├── shared/               # Shared types and schemas
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or pnpm
- MySQL database

### Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
```

2. Set up environment variables:

Create a `.env` file in the root directory:

```env
DATABASE_URL=mysql://user:password@localhost:3306/brainfeed
SESSION_SECRET=your-secret-key-here
AI_INTEGRATIONS_OPENAI_API_KEY=your-openai-key
PORT=5000
```

3. Push database schema:

```bash
npm run db:push
```

### Development

The project runs two servers:

1. **Next.js Frontend** (port 3000):

```bash
npm run dev
```

2. **Express Backend** (port 5000):

```bash
npm run dev:server
```

Or run both in development:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Building for Production

1. Build the Next.js frontend:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

## Features

- ✨ Modern Next.js 15 with App Router
- 🎨 Beautiful editorial design with Tailwind CSS
- 📱 Fully responsive layout
- 🔐 Authentication and authorization
- 📝 Content management system
- 🤖 AI-powered article recommendations
- 📊 Analytics and insights
- 🔍 Search functionality
- 📱 Progressive Web App (PWA) ready

## API Routes

All API routes are proxied from Next.js to the Express backend:

- `/api/articles` - Article management
- `/api/categories` - Category management
- `/api/auth` - Authentication
- `/api/chat` - AI chat assistant
- `/api/analytics` - Analytics tracking

## Tech Stack

### Frontend
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- TanStack Query
- Framer Motion

### Backend
- Express.js
- Drizzle ORM
- MySQL
- OpenAI API
- Express Session

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `SESSION_SECRET` | Session encryption key | Yes |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key | Yes |
| `PORT` | Backend server port | No (default: 5000) |
| `BACKEND_URL` | Backend API URL | No (default: http://localhost:5000) |

## Deployment

### Next.js Frontend

Deploy the Next.js app to Vercel, Netlify, or any other hosting platform that supports Next.js.

### Express Backend

Deploy the Express backend to:
- Railway
- Render
- Heroku
- VPS (DigitalOcean, Linode, etc.)

Make sure to set the `BACKEND_URL` environment variable in your frontend deployment to point to your backend API.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

