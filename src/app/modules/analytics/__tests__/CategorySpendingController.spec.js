/*
Test Documentation:
- Test Name: CategorySpendingController - initialization
- Purpose: Validates controller loads category spending data
- Scenario: Controller is instantiated
- Expected Result: Category data is loaded and displayed
*/
/*
Test Documentation:
- Test Name: CategorySpendingController - filterCategory
- Purpose: Validates filtering by specific category
- Scenario: User selects a category to filter
- Expected Result: selectedCategory is set
*/
/*
Coverage Report:
- Functions tested: initialization, filterCategory, clearFilter
- Scenarios covered: data loading, filtering, error handling
- Uncovered scenarios: none
*/

describe('CategorySpendingController', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var $controller, AnalyticsService, $q, $rootScope, $scope;
  
  beforeEach(inject(function(_$controller_, _AnalyticsService_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    AnalyticsService = _AnalyticsService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));
  
  describe('initialization', function() {
    it('should load category spending data', function(done) {
      var mockData = [
        { category: 'Food & Dining', totalAmount: 500, transactionCount: 10, percentage: '50.00' },
        { category: 'Fuel', totalAmount: 300, transactionCount: 5, percentage: '30.00' }
      ];
      
      spyOn(AnalyticsService, 'getCategorySpending').and.returnValue(Promise.resolve(mockData));
      
      var vm = $controller('CategorySpendingController', {
        AnalyticsService: AnalyticsService,
        $scope: $scope
      });
      
      expect(vm.loading).toBe(true);
      
      setTimeout(function() {
        $rootScope.$digest();
        expect(vm.categoryData).toEqual(mockData);
        expect(vm.loading).toBe(false);
        expect(vm.error).toBe(null);
        done();
      }, 10);
    });
    
    it('should handle error during data load', function(done) {
      spyOn(AnalyticsService, 'getCategorySpending').and.returnValue(Promise.reject('Service Error'));
      
      var vm = $controller('CategorySpendingController', {
        AnalyticsService: AnalyticsService,
        $scope: $scope
      });
      
      setTimeout(function() {
        $rootScope.$digest();
        expect(vm.loading).toBe(false);
        expect(vm.error).toBe('Failed to load analytics data');
        done();
      }, 10);
    });
  });
  
  describe('filterCategory', function() {
    it('should set selected category', function() {
      spyOn(AnalyticsService, 'getCategorySpending').and.returnValue(Promise.resolve([]));
      
      var vm = $controller('CategorySpendingController', {
        AnalyticsService: AnalyticsService,
        $scope: $scope
      });
      
      vm.filterCategory('Food & Dining');
      expect(vm.selectedCategory).toBe('Food & Dining');
    });
  });
  
  describe('clearFilter', function() {
    it('should clear selected category', function() {
      spyOn(AnalyticsService, 'getCategorySpending').and.returnValue(Promise.resolve([]));
      
      var vm = $controller('CategorySpendingController', {
        AnalyticsService: AnalyticsService,
        $scope: $scope
      });
      
      vm.selectedCategory = 'Food & Dining';
      vm.clearFilter();
      expect(vm.selectedCategory).toBe(null);
    });
  });
});