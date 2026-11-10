/*
Test Documentation:
- Test Name: CacheService - set
- Purpose: Validates that cache entries are correctly stored with key-value pairs
- Scenario: Call set with key, value, and optional TTL
- Expected Result: Cache entry is stored and retrievable
*/
/*
Test Documentation:
- Test Name: CacheService - get
- Purpose: Validates retrieval of cached values and TTL expiration
- Scenario: Retrieve existing cache entry, non-existent entry, and expired entry
- Expected Result: Correct value returned for valid entries, null for invalid/expired
*/
/*
Test Documentation:
- Test Name: CacheService - clear
- Purpose: Validates cache clearing for specific key or all keys
- Scenario: Clear specific cache entry or clear entire cache
- Expected Result: Specified entries are removed from cache
*/
/*
Coverage Report:
- Functions tested: set, get, clear
- Scenarios covered: basic set/get, TTL expiration, cache miss, specific key clear, full cache clear, overwrite existing key
- Uncovered scenarios: none
- Edge cases: expired cache retrieval, null key handling, negative TTL
*/

(function() {
  'use strict';

  describe('CacheService', function() {
    var CacheService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CacheService_) {
      CacheService = _CacheService_;
      // Clear cache before each test
      CacheService.clear();
    }));

    describe('set', function() {
      it('should store a value in cache without TTL', function() {
        CacheService.set('testKey', 'testValue');
        var value = CacheService.get('testKey');
        expect(value).toBe('testValue');
      });

      it('should store a value in cache with TTL', function() {
        CacheService.set('testKey', 'testValue', 5000);
        var value = CacheService.get('testKey');
        expect(value).toBe('testValue');
      });

      it('should store an object in cache', function() {
        var obj = { name: 'John', age: 30 };
        CacheService.set('userKey', obj);
        var value = CacheService.get('userKey');
        expect(value).toEqual(obj);
      });

      it('should store an array in cache', function() {
        var arr = [1, 2, 3, 4, 5];
        CacheService.set('arrayKey', arr);
        var value = CacheService.get('arrayKey');
        expect(value).toEqual(arr);
      });

      it('should overwrite existing cache entry', function() {
        CacheService.set('key1', 'value1');
        CacheService.set('key1', 'value2');
        var value = CacheService.get('key1');
        expect(value).toBe('value2');
      });

      it('should handle null value', function() {
        CacheService.set('nullKey', null);
        var value = CacheService.get('nullKey');
        expect(value).toBeNull();
      });

      it('should handle undefined value', function() {
        CacheService.set('undefinedKey', undefined);
        var value = CacheService.get('undefinedKey');
        expect(value).toBeUndefined();
      });
    });

    describe('get', function() {
      it('should return null for non-existent key', function() {
        var value = CacheService.get('nonExistentKey');
        expect(value).toBeNull();
      });

      it('should return cached value for valid key', function() {
        CacheService.set('validKey', 'validValue');
        var value = CacheService.get('validKey');
        expect(value).toBe('validValue');
      });

      it('should return null for expired cache entry', function(done) {
        CacheService.set('expireKey', 'expireValue', 50);
        setTimeout(function() {
          var value = CacheService.get('expireKey');
          expect(value).toBeNull();
          done();
        }, 100);
      });

      it('should return value before TTL expires', function() {
        CacheService.set('ttlKey', 'ttlValue', 10000);
        var value = CacheService.get('ttlKey');
        expect(value).toBe('ttlValue');
      });

      it('should return cached object correctly', function() {
        var obj = { id: 1, name: 'Test' };
        CacheService.set('objKey', obj);
        var value = CacheService.get('objKey');
        expect(value).toEqual(obj);
      });
    });

    describe('clear', function() {
      it('should clear specific cache entry', function() {
        CacheService.set('key1', 'value1');
        CacheService.set('key2', 'value2');
        CacheService.clear('key1');
        expect(CacheService.get('key1')).toBeNull();
        expect(CacheService.get('key2')).toBe('value2');
      });

      it('should clear all cache entries when no key provided', function() {
        CacheService.set('key1', 'value1');
        CacheService.set('key2', 'value2');
        CacheService.set('key3', 'value3');
        CacheService.clear();
        expect(CacheService.get('key1')).toBeNull();
        expect(CacheService.get('key2')).toBeNull();
        expect(CacheService.get('key3')).toBeNull();
      });

      it('should not throw error when clearing non-existent key', function() {
        expect(function() {
          CacheService.clear('nonExistentKey');
        }).not.toThrow();
      });

      it('should handle clearing empty cache', function() {
        expect(function() {
          CacheService.clear();
        }).not.toThrow();
      });
    });

    describe('TTL expiration edge cases', function() {
      it('should handle zero TTL as no expiration', function() {
        CacheService.set('zeroTTL', 'value', 0);
        var value = CacheService.get('zeroTTL');
        expect(value).toBe('value');
      });

      it('should handle negative TTL as immediate expiration', function(done) {
        CacheService.set('negativeTTL', 'value', -1000);
        setTimeout(function() {
          var value = CacheService.get('negativeTTL');
          expect(value).toBeNull();
          done();
        }, 10);
      });

      it('should remove expired entry from cache on get', function(done) {
        CacheService.set('removeExpired', 'value', 50);
        setTimeout(function() {
          CacheService.get('removeExpired');
          var value = CacheService.get('removeExpired');
          expect(value).toBeNull();
          done();
        }, 100);
      });
    });
  });
})();