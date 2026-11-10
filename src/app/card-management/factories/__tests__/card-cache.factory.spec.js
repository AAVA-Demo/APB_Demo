/*
Test Documentation:
- Test Name: CardCacheFactory - set and get
- Purpose: Validates cache storage and retrieval
- Scenario: Normal scenario storing and retrieving data
- Expected Result: Data is stored and retrieved correctly
*/
/*
Test Documentation:
- Test Name: CardCacheFactory - TTL expiration
- Purpose: Validates cache entries expire after TTL
- Scenario: Edge case with expired cache entry
- Expected Result: Expired entry returns null
*/
/*
Test Documentation:
- Test Name: CardCacheFactory - clear
- Purpose: Validates cache clearing functionality
- Scenario: Normal scenario clearing all cache
- Expected Result: All cache entries are removed
*/
/*
Coverage Report:
- Functions tested: set, get, clear
- Scenarios covered: set/get, TTL expiration, cache miss, clear cache
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardCacheFactory', function() {
    var CardCacheFactory;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_CardCacheFactory_) {
      CardCacheFactory = _CardCacheFactory_;
      CardCacheFactory.clear();
    }));

    describe('set and get', function() {
      it('should store and retrieve data', function() {
        var testData = { cardId: 'card-123', cardNumber: '****1234' };
        CardCacheFactory.set('testKey', testData);

        var result = CardCacheFactory.get('testKey');
        expect(result).toEqual(testData);
      });

      it('should return null for non-existent key', function() {
        var result = CardCacheFactory.get('nonExistentKey');
        expect(result).toBeNull();
      });

      it('should overwrite existing key', function() {
        CardCacheFactory.set('testKey', { value: 'old' });
        CardCacheFactory.set('testKey', { value: 'new' });

        var result = CardCacheFactory.get('testKey');
        expect(result).toEqual({ value: 'new' });
      });

      it('should handle null value', function() {
        CardCacheFactory.set('testKey', null);
        var result = CardCacheFactory.get('testKey');
        expect(result).toBeNull();
      });

      it('should handle undefined value', function() {
        CardCacheFactory.set('testKey', undefined);
        var result = CardCacheFactory.get('testKey');
        expect(result).toBeUndefined();
      });
    });

    describe('TTL expiration', function() {
      it('should return null for expired entry', function() {
        jasmine.clock().install();
        
        var testData = { cardId: 'card-123' };
        CardCacheFactory.set('testKey', testData);

        jasmine.clock().tick(300001);

        var result = CardCacheFactory.get('testKey');
        expect(result).toBeNull();

        jasmine.clock().uninstall();
      });

      it('should return data before TTL expires', function() {
        jasmine.clock().install();
        
        var testData = { cardId: 'card-123' };
        CardCacheFactory.set('testKey', testData);

        jasmine.clock().tick(299999);

        var result = CardCacheFactory.get('testKey');
        expect(result).toEqual(testData);

        jasmine.clock().uninstall();
      });
    });

    describe('clear', function() {
      it('should clear all cache entries', function() {
        CardCacheFactory.set('key1', { value: 'data1' });
        CardCacheFactory.set('key2', { value: 'data2' });

        CardCacheFactory.clear();

        expect(CardCacheFactory.get('key1')).toBeNull();
        expect(CardCacheFactory.get('key2')).toBeNull();
      });

      it('should allow setting new entries after clear', function() {
        CardCacheFactory.set('key1', { value: 'data1' });
        CardCacheFactory.clear();
        CardCacheFactory.set('key2', { value: 'data2' });

        expect(CardCacheFactory.get('key1')).toBeNull();
        expect(CardCacheFactory.get('key2')).toEqual({ value: 'data2' });
      });
    });
  });
})();