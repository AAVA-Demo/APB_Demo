/*
Test Documentation:
- Test Name: app.config - route configuration
- Purpose: Validates application routing configuration
- Scenario: Routes are configured
- Expected Result: All routes are properly defined
*/
/*
Coverage Report:
- Functions tested: route configuration
- Scenarios covered: dashboard route, transactions route, analytics route, default route
- Uncovered scenarios: none
*/

describe('app.config', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var $route;
  
  beforeEach(inject(function(_$route_) {
    $route = _$route_;
  }));
  
  it('should define dashboard route', function() {
    expect($route.routes['/dashboard']).toBeDefined();
    expect($route.routes['/dashboard'].controller).toBe('DashboardController');
    expect($route.routes['/dashboard'].controllerAs).toBe('vm');
  });
  
  it('should define transactions route', function() {
    expect($route.routes['/transactions']).toBeDefined();
    expect($route.routes['/transactions'].controller).toBe('TransactionController');
    expect($route.routes['/transactions'].controllerAs).toBe('vm');
  });
  
  it('should define analytics route', function() {
    expect($route.routes['/analytics']).toBeDefined();
    expect($route.routes['/analytics'].controller).toBe('AnalyticsController');
    expect($route.routes['/analytics'].controllerAs).toBe('vm');
  });
  
  it('should redirect to dashboard by default', function() {
    expect($route.routes[null]).toBeDefined();
    expect($route.routes[null].redirectTo).toBe('/dashboard');
  });
});