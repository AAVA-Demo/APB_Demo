/*
Test Documentation:
- Test Name: ApiService Unit Tests
- Purpose: Validate ApiService functionality including GET and POST operations, mock data handling, filtering, and error scenarios
- Scenario: Tests cover successful data retrieval, filtering by parameters, endpoint routing, error handling, and promise resolution
- Expected Result: All service methods return correct data structures, handle filters properly, and manage errors appropriately
*/

(function() {
  'use strict';

  describe('ApiService', function() {
    var ApiService, $q, $rootScope, AuthService, $timeout;

    beforeEach(module('ccApp'));

    beforeEach(inject(function(_ApiService_, _$q_, _$rootScope_, _AuthService_, _$timeout_) {
      ApiService = _ApiService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      AuthService = _AuthService_;
      $timeout = _$timeout_;
    }));

    describe('get method', function() {
      it('should be defined', function() {
        expect(ApiService.get).toBeDefined();
        expect(typeof ApiService.get).toBe('function');
      });

      it('should return credit cards data when endpoint includes /creditcards', function(done) {
        ApiService.get('/api/creditcards').then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBe(3);
          expect(response.data[0].id).toBe('1');
          expect(response.data[0].cardName).toBe('Visa Platinum');
          expect(response.data[0].creditLimit).toBe(10000);
          done();
        });
        $timeout.flush();
      });

      it('should return all transactions when endpoint includes /transactions without filters', function(done) {
        ApiService.get('/api/transactions').then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBe(10);
          expect(response.data[0].merchant).toBe('Whole Foods');
          done();
        });
        $timeout.flush();
      });

      it('should filter transactions by cardId when provided', function(done) {
        ApiService.get('/api/transactions', { cardId: '1' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          response.data.forEach(function(txn) {
            expect(txn.cardId).toBe('1');
          });
          done();
        });
        $timeout.flush();
      });

      it('should filter transactions by category when provided', function(done) {
        ApiService.get('/api/transactions', { category: 'Food & Dining' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          response.data.forEach(function(txn) {
            expect(txn.category).toBe('Food & Dining');
          });
          done();
        });
        $timeout.flush();
      });

      it('should filter transactions by both cardId and category when both provided', function(done) {
        ApiService.get('/api/transactions', { cardId: '1', category: 'Food & Dining' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          response.data.forEach(function(txn) {
            expect(txn.cardId).toBe('1');
            expect(txn.category).toBe('Food & Dining');
          });
          done();
        });
        $timeout.flush();
      });

      it('should return analytics data when endpoint includes /analytics/spending', function(done) {
        ApiService.get('/api/analytics/spending').then(function(response) {
          expect(response.data).toBeDefined();
          expect(response.data.categorySpend).toBeDefined();
          expect(Array.isArray(response.data.categorySpend)).toBe(true);
          expect(response.data.categorySpend.length).toBe(9);
          expect(response.data.monthlyTrend).toBeDefined();
          expect(response.data.cardWiseSpend).toBeDefined();
          expect(response.data.totalSpend).toBe(3900);
          done();
        });
        $timeout.flush();
      });

      it('should reject promise with 404 error for unknown endpoint', function(done) {
        ApiService.get('/api/unknown').catch(function(error) {
          expect(error).toBeDefined();
          expect(error.status).toBe(404);
          expect(error.message).toBe('Endpoint not found');
          done();
        });
        $timeout.flush();
      });

      it('should handle empty params object', function(done) {
        ApiService.get('/api/transactions', {}).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBe(10);
          done();
        });
        $timeout.flush();
      });

      it('should handle null params', function(done) {
        ApiService.get('/api/creditcards', null).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should return promise that resolves after timeout', function() {
        var resolved = false;
        ApiService.get('/api/creditcards').then(function() {
          resolved = true;
        });
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('post method', function() {
      it('should be defined', function() {
        expect(ApiService.post).toBeDefined();
        expect(typeof ApiService.post).toBe('function');
      });

      it('should return success response for any endpoint', function(done) {
        ApiService.post('/api/test', { test: 'data' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(response.data.success).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should accept empty data object', function(done) {
        ApiService.post('/api/test', {}).then(function(response) {
          expect(response.data.success).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should accept null data', function(done) {
        ApiService.post('/api/test', null).then(function(response) {
          expect(response.data.success).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should resolve immediately without timeout', function() {
        var resolved = false;
        ApiService.post('/api/test', {}).then(function() {
          resolved = true;
        });
        $rootScope.$apply();
        expect(resolved).toBe(true);
      });
    });

    describe('mock data structure', function() {
      it('should return credit cards with all required fields', function(done) {
        ApiService.get('/api/creditcards').then(function(response) {
          var card = response.data[0];
          expect(card.id).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
          expect(card.dueDate).toBeDefined();
          expect(card.status).toBeDefined();
          done();
        });
        $timeout.flush();
      });

      it('should return transactions with all required fields', function(done) {
        ApiService.get('/api/transactions').then(function(response) {
          var txn = response.data[0];
          expect(txn.id).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.currency).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.status).toBeDefined();
          expect(txn.cardLast4).toBeDefined();
          done();
        });
        $timeout.flush();
      });

      it('should return analytics with all required fields', function(done) {
        ApiService.get('/api/analytics/spending').then(function(response) {
          var analytics = response.data;
          expect(analytics.categorySpend).toBeDefined();
          expect(analytics.monthlyTrend).toBeDefined();
          expect(analytics.cardWiseSpend).toBeDefined();
          expect(analytics.totalSpend).toBeDefined();
          expect(analytics.periodStart).toBeDefined();
          expect(analytics.periodEnd).toBeDefined();
          done();
        });
        $timeout.flush();
      });
    });

    describe('edge cases', function() {
      it('should handle filter with non-existent cardId', function(done) {
        ApiService.get('/api/transactions', { cardId: '999' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle filter with non-existent category', function(done) {
        ApiService.get('/api/transactions', { category: 'NonExistent' }).then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          expect(response.data.length).toBe(0);
          done();
        });
        $timeout.flush();
      });

      it('should handle endpoint with query string', function(done) {
        ApiService.get('/api/creditcards?test=value').then(function(response) {
          expect(response.data).toBeDefined();
          expect(Array.isArray(response.data)).toBe(true);
          done();
        });
        $timeout.flush();
      });

      it('should handle multiple calls simultaneously', function() {
        var results = [];
        ApiService.get('/api/creditcards').then(function(response) {
          results.push('cards');
        });
        ApiService.get('/api/transactions').then(function(response) {
          results.push('transactions');
        });
        ApiService.get('/api/analytics/spending').then(function(response) {
          results.push('analytics');
        });
        $timeout.flush();
        expect(results.length).toBe(3);
        expect(results).toContain('cards');
        expect(results).toContain('transactions');
        expect(results).toContain('analytics');
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: get, post
- Scenarios covered:
  * Successful data retrieval for credit cards
  * Successful data retrieval for transactions
  * Successful data retrieval for analytics
  * Transaction filtering by cardId
  * Transaction filtering by category
  * Combined filtering (cardId + category)
  * Error handling for unknown endpoints
  * POST method success responses
  * Empty and null parameter handling
  * Promise resolution timing
  * Mock data structure validation
  * Edge cases (non-existent filters, query strings, simultaneous calls)
- Uncovered scenarios: Real HTTP integration, network errors, authentication token injection
*/