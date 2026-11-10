/*
Test Documentation:
- Test Name: AnalyticsApiService Unit Tests
- Purpose: Validate transaction data retrieval for analytics
- Scenario: Tests API calls and mock data generation for 12 months
- Expected Result: Service returns transaction data with proper categorization
*/

(function() {
  'use strict';
  
  describe('AnalyticsApiService', function() {
    var AnalyticsApiService, $httpBackend;
    
    beforeEach(module('analyticsModule'));
    
    beforeEach(inject(function(_AnalyticsApiService_, _$httpBackend_) {
      AnalyticsApiService = _AnalyticsApiService_;
      $httpBackend = _$httpBackend_;
    }));
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('getTransactions()', function() {
      it('should return transactions from API on success', function() {
        var mockTransactions = [
          {transactionId: 'txn1', amount: 1500, category: 'Food & Dining'}
        ];
        $httpBackend.expectGET('/api/analytics/transactions').respond(200, mockTransactions);
        
        var result;
        AnalyticsApiService.getTransactions().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(mockTransactions);
      });
      
      it('should return mock transactions on API failure', function() {
        $httpBackend.expectGET('/api/analytics/transactions').respond(500);
        
        var result;
        AnalyticsApiService.getTransactions().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      });
      
      it('should generate transactions for 12 months', function() {
        $httpBackend.expectGET('/api/analytics/transactions').respond(404);
        
        var result;
        AnalyticsApiService.getTransactions().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result.length).toBe(240);
      });
      
      it('should include all required transaction fields', function() {
        $httpBackend.expectGET('/api/analytics/transactions').respond(500);
        
        var result;
        AnalyticsApiService.getTransactions().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result[0]).toEqual(jasmine.objectContaining({
          transactionId: jasmine.any(String),
          cardId: jasmine.any(String),
          amount: jasmine.any(Number),
          date: jasmine.any(Date),
          category: jasmine.any(String),
          merchantName: jasmine.any(String)
        }));
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered:
  * Successful API response
  * API failure with mock data
  * 12-month data generation
  * Transaction structure validation
- Uncovered scenarios: Date range filtering, pagination
*/