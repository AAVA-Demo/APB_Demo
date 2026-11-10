/*
Test Documentation:
- Test Name: CardSpendingService - getCardSpending success
- Purpose: Validates retrieval of spending data for a specific card
- Scenario: HTTP GET to /api/cards/:cardId/spending returns spending data
- Expected Result: Promise resolves with spending analytics
*/
/*
Test Documentation:
- Test Name: CardSpendingService - getCardSpending handles error
- Purpose: Validates error handling when spending API fails
- Scenario: HTTP GET to /api/cards/:cardId/spending returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CardSpendingService - getRecentTransactions success
- Purpose: Validates retrieval of recent transactions for a card
- Scenario: HTTP GET to /api/cards/:cardId/transactions returns transaction array
- Expected Result: Promise resolves with transaction data
*/
/*
Test Documentation:
- Test Name: CardSpendingService - getRecentTransactions handles error
- Purpose: Validates error handling when transactions API fails
- Scenario: HTTP GET to /api/cards/:cardId/transactions returns error
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getCardSpending, getRecentTransactions
- Scenarios covered: success responses, HTTP errors, empty data
- Uncovered scenarios: none
*/

describe('CardSpendingService', function() {
  'use strict';

  beforeEach(module('app.cardManagement'));

  var CardSpendingService, $httpBackend, $rootScope;
  var API_BASE = '/api/cards';

  beforeEach(inject(function(_CardSpendingService_, _$httpBackend_, _$rootScope_) {
    CardSpendingService = _CardSpendingService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardSpending', function() {
    it('should retrieve card spending data successfully', function(done) {
      var mockSpending = {
        currentMonthSpend: 1500,
        lastMonthSpend: 1200,
        averageMonthlySpend: 1350,
        spendingTrend: 'increasing',
        topCategories: ['Food & Dining', 'Shopping']
      };

      $httpBackend.expectGET(API_BASE + '/card1/spending').respond(200, mockSpending);

      CardSpendingService.getCardSpending('card1').then(function(result) {
        expect(result).toEqual(mockSpending);
        expect(result.currentMonthSpend).toBe(1500);
        expect(result.topCategories.length).toBe(2);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle error when fetching spending data', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1/spending').respond(500, 'Server Error');

      CardSpendingService.getCardSpending('card1').catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle 404 when card spending not found', function(done) {
      $httpBackend.expectGET(API_BASE + '/invalidCard/spending').respond(404, 'Not Found');

      CardSpendingService.getCardSpending('invalidCard').catch(function(error) {
        expect(error.status).toBe(404);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle empty spending data', function(done) {
      var emptySpending = {
        currentMonthSpend: 0,
        lastMonthSpend: 0,
        averageMonthlySpend: 0,
        spendingTrend: 'stable',
        topCategories: []
      };

      $httpBackend.expectGET(API_BASE + '/card1/spending').respond(200, emptySpending);

      CardSpendingService.getCardSpending('card1').then(function(result) {
        expect(result.currentMonthSpend).toBe(0);
        expect(result.topCategories.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('getRecentTransactions', function() {
    it('should retrieve recent transactions successfully', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 45.50 },
        { date: '2023-01-14', category: 'Fuel', amount: 60.00 },
        { date: '2023-01-13', category: 'Shopping', amount: 120.75 }
      ];

      $httpBackend.expectGET(API_BASE + '/card1/transactions').respond(200, mockTransactions);

      CardSpendingService.getRecentTransactions('card1').then(function(result) {
        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(3);
        expect(result[0].category).toBe('Food & Dining');
        done();
      });

      $httpBackend.flush();
    });

    it('should handle error when fetching transactions', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1/transactions').respond(500, 'Server Error');

      CardSpendingService.getRecentTransactions('card1').catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should return empty array when no transactions exist', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1/transactions').respond(200, []);

      CardSpendingService.getRecentTransactions('card1').then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle unauthorized access to transactions', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1/transactions').respond(401, 'Unauthorized');

      CardSpendingService.getRecentTransactions('card1').catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });

      $httpBackend.flush();
    });
  });
});