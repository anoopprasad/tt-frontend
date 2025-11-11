# Cognitive Time Tracker - Frontend

A modern, responsive React application for AI-powered time tracking with beautiful Material UI design.

## 🎨 Features

### Core Functionality
- ⏱️ **Timer Management**: Start/stop timers with real-time display in the app bar
- 📅 **Weekly Calendar View**: Visual time entry management with drag-and-drop functionality
- 📊 **Dashboard**: Beautiful charts and analytics showing time distribution
- 📈 **Reports**: Advanced filtering and data visualization
- 🏢 **Entity Management**: CRUD operations for projects, clients, teams, and tags
- 🤖 **AI Chat Assistant**: Natural language queries for insights and reporting
- 📎 **File Attachments**: Drag-and-drop file upload support
- 🔐 **Secure Authentication**: JWT with automatic token refresh

### Design Excellence
- 🎨 Material UI v5+ components with custom theme
- 📱 Fully responsive (mobile, tablet, desktop)
- ✨ Smooth animations and transitions
- 🎯 Intuitive user experience
- 🌈 Modern gradient designs
- ⚡ Fast loading with code splitting
- 🔄 Optimistic updates with React Query

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. **Clone the repository** (if not already in the workspace):
```bash
git clone <repository-url>
cd cognitive-time-tracker
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```env
VITE_API_BASE_URL=http://localhost:4000
```

4. **Start the development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── calendar/       # Weekly calendar components
│   ├── charts/         # Chart components (Recharts)
│   ├── common/         # Common UI components
│   ├── forms/          # Form components and inputs
│   └── layout/         # Layout components (AppBar, Sidebar)
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── auth/          # Login, Signup
│   ├── dashboard/     # Dashboard page
│   ├── timelog/       # Time log with calendar
│   ├── reports/       # Reports page
│   └── manage/        # Entity management
├── services/           # API service layer
│   ├── api.js         # Axios instance with interceptors
│   ├── authService.js
│   ├── timeEntryService.js
│   ├── projectService.js
│   └── ...
├── stores/             # Zustand stores
│   └── timerStore.js  # Global timer state
├── utils/              # Utility functions
│   └── caseTransform.js # snake_case ↔ camelCase
├── App.jsx             # Main app component with routing
├── main.jsx           # App entry point
└── theme.js           # Material UI theme configuration
```

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing
```bash
npm test            # Run tests with Vitest
```

### Linting
```bash
npm run lint        # Run ESLint
```

## 🎯 Key Technologies

### Core
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing

### UI & Styling
- **Material UI v5** - Component library
- **Emotion** - CSS-in-JS styling
- **Recharts** - Data visualization
- **React Dropzone** - File uploads

### State Management
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Global UI state (timer)
- **React Context** - Authentication state

### Forms & Data
- **React Hook Form** - Form validation
- **date-fns** - Date utilities
- **Axios** - HTTP client

### Testing
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## 🔐 Authentication Flow

The app implements a secure authentication flow:

1. **Login**: User credentials → Backend → JWT access token + HttpOnly refresh cookie
2. **Token Storage**: Access token stored in memory (never localStorage)
3. **Auto-refresh**: On 401 error, automatically refreshes token using cookie
4. **Logout**: Clears token and revokes session

### API Integration

All API requests automatically:
- Add `Authorization: Bearer <token>` header
- Transform request data from camelCase to snake_case
- Transform response data from snake_case to camelCase
- Handle token refresh on 401 errors

## 📱 Responsive Design

The app is optimized for all screen sizes:

- **Mobile (< 768px)**: Hamburger menu, stacked layouts
- **Tablet (768px - 1024px)**: Adaptive sidebar, responsive grids
- **Desktop (> 1024px)**: Full sidebar, multi-column layouts

## 🎨 Theming

The app uses a custom Material UI theme with:
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Error: Red (#ef4444)

Customize in `src/theme.js`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set these in your hosting platform:
```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## 🧪 Testing

Run tests:
```bash
npm test
```

The app includes tests for:
- Authentication flow
- Form validation
- Component rendering
- API integration (mocked)

## 📚 API Endpoints

The frontend integrates with these backend endpoints:

### Authentication
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `DELETE /api/v1/auth/logout`

### Time Entries
- `GET /api/v1/time_entries`
- `POST /api/v1/time_entries`
- `PUT /api/v1/time_entries/:id`
- `DELETE /api/v1/time_entries/:id`
- `POST /api/v1/time_entries/:id/stop`

### Projects, Clients, Teams, Tags
- Standard CRUD endpoints for each entity

### Dashboard & Reports
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/reports`

### AI Chat
- `POST /api/v1/ai/chat`

See `FRONTEND_PROMPT.md` for complete API documentation.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📝 Code Style

The project uses ESLint for code quality:
- React hooks rules enforced
- Modern ES6+ syntax
- Functional components only
- Proper prop validation

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port in vite.config.js or use:
npm run dev -- --port 3001
```

### CORS issues
Make sure your backend API allows requests from your frontend origin.

### Token refresh not working
Check that:
1. Backend sets HttpOnly cookie correctly
2. `withCredentials: true` is set in axios config
3. Backend and frontend are on same domain or CORS is properly configured

## 📄 License

[Your License Here]

## 👥 Authors

[Your Name/Team]

## 🙏 Acknowledgments

- Material UI team for excellent components
- React Query for making server state easy
- Vite for blazing fast development

---

**Happy Time Tracking! ⏱️**
