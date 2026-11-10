# Credit Card Management Application

## Overview
This is a comprehensive credit card management application built with AngularJS 1.7.x that provides users with dashboard KPIs, multi-card management, and spending analytics.

## Features
- **Dashboard**: View consolidated KPIs including monthly spend, total credit limit, available credit, and outstanding amounts
- **Multi-Card Management**: Manage multiple credit cards with individual details and comparison tools
- **Spending Analytics**: Visualize spending trends and category-wise analysis with interactive charts

## Technology Stack
- AngularJS 1.7.9
- Bootstrap 3.4.1
- Chart.js 3.9.1
- HTML5/CSS3

## Installation
1. Clone the repository
2. Open `index.html` in a web browser or use VS Code Live Server
3. No build process required - pure client-side application

## Project Structure
```
/
├── index.html
├── src/
│   └── app/
│       ├── app.module.js
│       ├── app.config.js
│       ├── services/
│       ├── factories/
│       ├── models/
│       ├── dashboard/
│       ├── multi-card/
│       ├── analytics/
│       ├── components/
│       └── directives/
```

## User Stories Implemented
- QE-9278: Consolidated Credit Card KPI Dashboard
- QE-9280: Responsive Multi-Device Dashboard Access
- QE-9276: Multiple Credit Card Display Interface
- QE-9279: Card-Wise Spending Comparison Tool
- QE-9275: Monthly Spending Trend Visualization
- QE-9277: Category-Wise Spending Analysis Dashboard

## Running the Application
Simply open `index.html` in a modern web browser. For best results, use VS Code Live Server extension.

## Notes
- Mock data is used for demonstration purposes
- All paths are relative to the repository root
- Responsive design works across desktop, tablet, and mobile devices