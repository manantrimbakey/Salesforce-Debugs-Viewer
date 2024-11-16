# Salesforce Log Viewer

A modern web application for viewing and managing Salesforce debug logs with an enhanced user experience. Built with React, TypeScript, and Express.js.

## Features

- 🔍 Real-time log viewing and filtering
- 👤 User-specific log filtering
- 🌐 Direct integration with Salesforce CLI
- 🎨 Dark/Light theme support
- 📊 MOST IMPORTANTLY: It shows which method has started the log creation

## Prerequisites

- Node.js (v14 or higher)
- Salesforce CLI (sf) installed and configured
- Valid Salesforce org with appropriate permissions

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend and frontend dependencies
npm install
cd frontend && npm install
```

3. Build the frontend and backend:
```bash
npm run build
```

## Usage
1. Start the server:
```bash
npm run build
node build/backend/server.js
```

2. Open the application in your browser:
```bash
http://localhost:4000
```

3. Open the Salesforce Project where any org has already been authorized by its path.