# Cognitive Time Tracker - Frontend

A modern, responsive React application for tracking time, managing projects, and interacting with an AI assistant for insights and reporting.

## Features

- 🔐 **Authentication**: Secure login/signup with JWT tokens and automatic refresh
- ⏱️ **Time Tracking**: Manual entries and live timer functionality
- 📅 **Calendar View**: Weekly calendar visualization of time entries
- 📊 **Dashboard**: Analytics with charts and summary statistics
- 📈 **Reports**: Filterable reports with summary and detailed views
- 🏢 **Management**: CRUD operations for projects, clients, tags, and teams
- 🤖 **AI Chat**: Natural language queries about your time entries
- 📎 **File Attachments**: Upload and manage attachments for time entries

## Tech Stack

- **React 18+** with Vite
- **Material UI (MUI) v5+** for components
- **React Router v6+** for routing
- **TanStack Query (React Query)** for server state management
- **Zustand** for global UI state
- **React Hook Form** for form handling
- **Axios** for HTTP requests
- **Recharts** for data visualization
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
VITE_API_BASE_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `/api/v1`)

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/        # React contexts (Auth)
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API service functions
├── store/          # Zustand stores
├── utils/          # Utility functions
└── types/          # TypeScript types (if using TS)
```

## API Integration

The frontend automatically transforms data between `snake_case` (backend) and `camelCase` (frontend) formats. All API requests include automatic token refresh on 401 errors.

### Authentication Flow

1. User logs in → receives access token (stored in memory)
2. Refresh token stored in HttpOnly cookie (handled by browser)
3. On 401 error → automatically refresh token → retry request
4. If refresh fails → redirect to login

## Key Features Implementation

### Time Entry Management

- **Manual Entry**: Form with date, time, duration, project, tags, teams, and billable status
- **Timer Mode**: Start/stop timer from header, visible across all pages
- **Calendar View**: Weekly grid showing time entries as blocks

### Dashboard

- Summary cards (today, week, month hours, billable percentage)
- Pie chart: Time distribution by project
- Bar chart: Daily hours for last 7 days
- Recent time entries table

### Reports

- Filter by date range, client, project, tags, teams, billable status
- Summary view: Aggregated totals
- Detailed view: Full entry list
- CSV export functionality

### AI Chat

- Floating action button (bottom-right)
- Natural language queries
- Markdown-formatted responses
- Conversation history

## Development

### Code Style

- Functional components with hooks
- React Query for data fetching
- Material UI for styling
- Consistent error handling with toast notifications

### Testing

```bash
npm test
```

Uses Vitest + React Testing Library.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
