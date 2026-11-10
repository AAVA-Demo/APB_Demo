/*
Test Documentation:
- Test Name: CategorizationService - getCategories success
- Purpose: Validates that getCategories returns category list from API
- Scenario: Service calls ApiService.get and receives categories
- Expected Result: Returns array of category names
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategories fallback to default
- Purpose: Validates fallback to predefined categories when API fails
- Scenario: ApiService.get rejects with error
- Expected Result: Returns default 9 categories
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategories with null response
- Purpose: Validates handling of null API response
- Scenario: API returns null
- Expected Result: Returns default 9 categories
*/
/*
Coverage Report:
- Functions tested: getCategories
- Scenarios covered: successful API call, error fallback to defaults, null/undefined handling, default categories
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';
  
  var CategorizationService, ApiService, $q, $rootScope;
  var defaultCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CategorizationService_, _ApiService_, _$q_, _$rootScope_) {
    CategorizationService = _CategorizationService_;
    ApiService = _ApiService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    spyOn(console, 'error');
  }));
  
  describe('getCategories', function() {
    it('should call ApiService.get with correct endpoint', function() {
      var mockCategories = ['Food & Dining', 'Fuel', 'Shopping'];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCategories));
      
      CategorizationService.getCategories();
      
      expect(ApiService.get).toHaveBeenCalledWith('/api/categories');
    });
    
    it('should return categories from API on successful call', function(done) {
      var mockCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment'];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(mockCategories));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(mockCategories);
        expect(result.length).toBe(5);
        expect(result[0]).toBe('Food & Dining');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return all 9 default categories from API', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(defaultCategories));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(result.length).toBe(9);
        expect(result).toContain('Food & Dining');
        expect(result).toContain('Fuel');
        expect(result).toContain('Shopping');
        expect(result).toContain('Travel');
        expect(result).toContain('Entertainment');
        expect(result).toContain('Utilities');
        expect(result).toContain('Healthcare');
        expect(result).toContain('Education');
        expect(result).toContain('Miscellaneous');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories when API returns null', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(null));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(result.length).toBe(9);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories when API returns undefined', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve(undefined));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(result.length).toBe(9);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories when API call fails', function(done) {
      var mockError = { status: 500, message: 'Internal Server Error' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      CategorizationService.getCategories().then(function(result) {
        expect(console.error).toHaveBeenCalledWith('Failed to fetch categories:', mockError);
        expect(result).toEqual(defaultCategories);
        expect(result.length).toBe(9);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories on 404 error', function(done) {
      var notFoundError = { status: 404, message: 'Categories not found' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(notFoundError));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(console.error).toHaveBeenCalled();
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories on network timeout', function(done) {
      var timeoutError = { status: -1, message: 'Network timeout' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(timeoutError));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(result.length).toBe(9);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should return default categories on unauthorized error', function(done) {
      var authError = { status: 401, message: 'Unauthorized' };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(authError));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(defaultCategories);
        expect(console.error).toHaveBeenCalledWith('Failed to fetch categories:', authError);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty array response from API', function(done) {
      spyOn(ApiService, 'get').and.returnValue($q.resolve([]));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle custom categories from API', function(done) {
      var customCategories = ['Custom1', 'Custom2', 'Custom3'];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(customCategories));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(customCategories);
        expect(result.length).toBe(3);
        expect(result[0]).toBe('Custom1');
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Default Categories Validation', function() {
    it('should ensure default categories contain all 9 required categories', function(done) {
      var mockError = { status: 500 };
      
      spyOn(ApiService, 'get').and.returnValue($q.reject(mockError));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result.length).toBe(9);
        expect(result.indexOf('Food & Dining')).toBeGreaterThan(-1);
        expect(result.indexOf('Fuel')).toBeGreaterThan(-1);
        expect(result.indexOf('Shopping')).toBeGreaterThan(-1);
        expect(result.indexOf('Travel')).toBeGreaterThan(-1);
        expect(result.indexOf('Entertainment')).toBeGreaterThan(-1);
        expect(result.indexOf('Utilities')).toBeGreaterThan(-1);
        expect(result.indexOf('Healthcare')).toBeGreaterThan(-1);
        expect(result.indexOf('Education')).toBeGreaterThan(-1);
        expect(result.indexOf('Miscellaneous')).toBeGreaterThan(-1);
        done();
      });
      
      $rootScope.$apply();
    });
  });
  
  describe('Edge Cases', function() {
    it('should handle malformed API response', function(done) {
      var malformedData = { categories: 'invalid' };
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(malformedData));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(malformedData);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle categories with special characters', function(done) {
      var specialCategories = ['Food & Dining', 'Travel/Transport', 'Health-Care'];
      
      spyOn(ApiService, 'get').and.returnValue($q.resolve(specialCategories));
      
      CategorizationService.getCategories().then(function(result) {
        expect(result).toEqual(specialCategories);
        expect(result[1]).toBe('Travel/Transport');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});