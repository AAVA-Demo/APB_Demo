/*
Test Documentation:
- Test Name: SpendAnalyticsService - Card Spend Analytics Retrieval
- Purpose: Validate card-specific spending analytics data fetching
- Scenario: Test getCardSpend with success and error scenarios
- Expected Result: Card spend data fetched successfully or error handled
*/

describe('SpendAnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.cardManagement'));
  
  var SpendAnalyticsService, $httpBackend, API_CONFIG;
  var mockSpendData = {
    monthlySpend: 1200.50,
    lastTransactionDate: '2026-11-10T14:30:00Z',
    categoryBreakdown: [
      {category: 'Food & Dining', amount: 450.00},
      {category: 'Fuel', amount: 300.50},
      {category: 'Shopping', amount: 450.00}
    ]
  };
  
  beforeEach(inject(function(_SpendAnalyticsService_, _$httpBackend_, _API_CONFIG_) {
    SpendAnalyticsService = _SpendAnalyticsService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardSpend', function() {
    it('should fetch card spend data successfully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/1/spend')
        .respond(200, mockSpendData);
      
      var result;
      SpendAnalyticsService.getCardSpend('1').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockSpendData);
      expect(result.categoryBreakdown.length).toBe(3);
    });
    
    it('should handle card with no spending', function() {
      var emptySpendData = {
        monthlySpend: 0,
        lastTransactionDate: null,
        categoryBreakdown: []
      };
      
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/2/spend')
        .respond(200, emptySpendData);
      
      var result;
      SpendAnalyticsService.getCardSpend('2').then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result.monthlySpend).toBe(0);
      expect(result.categoryBreakdown.length).toBe(0);
    });
    
    it('should handle card not found', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/999/spend')
        .respond(404, {error: 'Card not found'});
      
      var error;
      SpendAnalyticsService.getCardSpend('999').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/1/spend')
        .respond(500, {error: 'Server Error'});
      
      var error;
      SpendAnalyticsService.getCardSpend('1').catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardSpend
- Scenarios covered: successful data fetch, empty spending data, card not found, server error
- Edge cases: zero spending, empty category breakdown, invalid card ID
- Uncovered scenarios: none
*/