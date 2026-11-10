/*
Test Documentation:
- Test Name: CardTransactionService Unit Tests
- Purpose: Validate card-wise spending data retrieval
- Scenario: Tests API calls for card transactions and spending analysis
- Expected Result: Service returns spending metrics or mock data
*/

(function() {
  'use strict';
  
  describe('CardTransactionService', function() {
    var CardTransactionService, $httpBackend;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_CardTransactionService_, _$httpBackend_) {
      CardTransactionService = _CardTransactionService_;
      $httpBackend = _$httpBackend_;
    }));
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('getCardSpending()', function() {
      it('should return spending data from API on success', function() {
        var mockSpending = {monthlySpend: 3000, totalTransactions: 15};
        $httpBackend.expectGET('/api/cards/card1/transactions').respond(200, mockSpending);
        
        var result;
        CardTransactionService.getCardSpending('card1').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(mockSpending);
      });
      
      it('should return mock spending data on API failure', function() {
        $httpBackend.expectGET('/api/cards/card1/transactions').respond(500);
        
        var result;
        CardTransactionService.getCardSpending('card1').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result.monthlySpend).toBe(5800);
        expect(result.totalTransactions).toBe(23);
      });
      
      it('should return zero spending for inactive card', function() {
        $httpBackend.expectGET('/api/cards/card4/transactions').respond(404);
        
        var result;
        CardTransactionService.getCardSpending('card4').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result.monthlySpend).toBe(0);
        expect(result.totalTransactions).toBe(0);
      });
      
      it('should return default structure for unknown card', function() {
        $httpBackend.expectGET('/api/cards/unknown/transactions').respond(500);
        
        var result;
        CardTransactionService.getCardSpending('unknown').then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual({
          monthlySpend: 0,
          totalTransactions: 0,
          lastTransactionDate: null
        });
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: getCardSpending
- Scenarios covered:
  * Successful API response
  * API failure with mock data
  * Inactive card handling
  * Unknown card default values
- Uncovered scenarios: Date range filtering, transaction categorization
*/