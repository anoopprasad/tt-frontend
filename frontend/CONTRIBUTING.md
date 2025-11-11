# Contributing to Cognitive Time Tracker

Thank you for considering contributing to the Cognitive Time Tracker! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/time-tracker.git
   cd time-tracker/frontend
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running the Application

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Project Structure

Follow the existing structure:
- `src/api/` - API client and endpoints
- `src/components/` - Reusable components
- `src/pages/` - Page components
- `src/contexts/` - React contexts
- `src/hooks/` - Custom hooks
- `src/utils/` - Utility functions
- `src/store/` - Zustand stores

## Coding Standards

### Style Guide

- Use functional components with hooks
- Follow Material UI conventions
- Use descriptive variable and function names
- Add comments for complex logic
- Keep components small and focused

### Component Structure

```javascript
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

export const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(null);

  const handleAction = () => {
    // Logic here
  };

  return (
    <Box>
      <Typography>{prop1}</Typography>
      {/* More JSX */}
    </Box>
  );
};
```

### Naming Conventions

- Components: PascalCase (e.g., `TimeEntryForm`)
- Functions: camelCase (e.g., `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- Files: Match component name (e.g., `TimeEntryForm.jsx`)

### State Management

- **Server State**: Use React Query
- **Global UI State**: Use Zustand
- **Local State**: Use useState/useReducer
- **Auth State**: Use AuthContext

### API Integration

Always use the API modules in `src/api/`:

```javascript
import { timeEntriesAPI } from '../api/timeEntries';

const { data } = useQuery({
  queryKey: ['time-entries'],
  queryFn: timeEntriesAPI.list,
});
```

## Making Changes

### Adding a Feature

1. **Plan the feature**
   - Write a brief description
   - Identify affected components
   - Consider UI/UX implications

2. **Implement**
   - Write the code
   - Follow coding standards
   - Add error handling
   - Add loading states

3. **Test**
   - Test manually
   - Check responsive design
   - Test error cases
   - Verify accessibility

4. **Document**
   - Update README if needed
   - Add code comments
   - Update CHANGELOG

### Bug Fixes

1. **Reproduce the bug**
2. **Identify the cause**
3. **Write a fix**
4. **Test thoroughly**
5. **Document the fix**

## Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature-name
   git rebase main
   ```

2. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template
   - Request review

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(timer): add pause functionality
fix(auth): resolve token refresh issue
docs(readme): update installation instructions
```

## Testing Guidelines

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Loading states display correctly
- [ ] Error messages are user-friendly
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Works in Chrome, Firefox, Safari

### Writing Tests

If adding tests (future enhancement):

```javascript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## UI/UX Guidelines

### Material UI Usage

- Use theme values for colors
- Use spacing scale (8px increments)
- Use Material icons
- Follow Material Design patterns

### Responsive Design

Test on:
- Mobile (320px - 480px)
- Tablet (481px - 768px)
- Desktop (769px+)

Use Material UI breakpoints:
```javascript
sx={{
  display: { xs: 'block', md: 'flex' }
}}
```

### Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen reader

## Documentation

### Code Comments

```javascript
/**
 * Formats duration in seconds to HH:MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  // Implementation
};
```

### Component Documentation

For complex components, add a comment at the top:

```javascript
/**
 * TimeEntryForm - Form for creating/editing time entries
 * 
 * Props:
 * - open: boolean - Dialog open state
 * - entry: object - Entry to edit (null for new)
 * - onSubmit: function - Callback on form submit
 * - onClose: function - Callback on dialog close
 */
```

## Questions?

- Open an issue for questions
- Check existing issues and PRs
- Review documentation

## Recognition

Contributors will be acknowledged in:
- README
- Release notes
- Contributors page (if created)

Thank you for contributing! 🎉
