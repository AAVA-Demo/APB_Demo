# Credit Card Management Dashboard

## Overview
AngularJS 1.7.x application for managing credit cards, viewing KPIs, and analyzing spending patterns.

## Features
- **Dashboard**: Consolidated KPI view with real-time credit utilization monitoring
- **Card Management**: Multiple credit card display and card-wise spend analysis
- **Analytics**: Category-wise spending visualization and monthly spend trend analysis

## User Stories Implemented
- QE-10261: Consolidated KPI Dashboard Display
- QE-10264: Real-Time Credit Utilization Monitoring
- QE-10262: Multiple Credit Card Display
- QE-10263: Card-Wise Spend Analysis
- QE-10260: Category-Wise Spending Visualization
- QE-10265: Monthly Spend Trend Analysis

## Setup
1. Clone repository
2. Open `index.html` with VS Code Live Server
3. Navigate to http://localhost:5500

## Architecture
- **Modules**: dashboard, card-management, analytics
- **Services**: KpiService, CardService, AnalyticsService, AuthInterceptor
- **Directives**: cardSelector, spendingChart
- **Models**: KpiModel, CardModel, SpendingModel

## API Endpoints (Mock Required)
- GET /api/dashboard/kpis
- GET /api/cards
- GET /api/cards/:cardId
- GET /api/analytics/spending

## Technologies
- AngularJS 1.7.9
- Bootstrap 3.4.1
- Chart.js 2.9.4

## Browser Support
Modern browsers (Chrome, Firefox, Safari, Edge)