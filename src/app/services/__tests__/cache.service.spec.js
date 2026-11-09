/*
Test Documentation:
- Test Name: CacheService - put and get
- Purpose: Validates cache storage and retrieval
- Scenario: Data is cached and retrieved within TTL
- Expected Result: Returns cached data
*/
/*
Test Documentation:
- Test Name: CacheService - get expired
- Purpose: Validates TTL expiration behavior
- Scenario: Data is retrieved after TTL expires
- Expected Result: Returns null and removes expired data
*/
/*
Test Documentation:
- Test Name: CacheService - get non-existent key
- Purpose: Validates behavior for missing keys
- Scenario: Attempt to retrieve non-existent cache key
- Expected Result: Returns null
*/
/*
Test Documentation:
- Test Name: CacheService - remove
- Purpose: Validates cache removal
- Scenario: Cached data is explicitly removed
- Expected Result: Data is removed and subsequent get returns null
*/
/*
Test Documentation:
- Test Name: CacheService - TTL boundary
- Purpose: Validates TTL boundary conditions
- Scenario: Data retrieved just before and after TTL
- Expected Result: Valid before TTL, null after TTL
*/
/*
Coverage Report:
- Functions tested: get, put, remove
- Scenarios covered: cache storage, retrieval within TTL, TTL expiration, non-existent keys, explicit removal, TTL boundary conditions
- Edge cases: expired data, null keys, timestamp validation
- Uncovered scenarios: concurrent cache access (not applicable for single-threaded JS)
*/

