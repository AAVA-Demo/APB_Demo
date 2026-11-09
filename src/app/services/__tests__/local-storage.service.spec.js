/*
Test Documentation:
- Test Name: LocalStorageService - set method
- Purpose: Stores key-value pairs in localStorage
- Scenario: Valid key and value provided
- Expected Result: Data is stored in localStorage
*/
/*
Test Documentation:
- Test Name: LocalStorageService - set method
- Purpose: Handles localStorage errors gracefully
- Scenario: localStorage.setItem throws an error
- Expected Result: Error is caught and logged
*/
/*
Test Documentation:
- Test Name: LocalStorageService - get method
- Purpose: Retrieves value from localStorage by key
- Scenario: Key exists in localStorage
- Expected Result: Returns the stored value
*/
/*
Test Documentation:
- Test Name: LocalStorageService - get method
- Purpose: Handles missing keys gracefully
- Scenario: Key does not exist in localStorage
- Expected Result: Returns null
*/
/*
Test Documentation:
- Test Name: LocalStorageService - get method
- Purpose: Handles localStorage errors during retrieval
- Scenario: localStorage.getItem throws an error
- Expected Result: Error is caught, logged, and null is returned
*/
/*
Test Documentation:
- Test Name: LocalStorageService - remove method
- Purpose: Removes key-value pair from localStorage
- Scenario: Valid key provided
- Expected Result: Item is removed from localStorage
*/
/*
Test Documentation:
- Test Name: LocalStorageService - remove method
- Purpose: Handles localStorage errors during removal
- Scenario: localStorage.removeItem throws an error
- Expected Result: Error is caught and logged
*/
/*
Coverage Report:
- Functions tested: set, get, remove
- Scenarios covered: successful operations, error handling, null values, missing keys
- Uncovered scenarios: localStorage quota exceeded, concurrent access conflicts
*/

(function() {
  'use strict';

  describe('LocalStorageService', function() {
    var LocalStorageService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_LocalStorageService_) {
      LocalStorageService = _LocalStorageService_;
    }));

    afterEach(function() {
      localStorage.clear();
    });

    describe('set', function() {
      it('should store key-value pair in localStorage', function() {
        LocalStorageService.set('testKey', 'testValue');
        expect(localStorage.getItem('testKey')).toBe('testValue');
      });

      it('should handle errors gracefully when localStorage.setItem fails', function() {
        spyOn(console, 'error');
        spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
        LocalStorageService.set('testKey', 'testValue');
        expect(console.error).toHaveBeenCalledWith('LocalStorage set error:', jasmine.any(Error));
      });

      it('should store numeric values as strings', function() {
        LocalStorageService.set('numericKey', '12345');
        expect(localStorage.getItem('numericKey')).toBe('12345');
      });

      it('should overwrite existing key with new value', function() {
        LocalStorageService.set('overwriteKey', 'oldValue');
        LocalStorageService.set('overwriteKey', 'newValue');
        expect(localStorage.getItem('overwriteKey')).toBe('newValue');
      });
    });

    describe('get', function() {
      it('should retrieve value from localStorage by key', function() {
        localStorage.setItem('retrieveKey', 'retrieveValue');
        var result = LocalStorageService.get('retrieveKey');
        expect(result).toBe('retrieveValue');
      });

      it('should return null when key does not exist', function() {
        var result = LocalStorageService.get('nonExistentKey');
        expect(result).toBeNull();
      });

      it('should handle errors gracefully when localStorage.getItem fails', function() {
        spyOn(console, 'error');
        spyOn(localStorage, 'getItem').and.throwError('SecurityError');
        var result = LocalStorageService.get('errorKey');
        expect(console.error).toHaveBeenCalledWith('LocalStorage get error:', jasmine.any(Error));
        expect(result).toBeNull();
      });

      it('should retrieve numeric string values correctly', function() {
        localStorage.setItem('numKey', '98765');
        var result = LocalStorageService.get('numKey');
        expect(result).toBe('98765');
      });
    });

    describe('remove', function() {
      it('should remove key-value pair from localStorage', function() {
        localStorage.setItem('removeKey', 'removeValue');
        LocalStorageService.remove('removeKey');
        expect(localStorage.getItem('removeKey')).toBeNull();
      });

      it('should handle errors gracefully when localStorage.removeItem fails', function() {
        spyOn(console, 'error');
        spyOn(localStorage, 'removeItem').and.throwError('SecurityError');
        LocalStorageService.remove('errorKey');
        expect(console.error).toHaveBeenCalledWith('LocalStorage remove error:', jasmine.any(Error));
      });

      it('should not throw error when removing non-existent key', function() {
        expect(function() {
          LocalStorageService.remove('nonExistentKey');
        }).not.toThrow();
      });

      it('should successfully remove multiple keys', function() {
        localStorage.setItem('key1', 'value1');
        localStorage.setItem('key2', 'value2');
        LocalStorageService.remove('key1');
        LocalStorageService.remove('key2');
        expect(localStorage.getItem('key1')).toBeNull();
        expect(localStorage.getItem('key2')).toBeNull();
      });
    });
  });
})();