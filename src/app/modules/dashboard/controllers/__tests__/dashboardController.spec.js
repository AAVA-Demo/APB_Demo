/*
Test Documentation:
- Test Name: DashboardController Unit Tests
- Purpose: Validate dashboard controller initialization, data loading, error handling, and retry logic
- Scenario: Test controller initialization, successful data load, error scenarios, and retry functionality
- Expected Result: Proper scope initialization, correct data binding, and error handling
*/

describe('DashboardController', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  beforeEach(module('creditCardApp'));
  
  var $controller, $scope, $q, $rootScope;
  var mockDashboardAggregationService, mockAuthService;
  var mockDashboardData;
  
  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
    
    mockDashboardData = {
      kpis: {
        monthlySpend: 1500,
        totalCreditLimit: 25000,
        availableCredit: 23500,
        outstandingAmount: 1500
      },
      cards: [
        { id: 'card1', cardName: 'Visa', creditLimit: 10000 },
        { id: 'card2', cardName: 'Mastercard', creditLimit: 15000 }
      ]
    };
    
    mockDashboardAggregationService = {
      getDashboardData: jasmine.createSpy('getDashboardData').and.returnValue($q.resolve(mockDashboardData))
    };
    
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue($q.resolve({ userId: 'user123' }))
    };
  }));
  
  describe('initialization', function() {
    it('should initialize scope variables', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      expect($scope.loading).toBe(true);
      expect($scope.error).toBe(null);
      expect($scope.kpis).toEqual([]);
      expect($scope.cards).toEqual([]);
    });
    
    it('should load dashboard data on initialization', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
      expect(mockDashboardAggregationService.getDashboardData).toHaveBeenCalledWith('user123');
    });
  });
  
  describe('successful data load', function() {
    it('should populate KPIs correctly', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect($scope.kpis.length).toBe(4);
      expect($scope.kpis[0].label).toBe('Monthly Spend');
      expect($scope.kpis[0].value).toBe(1500);
      expect($scope.kpis[0].format).toBe('currency');
      expect($scope.kpis[1].label).toBe('Total Credit Limit');
      expect($scope.kpis[2].label).toBe('Available Credit');
      expect($scope.kpis[3].label).toBe('Outstanding Amount');
    });
    
    it('should populate cards array', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect($scope.cards).toEqual(mockDashboardData.cards);
      expect($scope.cards.length).toBe(2);
    });
    
    it('should set loading to false after successful load', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect($scope.loading).toBe(false);
      expect($scope.error).toBe(null);
    });
  });
  
  describe('error handling', function() {
    it('should handle authentication errors', function() {
      mockAuthService.getCurrentUser.and.returnValue($q.reject('Auth failed'));
      
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect($scope.error).toBe('Failed to load dashboard data. Please try again.');
      expect($scope.loading).toBe(false);
    });
    
    it('should handle dashboard data fetch errors', function() {
      mockDashboardAggregationService.getDashboardData.and.returnValue($q.reject('API Error'));
      
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      
      expect($scope.error).toBe('Failed to load dashboard data. Please try again.');
      expect($scope.loading).toBe(false);
    });
  });
  
  describe('retry functionality', function() {
    it('should define retry function', function() {
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      expect($scope.retry).toBeDefined();
      expect(typeof $scope.retry).toBe('function');
    });
    
    it('should reload dashboard data on retry', function() {
      mockDashboardAggregationService.getDashboardData.and.returnValue($q.reject('Error'));
      
      $controller('DashboardController', {
        $scope: $scope,
        DashboardAggregationService: mockDashboardAggregationService,
        AuthService: mockAuthService
      });
      
      $rootScope.$apply();
      expect($scope.error).not.toBe(null);
      
      mockDashboardAggregationService.getDashboardData.and.returnValue($q.resolve(mockDashboardData));
      $scope.retry();
      $rootScope.$apply();
      
      expect($scope.error).toBe(null);
      expect($scope.loading).toBe(false);
      expect($scope.kpis.length).toBe(4);
    });
  });
});

/*
Coverage Report:
- Functions tested: Controller initialization, loadDashboard, retry
- Scenarios covered:
  * Initial scope setup
  * Successful data loading
  * KPI population
  * Cards array population
  * Authentication errors
  * Dashboard data fetch errors
  * Retry functionality
- Edge cases: Error states, retry after failure
- Uncovered scenarios: Multiple retry attempts, concurrent data loads, cache invalidation
*/