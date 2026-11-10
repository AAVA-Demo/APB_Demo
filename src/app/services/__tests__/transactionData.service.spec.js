/*
Test Documentation:
- Test Name: TransactionDataService Test Suite
- Purpose: Validate transaction data retrieval by category functionality
- Scenario: Tests transaction fetching via API with fallback to mock transaction data
- Expected Result: Service should retrieve transactions by category or return mock data on failure
*/

(function() {
  'use strict';

  describe('TransactionDataService', function() {
    var TransactionDataService, ApiGatewayService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataService_, _ApiGatewayService_, _$rootScope_, _$q_) {
      TransactionDataService = _TransactionDataService_;
      ApiGatewayService = _ApiGatewayService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    describe('getTransactionsByCategory', function() {
      it('should call ApiGatewayService.get with correct endpoint', function() {
        var category = 'Food & Dining';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        TransactionDataService.getTransactionsByCategory(category);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/transactions?category=' + category);
      });

      it('should return API data when request succeeds', function() {
        var category = 'Shopping';
        var apiResponse = [
          {
            transactionId: 'txn-api-1',
            cardId: 'card-api',
            amount: 250.50,
            category: category,
            merchantName: 'Amazon',
            transactionDate: new Date('2026-01-15'),
            description: 'Online shopping'
          }
        ];

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data array when API request fails', function() {
        var category = 'Travel';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 404 }));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(10);
      });

      it('should generate 10 mock transactions', function() {
        var category = 'Entertainment';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.length).toBe(10);
      });

      it('should include all required fields in mock transactions', function() {
        var category = 'Fuel';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.description).toBeDefined();
        });
      });

      it('should set category to requested category in mock transactions', function() {
        var category = 'Utilities';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.category).toBe(category);
        });
      });

      it('should generate sequential transaction IDs', function() {
        var category = 'Healthcare';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn, index) {
          expect(txn.transactionId).toBe('txn-' + index);
        });
      });

      it('should set cardId to card-1 for all mock transactions', function() {
        var category = 'Education';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.cardId).toBe('card-1');
        });
      });

      it('should generate amounts within valid range', function() {
        var category = 'Miscellaneous';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThanOrEqual(20);
          expect(txn.amount).toBeLessThanOrEqual(520);
        });
      });

      it('should generate merchant names with sequential numbering', function() {
        var category = 'Shopping';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn, index) {
          expect(txn.merchantName).toBe('Merchant ' + index);
        });
      });

      it('should set transactionDate to current date', function() {
        var category = 'Food & Dining';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));
        var beforeTime = new Date();

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        var afterTime = new Date();
        result.forEach(function(txn) {
          expect(txn.transactionDate).toBeDefined();
          expect(txn.transactionDate.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
          expect(txn.transactionDate.getTime()).toBeLessThanOrEqual(afterTime.getTime());
        });
      });

      it('should generate description with category name', function() {
        var category = 'Travel';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.description).toBe(category + ' purchase');
        });
      });

      it('should return promise', function() {
        var category = 'Entertainment';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = TransactionDataService.getTransactionsByCategory(category);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should handle network errors gracefully', function() {
        var category = 'Fuel';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500 }));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
      });

      it('should handle timeout errors', function() {
        var category = 'Utilities';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: -1 }));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.length).toBe(10);
      });
    });

    describe('data validation', function() {
      it('should have numeric amount for each transaction', function() {
        var category = 'Healthcare';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(typeof txn.amount).toBe('number');
        });
      });

      it('should have Date object for transactionDate', function() {
        var category = 'Education';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        result.forEach(function(txn) {
          expect(txn.transactionDate instanceof Date).toBe(true);
        });
      });
    });

    describe('integration scenarios', function() {
      it('should work with all valid categories', function() {
        var categories = [
          'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
          'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
        ];
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        categories.forEach(function(category) {
          var result;
          TransactionDataService.getTransactionsByCategory(category).then(function(data) {
            result = data;
          });
          $rootScope.$digest();

          expect(result.length).toBe(10);
          result.forEach(function(txn) {
            expect(txn.category).toBe(category);
          });
        });
      });

      it('should handle empty category string', function() {
        var category = '';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        TransactionDataService.getTransactionsByCategory(category).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.length).toBe(10);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getTransactionsByCategory()
- Scenarios covered:
  * API Gateway service invocation
  * Successful API response handling
  * API failure with mock data fallback
  * 10 mock transactions generation
  * All required fields in mock transactions
  * Category assignment to transactions
  * Sequential transaction IDs
  * CardId assignment
  * Amount range validation
  * Sequential merchant names
  * Current date for transaction date
  * Description generation with category
  * Promise return validation
  * Network error handling
  * Timeout error handling
  * Numeric amount validation
  * Date object validation
  * All valid categories
  * Empty category string handling
- Uncovered scenarios: Transaction pagination, date range filtering, amount range filtering, merchant search
*/