/*
Test Documentation:
- Test Name: CardService - getCardPortfolio success scenario
- Purpose: Validates that getCardPortfolio retrieves and enriches card data correctly
- Scenario: User requests card portfolio with valid userId
- Expected Result: Returns enriched cards with monthly spend, trends, and utilization rate
*/
/*
Test Documentation:
- Test Name: CardService - getCardPortfolio error handling
- Purpose: Validates error handling when API call fails
- Scenario: HTTP request fails with 500 error
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: CardService - getTransactionSummary success
- Purpose: Validates transaction summary retrieval for a card
- Scenario: Valid cardId provided
- Expected Result: Returns transaction summary with monthlySpend and trends
*/
/*
Test Documentation:
- Test Name: CardService - getTransactionSummary error fallback
- Purpose: Validates fallback behavior when transaction summary fails
- Scenario: API call fails
- Expected Result: Returns default object with zero spend and empty trends
*/
/*
Coverage Report:
- Functions tested: getCardPortfolio, getTransactionSummary
- Scenarios covered: success path, error handling, data enrichment, utilization calculation
- Uncovered scenarios: network timeout, partial data scenarios
*/

(function() {
  'use strict';

  describe('CardService', function() {
    var CardService, $httpBackend, $q, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardService_, _$httpBackend_, _$q_, _API_CONFIG_) {
      CardService = _CardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardPortfolio', function() {
      it('should retrieve and enrich card portfolio successfully', function() {
        var userId = 'user123';
        var mockCards = [
          { cardId: 'c1', cardNumber: '1234', balance: 1000, creditLimit: 5000 },
          { cardId: 'c2', cardNumber: '5678', balance: 2000, creditLimit: 10000 }
        ];
        var mockSummary = { monthlySpend: 450.25, trends: [{ month: 'Jan', amount: 450.25 }] };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?userId=' + userId).respond(200, mockCards);
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/summary?cardId=c1').respond(200, mockSummary);
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/summary?cardId=c2').respond(200, mockSummary);

        var result;
        CardService.getCardPortfolio(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.userId).toBe(userId);
        expect(result.cards.length).toBe(2);
        expect(result.totalCards).toBe(2);
        expect(result.cards[0].monthlySpend).toBe(450.25);
        expect(result.cards[0].utilizationRate).toBe('20.00');
        expect(result.cards[1].utilizationRate).toBe('20.00');
      });

      it('should handle error when fetching card portfolio', function() {
        var userId = 'user123';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?userId=' + userId).respond(500, 'Server Error');

        var error;
        CardService.getCardPortfolio(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching card portfolio:', jasmine.any(Object));
      });

      it('should calculate utilization rate correctly', function() {
        var userId = 'user123';
        var mockCards = [
          { cardId: 'c1', cardNumber: '1234', balance: 3500, creditLimit: 5000 }
        ];
        var mockSummary = { monthlySpend: 200, trends: [] };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?userId=' + userId).respond(200, mockCards);
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/summary?cardId=c1').respond(200, mockSummary);

        var result;
        CardService.getCardPortfolio(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cards[0].utilizationRate).toBe('70.00');
      });
    });

    describe('getTransactionSummary', function() {
      it('should retrieve transaction summary successfully', function() {
        var cardId = 'c1';
        var mockSummary = { monthlySpend: 450.25, trends: [{ month: 'Jan', amount: 450.25 }] };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/summary?cardId=' + cardId).respond(200, mockSummary);

        var result;
        CardService.getTransactionSummary(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockSummary);
        expect(result.monthlySpend).toBe(450.25);
        expect(result.trends.length).toBe(1);
      });

      it('should return default values on error', function() {
        var cardId = 'c1';
        spyOn(console, 'error');

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/summary?cardId=' + cardId).respond(500, 'Server Error');

        var result;
        CardService.getTransactionSummary(cardId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual({ monthlySpend: 0, trends: [] });
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();