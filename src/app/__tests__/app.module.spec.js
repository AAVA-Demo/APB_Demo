/*
Test Documentation:
- Test Name: creditCardApp Module Configuration
- Purpose: Validate AngularJS module registration and routing configuration
- Scenario: Module initialization and route definitions
- Expected Result: Module loads with correct dependencies and routes are properly configured
*/

describe('creditCardApp Module', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var $route, $location, $rootScope;

  beforeEach(inject(function(_$route_, _$location_, _$rootScope_) {
    $route = _$route_;
    $location = _$location_;
    $rootScope = _$rootScope_;
  }));

  it('should define creditCardApp module', function() {
    expect(angular.module('creditCardApp')).toBeDefined();
  });

  it('should have correct module dependencies', function() {
    var dependencies = angular.module('creditCardApp').requires;
    expect(dependencies).toContain('ngRoute');
    expect(dependencies).toContain('creditCard.dashboard');
    expect(dependencies).toContain('creditCard.transactions');
    expect(dependencies).toContain('creditCard.analytics');
  });

  it('should configure /dashboard route', function() {
    expect($route.routes['/dashboard']).toBeDefined();
    expect($route.routes['/dashboard'].controller).toBe('DashboardController');
    expect($route.routes['/dashboard'].controllerAs).toBe('vm');
    expect($route.routes['/dashboard'].templateUrl).toBe('src/app/modules/dashboard/views/dashboard.html');
  });

  it('should configure /transactions route', function() {
    expect($route.routes['/transactions']).toBeDefined();
    expect($route.routes['/transactions'].controller).toBe('TransactionController');
    expect($route.routes['/transactions'].controllerAs).toBe('vm');
    expect($route.routes['/transactions'].templateUrl).toBe('src/app/modules/transactions/views/transaction-view.html');
  });

  it('should configure /analytics route', function() {
    expect($route.routes['/analytics']).toBeDefined();
    expect($route.routes['/analytics'].controller).toBe('AnalyticsController');
    expect($route.routes['/analytics'].controllerAs).toBe('vm');
    expect($route.routes['/analytics'].templateUrl).toBe('src/app/modules/analytics/views/analytics-dashboard.html');
  });

  it('should redirect to /dashboard for undefined routes', function() {
    expect($route.routes[null].redirectTo).toBe('/dashboard');
  });

  it('should navigate to dashboard route', function() {
    $location.path('/dashboard');
    $rootScope.$digest();
    expect($location.path()).toBe('/dashboard');
    expect($route.current.controller).toBe('DashboardController');
  });

  it('should navigate to transactions route', function() {
    $location.path('/transactions');
    $rootScope.$digest();
    expect($location.path()).toBe('/transactions');
    expect($route.current.controller).toBe('TransactionController');
  });

  it('should navigate to analytics route', function() {
    $location.path('/analytics');
    $rootScope.$digest();
    expect($location.path()).toBe('/analytics');
    expect($route.current.controller).toBe('AnalyticsController');
  });

  it('should redirect unknown routes to dashboard', function() {
    $location.path('/unknown');
    $rootScope.$digest();
    expect($location.path()).toBe('/dashboard');
  });
});

/*
Coverage Report:
- Functions tested: module configuration, route provider setup
- Scenarios covered: module registration, dependency injection, route definitions, default redirect, navigation
- Edge cases: unknown route handling
- Uncovered scenarios: none
*/