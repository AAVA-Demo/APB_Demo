/*
Test Documentation:
- Test Name: DashboardController Unit Tests
- Purpose: Validate dashboard controller initialization, data loading, and user interactions
- Scenario: Tests authentication checks, data fetching, error handling, and refresh functionality
- Expected Result: Controller manages dashboard state correctly with proper error handling
*/

(function() {
  'use strict';
  
  describe('DashboardController', function() {
    var $controller, $scope, DashboardApiService, AuthService, $q, $rootScope;
    var controller;
    
    beforeEach(module('dashboardModule'));
    beforeEach(module('creditCardApp'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      
      DashboardApiService = {
        fetchDashboardData: jasmine.createSpy('fetchDashboardData')
      };
      
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated')
      };
    }));
    
    describe('initialization', function() {
      it('should initialize with loading state', function() {
        AuthService.isAuthenticated.and.returnValue(false);
        controller = $controller('DashboardController', {
          $scope: $scope,
          DashboardApiService: DashboardApiService,
          AuthService: AuthService
        });
        
        expect(controller.loading).toBe(false);
        expect(controller.error).toBe('Please authenticate to view dashboard');
      });
      
      it('should fetch dashboard data when authenticated', function() {
        var mockKpis = {monthlySpend: 5000, totalCreditLimit: 100000};
        AuthService.isAuthenticated.and.returnValue(true);
        DashboardApiService.fetchDashboardData.and.returnValue($q.resolve(mockKpis));
        
        controller = $controller('DashboardController', {
          $scope: $scope,
          DashboardApiService: DashboardApiService,
          AuthService: AuthService
        });
        
        $rootScope.$digest();
        expect(controller.kpis).toEqual(mockKpis);
        expect(controller.loading).toBe(false);
      });
      
      it('should set error message when data fetch fails', function() {
        AuthService.isAuthenticated.and.returnValue(true);
        DashboardApiService.fetchDashboardData.and.returnValue($q.reject('Error'));
        
        controller = $controller('DashboardController', {
          $scope: $scope,
          DashboardApiService: DashboardApiService,
          AuthService: AuthService
        });
        
        $rootScope.$digest();
        expect(controller.error).toBe('Failed to load dashboard data');
        expect(controller.loading).toBe(false);
      });
    });
    
    describe('refreshData()', function() {
      beforeEach(function() {
        AuthService.isAuthenticated.and.returnValue(true);
        DashboardApiService.fetchDashboardData.and.returnValue($q.resolve({}));
        
        controller = $controller('DashboardController', {
          $scope: $scope,
          DashboardApiService: DashboardApiService,
          AuthService: AuthService
        });
        $rootScope.$digest();
      });
      
      it('should reset loading state and fetch data again', function() {
        controller.refreshData();
        expect(controller.loading).toBe(true);
        expect(controller.error).toBeNull();
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: init, refreshData
- Scenarios covered:
  * Unauthenticated user handling
  * Successful data loading
  * Error handling on data fetch failure
  * Refresh functionality
  * Loading state management
- Uncovered scenarios: Multiple rapid refresh calls, concurrent data fetches
*/