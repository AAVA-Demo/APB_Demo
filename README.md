# Credit Card Dashboard Application

## Overview
This is a complete AngularJS 1.7.x application implementing a Credit Card Dashboard with KPIs, Analytics, and Transaction Management.

## Features
- **Dashboard**: Real-time KPIs (monthly spend, credit limit, available credit, outstanding amount)
- **Analytics**: Category-wise spending visualization with interactive charts
- **Transactions**: Paginated transaction list with search and filtering

## Tech Stack
- AngularJS 1.7.9
- Bootstrap 3.4.1
- Chart.js 2.9.4
- Angular-Chart.js 1.1.1

## Setup
1. Clone the repository
2. Open `index.html` in a browser using VS Code Live Server or any local web server
3. Ensure API endpoints are configured in `src/app/app.config.js`

## Project Structure
```
/
├── index.html
├── src/
│   └── app/
│       ├── app.module.js
│       ├── app.config.js
│       ├── styles/
│       ├── shared/
│       │   └── interceptors/
│       ├── services/
│       ├── dashboard/
│       ├── analytics/
│       └── transaction/
```

## User Stories Implemented
- QE-8852: Dashboard KPIs Real-Time Display
- QE-8853: Responsive Multi-Card Portfolio View
- QE-8854: Category-Wise Spending Visualization
- QE-8856: Monthly Spend Trend Analysis
- QE-8857: Transaction Listing and Detail View
- QE-8855: Transaction Search and Filtering

## Notes
- All paths follow the mandatory `src/app/` prefix
- Services are located in `src/app/services/` as per default convention
- Module-specific components are organized under their respective module folders
- Authentication is handled via JWT token stored in localStorage
- Real-time updates poll every 30 seconds
