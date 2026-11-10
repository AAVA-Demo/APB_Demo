/*
Test Documentation:
- Test Name: creditCardApp Module Configuration
- Purpose: Validate AngularJS module initialization, routing configuration, and authentication service initialization
- Scenario: Module loads with ngRoute dependency, routes are correctly configured, and authService.init() is called on app run
- Expected Result: All routes resolve to correct templates and controllers, default route redirects to /dashboard, authService.init() executes
*/

describe('creditCardApp Module', function() {
  beforeEach(module('creditCardApp'));

  var $route, $location, $rootScope, authService;

  beforeEach(inject(function(_$route_, _$location_, _$rootScope_, _authService_) {
    $route = _$route_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    authService = _authService_;
  }));

  describe('Module Dependencies', function() {
    it('should load ngRoute module', function() {
      expect(angular.module('creditCardApp').requires).toContain('ngRoute');
    });
  });

  describe('Route Configuration', function() {
    it('should configure /dashboard route correctly', function() {
      expect($route.routes['/dashboard']).toBeDefined();
      expect($route.routes['/dashboard'].controller).toBe('dashboardController');
      expect($route.routes['/dashboard'].controllerAs).toBe('vm');
      expect($route.routes['/dashboard'].templateUrl).toBe('src/app/modules/dashboard/views/dashboard.html');
    });

    it('should configure /cards route correctly', function() {
      expect($route.routes['/cards']).toBeDefined();
      expect($route.routes['/cards'].controller).toBe('cardManagementController');
      expect($route.routes['/cards'].controllerAs).toBe('vm');
      expect($route.routes['/cards'].templateUrl).toBe('src/app/modules/card-management/views/card-list.html');
    });

    it('should configure /cards/:cardId route correctly', function() {
      expect($route.routes['/cards/:cardId']).toBeDefined();
      expect($route.routes['/cards/:cardId'].controller).toBe('cardManagementController');
      expect($route.routes['/cards/:cardId'].controllerAs).toBe('vm');
      expect($route.routes['/cards/:cardId'].templateUrl).toBe('src/app/modules/card-management/views/card-detail.html');
    });

    it('should configure /analytics route correctly', function() {
      expect($route.routes['/analytics']).toBeDefined();
      expect($route.routes['/analytics'].controller).toBe('analyticsController');
      expect($route.routes['/analytics'].controllerAs).toBe('vm');
      expect($route.routes['/analytics'].templateUrl).toBe('src/app/modules/analytics/views/analytics.html');
    });

    it('should redirect to /dashboard for undefined routes', function() {
      expect($route.routes[null].redirectTo).toBe('/dashboard');
    });
  });

  describe('Application Run Block', function() {
    it('should call authService.init() on application start', function() {
      spyOn(authService, 'init');
      $rootScope.$digest();
      expect(authService.init).toHaveBeenCalled();
    });
  });
});

/*
Coverage Report:
- Functions tested: module configuration, route definitions, run block
- Scenarios covered: module dependencies, all route configurations, default redirect, authService initialization
- Uncovered scenarios: none - all critical paths tested
- Edge cases: undefined route handling
*/