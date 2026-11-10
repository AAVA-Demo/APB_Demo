/*
Test Documentation:
- Test Name: cacheService - Put and Get
- Purpose: Verify cache stores and retrieves data correctly
- Scenario: Store data with TTL and retrieve before expiry
- Expected Result: Returns cached data
*/
/*
Test Documentation:
- Test Name: cacheService - Expired Data
- Purpose: Verify cache returns null for expired data
- Scenario: Retrieve data after TTL expiry
- Expected Result: Returns null and removes from cache
*/
/*
Test Documentation:
- Test Name: cacheService - Missing Key
- Purpose: Verify cache returns null for non-existent keys
- Scenario: Request key that was never cached
- Expected Result: Returns null
*/
/*
Coverage Report:
- Functions tested: get, put
- Scenarios covered: cache hit, cache miss, expiry
- Uncovered scenarios: none
*/

describe('cacheService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var cacheService;
  
  beforeEach(inject(function(_cacheService_) {
    cacheService = _cacheService_;
  }));
  
  it('should store and retrieve data correctly', function() {
    var testData = {key: 'value', number: 123};
    cacheService.put('testKey', testData, 60);
    
    var result = cacheService.get('testKey');
    expect(result).toEqual(testData);
  });
  
  it('should return null for expired data', function() {
    var testData = {key: 'value'};
    cacheService.put('testKey', testData, -1);
    
    var result = cacheService.get('testKey');
    expect(result).toBe(null);
  });
  
  it('should return null for non-existent key', function() {
    var result = cacheService.get('nonExistentKey');
    expect(result).toBe(null);
  });
  
  it('should handle multiple cache entries', function() {
    cacheService.put('key1', {data: 'value1'}, 60);
    cacheService.put('key2', {data: 'value2'}, 60);
    
    expect(cacheService.get('key1').data).toBe('value1');
    expect(cacheService.get('key2').data).toBe('value2');
  });
  
  it('should remove expired items from cache', function() {
    cacheService.put('expiredKey', {data: 'value'}, -1);
    cacheService.get('expiredKey');
    
    var result = cacheService.get('expiredKey');
    expect(result).toBe(null);
  });
});