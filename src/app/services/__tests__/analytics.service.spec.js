/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending success
- Purpose: Validates that getCategorySpending returns category spending data successfully
- Scenario: Service calls ApiService.get with correct parameters and returns data
- Expected Result: Returns array of category spending data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getCategorySpending error handling
- Purpose: Validates error handling when API call fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns rejected promise and logs error
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends success
- Purpose: Validates that getMonthlyTrends returns monthly trend data successfully
- Scenario: Service calls ApiService.get with correct parameters and returns data
- Expected Result: Returns array of monthly trend data
*/
/*
Test Documentation:
- Test Name: AnalyticsService - getMonthlyTrends error handling
- Purpose: Validates error handling when API call fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns rejected promise and logs error
*/
/*
Coverage Report:
- Functions tested: getCategorySpending, getMonthlyTrends
- Scenarios covered: successful data retrieval, error handling, empty data handling
- Uncovered scenarios: none
*/

describe('AnalyticsService', function() {
  'use strict';
  
  var AnalyticsService, ApiService, $q, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_AnalyticsService_, _ApiService_, _$q_, _$rootScope_) {
    AnalyticsService = _AnalyticsService_;
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(console, 'error');
  }));
  
  describe('getCategorySpending', function() {
    it('should call ApiService.get with correct endpoint and filter parameters', function() {
      var mockFilter = { startDate: '2023-01-01', endDate: '2023-12-31', selectedCards: ['card1'] };
      var mockResponse = [{ category: 'Food & Dining', totalAmount: 500 }];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getCategorySpending(mockFilter);
      
      expect(ApiService.get).toHaveBeenCalledWith('/api/analytics/category', mockFilter);
    });
    
    it('should return category spending data on successful API call', function(done) {
      var mockFilter = { startDate: '2023-01-01', endDate: '2023-12-31' };
      var mockResponse = [
        { category: 'Food & Dining', totalAmount: 500 },
        { category: 'Fuel', totalAmount: 200 },
        { category: 'Shopping', totalAmount: 800 }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getCategorySpending(mockFilter).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns null or undefined', function(done) {
      var mockFilter = {};
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(null));
      
      AnalyticsService.getCategorySpending(mockFilter).then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle API errors and log error message', function(done) {
      var mockFilter = { startDate: '2023-01-01' };
      var mockError = { status: 500, message: 'Internal Server Error' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      AnalyticsService.getCategorySpending(mockFilter).catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch category spending:', mockError);
        expect(error).toEqual(mockError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle network timeout errors', function(done) {
      var mockFilter = {};
      var timeoutError = { status: -1, message: 'Network timeout' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(timeoutError));
      
      AnalyticsService.getCategorySpending(mockFilter).catch(function(error) {
        expect(error.status).toBe(-1);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('getMonthlyTrends', function() {
    it('should call ApiService.get with correct endpoint and filter parameters', function() {
      var mockFilter = { startDate: '2023-01-01', endDate: '2023-12-31', selectedCards: ['card1'] };
      var mockResponse = [{ month: 'January', totalSpend: 1500 }];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getMonthlyTrends(mockFilter);
      
      expect(ApiService.get).toHaveBeenCalledWith('/api/analytics/trends', mockFilter);
    });
    
    it('should return monthly trend data on successful API call', function(done) {
      var mockFilter = { startDate: '2023-01-01', endDate: '2023-12-31' };
      var mockResponse = [
        { month: 'January', totalSpend: 1500 },
        { month: 'February', totalSpend: 1800 },
        { month: 'March', totalSpend: 1200 }
      ];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getMonthlyTrends(mockFilter).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(3);
        expect(result[0].month).toBe('January');
        expect(result[0].totalSpend).toBe(1500);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return empty array when API returns null or undefined', function(done) {
      var mockFilter = {};
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(undefined));
      
      AnalyticsService.getMonthlyTrends(mockFilter).then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle API errors and log error message', function(done) {
      var mockFilter = { startDate: '2023-01-01' };
      var mockError = { status: 404, message: 'Not Found' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      AnalyticsService.getMonthlyTrends(mockFilter).catch(function(error) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch monthly trends:', mockError);
        expect(error).toEqual(mockError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle unauthorized access errors', function(done) {
      var mockFilter = {};
      var authError = { status: 401, message: 'Unauthorized' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(authError));
      
      AnalyticsService.getMonthlyTrends(mockFilter).catch(function(error) {
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle empty filter object for getCategorySpending', function(done) {
      var emptyFilter = {};
      var mockResponse = [];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getCategorySpending(emptyFilter).then(function(result) {
        expect(result).toEqual([]);
        expect(ApiService.get).toHaveBeenCalledWith('/api/analytics/category', emptyFilter);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty filter object for getMonthlyTrends', function(done) {
      var emptyFilter = {};
      var mockResponse = [];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockResponse));
      
      AnalyticsService.getMonthlyTrends(emptyFilter).then(function(result) {
        expect(result).toEqual([]);
        expect(ApiService.get).toHaveBeenCalledWith('/api/analytics/trends', emptyFilter);
        done();
      });
      
      $rootScope.$apply();
    });
  });
});