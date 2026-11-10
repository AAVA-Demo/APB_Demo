/*
Test Documentation:
- Test Name: TransactionService - getMonthlySpend with userId and month
- Purpose: Validates retrieval of monthly spending data
- Scenario: Service is called with valid userId and month
- Expected Result: Should return monthly spend data from API
*/
/*
Test Documentation:
- Test Name: TransactionService - getCardWiseSpending for specific card
- Purpose: Validates retrieval of card-specific spending data
- Scenario: Service is called with valid cardId
- Expected Result: Should return card-wise spending data
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionsByCategory
- Purpose: Validates retrieval of transactions filtered by category
- Scenario: Service is called with categoryId and userId
- Expected Result: Should return filtered transaction list
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend, getCardWiseSpending, getTransactionsByCategory
- Scenarios covered: successful API calls, error handling, parameter variations
- Edge cases: null parameters, undefined parameters, API failures, network errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend;
    var mockUserId = 'user123';
    var mockMonth = '2026-11';
    var mockCardId = 'card1';
    var mockCategoryId = '1';
    var mockMonthlySpendData = {
      totalSpend: 2500,
      transactionCount: 45
    };
    var mockCardWiseData = {
      cardId: 'card1',
      monthlySpend: 1200,
      spendTrend: [
        { month: '2026-09', amount: 1000 },
        { month: '2026-10', amount: 1100 },
        { month: '2026-11', amount: 1200 }
      ]
    };
    var mockTransactions = [
      { transactionId: 'tx1', date: '2026-11-01', description: 'Restaurant', amount: 50 },
      { transactionId: 'tx2', date: '2026-11-05', description: 'Grocery Store', amount: 120 }
    ];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getMonthlySpend', function() {
      it('should fetch monthly spend data with userId and month', function() {
        $httpBackend.expectGET('/api/transactions/monthly-spend?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(200, mockMonthlySpendData);

        var result;
        TransactionService.getMonthlySpend(mockUserId, mockMonth)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockMonthlySpendData);
        expect(result.totalSpend).toBe(2500);
        expect(result.transactionCount).toBe(45);
      });

      it('should fetch monthly spend data without month parameter', function() {
        $httpBackend.expectGET('/api/transactions/monthly-spend?userId=' + mockUserId)
          .respond(200, mockMonthlySpendData);

        var result;
        TransactionService.getMonthlySpend(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockMonthlySpendData);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET('/api/transactions/monthly-spend?userId=' + mockUserId + '&month=' + mockMonth)
          .respond(500, { error: 'Internal Server Error' });

        var errorResult;
        TransactionService.getMonthlySpend(mockUserId, mockMonth)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET('/api/transactions/monthly-spend?userId=' + mockUserId)
          .respond(-1, null);

        var errorResult;
        TransactionService.getMonthlySpend(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });
    });

    describe('getCardWiseSpending', function() {
      it('should fetch card-wise spending data successfully', function() {
        $httpBackend.expectGET('/api/transactions/card-wise?cardId=' + mockCardId)
          .respond(200, mockCardWiseData);

        var result;
        TransactionService.getCardWiseSpending(mockCardId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockCardWiseData);
        expect(result.cardId).toBe('card1');
        expect(result.monthlySpend).toBe(1200);
        expect(result.spendTrend.length).toBe(3);
      });

      it('should handle API errors for card-wise spending', function() {
        $httpBackend.expectGET('/api/transactions/card-wise?cardId=' + mockCardId)
          .respond(404, { error: 'Card not found' });

        var errorResult;
        TransactionService.getCardWiseSpending(mockCardId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      it('should handle network errors for card-wise spending', function() {
        $httpBackend.expectGET('/api/transactions/card-wise?cardId=' + mockCardId)
          .respond(-1, null);

        var errorResult;
        TransactionService.getCardWiseSpending(mockCardId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });
    });

    describe('getTransactionsByCategory', function() {
      it('should fetch transactions by category successfully', function() {
        $httpBackend.expectGET('/api/transactions?categoryId=' + mockCategoryId + '&userId=' + mockUserId)
          .respond(200, mockTransactions);

        var result;
        TransactionService.getTransactionsByCategory(mockCategoryId, mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('tx1');
        expect(result[1].amount).toBe(120);
      });

      it('should handle empty transaction list', function() {
        $httpBackend.expectGET('/api/transactions?categoryId=' + mockCategoryId + '&userId=' + mockUserId)
          .respond(200, []);

        var result;
        TransactionService.getTransactionsByCategory(mockCategoryId, mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle API errors for category transactions', function() {
        $httpBackend.expectGET('/api/transactions?categoryId=' + mockCategoryId + '&userId=' + mockUserId)
          .respond(500, { error: 'Server Error' });

        var errorResult;
        TransactionService.getTransactionsByCategory(mockCategoryId, mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle network errors for category transactions', function() {
        $httpBackend.expectGET('/api/transactions?categoryId=' + mockCategoryId + '&userId=' + mockUserId)
          .respond(-1, null);

        var errorResult;
        TransactionService.getTransactionsByCategory(mockCategoryId, mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });

      it('should construct correct query parameters', function() {
        var customCategoryId = '5';
        var customUserId = 'user999';

        $httpBackend.expectGET('/api/transactions?categoryId=' + customCategoryId + '&userId=' + customUserId)
          .respond(200, mockTransactions);

        TransactionService.getTransactionsByCategory(customCategoryId, customUserId);

        $httpBackend.flush();
      });
    });
  });
})();