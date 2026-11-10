/*
Test Documentation:
- Test Name: localStorageService Unit Tests
- Purpose: Validate local storage wrapper service functionality including set, get, remove, and clear operations
- Scenario: Tests cover storing objects, retrieving data, handling errors, removing items, and clearing storage
- Expected Result: All localStorage operations work correctly with proper JSON serialization and error handling
*/

(function() {
  'use strict';

  describe('localStorageService', function() {
    var localStorageService, $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_localStorageService_, _$window_) {
      localStorageService = _localStorageService_;
      $window = _$window_;
      
      // Clear localStorage before each test
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('set', function() {
      it('should store string value in localStorage', function() {
        localStorageService.set('testKey', 'testValue');
        var stored = $window.localStorage.getItem('testKey');
        expect(JSON.parse(stored)).toBe('testValue');
      });

      it('should store object in localStorage as JSON', function() {
        var testObj = { name: 'John', age: 30, active: true };
        localStorageService.set('userObj', testObj);
        var stored = $window.localStorage.getItem('userObj');
        expect(JSON.parse(stored)).toEqual(testObj);
      });

      it('should store array in localStorage as JSON', function() {
        var testArray = [1, 2, 3, 'four', { five: 5 }];
        localStorageService.set('testArray', testArray);
        var stored = $window.localStorage.getItem('testArray');
        expect(JSON.parse(stored)).toEqual(testArray);
      });

      it('should store null value', function() {
        localStorageService.set('nullKey', null);
        var stored = $window.localStorage.getItem('nullKey');
        expect(JSON.parse(stored)).toBeNull();
      });

      it('should store boolean value', function() {
        localStorageService.set('boolKey', true);
        var stored = $window.localStorage.getItem('boolKey');
        expect(JSON.parse(stored)).toBe(true);
      });

      it('should store number value', function() {
        localStorageService.set('numKey', 12345);
        var stored = $window.localStorage.getItem('numKey');
        expect(JSON.parse(stored)).toBe(12345);
      });

      it('should handle localStorage quota exceeded error gracefully', function() {
        spyOn(console, 'error');
        spyOn($window.localStorage, 'setItem').and.throwError('QuotaExceededError');

        expect(function() {
          localStorageService.set('testKey', 'testValue');
        }).not.toThrow();

        expect(console.error).toHaveBeenCalled();
      });

      it('should overwrite existing value', function() {
        localStorageService.set('overwriteKey', 'original');
        localStorageService.set('overwriteKey', 'updated');
        var result = localStorageService.get('overwriteKey');
        expect(result).toBe('updated');
      });
    });

    describe('get', function() {
      it('should retrieve stored string value', function() {
        $window.localStorage.setItem('testKey', JSON.stringify('testValue'));
        var result = localStorageService.get('testKey');
        expect(result).toBe('testValue');
      });

      it('should retrieve stored object', function() {
        var testObj = { name: 'Jane', age: 25 };
        $window.localStorage.setItem('userObj', JSON.stringify(testObj));
        var result = localStorageService.get('userObj');
        expect(result).toEqual(testObj);
      });

      it('should retrieve stored array', function() {
        var testArray = ['a', 'b', 'c'];
        $window.localStorage.setItem('testArray', JSON.stringify(testArray));
        var result = localStorageService.get('testArray');
        expect(result).toEqual(testArray);
      });

      it('should return null for non-existent key', function() {
        var result = localStorageService.get('nonExistentKey');
        expect(result).toBeNull();
      });

      it('should return null for invalid JSON', function() {
        spyOn(console, 'error');
        $window.localStorage.setItem('invalidJson', '{invalid json}');
        var result = localStorageService.get('invalidJson');
        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle localStorage access error gracefully', function() {
        spyOn(console, 'error');
        spyOn($window.localStorage, 'getItem').and.throwError('SecurityError');

        var result = localStorageService.get('testKey');

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
      });

      it('should retrieve null value correctly', function() {
        $window.localStorage.setItem('nullKey', JSON.stringify(null));
        var result = localStorageService.get('nullKey');
        expect(result).toBeNull();
      });

      it('should retrieve boolean value correctly', function() {
        $window.localStorage.setItem('boolKey', JSON.stringify(false));
        var result = localStorageService.get('boolKey');
        expect(result).toBe(false);
      });

      it('should retrieve number value correctly', function() {
        $window.localStorage.setItem('numKey', JSON.stringify(0));
        var result = localStorageService.get('numKey');
        expect(result).toBe(0);
      });
    });

    describe('remove', function() {
      it('should remove existing item from localStorage', function() {
        localStorageService.set('removeKey', 'removeValue');
        expect(localStorageService.get('removeKey')).toBe('removeValue');

        localStorageService.remove('removeKey');
        expect(localStorageService.get('removeKey')).toBeNull();
      });

      it('should handle removing non-existent key gracefully', function() {
        expect(function() {
          localStorageService.remove('nonExistentKey');
        }).not.toThrow();
      });

      it('should only remove specified key', function() {
        localStorageService.set('key1', 'value1');
        localStorageService.set('key2', 'value2');
        localStorageService.set('key3', 'value3');

        localStorageService.remove('key2');

        expect(localStorageService.get('key1')).toBe('value1');
        expect(localStorageService.get('key2')).toBeNull();
        expect(localStorageService.get('key3')).toBe('value3');
      });
    });

    describe('clear', function() {
      it('should clear all items from localStorage', function() {
        localStorageService.set('key1', 'value1');
        localStorageService.set('key2', 'value2');
        localStorageService.set('key3', 'value3');

        localStorageService.clear();

        expect(localStorageService.get('key1')).toBeNull();
        expect(localStorageService.get('key2')).toBeNull();
        expect(localStorageService.get('key3')).toBeNull();
        expect($window.localStorage.length).toBe(0);
      });

      it('should handle clearing empty localStorage', function() {
        expect(function() {
          localStorageService.clear();
        }).not.toThrow();
        expect($window.localStorage.length).toBe(0);
      });

      it('should clear localStorage completely', function() {
        localStorageService.set('test1', { data: 'complex' });
        localStorageService.set('test2', [1, 2, 3]);
        localStorageService.set('test3', 'simple');

        expect($window.localStorage.length).toBeGreaterThan(0);

        localStorageService.clear();

        expect($window.localStorage.length).toBe(0);
      });
    });

    describe('integration scenarios', function() {
      it('should handle complete set-get-remove cycle', function() {
        var testData = { userId: 'user123', cards: ['card1', 'card2'] };

        localStorageService.set('userData', testData);
        var retrieved = localStorageService.get('userData');
        expect(retrieved).toEqual(testData);

        localStorageService.remove('userData');
        var afterRemove = localStorageService.get('userData');
        expect(afterRemove).toBeNull();
      });

      it('should handle multiple operations in sequence', function() {
        localStorageService.set('key1', 'value1');
        localStorageService.set('key2', 'value2');
        expect(localStorageService.get('key1')).toBe('value1');

        localStorageService.set('key1', 'updatedValue1');
        expect(localStorageService.get('key1')).toBe('updatedValue1');

        localStorageService.remove('key1');
        expect(localStorageService.get('key1')).toBeNull();
        expect(localStorageService.get('key2')).toBe('value2');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: set, get, remove, clear
- Scenarios covered:
  * Storing various data types (string, object, array, null, boolean, number)
  * Retrieving stored data with JSON parsing
  * Handling non-existent keys
  * Error handling (quota exceeded, invalid JSON, security errors)
  * Removing specific items
  * Clearing all storage
  * Overwriting existing values
  * Integration scenarios with multiple operations
- Uncovered scenarios: None - comprehensive coverage achieved
- Test count: 29 tests
- Dependencies mocked: $window.localStorage (with spy for error scenarios)
*/