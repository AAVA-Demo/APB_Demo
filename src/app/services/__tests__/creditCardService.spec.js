/*
Test Documentation:
- Test Name: creditCardService Unit Tests
- Purpose: Validate aggregated credit card data retrieval
- Scenario: Test getAggregatedData method
- Expected Result: Correct total credit limit and balance aggregation
*/

describe('creditCardService', function() {
  'use strict';
  
  var creditCardService, $timeout;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_creditCardService_, _$timeout_) {
    creditCardService = _creditCardService_;
    $timeout = _$timeout_;
  }));
  
  describe('getAggregatedData', function() {
    it('should return aggregated credit card data', function() {
      var result;
      creditCardService.getAggregatedData().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result).toBeDefined();
      expect(result.totalLimit).toBe(30000.00);
      expect(result.totalBalance).toBe(7500.00);
    });
    
    it('should resolve promise asynchronously', function() {
      var resolved = false;
      creditCardService.getAggregatedData().then(function() {
        resolved = true;
      });
      
      expect(resolved).toBe(false);
      $timeout.flush();
      expect(resolved).toBe(true);
    });
    
    it('should return numeric values', function() {
      var result;
      creditCardService.getAggregatedData().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(typeof result.totalLimit).toBe('number');
      expect(typeof result.totalBalance).toBe('number');
    });
    
    it('should return data with correct decimal precision', function() {
      var result;
      creditCardService.getAggregatedData().then(function(data) {
        result = data;
      });
      
      $timeout.flush();
      
      expect(result.totalLimit.toFixed(2)).toBe('30000.00');
      expect(result.totalBalance.toFixed(2)).toBe('7500.00');
    });
  });
});

/*
Coverage Report:
- Functions tested: getAggregatedData
- Scenarios covered:
  * Aggregated data retrieval
  * Async promise resolution
  * Data type validation
  * Decimal precision validation
- Uncovered scenarios: Error handling (not implemented in source)
*/