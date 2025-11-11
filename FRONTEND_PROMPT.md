# Frontend Development Prompt: Cognitive Time Tracker

## Your Role
You are an expert React frontend developer. Your task is to build a modern, responsive, production-ready web application for an AI-powered time tracking tool.

## Repository Setup

Initialize the React application inside this repository.

## Project Overview

Build a React-based single-page application that provides an intuitive interface for tracking time, managing projects, and interacting with an AI assistant for insights and reporting.

**Core Purpose:**
- Allow users to log time manually or with a timer
- Visualize time entries in a weekly calendar view
- Manage projects, clients, tags, and teams
- Display analytics and reports with charts
- Provide AI-powered chat interface for queries and insights

## Technical Requirements

### Stack
- **Framework:** React 18+ (use Vite as build tool)
- **UI Library:** Material UI (MUI) v5+
- **Routing:** React Router v6+
- **Charts:** Recharts or similar
- **State Management:**
  - React Context for authentication
  - React Query (TanStack Query) for server state
  - Zustand (or similar) for global UI state (e.g., running timer)
- **Forms:** React Hook Form or Formik
- **HTTP Client:** Axios or Fetch

### Core Principles
1. **Modern React:** Use functional components and hooks
2. **Responsive Design:** Mobile-first, works on all screen sizes
3. **User Experience:** Smooth, intuitive, fast
4. **API Consistency:** Use exact same naming as backend API (snake_case from API, camelCase in JavaScript)
5. **Security:** Never store sensitive tokens in localStorage

## Backend API Integration

**Critical:** The backend uses `snake_case` for all JSON keys. You'll need to:
- Transform API responses: `snake_case` → `camelCase` for use in React
- Transform requests: `camelCase` → `snake_case` before sending to API

### Expected API Conventions
- Base URL: `/api/v1/`
- Authentication: JWT access token in `Authorization: Bearer` header
- Refresh token: HttpOnly cookie (automatically sent)
- Response format:
  ```json
  {
    "data": { ... },
    "meta": { ... }
  }
  ```
- Error format:
  ```json
  {
    "error": {
      "message": "Human-readable error",
      "code": "ERROR_CODE"
    }
  }
  ```

### Available API Endpoints

The backend provides these endpoints for you to consume:

#### Authentication
- `POST /api/v1/auth/signup` - Create new user account
- `POST /api/v1/auth/login` - Login, returns access token + sets HttpOnly refresh cookie
- `POST /api/v1/auth/refresh` - Refresh access token using cookie
- `DELETE /api/v1/auth/logout` - Revoke tokens and clear session
- `POST /api/v1/auth/password/reset` - Request password reset
- `PUT /api/v1/auth/password/reset` - Complete password reset

#### Time Entries
- `GET /api/v1/time_entries` - List time entries (supports filtering: date range, project_id, client_id, tag_ids, team_ids, is_billable)
- `POST /api/v1/time_entries` - Create new time entry (manual or timer start)
- `GET /api/v1/time_entries/:id` - Get single time entry details
- `PUT /api/v1/time_entries/:id` - Update time entry
- `DELETE /api/v1/time_entries/:id` - Delete time entry
- `POST /api/v1/time_entries/:id/stop` - Stop running timer (sets end_time)

#### Projects
- `GET /api/v1/projects` - List all projects (includes client info)
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

#### Clients
- `GET /api/v1/clients` - List all clients
- `POST /api/v1/clients` - Create new client
- `GET /api/v1/clients/:id` - Get client details
- `PUT /api/v1/clients/:id` - Update client
- `DELETE /api/v1/clients/:id` - Delete client

#### Teams
- `GET /api/v1/teams` - List all teams
- `POST /api/v1/teams` - Create new team
- `GET /api/v1/teams/:id` - Get team details
- `PUT /api/v1/teams/:id` - Update team
- `DELETE /api/v1/teams/:id` - Delete team

#### Tags
- `GET /api/v1/tags` - List all tags
- `POST /api/v1/tags` - Create new tag
- `GET /api/v1/tags/:id` - Get tag details
- `PUT /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags/:id` - Delete tag

#### File Attachments
- `POST /api/v1/time_entries/:id/attachments` - Upload attachment(s) to time entry
- `DELETE /api/v1/attachments/:id` - Remove attachment

#### AI Chat
- `POST /api/v1/ai/chat` - Send natural language query, receive AI response

