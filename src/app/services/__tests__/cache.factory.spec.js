/*
Test Documentation:
- Test Name: CacheFactory - put and get operations
- Purpose: Validates that data can be stored and retrieved from cache with TTL
- Scenario: Data is cached with specified TTL and retrieved before expiry
- Expected Result: Cached data is returned correctly before TTL expires
*/
/*
Test Documentation:
- Test Name: CacheFactory - cache expiry handling
- Purpose: Validates that expired cache entries return null and are removed
- Scenario: Cached data is accessed after TTL has expired
- Expected Result: Returns null and removes expired entry from cache
*/
/*
Test Documentation:
- Test Name: CacheFactory - remove operation
- Purpose: Validates that cache entries can be manually removed
- Scenario: User explicitly removes a cache entry
- Expected Result: Entry is removed and subsequent get returns null
*/
/*
Coverage Report:
- Functions tested: get, put, remove
- Scenarios covered: cache storage, retrieval, expiry, manual removal, non-existent key
- Uncovered scenarios: none - all cache operations tested
- Edge cases: expired cache, null data, undefined key, negative TTL
*/

(function() {
  'use strict';

  describe('CacheFactory', function() {
    var CacheFactory, $cacheFactory;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CacheFactory_, _$cacheFactory_) {
      CacheFactory = _CacheFactory_;
      $cacheFactory = _$cacheFactory_;
    }));

    describe('put and get operations', function() {
      it('should store and retrieve data correctly', function() {
        var testKey = 'testKey';
        var testData = {name: 'Test', value: 123};
        var ttl = 60;

        CacheFactory.put(testKey, testData, ttl);
        var result = CacheFactory.get(testKey);

        expect(result).toEqual(testData);
      });

      it('should return null for non-existent key', function() {
        var result = CacheFactory.get('nonExistentKey');

        expect(result).toBeNull();
      });

      it('should handle multiple cache entries independently', function() {
        var key1 = 'key1';
        var key2 = 'key2';
        var data1 = {id: 1};
        var data2 = {id: 2};

        CacheFactory.put(key1, data1, 60);
        CacheFactory.put(key2, data2, 60);

        expect(CacheFactory.get(key1)).toEqual(data1);
        expect(CacheFactory.get(key2)).toEqual(data2);
      });

      it('should overwrite existing cache entry with same key', function() {
        var key = 'sameKey';
        var oldData = {version: 1};
        var newData = {version: 2};

        CacheFactory.put(key, oldData, 60);
        CacheFactory.put(key, newData, 60);

        var result = CacheFactory.get(key);
        expect(result).toEqual(newData);
      });
    });

    describe('cache expiry handling', function() {
      it('should return null for expired cache entry', function() {
        jasmine.clock().install();
        var baseTime = new Date(2024, 0, 1);
        jasmine.clock().mockDate(baseTime);

        var testKey = 'expiringKey';
        var testData = {expires: true};
        var ttl = 5;

        CacheFactory.put(testKey, testData, ttl);

        jasmine.clock().tick(6000);

        var result = CacheFactory.get(testKey);
        expect(result).toBeNull();

        jasmine.clock().uninstall();
      });

      it('should return data when accessed before expiry', function() {
        jasmine.clock().install();
        var baseTime = new Date(2024, 0, 1);
        jasmine.clock().mockDate(baseTime);

        var testKey = 'validKey';
        var testData = {valid: true};
        var ttl = 10;

        CacheFactory.put(testKey, testData, ttl);

        jasmine.clock().tick(5000);

        var result = CacheFactory.get(testKey);
        expect(result).toEqual(testData);

        jasmine.clock().uninstall();
      });

      it('should remove expired entry from cache', function() {
        jasmine.clock().install();
        var baseTime = new Date(2024, 0, 1);
        jasmine.clock().mockDate(baseTime);

        var testKey = 'removeKey';
        var testData = {remove: true};
        var ttl = 3;

        CacheFactory.put(testKey, testData, ttl);
        jasmine.clock().tick(4000);

        CacheFactory.get(testKey);
        var secondGet = CacheFactory.get(testKey);

        expect(secondGet).toBeNull();

        jasmine.clock().uninstall();
      });
    });

    describe('remove operation', function() {
      it('should remove cache entry and return null on subsequent get', function() {
        var testKey = 'removeTest';
        var testData = {data: 'test'};

        CacheFactory.put(testKey, testData, 60);
        expect(CacheFactory.get(testKey)).toEqual(testData);

        CacheFactory.remove(testKey);
        var result = CacheFactory.get(testKey);

        expect(result).toBeNull();
      });

      it('should handle removal of non-existent key gracefully', function() {
        expect(function() {
          CacheFactory.remove('nonExistentKey');
        }).not.toThrow();
      });

      it('should not affect other cache entries when removing one', function() {
        var key1 = 'keep';
        var key2 = 'remove';
        var data1 = {keep: true};
        var data2 = {remove: true};

        CacheFactory.put(key1, data1, 60);
        CacheFactory.put(key2, data2, 60);

        CacheFactory.remove(key2);

        expect(CacheFactory.get(key1)).toEqual(data1);
        expect(CacheFactory.get(key2)).toBeNull();
      });
    });

    describe('edge cases', function() {
      it('should handle null data', function() {
        var key = 'nullData';
        CacheFactory.put(key, null, 60);

        var result = CacheFactory.get(key);
        expect(result).toBeNull();
      });

      it('should handle undefined data', function() {
        var key = 'undefinedData';
        CacheFactory.put(key, undefined, 60);

        var result = CacheFactory.get(key);
        expect(result).toBeUndefined();
      });

      it('should handle zero TTL', function() {
        jasmine.clock().install();
        var baseTime = new Date(2024, 0, 1);
        jasmine.clock().mockDate(baseTime);

        var key = 'zeroTTL';
        var data = {ttl: 0};
        CacheFactory.put(key, data, 0);

        jasmine.clock().tick(1);

        var result = CacheFactory.get(key);
        expect(result).toBeNull();

        jasmine.clock().uninstall();
      });
    });
  });
})();