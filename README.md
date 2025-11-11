# Cognitive Time Tracker - Frontend

A modern, responsive React application for AI-powered time tracking with beautiful Material UI design.

## Features

- 🔐 **Authentication**: Secure JWT-based auth with automatic token refresh
- ⏱️ **Time Tracking**: Manual entries and live timer functionality
- 📅 **Calendar View**: Weekly calendar visualization of time entries
- 📊 **Dashboard**: Analytics with charts and summary statistics
- 📈 **Reports**: Filterable reports with summary and detailed views
- 🏢 **Management**: CRUD operations for Projects, Clients, Teams, and Tags
- 🤖 **AI Assistant**: Chat interface for natural language queries
- 📎 **File Attachments**: Drag & drop file uploads for time entries
- 📱 **Responsive**: Mobile-first design that works on all devices

## Tech Stack

- **React 18+** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Material UI (MUI) v5** - Beautiful component library
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Global UI state management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Recharts** - Chart visualizations
- **date-fns** - Date utilities
- **React Markdown** - Markdown rendering for AI responses

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
VITE_API_BASE_URL=http://localhost:3001/api/v1
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

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable React components
│   ├── AIChat/      # AI chat interface
│   ├── Layout/      # Sidebar, Header
│   ├── TimeEntry/   # Time entry forms and calendar
│   └── Timer/       # Timer components
├── contexts/        # React contexts (Auth)
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── stores/          # Zustand stores
├── utils/           # Utility functions
└── theme.js         # MUI theme configuration
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `/api/v1`)

## API Integration

The frontend automatically handles:
- **snake_case ↔ camelCase** conversion for API requests/responses
- **JWT token** management (access token in memory, refresh token in HttpOnly cookie)
- **Automatic token refresh** on 401 errors
- **Request/response interceptors** for authentication

## Key Features

### Authentication
- Login/Signup pages
- Protected routes
- Automatic token refresh
- Secure token storage (memory only)

### Time Tracking
- Manual time entry form
- Live timer with real-time updates
- Weekly calendar view
- Edit/delete entries
- File attachments

### Dashboard
- Summary cards (today, week, month)
- Project distribution pie chart
- Daily hours bar chart
- Recent entries table

### Reports
- Date range filtering
- Filter by client, project, tags, teams
- Billable/non-billable filter
- Summary and detailed views
- CSV export

### Management
- Projects (with client association, billable flag)
- Clients
- Teams (with color coding)
- Tags

### AI Chat
- Floating action button
- Drawer interface
- Markdown support
- Conversation history

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
