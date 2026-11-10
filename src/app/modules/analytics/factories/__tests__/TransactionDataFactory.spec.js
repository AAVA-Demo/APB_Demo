/*
Test Documentation:
- Test Name: TransactionDataFactory (Analytics) - fetchTransactions
- Purpose: Validates fetching transaction data for analytics
- Scenario: HTTP GET request to /api/transactions
- Expected Result: Promise resolves with transaction data
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: successful fetch, error handling
- Uncovered scenarios: none
*/

describe('TransactionDataFactory (Analytics)', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var TransactionDataFactory, $httpBackend;
  
  beforeEach(inject(function(_TransactionDataFactory_, _$httpBackend_) {
    TransactionDataFactory = _TransactionDataFactory_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchTransactions', function() {
    it('should fetch all transactions for analytics', function() {
      var mockTransactions = [
        { transactionId: 1, amount: 100, merchantCode: '5812', category: 'Food & Dining' },
        { transactionId: 2, amount: 250, merchantCode: '5541', category: 'Fuel' }
      ];
      
      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);
      
      var result;
      TransactionDataFactory.fetchTransactions().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
    });
    
    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');
      
      var errorResult;
      TransactionDataFactory.fetchTransactions().catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });
  });
});