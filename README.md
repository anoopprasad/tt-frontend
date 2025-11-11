# Cognitive Time Tracker - Frontend

A modern, responsive React application for AI-powered time tracking with beautiful Material UI design.

## Features

- 🔐 **Authentication**: Secure login/signup with JWT tokens and automatic refresh
- ⏱️ **Time Tracking**: Manual entries and live timer functionality
- 📅 **Weekly Calendar**: Visual calendar view of time entries
- 📊 **Dashboard**: Analytics with charts and summary statistics
- 📈 **Reports**: Filterable reports with summary and detailed views
- 🏢 **Management**: CRUD operations for Projects, Clients, Teams, and Tags
- 🤖 **AI Chat**: Natural language queries about your time entries
- 📎 **File Attachments**: Upload and manage attachments for time entries
- 📱 **Responsive**: Works beautifully on mobile, tablet, and desktop

## Tech Stack

- **React 18+** with Vite
- **Material UI (MUI) v5** for components
- **React Router v6** for routing
- **TanStack Query (React Query)** for server state management
- **Zustand** for global UI state
- **React Hook Form** for form handling
- **Axios** for HTTP requests
- **Recharts** for data visualization
- **date-fns** for date manipulation
- **React Markdown** for AI chat responses

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Common components (LoadingSpinner, ErrorBoundary, etc.)
│   ├── layout/         # Layout components (AppBar, Sidebar, MainLayout)
│   ├── time-entry/     # Time entry related components
│   ├── forms/          # Form components
│   ├── charts/         # Chart components
│   ├── chat/           # AI chat components
│   └── manage/         # Management page components
├── pages/              # Page components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom React hooks for API calls
├── services/           # API client and services
├── store/              # Zustand stores (timer, UI state)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (transform, date helpers)
```

## API Integration

The frontend communicates with a backend API that uses `snake_case` for JSON keys. The application automatically transforms:
- API responses: `snake_case` → `camelCase`
- API requests: `camelCase` → `snake_case`

### Authentication

- Access tokens are stored in memory only (not localStorage)
- Refresh tokens are stored in HttpOnly cookies (handled automatically)
- Automatic token refresh on 401 errors
- Redirects to login if refresh fails

## Environment Variables

- `VITE_API_BASE_URL`: Backend API base URL (default: `/api/v1`)

## Key Features Implementation

### Timer Functionality

- Start timer from header or Time Log page
- Running timer displays elapsed time in header
- Only one timer can run at a time
- Stop timer updates the time entry with end time

### Weekly Calendar

- Click empty slot to create new entry
- Click existing entry to edit
- Visual indicators for running timers
- Week navigation (previous/next)

### Dashboard

- Summary cards: Today, Week, Month hours, Billable %
- Pie chart: Time distribution by project
- Bar chart: Daily hours for last 7 days
- Recent time entries table

### Reports

- Filter by date range, client, project, tags, teams, billable status
- Summary view: Aggregated totals
- Detailed view: Full data table
- Export to CSV (when backend supports it)

### AI Chat

- Floating action button (bottom-right)
- Natural language queries
- Markdown support in responses
- Conversation history

## Development

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Consistent component structure
- Error boundaries for error handling

### Testing

Tests can be added using Vitest + React Testing Library (not yet implemented).

## Deployment

1. Build the application: `npm run build`
2. Serve the `dist` directory with a static file server
3. Ensure the backend API is accessible at the configured `VITE_API_BASE_URL`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the Cognitive Time Tracker application.
