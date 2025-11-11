# Deployment Guide

This guide covers deploying the Cognitive Time Tracker frontend to various platforms.

## Prerequisites

- Built application (`npm run build` creates `dist/` folder)
- Backend API deployed and accessible
- Environment variables configured

## Environment Configuration

### Production Environment Variables

Update your production `.env` file:

```env
VITE_API_BASE_URL=https://your-api-domain.com
```

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment with automatic CI/CD.

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configuration (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_API_BASE_URL": "https://your-api.com"
  }
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Configuration (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_BASE_URL = "https://your-api.com"
```

### Option 3: AWS S3 + CloudFront

1. **Build the application:**
```bash
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://your-app-name
aws s3 website s3://your-app-name --index-document index.html
```

3. **Upload files:**
```bash
aws s3 sync dist/ s3://your-app-name
```

4. **Set up CloudFront distribution:**
   - Point to S3 bucket
   - Configure SSL certificate
   - Set error pages to redirect to `/index.html`

### Option 4: Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional if not using CORS)
    location /api {
        proxy_pass https://your-backend-api.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Build and run:**
```bash
docker build -t time-tracker-frontend .
docker run -p 80:80 time-tracker-frontend
```

### Option 5: GitHub Pages

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Update `package.json`:**
```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Deploy:**
```bash
npm run deploy
```

4. **Update `vite.config.js`:**
```javascript
export default defineConfig({
  base: '/repo-name/',
  // ... rest of config
})
```

## Post-Deployment Checklist

- [ ] Verify environment variables are set
- [ ] Test authentication flow
- [ ] Check API connectivity
- [ ] Verify all pages load correctly
- [ ] Test responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test file uploads
- [ ] Verify AI chat functionality
- [ ] Test timer functionality
- [ ] Check HTTPS/SSL certificate
- [ ] Set up monitoring (Sentry, LogRocket, etc.)

## Monitoring and Analytics

### Sentry (Error Tracking)

```bash
npm install @sentry/react @sentry/tracing
```

**Add to `main.jsx`:**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Google Analytics

```bash
npm install react-ga4
```

## Performance Optimization

### Code Splitting

Already implemented with React.lazy for routes. Consider adding more:

```javascript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

### Bundle Analysis

```bash
npm install --save-dev rollup-plugin-visualizer
```

Add to `vite.config.js`:
```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ],
});
```

## CORS Configuration

If you encounter CORS issues, ensure your backend allows requests from your frontend domain:

```javascript
// Backend CORS config example
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## SSL/HTTPS

Always use HTTPS in production for:
- Security
- HttpOnly cookies to work properly
- Service workers (PWA)

Most platforms (Vercel, Netlify) provide free SSL automatically.

## CDN Configuration

For better performance, use a CDN:
- CloudFlare
- AWS CloudFront
- Fastly

## Rollback Strategy

Keep previous deployment artifacts:
```bash
# Tag releases
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Rollback if needed
git checkout v1.0.0
npm run build
# Deploy
```

## Troubleshooting

### Build fails
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify all environment variables

### API not connecting
- Check CORS configuration
- Verify API URL in environment
- Check browser console for errors

### White screen on deployment
- Check browser console
- Verify `base` path in vite.config.js
- Check routing configuration

### Cookies not working
- Ensure both frontend and backend use HTTPS
- Check `sameSite` cookie attribute
- Verify domain configuration

## Support

For deployment issues:
1. Check build logs
2. Review browser console
3. Test API endpoints with curl/Postman
4. Verify environment variables
5. Check platform-specific documentation

---

**Happy Deploying! 🚀**
