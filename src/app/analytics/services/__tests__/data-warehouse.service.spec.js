/*
Test Documentation:
- Test Name: DataWarehouseService Unit Tests
- Purpose: Validate historical transaction retrieval with date range filtering and mock data generation
- Scenario: Tests cover successful API calls, date parameter formatting, error handling, and mock data generation with date ranges
- Expected Result: Historical transactions are retrieved correctly with proper date filtering
*/

(function() {
  'use strict';

  describe('DataWarehouseService', function() {
    var DataWarehouseService, $httpBackend, $rootScope, AuthService;

    beforeEach(module('app.analytics'));

    beforeEach(function() {
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token')
      };
      
      module(function($provide) {
        $provide.value('AuthService', AuthService);
      });
    });

    beforeEach(inject(function(_DataWarehouseService_, _$httpBackend_, _$rootScope_) {
      DataWarehouseService = _DataWarehouseService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getHistoricalTransactions', function() {
      it('should retrieve transactions from API with date range parameters', function() {
        var dateRange = {
          start: new Date(2024, 0, 1),
          end: new Date(2024, 11, 31)
        };
        
        var mockResponse = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining' },
          { transactionId: 'txn-002', amount: 1800, category: 'Shopping' }
        ];
        
        var expectedUrl = '/api/transactions/historical?start=' + dateRange.start.toISOString() + '&end=' + dateRange.end.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);
        
        var result;
        DataWarehouseService.getHistoricalTransactions(dateRange).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
      });

      it('should retrieve transactions without date range parameters', function() {
        var mockResponse = [
          { transactionId: 'txn-001', amount: 2500, category: 'Food & Dining' }
        ];
        
        $httpBackend.expectGET('/api/transactions/historical').respond(200, mockResponse);
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
      });

      it('should return mock transactions when API returns empty data', function() {
        $httpBackend.expectGET('/api/transactions/historical').respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(200);
      });

      it('should fallback to mock transactions on API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/transactions/historical').respond(500, 'Server Error');
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(console.error).toHaveBeenCalledWith('Error fetching historical transactions:', jasmine.any(Object));
        expect(result).toBeDefined();
        expect(result.length).toBe(200);
      });

      it('should generate mock transactions with all required properties', function() {
        $httpBackend.expectGET('/api/transactions/historical').respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.transactionId).toBeDefined();
          expect(txn.amount).toBeDefined();
          expect(txn.category).toBeDefined();
          expect(txn.merchantName).toBeDefined();
          expect(txn.transactionDate).toBeDefined();
          expect(txn.cardId).toBeDefined();
          expect(txn.transactionType).toBe('Debit');
        });
      });

      it('should generate mock transactions with valid categories', function() {
        $httpBackend.expectGET('/api/transactions/historical').respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        
        result.forEach(function(txn) {
          expect(validCategories).toContain(txn.category);
        });
      });

      it('should generate mock transactions with amounts in valid range', function() {
        $httpBackend.expectGET('/api/transactions/historical').respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions({}).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          expect(txn.amount).toBeGreaterThanOrEqual(500);
          expect(txn.amount).toBeLessThanOrEqual(5500);
        });
      });

      it('should generate mock transactions within specified date range', function() {
        var dateRange = {
          start: new Date(2024, 0, 1),
          end: new Date(2024, 2, 31)
        };
        
        $httpBackend.expectGET(jasmine.any(String)).respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions(dateRange).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        result.forEach(function(txn) {
          var txnDate = new Date(txn.transactionDate);
          expect(txnDate).toBeGreaterThanOrEqual(dateRange.start);
          expect(txnDate).toBeLessThanOrEqual(dateRange.end);
        });
      });

      it('should use default date range when not provided', function() {
        $httpBackend.expectGET('/api/transactions/historical').respond(200, null);
        
        var result;
        DataWarehouseService.getHistoricalTransactions(null).then(function(transactions) {
          result = transactions;
        });
        
        $httpBackend.flush();
        
        expect(result).toBeDefined();
        expect(result.length).toBe(200);
        
        var now = new Date();
        var oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        
        result.forEach(function(txn) {
          var txnDate = new Date(txn.transactionDate);
          expect(txnDate).toBeGreaterThanOrEqual(oneYearAgo);
          expect(txnDate).toBeLessThanOrEqual(now);
        });
      });

      it('should handle only start date provided', function() {
        var dateRange = {
          start: new Date(2024, 0, 1)
        };
        
        var expectedUrl = '/api/transactions/historical?start=' + dateRange.start.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, []);
        
        DataWarehouseService.getHistoricalTransactions(dateRange);
        
        $httpBackend.flush();
      });

      it('should handle only end date provided', function() {
        var dateRange = {
          end: new Date(2024, 11, 31)
        };
        
        var expectedUrl = '/api/transactions/historical?end=' + dateRange.end.toISOString();
        $httpBackend.expectGET(expectedUrl).respond(200, []);
        
        DataWarehouseService.getHistoricalTransactions(dateRange);
        
        $httpBackend.flush();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getHistoricalTransactions
- Scenarios covered:
  * Successful API retrieval with date range
  * API retrieval without date range
  * Empty API response with mock fallback
  * API error with mock fallback
  * Required properties validation
  * Valid category generation
  * Amount range validation
  * Date range filtering for mock data
  * Default date range (1 year)
  * Only start date provided
  * Only end date provided
- Uncovered scenarios: None - all historical data retrieval paths tested
- Edge cases: Empty response, server errors, various date range combinations, mock data generation
*/