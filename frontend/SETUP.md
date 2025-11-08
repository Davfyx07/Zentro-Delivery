# Frontend Setup Requirements

## Required Software

### Node.js & npm
- **Version**: Node.js 18.x or higher
- **Download**: https://nodejs.org/
- **Verify installation**:
  ```bash
  node --version
  npm --version
  ```

### Git
- **Download**: https://git-scm.com/downloads
- **Verify**: `git --version`

## Installation Steps

### 1. Clone & Navigate
```bash
git clone https://github.com/Davfyx07/Zentro-Restaurant.git
cd Zentro-Restaurant/frontend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all packages from `package.json`:
- react ^19.0.0
- react-dom ^19.0.0
- next ^15.0.0
- typescript ^5
- tailwindcss ^3.4.1
- eslint ^8
- And all other dependencies

### 3. Environment Variables
Create `.env.local` file in `/frontend`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 4. Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

## Optional Packages

### For API Integration
```bash
npm install axios
npm install @tanstack/react-query
```

### For State Management
```bash
npm install zustand
# or
npm install redux @reduxjs/toolkit react-redux
```

### UI Component Libraries

#### Option 1: Material-UI (if following tutorial)
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-date-pickers
```

#### Option 2: shadcn/ui (modern alternative)
```bash
npx shadcn@latest init
```

#### Option 3: Additional UI Libraries
```bash
# Headless UI (works great with Tailwind)
npm install @headlessui/react

# Radix UI (primitive components)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

### Form Management
```bash
npm install react-hook-form
npm install zod  # for validation
```

### Routing (already included in Next.js)
Next.js has built-in file-based routing

### Icons
```bash
npm install lucide-react  # Modern icon library
# or
npm install react-icons   # Large collection
```

### Date/Time
```bash
npm install date-fns  # or moment.js
```

### Image Upload
```bash
npm install react-dropzone
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Troubleshooting

### Clear cache and reinstall
```bash
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

### Port already in use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### TypeScript errors
```bash
npm run build
```

## Production Build

```bash
npm run build
npm run start
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect GitHub repo to Vercel dashboard: https://vercel.com/
