/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate card-specific spending data retrieval for card management
- Scenario: Tests getCardSpending method with various card IDs and spending scenarios
- Expected Result: Correct spending data retrieval with error handling for invalid requests
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardSpending', function() {
      it('should retrieve card spending data for valid card ID', function(done) {
        var cardId = 'card123';
        var mockSpendingData = {
          cardId: 'card123',
          monthlySpend: 1500,
          transactionCount: 25,
          categoryBreakdown: [
            { category: 'Food & Dining', amount: 500 },
            { category: 'Fuel', amount: 300 },
            { category: 'Shopping', amount: 700 }
          ]
        };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        TransactionService.getCardSpending(cardId).then(function(spendingData) {
          expect(spendingData).toEqual(mockSpendingData);
          expect(spendingData.monthlySpend).toBe(1500);
          expect(spendingData.transactionCount).toBe(25);
          expect(spendingData.categoryBreakdown.length).toBe(3);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle card with no spending data', function(done) {
        var cardId = 'card456';
        var mockSpendingData = {
          cardId: 'card456',
          monthlySpend: 0,
          transactionCount: 0,
          categoryBreakdown: []
        };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        TransactionService.getCardSpending(cardId).then(function(spendingData) {
          expect(spendingData.monthlySpend).toBe(0);
          expect(spendingData.transactionCount).toBe(0);
          expect(spendingData.categoryBreakdown).toEqual([]);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle card with spending across all 9 categories', function(done) {
        var cardId = 'card789';
        var mockSpendingData = {
          cardId: 'card789',
          monthlySpend: 3000,
          transactionCount: 50,
          categoryBreakdown: [
            { category: 'Food & Dining', amount: 500 },
            { category: 'Fuel', amount: 300 },
            { category: 'Shopping', amount: 700 },
            { category: 'Travel', amount: 400 },
            { category: 'Entertainment', amount: 200 },
            { category: 'Utilities', amount: 300 },
            { category: 'Healthcare', amount: 250 },
            { category: 'Education', amount: 200 },
            { category: 'Miscellaneous', amount: 150 }
          ]
        };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        TransactionService.getCardSpending(cardId).then(function(spendingData) {
          expect(spendingData.categoryBreakdown.length).toBe(9);
          var categories = spendingData.categoryBreakdown.map(function(cat) { return cat.category; });
          expect(categories).toContain('Food & Dining');
          expect(categories).toContain('Fuel');
          expect(categories).toContain('Shopping');
          expect(categories).toContain('Travel');
          expect(categories).toContain('Entertainment');
          expect(categories).toContain('Utilities');
          expect(categories).toContain('Healthcare');
          expect(categories).toContain('Education');
          expect(categories).toContain('Miscellaneous');
          done();
        });

        $httpBackend.flush();
      });

      it('should reject promise on 404 error for invalid card ID', function(done) {
        var cardId = 'invalidCard';

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(404, { error: 'Card not found' });

        TransactionService.getCardSpending(cardId).then(function() {
          fail('Should not resolve on 404 error');
        }, function(error) {
          expect(error.status).toBe(404);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle server errors gracefully', function(done) {
        var cardId = 'card123';

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(500, { error: 'Internal Server Error' });

        TransactionService.getCardSpending(cardId).then(function() {
          fail('Should not resolve on server error');
        }, function(error) {
          expect(error.status).toBe(500);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle unauthorized access (403)', function(done) {
        var cardId = 'card123';

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(403, { error: 'Forbidden' });

        TransactionService.getCardSpending(cardId).then(function() {
          fail('Should not resolve on forbidden error');
        }, function(error) {
          expect(error.status).toBe(403);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle card ID with special characters', function(done) {
        var cardId = 'card@123#test';
        var mockSpendingData = {
          cardId: cardId,
          monthlySpend: 1000,
          transactionCount: 10,
          categoryBreakdown: []
        };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        TransactionService.getCardSpending(cardId).then(function(spendingData) {
          expect(spendingData.cardId).toBe(cardId);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle high transaction count (100+ transactions)', function(done) {
        var cardId = 'card123';
        var mockSpendingData = {
          cardId: 'card123',
          monthlySpend: 10000,
          transactionCount: 150,
          categoryBreakdown: [
            { category: 'Food & Dining', amount: 5000 },
            { category: 'Shopping', amount: 5000 }
          ]
        };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        TransactionService.getCardSpending(cardId).then(function(spendingData) {
          expect(spendingData.transactionCount).toBe(150);
          expect(spendingData.monthlySpend).toBe(10000);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network timeout errors', function(done) {
        var cardId = 'card123';

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(-1, null);

        TransactionService.getCardSpending(cardId).then(function() {
          fail('Should not resolve on network timeout');
        }, function(error) {
          expect(error.status).toBe(-1);
          done();
        });

        $httpBackend.flush();
      });

      it('should return promise that can be chained', function() {
        var cardId = 'card123';
        var mockSpendingData = { cardId: 'card123', monthlySpend: 1000 };

        $httpBackend.expectGET('/api/transactions/card/' + cardId).respond(200, mockSpendingData);

        var result = TransactionService.getCardSpending(cardId);
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');

        $httpBackend.flush();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCardSpending
- Scenarios covered:
  * Valid card ID with spending data
  * No spending data
  * All 9 categories
  * 404 error for invalid card
  * 500 server error
  * 403 forbidden access
  * Special characters in card ID
  * High transaction count (150)
  * Network timeout
  * Promise chaining
- Edge cases: Empty arrays, special characters, high transaction counts, all categories
- Error scenarios: 404 Not Found, 500 Server Error, 403 Forbidden, network timeout
- Uncovered scenarios: None - comprehensive coverage achieved
*/