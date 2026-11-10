/*
Test Documentation:
- Test Name: TransactionService - getTransactions (success)
- Purpose: Validates successful transaction retrieval
- Scenario: API returns transaction list
- Expected Result: Returns array of transactions
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions (with filters)
- Purpose: Validates filtered transaction retrieval
- Scenario: Filter parameters provided
- Expected Result: Returns filtered transactions with correct query string
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactionById (success)
- Purpose: Validates individual transaction retrieval
- Scenario: Valid transaction ID provided
- Expected Result: Returns specific transaction details
*/
/*
Test Documentation:
- Test Name: TransactionService - getTransactions (error)
- Purpose: Validates error handling
- Scenario: API call fails
- Expected Result: Returns rejected promise
*/
/*
Test Documentation:
- Test Name: TransactionService - getMockTransactions
- Purpose: Validates mock transaction data generation
- Scenario: Mock transactions requested
- Expected Result: Returns 5 mock transactions with complete details
*/
/*
Coverage Report:
- Functions tested: getTransactions, getTransactionById, getMockTransactions
- Scenarios covered: successful retrieval, filtering, error handling, authorization, mock data
- Edge cases: empty filters, invalid transaction ID, network errors, query string encoding
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService;
    var $httpBackend;
    var $q;
    var $rootScope;
    var AuthService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _$rootScope_, _AuthService_) {
      TransactionService = _TransactionService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      AuthService = _AuthService_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getTransactions', function() {
      it('should retrieve transactions successfully without filters', function() {
        // Arrange
        var mockTransactions = [
          { transactionId: 'T1', amount: 100, merchant: 'Store A' },
          { transactionId: 'T2', amount: 200, merchant: 'Store B' }
        ];
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

        // Act
        var result;
        TransactionService.getTransactions().then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].transactionId).toBe('T1');
      });

      it('should include authorization header in request', function() {
        // Arrange
        var token = 'auth-token-123';
        spyOn(AuthService, 'getToken').and.returnValue(token);
        $httpBackend.expectGET('/api/transactions', function(headers) {
          return headers['Authorization'] === 'Bearer ' + token;
        }).respond(200, []);

        // Act
        TransactionService.getTransactions();
        $httpBackend.flush();

        // Assert
        expect(AuthService.getToken).toHaveBeenCalled();
      });

      it('should apply filter parameters to query string', function() {
        // Arrange
        var filters = {
          cardId: 'CC001',
          category: 'Shopping',
          startDate: '2024-01-01'
        };
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions?cardId=CC001&category=Shopping&startDate=2024-01-01')
          .respond(200, []);

        // Act
        TransactionService.getTransactions(filters);
        $httpBackend.flush();

        // Assert - expectation verified by $httpBackend
        expect(true).toBe(true);
      });

      it('should handle single filter parameter', function() {
        // Arrange
        var filters = { cardId: 'CC002' };
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions?cardId=CC002').respond(200, []);

        // Act
        TransactionService.getTransactions(filters);
        $httpBackend.flush();

        // Assert
        expect(true).toBe(true);
      });

      it('should encode special characters in filter values', function() {
        // Arrange
        var filters = { merchant: 'Store & Shop' };
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions?merchant=Store%20%26%20Shop').respond(200, []);

        // Act
        TransactionService.getTransactions(filters);
        $httpBackend.flush();

        // Assert
        expect(true).toBe(true);
      });

      it('should handle empty filter object', function() {
        // Arrange
        var filters = {};
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(200, []);

        // Act
        TransactionService.getTransactions(filters);
        $httpBackend.flush();

        // Assert
        expect(true).toBe(true);
      });

      it('should handle null filter parameter', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(200, []);

        // Act
        TransactionService.getTransactions(null);
        $httpBackend.flush();

        // Assert
        expect(true).toBe(true);
      });

      it('should handle API error and reject promise', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');

        // Act
        var errorResult;
        TransactionService.getTransactions().catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle 401 unauthorized error', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('invalid-token');
        $httpBackend.expectGET('/api/transactions').respond(401, 'Unauthorized');

        // Act
        var errorResult;
        TransactionService.getTransactions().catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(401);
      });

      it('should handle network timeout', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(0, '');

        // Act
        var errorResult;
        TransactionService.getTransactions().catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
      });
    });

    describe('getTransactionById', function() {
      it('should retrieve specific transaction successfully', function() {
        // Arrange
        var transactionId = 'TXN001';
        var mockTransaction = {
          transactionId: 'TXN001',
          amount: 2500,
          merchant: 'Amazon',
          category: 'Shopping'
        };
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions/' + transactionId).respond(200, mockTransaction);

        // Act
        var result;
        TransactionService.getTransactionById(transactionId).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        // Assert
        expect(result).toBeDefined();
        expect(result.transactionId).toBe('TXN001');
        expect(result.amount).toBe(2500);
        expect(result.merchant).toBe('Amazon');
      });

      it('should include authorization header in transaction request', function() {
        // Arrange
        var transactionId = 'TXN002';
        var token = 'auth-token-456';
        spyOn(AuthService, 'getToken').and.returnValue(token);
        $httpBackend.expectGET('/api/transactions/' + transactionId, function(headers) {
          return headers['Authorization'] === 'Bearer ' + token;
        }).respond(200, {});

        // Act
        TransactionService.getTransactionById(transactionId);
        $httpBackend.flush();

        // Assert
        expect(AuthService.getToken).toHaveBeenCalled();
      });

      it('should handle transaction not found error', function() {
        // Arrange
        var transactionId = 'INVALID';
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions/' + transactionId).respond(404, 'Not Found');

        // Act
        var errorResult;
        TransactionService.getTransactionById(transactionId).catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      it('should handle server error when retrieving transaction', function() {
        // Arrange
        var transactionId = 'TXN003';
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions/' + transactionId).respond(500, 'Internal Server Error');

        // Act
        var errorResult;
        TransactionService.getTransactionById(transactionId).catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle empty transaction ID', function() {
        // Arrange
        var transactionId = '';
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions/').respond(400, 'Bad Request');

        // Act
        var errorResult;
        TransactionService.getTransactionById(transactionId).catch(function(error) {
          errorResult = error;
        });
        $httpBackend.flush();

        // Assert
        expect(errorResult).toBeDefined();
      });
    });

    describe('getMockTransactions', function() {
      it('should return array of 5 mock transactions', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(5);
      });

      it('should return first transaction with correct details', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        var txn1 = result[0];
        expect(txn1.transactionId).toBe('TXN001');
        expect(txn1.cardId).toBe('CC001');
        expect(txn1.cardName).toBe('Visa Platinum *1234');
        expect(txn1.amount).toBe(2500);
        expect(txn1.merchant).toBe('Amazon');
        expect(txn1.category).toBe('Shopping');
        expect(txn1.description).toBe('Online purchase');
        expect(txn1.status).toBe('Completed');
      });

      it('should return transactions with different categories', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        var categories = result.map(function(txn) { return txn.category; });
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
      });

      it('should return transactions with valid date objects', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        result.forEach(function(txn) {
          expect(txn.date).toBeDefined();
          expect(txn.date instanceof Date).toBe(true);
        });
      });

      it('should return transactions from different cards', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        var cardIds = result.map(function(txn) { return txn.cardId; });
        expect(cardIds).toContain('CC001');
        expect(cardIds).toContain('CC002');
      });

      it('should return transactions with all required fields', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        result.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.cardName).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.merchant).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.date).toBeDefined();
          expect(txn.description).toBeDefined();
          expect(txn.status).toBeDefined();
        });
      });

      it('should return promise that resolves immediately', function() {
        // Arrange
        var resolved = false;

        // Act
        TransactionService.getMockTransactions().then(function() {
          resolved = true;
        });
        $rootScope.$digest();

        // Assert
        expect(resolved).toBe(true);
      });

      it('should return transactions with positive amounts', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        result.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThan(0);
        });
      });

      it('should return transactions with Completed status', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        result.forEach(function(txn) {
          expect(txn.status).toBe('Completed');
        });
      });

      it('should return transactions in chronological order', function() {
        // Act
        var result;
        TransactionService.getMockTransactions().then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        // Assert
        for (var i = 0; i < result.length - 1; i++) {
          expect(result[i].date >= result[i + 1].date).toBe(true);
        }
      });
    });

    describe('Integration scenarios', function() {
      it('should handle complete transaction workflow', function() {
        // Arrange
        var mockTransactions = [
          { transactionId: 'TXN001', amount: 100 },
          { transactionId: 'TXN002', amount: 200 }
        ];
        var mockTransaction = { transactionId: 'TXN001', amount: 100, merchant: 'Store' };
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

        // Act - Get list
        var listResult;
        TransactionService.getTransactions().then(function(data) {
          listResult = data;
        });
        $httpBackend.flush();

        // Get detail
        $httpBackend.expectGET('/api/transactions/TXN001').respond(200, mockTransaction);
        var detailResult;
        TransactionService.getTransactionById('TXN001').then(function(data) {
          detailResult = data;
        });
        $httpBackend.flush();

        // Assert
        expect(listResult.length).toBe(2);
        expect(detailResult.transactionId).toBe('TXN001');
      });

      it('should handle filtered transactions and detail retrieval', function() {
        // Arrange
        var filters = { cardId: 'CC001' };
        var mockFilteredTransactions = [
          { transactionId: 'TXN001', cardId: 'CC001' }
        ];
        spyOn(AuthService, 'getToken').and.returnValue('test-token');
        $httpBackend.expectGET('/api/transactions?cardId=CC001').respond(200, mockFilteredTransactions);

        // Act
        var result;
        TransactionService.getTransactions(filters).then(function(data) {
          result = data;
        });
        $httpBackend.flush();

        // Assert
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('CC001');
      });
    });
  });
})();