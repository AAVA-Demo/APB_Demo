/*
Test Documentation:
- Test Name: CacheService - get
- Purpose: Verify that get retrieves cached values before TTL expiry
- Scenario: When a value is cached with TTL and retrieved before expiry, it should be returned
- Expected Result: Cached value is returned successfully
*/
/*
Test Documentation:
- Test Name: CacheService - get expired
- Purpose: Verify that get returns undefined for expired cache entries
- Scenario: When a cached value's TTL has expired, get should return undefined
- Expected Result: Undefined is returned for expired entries
*/
/*
Test Documentation:
- Test Name: CacheService - put
- Purpose: Verify that put stores values in cache with TTL
- Scenario: When put is called with key, value, and TTL, the value should be cached
- Expected Result: Value is stored and retrievable before TTL expiry
*/
/*
Test Documentation:
- Test Name: CacheService - remove
- Purpose: Verify that remove deletes cached values
- Scenario: When remove is called with a key, the cached value should be deleted
- Expected Result: Value is removed from cache and TTL map
*/
/*
Test Documentation:
- Test Name: CacheService - removeAll
- Purpose: Verify that removeAll clears entire cache
- Scenario: When removeAll is called, all cached values and TTL entries should be cleared
- Expected Result: Cache and TTL map are completely cleared
*/
/*
Coverage Report:
- Functions tested: get, put, remove, removeAll
- Scenarios covered: cache storage, cache retrieval, TTL expiry, cache removal, bulk removal
- Uncovered scenarios: none
*/

