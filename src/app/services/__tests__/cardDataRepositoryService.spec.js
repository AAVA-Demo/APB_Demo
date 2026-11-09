/*
Test Documentation:
- Test Name: cardDataRepositoryService Unit Tests
- Purpose: Validate card summary data retrieval
- Scenario: Test getCardSummary method with async promise resolution
- Expected Result: Correct card summary data with total limits and outstanding amounts
*/

describe('cardDataRepositoryService', function() {
  'use strict';
  
  var cardDataRepositoryService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_cardDataRepositoryService_, _$timeout_) {
    cardDataRepositoryService = _cardDataRepositoryService_;
    $timeout = _$timeout_;
  }));
  
  describe('getCardSummary', function() {
    it('should return card summary data', function() {
      var result;
      cardDataRepositoryService.getCardSummary().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.totalLimit).toBe(30000.00);
      expect(result.totalOutstanding).toBe(7500.00);
      expect(result.cardCount).toBe(3);
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      cardDataRepositoryService.getCardSummary().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
    
    it('should return data with correct types', function() {
      var result;
      cardDataRepositoryService.getCardSummary().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(typeof result.totalLimit).toBe('number');
      expect(typeof result.totalOutstanding).toBe('number');
      expect(typeof result.cardCount).toBe('number');
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardSummary
- Scenarios covered:
  * Card summary retrieval
  * Async promise resolution
  * Data type validation
- Uncovered scenarios: Error handling (not implemented in source)
*/