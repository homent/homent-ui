# homent-ui

A modern web application built with React Router, Vite, and Tailwind CSS.

## Technologies Used

- **Frontend Framework**: React 18, Next.js
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **UI Libraries**: Chakra UI, Lucide React, Recharts
- **State Management**: Zustand, TanStack React Query
- **Forms**: React Hook Form with Yup validation
- **Maps**: React Leaflet, React Google Maps
- **Authentication**: Auth.js (@auth/core)
- **Database**: Neon Database (serverless)
- **Server**: Hono
- **Testing**: Vitest, Testing Library
- **Other**: PDF.js, React Markdown, etc.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd homent-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## Building for Production

To build the project for production:

```bash
npm run build
```

## Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

## Testing

Run tests with Vitest:

```bash
npm test
```

## Project Structure

- `src/`: Source code
  - `app/`: Application pages and routes
  - `components/`: Reusable components
  - `utils/`: Utility functions
  - `client-integrations/`: Third-party integrations
- `plugins/`: Vite plugins
- `test/`: Test files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

[Add license information here]
