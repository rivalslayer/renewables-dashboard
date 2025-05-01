# Avathon Dashboard

A React-based dashboard application for monitoring and analyzing renewable energy data from wind farms. This application provides visualization and analysis of turbine data and fault events across Minneapolis and Colorado wind farms.

![Dashboard UI](./public/images/UI.png)

## Key Features

- **Wind Farm Selection**: Toggle between Minneapolis and Colorado wind farms
- **Advanced Filtering**:
  - Device Name
- **Summary Tiles**:
  - Total Alarm Duration
  - Total Count of Alarms
  - Device with Maximum Duration Alarm
  - Maximum Duration Alarm Time
- **Data Visualization**:
  - Bar Charts:
    - Top Alarms by Duration
    - Top Alarms by Frequency
  - Pie Charts:
    - Alarms by Category (Duration)
    - Alarms by Category (Frequency)
- **Interactive Data Table**:
  - Sortable columns (Start Time, Resolution Time, Category, Alarm Code)
  - Global search functionality
  - Pagination
  - Tooltips for long descriptions

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Charting Libraries**: 
  - Recharts
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Main dashboard layout
│   ├── filters/       # Wind farm and device filters
│   ├── tiles/         # Summary statistics tiles
│   ├── charts/        # Recharts visualizations
│   ├── table/         # Interactive data table
│   ├── tabs/          # Tab components
│   └── layout/        # Layout components
├── context/           # React context for state management
└── types/            # TypeScript type definitions
```

## Critical Solution Components

### 1. Data Management
- Centralized state management using React Context
- Efficient data filtering and aggregation
- Memoized calculations for performance optimization
- Device lookup optimization using Map

### 2. Visualization Architecture
- Dual-view charts (Bar and Pie) for each metric
- Responsive design with Material-UI Grid system
- Interactive tooltips and legends
- Color-coded categories for easy identification
- Summary tiles with key metrics

### 3. Performance Optimizations
- Memoized data transformations
- Efficient device lookup using Map
- Optimized re-renders using React.memo
- Responsive container sizing
- Paginated data table for large datasets

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aakashcal/renewables-dashboard.git
cd renewables-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Deployment

The application is deployed using Firebase Hosting. To deploy:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the project:
```bash
firebase init
```
   - Select "Hosting" when prompted
   - Choose your Firebase project
   - Set the public directory as `dist`
   - Configure as a single-page app
   - Don't overwrite existing `index.html`

4. Build the application:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

The application will be available at: https://renewables-dashboard.web.app

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Recharts for data visualization
- Vite for the build tool