#### Dashboard & Analytics
- `GET /api/v1/dashboard/summary` - Get summary stats (today, week, month hours)
- `GET /api/v1/reports` - Generate detailed reports (supports filtering by date range, client, project, tags, teams, billable status)

**Your Task:** Implement seamless authentication with automatic token refresh on 401 errors, and integrate all these endpoints into your React application.

## Core Features to Build

### 1. Authentication System

**Requirements:**
- Login page (email + password)
- Store access token in memory only (not localStorage)
- Implement axios/fetch interceptor that:
  - Adds `Authorization` header to all requests
  - Catches 401 errors
  - Automatically calls refresh endpoint
  - Retries original request with new token
  - Redirects to login if refresh fails
- Protected routes that redirect unauthenticated users
- User profile display and logout functionality

### 2. Layout & Navigation

**Requirements:**
- Persistent sidebar navigation
- Top header/app bar with:
  - User avatar and menu
  - Running timer display (when active)
  - Start timer button (when no timer running)
- Responsive: drawer on mobile, permanent sidebar on desktop

**Navigation Items:**
- Dashboard (overview)
- Time Log (calendar view)
- Reports (analytics)
- Manage (CRUD for projects, clients, tags, teams)

### 3. Time Entry Management

**Features Needed:**

#### Manual Entry Form:
- Description (text area)
- Date picker
- Start time, end time
- Duration (auto-calculated or manual)
- Project selector (grouped by client)
- Tags selector (multi-select)
- Teams selector (multi-select)
- Billable toggle
- File attachment (drag & drop)

#### Timer Mode:
- "Start Timer" button in header
- Modal to capture: description, project (optional)
- Running timer visible in header with elapsed time (updates every second)
- "Stop Timer" button
- On stop: POST to backend stop endpoint
- Only one timer can run at a time

#### Weekly Calendar View:
- Display time entries as blocks on a calendar grid
- Days of week (columns), hours of day (rows)
- Click empty slot → opens entry form with pre-filled times
- Click existing entry → opens edit form
- Visual indicator for running timer
- Week navigation (previous/next)

### 4. Dashboard Page

**Display:**
- Summary cards:
  - Total hours today
  - Total hours this week
  - Total hours this month
  - Billable vs non-billable ratio
- Pie chart: Time distribution by project
- Bar chart: Daily hours for last 7 days
- Recent time entries table (last 10)

Use Recharts or similar for visualizations.

### 5. Reports Page

**Features:**
- Filter panel:
  - Date range picker
  - Client dropdown
  - Project dropdown
  - Tags multi-select
  - Teams multi-select
  - Billable filter (all/billable/non-billable)
- View toggle: Summary vs Detailed
- **Summary view:** Aggregated totals by project, tag, team
- **Detailed view:** Data table with all matching entries
- Export button (trigger CSV download from backend)

### 6. Manage Page

**Requirements:**
- Tabs or sections for: Projects, Clients, Teams, Tags
- Each section:
  - List/table of items
  - "Add New" button
  - Edit/Delete actions for each item
  - Form modal or inline editing

**Specific fields:**
- Clients: name
- Projects: name, client, is_billable
- Teams: name, color picker
- Tags: name

### 7. AI Chat Interface

**Requirements:**
- Floating action button (bottom-right) with chat icon
- Click → opens drawer/modal with chat interface
- Display conversation history
- Input field for user query
- Send button
- Stream or display AI responses
- Support markdown rendering in responses
- Show loading state while AI processes

**Example queries the AI should handle:**
- "What did I work on last week?"
- "Show me all security work in Q4"
- "How many billable hours this month?"
- "Generate a summary for my manager"

### 8. File Attachments

**Requirements:**
- Drag & drop zone in time entry form
- Upload progress indicator
- Thumbnail preview for images
- File list with download/delete buttons
- Support multiple files per entry

**Implementation:**
- Development: Direct upload through API
- Production: May use presigned S3 URLs (backend provides)

## UI/UX Requirements

### Design Guidelines:
- Use Material UI components consistently
- Modern, clean aesthetic
- Good use of whitespace
- Intuitive icons (Material Icons)
- Smooth transitions and animations
- Loading skeletons while fetching data
- Toast notifications for success/error messages
- Confirmation dialogs for destructive actions

### Responsive Behavior:
- Mobile: hamburger menu, stacked layout
- Tablet: adaptive sidebar
- Desktop: full sidebar, multi-column layouts

