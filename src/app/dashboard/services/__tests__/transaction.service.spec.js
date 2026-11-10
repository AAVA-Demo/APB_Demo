/*
Test Documentation:
- Test Name: TransactionService Unit Tests
- Purpose: Validate transaction data retrieval for current month with API integration and mock fallback
- Scenario: Tests cover successful API calls, date parameter formatting, error handling, and mock data generation
- Expected Result: Current month transactions are retrieved correctly with proper date filtering
*/

(function() {
  'use strict';

  describe('TransactionService', function() {
    var TransactionService, $httpBackend, $rootScope, AuthService;

    beforeEach(module('app.dashboard'));

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

    describe('getCurrentMonthTransactions', function() {
      it('should retrieve transactions from API with correct month parameter', function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var expectedMonth = year + '-' + month;
        
        var mockResponse = [
          { transactionId: 'txn-001', amount: 2500, transactionType: 'Debit' },
          { transactionId: 'txn-002', amount: 1800, transactionType: 'Debit' }
        ];
        
        $httpBackend.expectGET('/api/transactions?month=' + expectedMonth).respond(200, mockResponse);
        
        var result;
        TransactionService.getCurrentMonthTransactions().then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should return mock transactions when API returns empty data', function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var expectedMonth = year + '-' + month;
        
        $httpBackend.expectGET('/api/transactions?month=' + expectedMonth).respond(200, null);
        
        var result;
        TransactionService.getCurrentMonthTransactions().then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(4);
      });

      it('should fallback to mock transactions on API error', function() {
        spyOn(console, 'error');
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var expectedMonth = year + '-' + month;
        
        $httpBackend.expectGET('/api/transactions?month=' + expectedMonth).respond(500, 'Server Error');
        
        var result;
        TransactionService.getCurrentMonthTransactions().then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      });

      it('should return transactions with all required properties', function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var expectedMonth = year + '-' + month;
        
        $httpBackend.expectGET('/api/transactions?month=' + expectedMonth).respond(200, null);
        
        var result;
        TransactionService.getCurrentMonthTransactions().then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.transactionType).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
        });
      });

      it('should format month parameter with leading zero', function() {
        var testDate = new Date(2024, 0, 15); // January
        spyOn(Date.prototype, 'getFullYear').and.returnValue(2024);
        spyOn(Date.prototype, 'getMonth').and.returnValue(0);
        
        $httpBackend.expectGET('/api/transactions?month=2024-01').respond(200, []);
        
        TransactionService.getCurrentMonthTransactions();
        
        $httpBackend.flush();
      });

      it('should handle 404 error gracefully', function() {
        spyOn(console, 'error');
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var expectedMonth = year + '-' + month;
        
        $httpBackend.expectGET('/api/transactions?month=' + expectedMonth).respond(404, 'Not Found');
        
        var result;
        TransactionService.getCurrentMonthTransactions().then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions
- Scenarios covered:
  * Successful API retrieval with month parameter
  * Empty API response with mock fallback
  * API error with mock fallback
  * Required properties validation
  * Month parameter formatting with leading zero
  * 404 error handling
- Uncovered scenarios: None - all transaction retrieval paths tested
- Edge cases: Empty response, server errors, 404 errors, date formatting
*/