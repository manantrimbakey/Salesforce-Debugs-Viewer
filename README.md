# Salesforce Log Viewer

A modern web application for viewing and managing Salesforce debug logs with an enhanced user experience. Built with React, TypeScript, and Express.js.

## Features

- 🔍 Real-time log viewing and filtering
- 👤 User-specific log filtering
- 🌐 Direct integration with Salesforce CLI
- 🎨 Dark/Light theme support
- 📊 Detailed log analysis
- 🔄 Auto-refresh capabilities
- 💾 Session storage for better performance

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
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Configuration

1. Ensure you have authenticated with your Salesforce org using Salesforce CLI:
```bash
sf org login web
```

2. The application will automatically detect your Salesforce project path and credentials.

## Usage

1. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm run dev
```

2. Open your browser and navigate to `http://localhost:1212`

3. Enter your SFDX project path to connect to your Salesforce org

4. View and filter logs by:
   - User
   - Date
   - Log size
   - Method name

## Architecture

- **Frontend**: React + TypeScript + Material-UI
- **Backend**: Express.js + TypeScript
- **Authentication**: Salesforce CLI integration
- **State Management**: React hooks
- **Styling**: Material-UI components

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── expressServer/
│   │   ├── sfUtils/
│   │   ├── utils/
│   │   └── index.ts
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Salesforce CLI for the integration capabilities
- React community for the excellent tooling
