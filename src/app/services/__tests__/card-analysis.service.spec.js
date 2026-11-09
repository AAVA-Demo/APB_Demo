/*
Test Documentation:
- Test Name: CardAnalysisService - analyzeCards
- Purpose: Validates card-wise spending analysis and utilization calculation
- Scenario: User requests analysis for multiple cards
- Expected Result: Returns analysis data including monthlySpend, utilizationRate, and categoryBreakdown for each card
*/
/*
Coverage Report:
- Functions tested: analyzeCards
- Scenarios covered: successful API response, API failure with mock data, multiple cards analysis
- Uncovered scenarios: none
*/

describe('CardAnalysisService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardAnalysisService, $httpBackend, API_BASE_URL;
  
  beforeEach(inject(function(_CardAnalysisService_, _$httpBackend_, _API_BASE_URL_) {
    CardAnalysisService = _CardAnalysisService_;
    $httpBackend = _$httpBackend_;
    API_BASE_URL = _API_BASE_URL_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('analyzeCards', function() {
    it('should return analysis data from API', function() {
      var cardIds = ['C001', 'C002'];
      var mockResponse = [
        { cardId: 'C001', monthlySpend: 15000, utilizationRate: 45, categoryBreakdown: [{ category: 'Food & Dining', amount: 5000 }] },
        { cardId: 'C002', monthlySpend: 20000, utilizationRate: 60, categoryBreakdown: [{ category: 'Fuel', amount: 3000 }] }
      ];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/analysis?cardIds=C001,C002').respond(200, mockResponse);
      
      CardAnalysisService.analyzeCards(cardIds).then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
        expect(result[0].monthlySpend).toBe(15000);
        expect(result[1].cardId).toBe('C002');
      });
      $httpBackend.flush();
    });
    
    it('should return mock data on API failure', function() {
      var cardIds = ['C001', 'C002'];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/analysis?cardIds=C001,C002').respond(500, 'Server Error');
      
      CardAnalysisService.analyzeCards(cardIds).then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
        expect(result[0].monthlySpend).toBeGreaterThan(0);
        expect(result[0].utilizationRate).toBeGreaterThan(0);
        expect(result[0].categoryBreakdown).toBeDefined();
        expect(result[0].categoryBreakdown.length).toBeGreaterThan(0);
      });
      $httpBackend.flush();
    });
    
    it('should handle single card analysis', function() {
      var cardIds = ['C001'];
      $httpBackend.expectGET(API_BASE_URL + '/api/cards/analysis?cardIds=C001').respond(500);
      
      CardAnalysisService.analyzeCards(cardIds).then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('C001');
      });
      $httpBackend.flush();
    });
  });
});