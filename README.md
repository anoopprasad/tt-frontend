# Cognitive Time Tracker - Frontend

A modern, responsive React application for tracking time, managing projects, and interacting with an AI assistant for insights and reporting.

## Features

- 🔐 **Authentication**: Secure JWT-based authentication with automatic token refresh
- ⏱️ **Time Tracking**: Manual entries and live timer functionality
- 📅 **Weekly Calendar View**: Visual representation of time entries
- 📊 **Dashboard**: Analytics with charts and summary statistics
- 📈 **Reports**: Detailed reporting with filtering and export capabilities
- 🏢 **Project Management**: CRUD operations for projects, clients, teams, and tags
- 🤖 **AI Assistant**: Chat interface for querying time tracking data
- 📎 **File Attachments**: Drag & drop file uploads for time entries
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **React 18+** - UI framework
- **Vite** - Build tool and dev server
- **Material UI (MUI) v5** - Component library
- **React Router v6** - Routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Global UI state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Recharts** - Chart library
- **date-fns** - Date utilities
- **react-markdown** - Markdown rendering
- **react-dropzone** - File uploads
- **notistack** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AIChat.jsx      # AI chat interface
│   ├── ErrorBoundary.jsx
│   ├── FileUpload.jsx  # File upload component
│   ├── TimeEntryModal.jsx
│   └── WeeklyCalendar.jsx
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── layouts/            # Layout components
│   └── DashboardLayout.jsx
├── pages/              # Page components
│   ├── DashboardPage.jsx
│   ├── LoginPage.jsx
│   ├── ManagePage.jsx
│   ├── ReportsPage.jsx
│   ├── SignupPage.jsx
│   └── TimeLogPage.jsx
├── services/           # API service functions
│   ├── aiService.js
│   ├── authService.js
│   ├── clientService.js
│   ├── dashboardService.js
│   ├── projectService.js
│   ├── reportService.js
│   ├── tagService.js
│   ├── teamService.js
│   └── timeEntryService.js
├── stores/             # Zustand stores
│   ├── timerStore.js
│   └── uiStore.js
├── utils/               # Utility functions
│   └── api.js          # Axios instance with interceptors
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── theme.js            # MUI theme configuration
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `/api/v1`)

## API Integration

The frontend communicates with a backend API that uses `snake_case` for JSON keys. The application automatically transforms:

- **Requests**: `camelCase` → `snake_case`
- **Responses**: `snake_case` → `camelCase`

### Authentication

- Access tokens are stored in memory only (not localStorage)
- Refresh tokens are handled via HttpOnly cookies
- Automatic token refresh on 401 errors
- Redirects to login if refresh fails

## Key Features Implementation

### Time Tracking

- **Manual Entry**: Create time entries with description, date, times, project, tags, teams, and billable status
- **Timer Mode**: Start a timer from the header, visible across all pages
- **Weekly Calendar**: Visual calendar view with clickable slots for quick entry creation

### Dashboard

- Summary cards showing today, week, and month totals
- Pie chart for time distribution by project
- Bar chart for daily hours over the last 7 days
- Recent time entries table

### Reports

- Filter by date range, client, project, tags, teams, and billable status
- Summary view with aggregated totals
- Detailed view with full entry list

### Management

- CRUD operations for:
  - **Clients**: Name
  - **Projects**: Name, client, billable status
  - **Tags**: Name
  - **Teams**: Name, color

### AI Chat

- Floating action button opens chat drawer
- Natural language queries about time tracking data
- Markdown rendering for responses

## Development

### Code Style

- ESLint configuration included
- Follow React best practices
- Use functional components and hooks

### Testing

```bash
npm test
```

Uses Vitest and React Testing Library.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private project

## Support

For issues or questions, please contact the development team.
