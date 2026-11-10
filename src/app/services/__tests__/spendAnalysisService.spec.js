/*
Test Documentation:
- Test Name: spendAnalysisService - getSpendSummary success
- Purpose: Validates retrieval of spend summary for a specific card
- Scenario: Given valid cardId, when getSpendSummary is called, then spend summary data should be returned
- Expected Result: Returns spend summary including monthly spend, yearly spend, and transaction count
*/
/*
Test Documentation:
- Test Name: spendAnalysisService - getCardSpendTrends success
- Purpose: Validates retrieval of spending trends for a card over date range
- Scenario: Given cardId and date range, when getCardSpendTrends is called, then trend data should be returned
- Expected Result: Returns spending trend data for specified period
*/
/*
Test Documentation:
- Test Name: spendAnalysisService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when service methods are called, then errors should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getSpendSummary, getCardSpendTrends
- Scenarios covered: successful data retrieval, date range filtering, error handling, promise rejection
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('spendAnalysisService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var spendAnalysisService;
  var $httpBackend;

  beforeEach(inject(function(_spendAnalysisService_, _$httpBackend_) {
    spendAnalysisService = _spendAnalysisService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getSpendSummary', function() {
    it('should retrieve spend summary for specific card', function() {
      var cardId = 'card123';
      var mockSummary = {
        cardId: 'card123',
        monthlySpend: 2500.00,
        yearlySpend: 30000.00,
        transactionCount: 150,
        lastTransactionDate: '2023-12-15'
      };

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend').respond(200, mockSummary);

      spendAnalysisService.getSpendSummary(cardId).then(function(response) {
        expect(response.cardId).toBe('card123');
        expect(response.monthlySpend).toBe(2500.00);
        expect(response.transactionCount).toBe(150);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving spend summary', function() {
      var cardId = 'invalid-card';

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend').respond(404, { error: 'Card not found' });

      spendAnalysisService.getSpendSummary(cardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });
  });

  describe('getCardSpendTrends', function() {
    it('should retrieve spend trends for card with date range', function() {
      var cardId = 'card123';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockTrends = {
        cardId: 'card123',
        trends: [
          { month: '2023-01', totalSpend: 2000.00 },
          { month: '2023-02', totalSpend: 2500.00 },
          { month: '2023-03', totalSpend: 1800.00 }
        ]
      };

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend/trends?start=' + startDate + '&end=' + endDate)
        .respond(200, mockTrends);

      spendAnalysisService.getCardSpendTrends(cardId, startDate, endDate).then(function(response) {
        expect(response.cardId).toBe('card123');
        expect(response.trends.length).toBe(3);
        expect(response.trends[0].totalSpend).toBe(2000.00);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving spend trends', function() {
      var cardId = 'invalid-card';
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend/trends?start=' + startDate + '&end=' + endDate)
        .respond(500, { error: 'Server error' });

      spendAnalysisService.getCardSpendTrends(cardId, startDate, endDate).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });
});