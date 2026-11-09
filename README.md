# Credit Card Management Application

## Overview
AngularJS 1.7.x application for managing credit cards, transactions, and spending analytics.

## Features
- **Dashboard**: View all credit cards with KPIs (monthly spend, credit limit, available credit, outstanding amount)
- **Transactions**: List, search, and filter transactions across all cards
- **Analytics**: Category-wise spending visualization and monthly trend analysis

## Setup
1. Open `index.html` in VS Code Live Server or any HTTP server
2. Navigate to dashboard, transactions, or analytics views
3. Mock data is used for demonstration purposes

## Architecture
- AngularJS 1.7.9 with ngRoute
- Bootstrap 3.4.1 for responsive layout
- Chart.js 2.9.4 for data visualization
- Modular structure with services, factories, and directives

## User Stories Implemented
- QE-7613: Dashboard Interface with KPI Display
- QE-7614: Responsive Dashboard Layout Implementation
- QE-7609: Transaction Listing and Display
- QE-7612: Transaction Search and Filtering
- QE-7611: Category-wise Spending Visualization
- QE-7610: Monthly Spend Trend Analysis

## Notes
- All API calls fallback to mock data for demo purposes
- Data refresh occurs every 10 seconds on dashboard
- Responsive design supports desktop, tablet, and mobile devices