### Accessibility:
- Proper ARIA labels
- Keyboard navigation support
- Sufficient color contrast
- Focus indicators

## State Management Strategy

### Authentication State:
Use React Context:
```javascript
{
  user: { id, email },
  isAuthenticated: boolean,
  login: (email, password) => Promise,
  logout: () => void
}
```

### Server State:
Use React Query for:
- Fetching time entries, projects, clients, etc.
- Caching and automatic refetching
- Optimistic updates
- Pagination

### Global UI State:
Use Zustand for:
- Running timer state (visible in header from any page)
- Theme preferences (if implementing dark mode)
- Sidebar open/close state

## Error Handling

**Requirements:**
- Display user-friendly error messages
- Toast notifications for errors
- Form validation with clear error messages
- Network error handling (offline state)
- 404 page for invalid routes
- Error boundary component for unexpected errors

## Performance Considerations

- Lazy load routes (React.lazy + Suspense)
- Debounce search/filter inputs
- Virtualize long lists if needed
- Optimize re-renders (useMemo, useCallback where appropriate)
- Minimize bundle size

## Development Workflow

1. **Setup:** Initialize React app with Vite, install dependencies
2. **Structure:** Create folder structure (pages, components, hooks, contexts, utils)
3. **Authentication:** Implement auth flow and route protection
4. **Layout:** Build app shell (sidebar, header, routing)
5. **Components:** Build reusable components (selectors, forms, etc.)
6. **Pages:** Implement all main pages
7. **AI Chat:** Integrate chat interface
8. **Polish:** Add loading states, error handling, animations
9. **Testing:** Write component tests

## Testing Requirements

Implement tests for:
- Authentication flow
- Form validation
- API integration (with mock backend)
- User interactions (button clicks, form submissions)
- Routing and navigation
- Error scenarios

Use Vitest + React Testing Library.

## Documentation

Create:
- README with setup instructions
- Environment variables guide
- Component documentation (if complex)
- Deployment instructions

## Environment Variables

Document required env vars:
- `VITE_API_BASE_URL` - Backend API URL
- Any other configuration

## Success Criteria

The frontend is complete when:
- [ ] User can sign up and log in
- [ ] Authentication persists across page refreshes
- [ ] Token refresh works automatically
- [ ] User can create manual time entries
- [ ] User can start/stop timer from header
- [ ] Timer is visible and updates in real-time
- [ ] Weekly calendar displays time entries
- [ ] User can edit/delete entries
- [ ] User can upload files to entries
- [ ] Dashboard shows charts and summaries
- [ ] Reports page filters and displays data
- [ ] Manage page allows CRUD for all entities
- [ ] AI chat responds to queries
- [ ] Application is responsive on all devices
- [ ] Error handling works throughout
- [ ] Application is deployed and accessible

## Key Reminders

1. **API Naming:** Backend uses `snake_case`, transform to `camelCase` in your app
2. **Token Security:** Access token in memory only, refresh token in HttpOnly cookie
3. **User Experience:** Fast, smooth, intuitive
4. **Error Handling:** Always handle network errors gracefully
5. **Git:** Commit frequently with clear messages
6. **Documentation:** Keep README updated

## Questions You Can Decide

- State management library choices (beyond requirements)
- Component structure and organization
- Styling approach (styled-components, emotion, CSS modules)
- Testing strategy details
- Build optimization techniques
- Additional UI enhancements (animations, themes)
- PWA features (optional)
- Dark mode support (optional)

## Getting Started

Begin with:
```bash

# Initialize React app with Vite
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Start building!
```

**Proceed autonomously.** Make architectural and design decisions that follow React and Material UI best practices. Build a beautiful, performant, user-friendly application.

## Backend Coordination

The backend developer is building the API in parallel. Key coordination points:
- **API Contract:** Backend uses `snake_case`, you transform to `camelCase`
- **Serialization:** Backend uses Alba gem for consistent JSON responses with nested associations
- **Authentication:** Backend provides JWT + refresh cookie strategy
- **File Upload:** Backend handles both local and S3 storage
- **AI Responses:** Backend provides formatted text responses
- **All Endpoints:** All backend API endpoints are documented above in "Available API Endpoints" section

For development, you may need to mock API responses initially or coordinate with backend developer on API availability. The backend will provide properly structured responses with nested associations (e.g., time entries include project, client, tags, teams, and attachments).

