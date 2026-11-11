/*
Test Documentation:
- Test Name: CardSummaryService - Card Summary Data Retrieval
- Purpose: Validate card summary data fetching and error handling
- Scenario: Test getCardSummaries success and error scenarios
- Expected Result: Card summaries fetched successfully or error rejected
*/

describe('CardSummaryService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.dashboard'));
  
  var CardSummaryService, $httpBackend, API_CONFIG;
  var mockSummaryData = [
    {cardName: 'Visa Gold', currentBalance: 1500, creditLimit: 5000, utilizationPercentage: 30},
    {cardName: 'MasterCard Platinum', currentBalance: 3000, creditLimit: 10000, utilizationPercentage: 30}
  ];
  
  beforeEach(inject(function(_CardSummaryService_, _$httpBackend_, _API_CONFIG_) {
    CardSummaryService = _CardSummaryService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardSummaries', function() {
    it('should fetch card summaries successfully', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/summary')
        .respond(200, mockSummaryData);
      
      var result;
      CardSummaryService.getCardSummaries().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual(mockSummaryData);
      expect(result.length).toBe(2);
    });
    
    it('should handle empty card summaries', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/summary')
        .respond(200, []);
      
      var result;
      CardSummaryService.getCardSummaries().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/summary')
        .respond(500, {error: 'Internal Server Error'});
      
      var error;
      CardSummaryService.getCardSummaries().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
    
    it('should handle network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/summary')
        .respond(0, '');
      
      var error;
      CardSummaryService.getCardSummaries().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardSummaries
- Scenarios covered: successful data fetch, empty response, API error, network error
- Edge cases: empty array response, server errors, network failures
- Uncovered scenarios: none
*/