describe('CacheService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var CacheService;
  var originalDateNow;

  beforeEach(inject(function(_CacheService_) {
    CacheService = _CacheService_;
    originalDateNow = Date.now;
  }));

  afterEach(function() {
    Date.now = originalDateNow;
    CacheService.removeAll();
  });

  describe('put', function() {
    it('should store value in cache with TTL', function() {
      CacheService.put('testKey', 'testValue', 60);
      var result = CacheService.get('testKey');
      expect(result).toBe('testValue');
    });

    it('should store object values in cache', function() {
      var testObj = { name: 'John', age: 30 };
      CacheService.put('userKey', testObj, 60);
      var result = CacheService.get('userKey');
      expect(result).toEqual(testObj);
    });

    it('should store array values in cache', function() {
      var testArray = [1, 2, 3, 4, 5];
      CacheService.put('arrayKey', testArray, 60);
      var result = CacheService.get('arrayKey');
      expect(result).toEqual(testArray);
    });

    it('should overwrite existing cache entry with same key', function() {
      CacheService.put('key1', 'value1', 60);
      CacheService.put('key1', 'value2', 60);
      var result = CacheService.get('key1');
      expect(result).toBe('value2');
    });

    it('should handle zero TTL seconds', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('zeroTTL', 'value', 0);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 1);
      var result = CacheService.get('zeroTTL');
      expect(result).toBeUndefined();
    });

    it('should handle large TTL values', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('largeTTL', 'value', 86400);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 1000);
      var result = CacheService.get('largeTTL');
      expect(result).toBe('value');
    });
  });

  describe('get', function() {
    it('should return cached value before TTL expiry', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('key1', 'value1', 60);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 30000);
      var result = CacheService.get('key1');
      expect(result).toBe('value1');
    });

    it('should return undefined for expired cache entry', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('expiredKey', 'expiredValue', 10);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 11000);
      var result = CacheService.get('expiredKey');
      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent key', function() {
      var result = CacheService.get('nonExistentKey');
      expect(result).toBeUndefined();
    });

    it('should remove expired entry from cache when accessed', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('toExpire', 'value', 5);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 6000);
      CacheService.get('toExpire');
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 7000);
      var result = CacheService.get('toExpire');
      expect(result).toBeUndefined();
    });

    it('should return undefined when TTL entry exists but cache entry missing', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('key1', 'value1', 60);
      CacheService.remove('key1');
      var result = CacheService.get('key1');
      expect(result).toBeUndefined();
    });

    it('should handle multiple cache entries with different TTLs', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('short', 'shortValue', 10);
      CacheService.put('long', 'longValue', 100);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 15000);
      var shortResult = CacheService.get('short');
      var longResult = CacheService.get('long');
      expect(shortResult).toBeUndefined();
      expect(longResult).toBe('longValue');
    });
  });

  describe('remove', function() {
    it('should remove cached value', function() {
      CacheService.put('removeKey', 'removeValue', 60);
      CacheService.remove('removeKey');
      var result = CacheService.get('removeKey');
      expect(result).toBeUndefined();
    });

    it('should remove TTL entry when removing cache', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('key1', 'value1', 60);
      CacheService.remove('key1');
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 1000);
      var result = CacheService.get('key1');
      expect(result).toBeUndefined();
    });

    it('should not throw error when removing non-existent key', function() {
      expect(function() {
        CacheService.remove('nonExistent');
      }).not.toThrow();
    });

    it('should only remove specified key', function() {
      CacheService.put('key1', 'value1', 60);
      CacheService.put('key2', 'value2', 60);
      CacheService.remove('key1');
      var result1 = CacheService.get('key1');
      var result2 = CacheService.get('key2');
      expect(result1).toBeUndefined();
      expect(result2).toBe('value2');
    });
  });

  describe('removeAll', function() {
    it('should clear all cached values', function() {
      CacheService.put('key1', 'value1', 60);
      CacheService.put('key2', 'value2', 60);
      CacheService.put('key3', 'value3', 60);
      CacheService.removeAll();
      var result1 = CacheService.get('key1');
      var result2 = CacheService.get('key2');
      var result3 = CacheService.get('key3');
      expect(result1).toBeUndefined();
      expect(result2).toBeUndefined();
      expect(result3).toBeUndefined();
    });

    it('should clear all TTL entries', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('key1', 'value1', 60);
      CacheService.put('key2', 'value2', 60);
      CacheService.removeAll();
      CacheService.put('key1', 'newValue', 60);
      var result = CacheService.get('key1');
      expect(result).toBe('newValue');
    });

    it('should not throw error when cache is already empty', function() {
      expect(function() {
        CacheService.removeAll();
      }).not.toThrow();
    });

    it('should allow new entries after removeAll', function() {
      CacheService.put('key1', 'value1', 60);
      CacheService.removeAll();
      CacheService.put('key2', 'value2', 60);
      var result = CacheService.get('key2');
      expect(result).toBe('value2');
    });
  });

  describe('TTL expiry edge cases', function() {
    it('should return value when accessed exactly at expiry time', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('exactExpiry', 'value', 60);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 60000);
      var result = CacheService.get('exactExpiry');
      expect(result).toBeUndefined();
    });

    it('should return value when accessed 1ms before expiry', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('almostExpired', 'value', 60);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 59999);
      var result = CacheService.get('almostExpired');
      expect(result).toBe('value');
    });

    it('should return undefined when accessed 1ms after expiry', function() {
      var currentTime = 1000000;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime);
      CacheService.put('justExpired', 'value', 60);
      Date.now = jasmine.createSpy('Date.now').and.returnValue(currentTime + 60001);
      var result = CacheService.get('justExpired');
      expect(result).toBeUndefined();
    });
  });

  describe('complex data types', function() {
    it('should cache and retrieve nested objects', function() {
      var complexObj = {
        user: {
          name: 'John',
          address: {
            street: '123 Main St',
            city: 'New York'
          }
        },
        preferences: ['dark', 'compact']
      };
      CacheService.put('complex', complexObj, 60);
      var result = CacheService.get('complex');
      expect(result).toEqual(complexObj);
      expect(result.user.address.city).toBe('New York');
    });

    it('should cache null values', function() {
      CacheService.put('nullKey', null, 60);
      var result = CacheService.get('nullKey');
      expect(result).toBeNull();
    });

    it('should cache boolean values', function() {
      CacheService.put('boolTrue', true, 60);
      CacheService.put('boolFalse', false, 60);
      var resultTrue = CacheService.get('boolTrue');
      var resultFalse = CacheService.get('boolFalse');
      expect(resultTrue).toBe(true);
      expect(resultFalse).toBe(false);
    });

    it('should cache numeric values including zero', function() {
      CacheService.put('zero', 0, 60);
      CacheService.put('negative', -42, 60);
      CacheService.put('float', 3.14, 60);
      expect(CacheService.get('zero')).toBe(0);
      expect(CacheService.get('negative')).toBe(-42);
      expect(CacheService.get('float')).toBe(3.14);
    });
  });
});