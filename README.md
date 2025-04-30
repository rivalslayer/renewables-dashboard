# Avathon Dashboard

A React-based dashboard application for monitoring and analyzing renewable energy data from wind farms. This application provides real-time visualization and analysis of turbine data and fault events across multiple wind farms.

## Features

- Wind farm selection between Minneapolis and Colorado
- Advanced filtering capabilities for:
  - Device Name
  - Time Range
  - Fault Type
  - Fault Code
- Summary tiles showing critical alarm metrics
- Data visualization:
  - Top 10 Alarms by Duration (Bar Chart)
  - Top 10 Alarms by Frequency (Bar Chart)
  - Alarms by Category - Duration (Pie Chart)
  - Alarms by Category - Frequency (Pie Chart)
- Interactive data table with sorting and filtering capabilities
- Heat maps for Top 10 alarms (Bonus feature)
- Individual turbine filtering (Bonus feature)

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Charting Libraries**: 
  - Highcharts
  - Recharts
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/avathon-dashboard.git
cd avathon-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Main dashboard layout
│   ├── filters/       # Wind farm and alarm filters
│   ├── tiles/         # Summary statistics tiles
│   ├── charts/        # Highcharts and Recharts visualizations
│   └── table/         # Interactive data table
├── context/           # React context for state management
├── assets/            # Static assets and images
└── App.tsx            # Root component
```

## Data Sources

The application processes two main data sources:
- `device.json`: Contains device information across Minneapolis and Colorado wind farms
- `fault.json`: Contains detailed fault events and their metrics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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
- Highcharts and Recharts for data visualization
- Vite for the build tool
