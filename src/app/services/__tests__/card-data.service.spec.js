/*
Test Documentation:
- Test Name: CardDataService - getAllCardBalances - success scenario
- Purpose: Validates that getAllCardBalances retrieves card balance data from API successfully
- Scenario: HTTP GET request to /cards/balances returns valid data
- Expected Result: Service returns array of card balance objects with creditLimit, availableCredit, outstandingAmount
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCardBalances - API failure fallback
- Purpose: Validates that service falls back to mock data when API fails
- Scenario: HTTP GET request fails with error
- Expected Result: Service returns mock card balances array
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCardBalances - empty response handling
- Purpose: Validates that service handles empty API response
- Scenario: API returns empty or null data
- Expected Result: Service returns mock card balances
*/
/*
Coverage Report:
- Functions tested: getAllCardBalances, mockCardBalances
- Scenarios covered: successful API call, API failure, empty response handling
- Edge cases: null/undefined response data, HTTP errors
- Uncovered scenarios: network timeout (requires additional infrastructure)
*/

describe('CardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardDataService;
  var $httpBackend;
  var $q;
  var API_BASE_URL;
  
  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$q_, _API_BASE_URL_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getAllCardBalances', function() {
    
    it('should retrieve card balances successfully from API', function() {
      var mockResponse = [
        {cardId: 'card-001', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000},
        {cardId: 'card-002', creditLimit: 30000, availableCredit: 28000, outstandingAmount: 2000}
      ];
      
      $httpBackend.expectGET(API_BASE_URL + '/cards/balances').respond(200, mockResponse);
      
      var result;
      CardDataService.getAllCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card-001');
      expect(result[0].creditLimit).toBe(50000);
      expect(result[1].cardId).toBe('card-002');
    });
    
    it('should return mock data when API call fails', function() {
      $httpBackend.expectGET(API_BASE_URL + '/cards/balances').respond(500, 'Internal Server Error');
      
      var result;
      CardDataService.getAllCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card-001');
      expect(result[1].cardId).toBe('card-002');
      expect(result[2].cardId).toBe('card-003');
    });
    
    it('should return mock data when API returns null or empty response', function() {
      $httpBackend.expectGET(API_BASE_URL + '/cards/balances').respond(200, null);
      
      var result;
      CardDataService.getAllCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].creditLimit).toBe(50000);
      expect(result[1].creditLimit).toBe(30000);
      expect(result[2].creditLimit).toBe(75000);
    });
    
    it('should handle network errors gracefully', function() {
      $httpBackend.expectGET(API_BASE_URL + '/cards/balances').respond(0, '');
      
      var result;
      CardDataService.getAllCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
    
    it('should return valid card balance structure with all required fields', function() {
      var mockResponse = [{cardId: 'test-001', creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000}];
      
      $httpBackend.expectGET(API_BASE_URL + '/cards/balances').respond(200, mockResponse);
      
      var result;
      CardDataService.getAllCardBalances().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result[0]).toEqual(jasmine.objectContaining({
        cardId: jasmine.any(String),
        creditLimit: jasmine.any(Number),
        availableCredit: jasmine.any(Number),
        outstandingAmount: jasmine.any(Number)
      }));
    });
  });
});