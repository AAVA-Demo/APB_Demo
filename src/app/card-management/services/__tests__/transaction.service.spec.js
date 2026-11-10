/*
Test Documentation:
- Test Name: TransactionService (Card Management) Unit Tests
- Purpose: Validate transaction retrieval by card ID with API integration and mock fallback
- Scenario: Tests cover successful API calls with card filtering, error handling, and mock transaction generation
- Expected Result: Card-specific transactions are retrieved correctly with proper filtering
*/

(function() {
  'use strict';

  describe('TransactionService (Card Management)', function() {
    var TransactionService, $httpBackend, $rootScope, AuthService;

    beforeEach(module('app.cardManagement'));

    beforeEach(function() {
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
      };
      
      module(function($provide) {
        $provide.value('AuthService', AuthService);
      });
    });

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$rootScope_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactionsByCard', function() {
      it('should retrieve transactions from API with cardId parameter', function() {
        var mockResponse = [
          { transactionId: 'txn-001', cardId: 'card-001', amount: 2500, merchantName: 'Amazon' },
          { transactionId: 'txn-002', cardId: 'card-001', amount: 1800, merchantName: 'Starbucks' }
        ];
        
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, mockResponse);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should return mock transactions when API returns empty data', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(20);
      });

      it('should fallback to mock transactions on API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions?cardId=card-002').respond(500, 'Server Error');
        
        var result;
        TransactionService.getTransactionsByCard('card-002').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBe(20);
      });

      it('should return transactions with all required properties', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBe('card-001');
          expect(txn.amount).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.transactionType).toBeDefined();
        });
      });

      it('should generate transactions with valid categories', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        
        result.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
      });

      it('should generate transactions with amounts in valid range', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThanOrEqual(500);
          expect(txn.amount).toBeLessThanOrEqual(5500);
        });
      });

      it('should generate transactions with dates within last 30 days', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-001').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-001').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        var now = new Date();
        var thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        result.forEach(function(txn) {
          var txnDate = new Date(txn.transactionDate);
          expect(txnDate).toBeGreaterThanOrEqual(thirtyDaysAgo);
          expect(txnDate).toBeLessThanOrEqual(now);
        });
      });

      it('should handle different card IDs', function() {
        $httpBackend.expectGET('/api/transactions?cardId=card-999').respond(200, null);
        
        var result;
        TransactionService.getTransactionsByCard('card-999').then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.cardId).toBe('card-999');
        });
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactionsByCard
- Scenarios covered:
  * Successful API retrieval with cardId parameter
  * Empty API response with mock fallback
  * API error with mock fallback
  * Required properties validation
  * Valid category generation
  * Amount range validation
  * Date range validation (last 30 days)
  * Different card ID handling
- Uncovered scenarios: None - all transaction retrieval paths tested
- Edge cases: Empty response, server errors, various card IDs, mock data generation
*/