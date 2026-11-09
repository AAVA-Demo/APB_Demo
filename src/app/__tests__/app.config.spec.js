/*
Test Documentation:
- Test Name: creditCardApp routing configuration
- Purpose: Verify application routes are properly configured
- Scenario: Routes defined for dashboard, cards, and analytics
- Expected Result: All routes should be configured with correct templates and controllers
*/

describe('creditCardApp Config', function() {
  'use strict';

  var $route;
  var $location;
  var $rootScope;

  beforeEach(module('creditCardApp'));
  beforeEach(module('dashboardModule'));
  beforeEach(module('cardManagementModule'));
  beforeEach(module('analyticsModule'));

  beforeEach(inject(function(_$route_, _$location_, _$rootScope_) {
    $route = _$route_;
    $location = _$location_;
    $rootScope = _$rootScope_;
  }));

  /*
  Test Documentation:
  - Test Name: should redirect root to dashboard
  - Purpose: Verify default route redirects to dashboard
  - Scenario: Navigate to root path
  - Expected Result: Should redirect to /dashboard
  */
  it('should redirect root to dashboard', function() {
    expect($route.routes['/'].redirectTo).toBe('/dashboard');
  });

  /*
  Test Documentation:
  - Test Name: should have dashboard route configured
  - Purpose: Verify dashboard route exists with correct configuration
  - Scenario: Check /dashboard route
  - Expected Result: Route should have correct template and controller
  */
  it('should have dashboard route configured', function() {
    expect($route.routes['/dashboard']).toBeDefined();
    expect($route.routes['/dashboard'].controller).toBe('DashboardController');
    expect($route.routes['/dashboard'].controllerAs).toBe('vm');
    expect($route.routes['/dashboard'].templateUrl).toBe('src/app/modules/dashboard/views/dashboard.html');
  });

  /*
  Test Documentation:
  - Test Name: should have cards list route configured
  - Purpose: Verify cards list route exists
  - Scenario: Check /cards route
  - Expected Result: Route should have correct template and controller
  */
  it('should have cards list route configured', function() {
    expect($route.routes['/cards']).toBeDefined();
    expect($route.routes['/cards'].controller).toBe('CardListController');
    expect($route.routes['/cards'].controllerAs).toBe('vm');
    expect($route.routes['/cards'].templateUrl).toBe('src/app/modules/card-management/views/card-list.html');
  });

  /*
  Test Documentation:
  - Test Name: should have card detail route with parameter
  - Purpose: Verify card detail route supports cardId parameter
  - Scenario: Check /cards/:cardId route
  - Expected Result: Route should have correct template and controller
  */
  it('should have card detail route with parameter', function() {
    expect($route.routes['/cards/:cardId']).toBeDefined();
    expect($route.routes['/cards/:cardId'].controller).toBe('CardDetailController');
    expect($route.routes['/cards/:cardId'].controllerAs).toBe('vm');
    expect($route.routes['/cards/:cardId'].templateUrl).toBe('src/app/modules/card-management/views/card-detail.html');
  });

  /*
  Test Documentation:
  - Test Name: should have analytics route configured
  - Purpose: Verify analytics route exists
  - Scenario: Check /analytics route
  - Expected Result: Route should have correct template and controller
  */
  it('should have analytics route configured', function() {
    expect($route.routes['/analytics']).toBeDefined();
    expect($route.routes['/analytics'].controller).toBe('AnalyticsController');
    expect($route.routes['/analytics'].controllerAs).toBe('vm');
    expect($route.routes['/analytics'].templateUrl).toBe('src/app/modules/analytics/views/analytics-dashboard.html');
  });

  /*
  Test Documentation:
  - Test Name: should redirect to root for undefined routes
  - Purpose: Verify otherwise clause redirects to root
  - Scenario: Navigate to undefined route
  - Expected Result: Should redirect to /
  */
  it('should redirect to root for undefined routes', function() {
    expect($route.routes[null].redirectTo).toBe('/');
  });
});

/*
Coverage Report:
- Functions tested: route configuration
- Scenarios covered: all route definitions, redirects, controller and template mappings
- Uncovered scenarios: none (all routes tested)
*/