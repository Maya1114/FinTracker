# Finance Tracker – Personal Financial Management Application

## Project Description

A comprehensive personal finance tracking web application that helps users monitor their income, expenses, and financial patterns through an intuitive dashboard with data visualization and AI-powered receipt processing.

## Core Features

### Financial Management

- **Transaction Tracking**: Add, edit, and categorize income and expense transactions
- **Recurring Transactions**: Set up automatic recurring payments and income streams
- **Receipt Upload & Processing**: Upload receipt images for automatic transaction extraction (AI-powered)
- **Multi-category Support**: Organize transactions by categories (Food, Transportation, Entertainment, etc.)

### Analytics & Insights

- **Interactive Dashboard**: Real-time financial overview with visual charts and graphs
- **Spending Trends**: Monthly and weekly spending analysis with trend indicators
- **Category Analysis**: Breakdown of expenses by category with detailed insights
- **Cash Flow Visualization**: Income vs. expenses tracking over time
- **Daily Average Calculations**: Smart daily spending averages based on transaction dates
- **Financial Statistics**: Balance tracking, monthly/weekly summaries, and historical comparisons

### Data Visualization

- **Charts**: Line charts for spending trends, bar charts for category analysis, area charts for cash flow
- **Interactive Tooltips**: Detailed information on hover
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Time Filtering**: View data for 7 days, 30 days, 90 days, or 1 year periods

### User Experience

- **Authentication System**: Secure user registration and login
- **Protected Routes**: User-specific data access and privacy
- **Landing Page**: Feature showcase for potential users
- **Modern UI**: Glass-morphism design with smooth animations and dark theme
- **Responsive Layout**: Mobile-first design approach

## Technical Specifications

### Frontend Stack

- React 18 with TypeScript
- Vite for fast builds
- Tailwind CSS with a custom design system
- Radix UI components for accessibility
- React Hook Form + Zod validation
- Recharts for data visualization
- React Router for navigation

### Backend & Database

- Supabase (Backend-as-a-Service)
- PostgreSQL with Row Level Security (RLS)
- Real-time subscriptions for live data updates
- Authentication with email/password

### Key Dependencies

- `@supabase/supabase-js` – Database and auth integration
- `@tanstack/react-query` – Data fetching and caching
- `recharts` – Chart visualization
- `lucide-react` – Icon library
- `date-fns` – Date utilities

### Database Schema

- **Users**: Authentication and profile management
- **Transactions**: Records with categories, amounts, and dates
- **Recurring Transactions**: Automated income/expense setup

### Security Features

- Row Level Security (RLS) for strict data isolation
- User-specific access controls
- Secure authentication flow
- Protected API endpoints

### Performance Features

- Lazy loading and code splitting
- Optimized chart rendering
- Efficient data filtering and aggregation
- Responsive image handling for receipts

## Development & Deployment

- **Local Development**:
  ```sh
  npm run dev
  ```
- **Production Build**:
  ```sh
  npm run build
  ```
- **Deployment**:
  Can be deployed to providers like Vercel, Netlify, or any platform supporting modern React apps.

### Who Is This For?

- This application is perfect for individuals who want to:
- Take control of their personal finances
- Understand their spending patterns
- Track financial goals and budgets
- Simplify expense tracking with receipt scanning
- Visualize their financial health over time
