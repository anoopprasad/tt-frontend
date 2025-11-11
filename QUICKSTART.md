# Quick Start Guide

Get up and running with the Cognitive Time Tracker frontend in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- Backend API running (see backend repository)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Already created, just verify/update if needed
cat .env
```

Should contain:
```env
VITE_API_BASE_URL=http://localhost:4000
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## First Time Usage

### 1. Create an Account
- Navigate to the signup page
- Enter your name, email, and password (minimum 8 characters)
- Click "Sign Up"

### 2. Start Tracking Time
You have two options:

**Option A: Use the Timer**
1. Click "Start Timer" in the top right
2. Add a description and select a project (optional)
3. Click "Start Timer"
4. Work on your task
5. Click the timer chip in the header to stop it

**Option B: Manual Entry**
1. Go to "Time Log" in the sidebar
2. Click "Add Entry"
3. Fill in the details
4. Click "Create"

### 3. Manage Your Projects
1. Go to "Manage" in the sidebar
2. Navigate through the tabs to create:
   - Clients
   - Projects (assign to clients)
   - Teams (with colors)
   - Tags

### 4. View Reports
1. Go to "Dashboard" to see overview
2. Go to "Reports" for detailed analytics with filters

### 5. Ask the AI
1. Click the chat icon in the bottom right
2. Ask questions like:
   - "What did I work on last week?"
   - "Show me all security work"
   - "How many billable hours this month?"

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test            # Run tests

# Code Quality
npm run lint        # Check code style
```

## Troubleshooting

### Port Already in Use
```bash
npm run dev -- --port 3001
```

### Can't Connect to Backend
1. Check `.env` has correct `VITE_API_BASE_URL`
2. Ensure backend is running
3. Check CORS settings on backend

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Key Features to Try

### ⏱️ Timer
- Always visible in header when running
- Updates every second
- Auto-saves on stop

### 📅 Calendar View
- Click any time slot to create entry
- Click existing entries to edit
- Color-coded by project

### 📊 Dashboard
- Real-time stats
- Interactive charts
- Recent entries

### 🤖 AI Chat
- Natural language queries
- Contextual responses
- Markdown formatting

### 📎 Attachments
- Drag & drop files
- Preview thumbnails
- Download/delete

## Next Steps

1. **Customize Theme**: Edit `src/theme.js`
2. **Add Tests**: Use Vitest + React Testing Library
3. **Deploy**: Follow deployment guide in README.md
4. **Optimize**: Use dynamic imports for code splitting

## Need Help?

- Read the full README.md
- Check PROJECT_SUMMARY.md for architecture details
- Review FRONTEND_PROMPT.md for requirements

---

Happy time tracking! ⏱️