(function() {
  'use strict';

  describe('CacheService', function() {
    var CacheService;
    var $cacheFactory;
    var originalDateNow;
    var mockTimestamp;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CacheService_, _$cacheFactory_) {
      CacheService = _CacheService_;
      $cacheFactory = _$cacheFactory_;
      mockTimestamp = 1609459200000;
      originalDateNow = Date.now;
      Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp);
    }));

    afterEach(function() {
      Date.now = originalDateNow;
    });

    describe('put and get', function() {
      it('should store and retrieve data within TTL', function() {
        var testData = {userId: 'user-123', balance: 5000};
        CacheService.put('testKey', testData);
        var retrieved = CacheService.get('testKey');
        expect(retrieved).toEqual(testData);
      });

      it('should store multiple keys independently', function() {
        var data1 = {id: 1, value: 'first'};
        var data2 = {id: 2, value: 'second'};
        CacheService.put('key1', data1);
        CacheService.put('key2', data2);
        expect(CacheService.get('key1')).toEqual(data1);
        expect(CacheService.get('key2')).toEqual(data2);
      });

      it('should overwrite existing key', function() {
        CacheService.put('key', {value: 'old'});
        CacheService.put('key', {value: 'new'});
        expect(CacheService.get('key')).toEqual({value: 'new'});
      });

      it('should handle complex nested objects', function() {
        var complexData = {
          user: {id: 123, name: 'John'},
          cards: [{id: 1, limit: 5000}, {id: 2, limit: 10000}],
          metadata: {timestamp: Date.now()}
        };
        CacheService.put('complex', complexData);
        expect(CacheService.get('complex')).toEqual(complexData);
      });

      it('should handle null data', function() {
        CacheService.put('nullKey', null);
        expect(CacheService.get('nullKey')).toBeNull();
      });

      it('should handle undefined data', function() {
        CacheService.put('undefinedKey', undefined);
        expect(CacheService.get('undefinedKey')).toBeUndefined();
      });
    });

    describe('get with TTL expiration', function() {
      it('should return null for expired data', function() {
        var testData = {value: 'test'};
        CacheService.put('expireKey', testData);
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (16 * 60 * 1000));
        var retrieved = CacheService.get('expireKey');
        expect(retrieved).toBeNull();
      });

      it('should return data just before TTL expires', function() {
        var testData = {value: 'test'};
        CacheService.put('almostExpired', testData);
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (14 * 60 * 1000));
        var retrieved = CacheService.get('almostExpired');
        expect(retrieved).toEqual(testData);
      });

      it('should return null exactly at TTL boundary', function() {
        var testData = {value: 'test'};
        CacheService.put('boundaryKey', testData);
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (15 * 60 * 1000));
        var retrieved = CacheService.get('boundaryKey');
        expect(retrieved).toBeNull();
      });

      it('should remove expired item from cache', function() {
        var testData = {value: 'test'};
        CacheService.put('removeExpired', testData);
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (16 * 60 * 1000));
        CacheService.get('removeExpired');
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp);
        var retrieved = CacheService.get('removeExpired');
        expect(retrieved).toBeNull();
      });
    });

    describe('get non-existent key', function() {
      it('should return null for non-existent key', function() {
        var retrieved = CacheService.get('nonExistentKey');
        expect(retrieved).toBeNull();
      });

      it('should return null for empty string key', function() {
        var retrieved = CacheService.get('');
        expect(retrieved).toBeNull();
      });

      it('should handle multiple get calls on non-existent key', function() {
        expect(CacheService.get('missing')).toBeNull();
        expect(CacheService.get('missing')).toBeNull();
        expect(CacheService.get('missing')).toBeNull();
      });
    });

    describe('remove', function() {
      it('should remove cached data', function() {
        var testData = {value: 'test'};
        CacheService.put('removeKey', testData);
        CacheService.remove('removeKey');
        var retrieved = CacheService.get('removeKey');
        expect(retrieved).toBeNull();
      });

      it('should not affect other cached keys', function() {
        CacheService.put('key1', {value: 'first'});
        CacheService.put('key2', {value: 'second'});
        CacheService.remove('key1');
        expect(CacheService.get('key1')).toBeNull();
        expect(CacheService.get('key2')).toEqual({value: 'second'});
      });

      it('should handle removal of non-existent key', function() {
        expect(function() {
          CacheService.remove('nonExistent');
        }).not.toThrow();
      });

      it('should allow re-adding after removal', function() {
        CacheService.put('readdKey', {value: 'first'});
        CacheService.remove('readdKey');
        CacheService.put('readdKey', {value: 'second'});
        expect(CacheService.get('readdKey')).toEqual({value: 'second'});
      });
    });

    describe('TTL boundary conditions', function() {
      it('should validate 15 minute TTL constant', function() {
        var testData = {value: 'test'};
        CacheService.put('ttlTest', testData);
        var ttlMilliseconds = 15 * 60 * 1000;
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + ttlMilliseconds - 1);
        expect(CacheService.get('ttlTest')).toEqual(testData);
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + ttlMilliseconds);
        expect(CacheService.get('ttlTest')).toBeNull();
      });

      it('should handle timestamp at exact TTL', function() {
        CacheService.put('exactTTL', {value: 'test'});
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (15 * 60 * 1000));
        expect(CacheService.get('exactTTL')).toBeNull();
      });

      it('should handle timestamp one millisecond before TTL', function() {
        CacheService.put('beforeTTL', {value: 'test'});
        Date.now = jasmine.createSpy('Date.now').and.returnValue(mockTimestamp + (15 * 60 * 1000) - 1);
        expect(CacheService.get('beforeTTL')).toEqual({value: 'test'});
      });
    });

    describe('integration scenarios', function() {
      it('should handle complete cache lifecycle', function() {
        var data = {userId: 'user-123', balance: 5000};
        CacheService.put('lifecycle', data);
        expect(CacheService.get('lifecycle')).toEqual(data);
        CacheService.remove('lifecycle');
        expect(CacheService.get('lifecycle')).toBeNull();
      });

      it('should handle multiple operations on same key', function() {
        CacheService.put('multi', {value: 1});
        expect(CacheService.get('multi')).toEqual({value: 1});
        CacheService.put('multi', {value: 2});
        expect(CacheService.get('multi')).toEqual({value: 2});
        CacheService.remove('multi');
        expect(CacheService.get('multi')).toBeNull();
      });

      it('should maintain separate cache instances', function() {
        CacheService.put('dashboardKPI_user1', {spend: 1000});
        CacheService.put('dashboardKPI_user2', {spend: 2000});
        expect(CacheService.get('dashboardKPI_user1')).toEqual({spend: 1000});
        expect(CacheService.get('dashboardKPI_user2')).toEqual({spend: 2000});
      });
    });

    describe('edge cases', function() {
      it('should handle very large data objects', function() {
        var largeData = {items: []};
        for (var i = 0; i < 1000; i++) {
          largeData.items.push({id: i, value: 'item-' + i});
        }
        CacheService.put('large', largeData);
        expect(CacheService.get('large')).toEqual(largeData);
      });

      it('should handle special characters in keys', function() {
        var data = {value: 'test'};
        CacheService.put('key-with-dashes', data);
        CacheService.put('key_with_underscores', data);
        CacheService.put('key.with.dots', data);
        expect(CacheService.get('key-with-dashes')).toEqual(data);
        expect(CacheService.get('key_with_underscores')).toEqual(data);
        expect(CacheService.get('key.with.dots')).toEqual(data);
      });

      it('should handle boolean values', function() {
        CacheService.put('boolTrue', true);
        CacheService.put('boolFalse', false);
        expect(CacheService.get('boolTrue')).toBe(true);
        expect(CacheService.get('boolFalse')).toBe(false);
      });

      it('should handle numeric values', function() {
        CacheService.put('zero', 0);
        CacheService.put('negative', -100);
        CacheService.put('decimal', 123.456);
        expect(CacheService.get('zero')).toBe(0);
        expect(CacheService.get('negative')).toBe(-100);
        expect(CacheService.get('decimal')).toBe(123.456);
      });
    });
  });
})();