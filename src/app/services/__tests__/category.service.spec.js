/*
Test Documentation:
- Test Name: CategoryService - getCategories success
- Purpose: Validates that getCategories retrieves category list successfully
- Scenario: Service is called and API returns category data
- Expected Result: Returns array of categories with name and color properties
*/
/*
Test Documentation:
- Test Name: CategoryService - getCategories with API failure
- Purpose: Validates that service returns default categories when API fails
- Scenario: API returns 404 or network error
- Expected Result: Service returns predefined list of 9 categories
*/
/*
Coverage Report:
- Functions tested: getCategories
- Scenarios covered: successful API call, error handling with default data fallback
- Uncovered scenarios: network timeout, partial response
*/

describe('CategoryService', function() {
  'use strict';
  
  beforeEach(module('app.analytics'));
  
  var CategoryService, $httpBackend, $q;
  
  beforeEach(inject(function(_CategoryService_, _$httpBackend_, _$q_) {
    CategoryService = _CategoryService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCategories', function() {
    it('should retrieve categories successfully from API', function() {
      var mockResponse = [
        {name: 'Food & Dining', color: '#FF6384'},
        {name: 'Fuel', color: '#36A2EB'},
        {name: 'Shopping', color: '#FFCE56'}
      ];
      
      $httpBackend.expectGET('/api/categories').respond(200, mockResponse);
      
      var result;
      CategoryService.getCategories().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Food & Dining');
      expect(result[0].color).toBe('#FF6384');
    });
    
    it('should return default categories when API returns 404', function() {
      $httpBackend.expectGET('/api/categories').respond(404);
      
      var result;
      CategoryService.getCategories().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(9);
      expect(result[0].name).toBe('Food & Dining');
      expect(result[1].name).toBe('Fuel');
      expect(result[2].name).toBe('Shopping');
    });
    
    it('should return default categories when network fails', function() {
      $httpBackend.expectGET('/api/categories').respond(-1);
      
      var result;
      CategoryService.getCategories().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(9);
    });
  });
});