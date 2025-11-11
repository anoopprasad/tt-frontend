# Cognitive Time Tracker - Frontend

A modern, responsive React application for AI-powered time tracking with beautiful UI and seamless user experience.

![Time Tracker](https://img.shields.io/badge/React-18+-blue)
![Material UI](https://img.shields.io/badge/Material--UI-v5+-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Functionality
- **Time Tracking**: Manual entries and real-time timer with running timer display in header
- **Weekly Calendar View**: Visual time entry management with drag-and-drop
- **Dashboard**: Beautiful charts and statistics for time insights
- **Reports**: Advanced filtering and data visualization
- **Entity Management**: Full CRUD for projects, clients, teams, and tags
- **AI Assistant**: Natural language queries for insights and reports
- **File Attachments**: Drag-and-drop file uploads to time entries

### 🎨 Design Highlights
- **Modern UI**: Clean, professional design with Material UI components
- **Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Polished transitions and interactions
- **Intuitive Navigation**: Easy-to-use sidebar and header navigation
- **Color-Coded**: Projects and teams with customizable colors

### 🔒 Security
- **JWT Authentication**: Access tokens stored in memory only
- **Automatic Token Refresh**: Seamless session management
- **Protected Routes**: Secure access control
- **HttpOnly Cookies**: Refresh tokens stored securely

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend documentation)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/              # API client and endpoint modules
│   ├── client.js     # Axios client with interceptors
│   ├── auth.js       # Authentication endpoints
│   ├── timeEntries.js
│   ├── projects.js
│   ├── clients.js
│   ├── teams.js
│   ├── tags.js
│   ├── dashboard.js
│   └── ai.js
├── components/       # Reusable components
│   ├── common/       # Shared components
│   ├── layout/       # Layout components (Sidebar, Header)
│   ├── time/         # Time entry components
│   ├── dashboard/    # Dashboard components
│   ├── reports/      # Reports components
│   ├── manage/       # CRUD components
│   └── ai/           # AI chat component
├── contexts/         # React contexts
│   └── AuthContext.jsx
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx
│   ├── TimeLogPage.jsx
│   ├── ReportsPage.jsx
│   └── ManagePage.jsx
├── store/            # Zustand stores
│   └── timerStore.js
├── utils/            # Utility functions
│   ├── caseTransform.js  # snake_case ↔ camelCase
│   └── formatters.js     # Date/time formatters
├── App.jsx           # Main app component
├── main.jsx          # App entry point
└── theme.js          # Material UI theme

```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Backend API Integration

The frontend expects the backend API to:
- Use `snake_case` for JSON keys (automatically transformed to `camelCase`)
- Provide JWT access tokens in response to login
- Set HttpOnly cookies for refresh tokens
- Follow the API contract defined in FRONTEND_PROMPT.md

## 🎨 Customization

### Theme

Edit `src/theme.js` to customize colors, typography, and component styles:

```javascript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      // ...
    },
  },
});
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/layout/Sidebar.jsx`

## 📚 Key Technologies

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Material UI v5**: Comprehensive component library
- **React Router v6**: Client-side routing
- **TanStack Query**: Server state management
- **Zustand**: Global UI state (timer)
- **Axios**: HTTP client with interceptors
- **Recharts**: Beautiful, composable charts
- **React Hook Form**: Efficient form management
- **React Dropzone**: Drag-and-drop file uploads
- **Notistack**: Toast notifications
- **Day.js**: Date manipulation and formatting

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# The build folder will be in ./dist
# Deploy the contents to your static hosting service
```

### Deployment Options

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **AWS S3 + CloudFront**: Upload `dist` to S3 bucket
- **Docker**: Use included Dockerfile (if provided)

## 🔐 Authentication Flow

1. User enters credentials on login page
2. Backend returns access token (stored in memory)
3. Backend sets HttpOnly refresh cookie
4. All API requests include `Authorization: Bearer <token>`
5. On 401 error, automatically call refresh endpoint
6. Retry original request with new token
7. If refresh fails, redirect to login

## 🎯 Key Features Explained

### Timer Management

The timer state is managed globally with Zustand:
- Start timer from any page via header button
- Timer displays in header with live elapsed time
- Stop timer to save time entry
- Only one timer can run at a time

### Weekly Calendar

- Interactive calendar grid showing time entries
- Click empty slot to create entry at that time
- Click existing entry to edit
- Visual blocks with project colors
- Week navigation

### AI Assistant

- Floating action button (bottom-right)
- Opens chat drawer
- Natural language queries
- Markdown-formatted responses
- Conversation history

### File Attachments

- Drag-and-drop interface
- Multiple file support
- Upload progress indicators
- Preview and download
- Delete attachments

## 🐛 Troubleshooting

### API Connection Issues

- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS settings on backend
- Ensure backend is running

### Authentication Not Working

- Check browser console for errors
- Verify cookies are enabled
- Check backend token generation

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 Best Practices

1. **State Management**: Use React Query for server state, Zustand for UI state
2. **Error Handling**: Always handle loading and error states
3. **Forms**: Use React Hook Form for performance
4. **API Calls**: Let interceptors handle auth automatically
5. **Styling**: Use Material UI's `sx` prop for custom styles
6. **Types**: Consider adding TypeScript for better type safety

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Material UI team for the excellent component library
- React Query for powerful data synchronization
- The React community for amazing tools and libraries

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `/docs`
- Review API contract in `FRONTEND_PROMPT.md`

---

**Built with ❤️ using React and Material UI**
