/*
Test Documentation:
- Test Name: CategoryService - getCategorySpending with valid filter
- Purpose: Validates that getCategorySpending returns properly formatted category data
- Scenario: Service is called with valid filter parameters
- Expected Result: Returns promise resolving to array of category objects

Test Documentation:
- Test Name: CategoryService - getCategorySpending with default dates
- Purpose: Validates that default date range is applied when filter has no dates
- Scenario: Service is called with empty filter object
- Expected Result: Uses last 12 months as default date range

Test Documentation:
- Test Name: CategoryService - getCategorySpending with category filter
- Purpose: Validates that selected categories are properly passed as query parameters
- Scenario: Service is called with selectedCategories array in filter
- Expected Result: Categories are joined with comma and sent as params.categories

Test Documentation:
- Test Name: CategoryService - getCategorySpending HTTP error handling
- Purpose: Validates that service properly handles HTTP errors
- Scenario: Backend returns error response
- Expected Result: Promise is rejected with error object

Test Documentation:
- Test Name: CategoryService - getCategories returns predefined categories
- Purpose: Validates that getCategories returns the correct list of expense categories
- Scenario: Service method is called
- Expected Result: Returns array of 9 predefined categories

Coverage Report:
- Functions tested: getCategorySpending, getCategories, getDefaultStartDate, getDefaultEndDate
- Scenarios covered: valid filter, default dates, category filtering, error handling, category list retrieval
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CategoryService, $httpBackend, API_CONFIG;
  
  beforeEach(inject(function(_CategoryService_, _$httpBackend_, _API_CONFIG_) {
    CategoryService = _CategoryService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCategorySpending', function() {
    it('should return category spending with valid filter', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12'
      };
      var mockResponse = [
        { category: 'Food & Dining', totalAmount: 1500.50, transactionCount: 45, percentage: 30.5, monthYear: '2023-01' },
        { category: 'Travel', totalAmount: 2500.00, transactionCount: 12, percentage: 50.8, monthYear: '2023-01' }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/category-spending?endDate=2023-12&startDate=2023-01')
        .respond(200, mockResponse);
      
      var result;
      CategoryService.getCategorySpending(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].category).toBe('Food & Dining');
      expect(result[0].totalAmount).toBe(1500.50);
      expect(result[0].transactionCount).toBe(45);
      expect(result[0].percentage).toBe(30.5);
    });
    
    it('should use default dates when filter has no dates', function() {
      var filter = {};
      var mockResponse = [];
      
      var currentDate = new Date();
      var startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      var expectedStartDate = startDate.toISOString().substring(0, 7);
      var expectedEndDate = currentDate.toISOString().substring(0, 7);
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/category-spending') > -1 && 
               url.indexOf('startDate=' + expectedStartDate) > -1 &&
               url.indexOf('endDate=' + expectedEndDate) > -1;
      }).respond(200, mockResponse);
      
      var result;
      CategoryService.getCategorySpending(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should include selected categories in request params', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12',
        selectedCategories: ['Food & Dining', 'Travel']
      };
      var mockResponse = [];
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/category-spending') > -1 && 
               url.indexOf('categories=Food+%26+Dining%2CTravel') > -1;
      }).respond(200, mockResponse);
      
      CategoryService.getCategorySpending(filter);
      $httpBackend.flush();
    });
    
    it('should not include categories param when selectedCategories is empty', function() {
      var filter = {
        startDate: '2023-01',
        endDate: '2023-12',
        selectedCategories: []
      };
      var mockResponse = [];
      
      $httpBackend.expectGET(function(url) {
        return url.indexOf('/category-spending') > -1 && 
               url.indexOf('categories=') === -1;
      }).respond(200, mockResponse);
      
      CategoryService.getCategorySpending(filter);
      $httpBackend.flush();
    });
    
    it('should handle HTTP errors gracefully', function() {
      var filter = { startDate: '2023-01', endDate: '2023-12' };
      var errorResponse = { message: 'Server error' };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/category-spending?endDate=2023-12&startDate=2023-01')
        .respond(500, errorResponse);
      
      var error;
      CategoryService.getCategorySpending(filter).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should map all response fields correctly', function() {
      var filter = { startDate: '2023-01', endDate: '2023-12' };
      var mockResponse = [
        { category: 'Shopping', totalAmount: 3000, transactionCount: 25, percentage: 60, monthYear: '2023-05' }
      ];
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.analytics + '/category-spending?endDate=2023-12&startDate=2023-01')
        .respond(200, mockResponse);
      
      var result;
      CategoryService.getCategorySpending(filter).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual({
        category: 'Shopping',
        totalAmount: 3000,
        transactionCount: 25,
        percentage: 60,
        monthYear: '2023-05'
      });
    });
  });
  
  describe('getCategories', function() {
    it('should return predefined list of categories', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBe(9);
      expect(categories).toContain('Food & Dining');
      expect(categories).toContain('Fuel');
      expect(categories).toContain('Shopping');
      expect(categories).toContain('Travel');
      expect(categories).toContain('Entertainment');
      expect(categories).toContain('Utilities');
      expect(categories).toContain('Healthcare');
      expect(categories).toContain('Education');
      expect(categories).toContain('Miscellaneous');
    });
    
    it('should return categories in correct order', function() {
      var categories = CategoryService.getCategories();
      
      expect(categories[0]).toBe('Food & Dining');
      expect(categories[1]).toBe('Fuel');
      expect(categories[2]).toBe('Shopping');
      expect(categories[8]).toBe('Miscellaneous');
    });
  });
});