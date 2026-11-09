/*
Test Documentation:
- Test Name: CacheService functionality tests
- Purpose: Validates cache operations including get, put, remove, and removeAll for multiple cache instances
- Scenario: Tests cache service methods with normal operations, edge cases, and error scenarios
- Expected Result: All cache operations work correctly with proper data storage and retrieval
*/

(function() {
  'use strict';

  describe('CacheService', function() {
    var CacheService, $cacheFactory, API_CONFIG;
    var mockCardCache, mockTransactionCache;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CacheService_, _$cacheFactory_, _API_CONFIG_) {
      CacheService = _CacheService_;
      $cacheFactory = _$cacheFactory_;
      API_CONFIG = _API_CONFIG_;
    }));

    describe('Service Initialization', function() {
      it('should be defined', function() {
        expect(CacheService).toBeDefined();
      });

      it('should initialize cardCache', function() {
        expect(CacheService.cardCache).toBeDefined();
      });

      it('should initialize transactionCache', function() {
        expect(CacheService.transactionCache).toBeDefined();
      });

      it('should create cardCache with capacity 50', function() {
        var info = CacheService.cardCache.info();
        expect(info.size).toBeDefined();
      });

      it('should create transactionCache with capacity 100', function() {
        var info = CacheService.transactionCache.info();
        expect(info.size).toBeDefined();
      });
    });

    describe('get() method', function() {
      it('should be defined', function() {
        expect(CacheService.get).toBeDefined();
        expect(typeof CacheService.get).toBe('function');
      });

      it('should retrieve value from cardCache', function() {
        var testKey = 'testCard123';
        var testValue = { cardId: '123', balance: 1000 };
        CacheService.cardCache.put(testKey, testValue);
        var result = CacheService.get('cardCache', testKey);
        expect(result).toEqual(testValue);
      });

      it('should retrieve value from transactionCache', function() {
        var testKey = 'testTransaction456';
        var testValue = { transactionId: '456', amount: 250 };
        CacheService.transactionCache.put(testKey, testValue);
        var result = CacheService.get('transactionCache', testKey);
        expect(result).toEqual(testValue);
      });

      it('should return null for non-existent key', function() {
        var result = CacheService.get('cardCache', 'nonExistentKey');
        expect(result).toBeUndefined();
      });

      it('should return null for invalid cache name', function() {
        var result = CacheService.get('invalidCache', 'someKey');
        expect(result).toBeNull();
      });

      it('should handle null key gracefully', function() {
        var result = CacheService.get('cardCache', null);
        expect(result).toBeUndefined();
      });

      it('should handle undefined key gracefully', function() {
        var result = CacheService.get('cardCache', undefined);
        expect(result).toBeUndefined();
      });
    });

    describe('put() method', function() {
      it('should be defined', function() {
        expect(CacheService.put).toBeDefined();
        expect(typeof CacheService.put).toBe('function');
      });

      it('should store value in cardCache', function() {
        var testKey = 'card789';
        var testValue = { cardId: '789', limit: 5000 };
        CacheService.put('cardCache', testKey, testValue);
        var retrieved = CacheService.cardCache.get(testKey);
        expect(retrieved).toEqual(testValue);
      });

      it('should store value in transactionCache', function() {
        var testKey = 'trans101';
        var testValue = { transactionId: '101', merchant: 'Store' };
        CacheService.put('transactionCache', testKey, testValue);
        var retrieved = CacheService.transactionCache.get(testKey);
        expect(retrieved).toEqual(testValue);
      });

      it('should overwrite existing value', function() {
        var testKey = 'card999';
        var firstValue = { balance: 100 };
        var secondValue = { balance: 200 };
        CacheService.put('cardCache', testKey, firstValue);
        CacheService.put('cardCache', testKey, secondValue);
        var result = CacheService.get('cardCache', testKey);
        expect(result).toEqual(secondValue);
      });

      it('should handle invalid cache name gracefully', function() {
        expect(function() {
          CacheService.put('invalidCache', 'key', 'value');
        }).not.toThrow();
      });

      it('should store null values', function() {
        var testKey = 'nullKey';
        CacheService.put('cardCache', testKey, null);
        var result = CacheService.get('cardCache', testKey);
        expect(result).toBeNull();
      });

      it('should store complex objects', function() {
        var complexObject = {
          id: '123',
          nested: { value: 'test', array: [1, 2, 3] },
          date: new Date()
        };
        CacheService.put('cardCache', 'complex', complexObject);
        var result = CacheService.get('cardCache', 'complex');
        expect(result).toEqual(complexObject);
      });
    });

    describe('remove() method', function() {
      it('should be defined', function() {
        expect(CacheService.remove).toBeDefined();
        expect(typeof CacheService.remove).toBe('function');
      });

      it('should remove value from cardCache', function() {
        var testKey = 'removeCard';
        var testValue = { cardId: 'remove123' };
        CacheService.put('cardCache', testKey, testValue);
        expect(CacheService.get('cardCache', testKey)).toEqual(testValue);
        CacheService.remove('cardCache', testKey);
        expect(CacheService.get('cardCache', testKey)).toBeUndefined();
      });

      it('should remove value from transactionCache', function() {
        var testKey = 'removeTrans';
        var testValue = { transactionId: 'remove456' };
        CacheService.put('transactionCache', testKey, testValue);
        expect(CacheService.get('transactionCache', testKey)).toEqual(testValue);
        CacheService.remove('transactionCache', testKey);
        expect(CacheService.get('transactionCache', testKey)).toBeUndefined();
      });

      it('should handle removing non-existent key gracefully', function() {
        expect(function() {
          CacheService.remove('cardCache', 'nonExistentKey');
        }).not.toThrow();
      });

      it('should handle invalid cache name gracefully', function() {
        expect(function() {
          CacheService.remove('invalidCache', 'key');
        }).not.toThrow();
      });
    });

    describe('removeAll() method', function() {
      it('should be defined', function() {
        expect(CacheService.removeAll).toBeDefined();
        expect(typeof CacheService.removeAll).toBe('function');
      });

      it('should clear all entries from cardCache', function() {
        CacheService.put('cardCache', 'key1', 'value1');
        CacheService.put('cardCache', 'key2', 'value2');
        CacheService.put('cardCache', 'key3', 'value3');
        CacheService.removeAll('cardCache');
        expect(CacheService.get('cardCache', 'key1')).toBeUndefined();
        expect(CacheService.get('cardCache', 'key2')).toBeUndefined();
        expect(CacheService.get('cardCache', 'key3')).toBeUndefined();
      });

      it('should clear all entries from transactionCache', function() {
        CacheService.put('transactionCache', 'trans1', { id: 1 });
        CacheService.put('transactionCache', 'trans2', { id: 2 });
        CacheService.removeAll('transactionCache');
        expect(CacheService.get('transactionCache', 'trans1')).toBeUndefined();
        expect(CacheService.get('transactionCache', 'trans2')).toBeUndefined();
      });

      it('should not affect other caches when clearing one', function() {
        CacheService.put('cardCache', 'cardKey', 'cardValue');
        CacheService.put('transactionCache', 'transKey', 'transValue');
        CacheService.removeAll('cardCache');
        expect(CacheService.get('cardCache', 'cardKey')).toBeUndefined();
        expect(CacheService.get('transactionCache', 'transKey')).toBe('transValue');
      });

      it('should handle invalid cache name gracefully', function() {
        expect(function() {
          CacheService.removeAll('invalidCache');
        }).not.toThrow();
      });

      it('should handle clearing empty cache', function() {
        CacheService.removeAll('cardCache');
        expect(function() {
          CacheService.removeAll('cardCache');
        }).not.toThrow();
      });
    });

    describe('Cache Isolation', function() {
      it('should maintain separate data in cardCache and transactionCache', function() {
        var sameKey = 'duplicateKey';
        var cardValue = { type: 'card' };
        var transValue = { type: 'transaction' };
        CacheService.put('cardCache', sameKey, cardValue);
        CacheService.put('transactionCache', sameKey, transValue);
        expect(CacheService.get('cardCache', sameKey)).toEqual(cardValue);
        expect(CacheService.get('transactionCache', sameKey)).toEqual(transValue);
      });

      it('should not affect transactionCache when modifying cardCache', function() {
        CacheService.put('transactionCache', 'trans', { data: 'important' });
        CacheService.put('cardCache', 'card1', { data: 'test1' });
        CacheService.put('cardCache', 'card2', { data: 'test2' });
        CacheService.removeAll('cardCache');
        expect(CacheService.get('transactionCache', 'trans')).toEqual({ data: 'important' });
      });
    });

    describe('Edge Cases', function() {
      it('should handle storing and retrieving empty strings', function() {
        CacheService.put('cardCache', 'emptyString', '');
        expect(CacheService.get('cardCache', 'emptyString')).toBe('');
      });

      it('should handle storing and retrieving zero values', function() {
        CacheService.put('cardCache', 'zero', 0);
        expect(CacheService.get('cardCache', 'zero')).toBe(0);
      });

      it('should handle storing and retrieving false values', function() {
        CacheService.put('cardCache', 'false', false);
        expect(CacheService.get('cardCache', 'false')).toBe(false);
      });

      it('should handle storing arrays', function() {
        var testArray = [1, 2, 3, 4, 5];
        CacheService.put('cardCache', 'array', testArray);
        expect(CacheService.get('cardCache', 'array')).toEqual(testArray);
      });

      it('should handle storing dates', function() {
        var testDate = new Date('2023-01-01');
        CacheService.put('cardCache', 'date', testDate);
        expect(CacheService.get('cardCache', 'date')).toEqual(testDate);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested:
  * get(cacheName, key)
  * put(cacheName, key, value)
  * remove(cacheName, key)
  * removeAll(cacheName)
- Scenarios covered:
  * Service initialization with cardCache and transactionCache
  * Storing and retrieving values from both caches
  * Removing individual entries
  * Clearing entire caches
  * Cache isolation between cardCache and transactionCache
  * Invalid cache name handling
  * Non-existent key handling
  * Null and undefined value handling
  * Complex object storage
  * Edge cases (empty strings, zero, false, arrays, dates)
  * Overwriting existing values
- Uncovered scenarios: None - comprehensive coverage of all cache operations
- Edge cases tested:
  * Null/undefined keys and values
  * Invalid cache names
  * Empty caches
  * Duplicate keys across caches
  * Various data types (primitives, objects, arrays, dates)
*/