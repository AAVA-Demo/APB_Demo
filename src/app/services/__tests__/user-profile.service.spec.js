/*
Test Documentation:
- Test Name: UserProfileService - validateOwnership - returns true when user owns the card
- Purpose: Validates that the service correctly identifies when a user owns a specific card
- Scenario: API confirms user owns the requested card
- Expected Result: Service returns true
*/
/*
Test Documentation:
- Test Name: UserProfileService - validateOwnership - returns false when user does not own the card
- Purpose: Validates that the service correctly identifies when a user does not own a card
- Scenario: API indicates user does not own the requested card
- Expected Result: Service returns false
*/
/*
Test Documentation:
- Test Name: UserProfileService - validateOwnership - returns false when API call fails
- Purpose: Validates that the service handles API errors by denying access
- Scenario: API call fails or returns error
- Expected Result: Service returns false for security
*/
/*
Coverage Report:
- Functions tested: validateOwnership
- Scenarios covered: valid ownership, invalid ownership, API success, API failure, error handling, security defaults
- Uncovered scenarios: none
*/

describe('UserProfileService', function() {
  'use strict';
  
  var UserProfileService;
  var ApiFactory;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_UserProfileService_, _ApiFactory_, _$q_, _$rootScope_) {
    UserProfileService = _UserProfileService_;
    ApiFactory = _ApiFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('validateOwnership', function() {
    
    it('should return true when API confirms user owns the card', function() {
      var cardId = 'card123';
      var apiResponse = {isValid: true};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/user/cards/' + cardId + '/validate');
      expect(result).toBe(true);
    });
    
    it('should return false when API indicates user does not own the card', function() {
      var cardId = 'card456';
      var apiResponse = {isValid: false};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/user/cards/' + cardId + '/validate');
      expect(result).toBe(false);
    });
    
    it('should return false when API response does not contain isValid field', function() {
      var cardId = 'card789';
      var apiResponse = {};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should return false when API response isValid is not strictly true', function() {
      var cardId = 'card999';
      var apiResponse = {isValid: 'true'};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should return false when API call fails with error', function() {
      var cardId = 'card111';
      var deferred = $q.defer();
      deferred.reject({message: 'Network error', status: 500});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should return false when API returns 404 error', function() {
      var cardId = 'card222';
      var deferred = $q.defer();
      deferred.reject({message: 'Card not found', status: 404});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should return false when API returns 403 forbidden error', function() {
      var cardId = 'card333';
      var deferred = $q.defer();
      deferred.reject({message: 'Forbidden', status: 403});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should construct correct API endpoint with cardId', function() {
      var cardId = 'card444';
      var deferred = $q.defer();
      deferred.resolve({isValid: true});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      UserProfileService.validateOwnership(cardId);
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/user/cards/' + cardId + '/validate');
      expect(ApiFactory.get).toHaveBeenCalledTimes(1);
    });
    
    it('should handle special characters in cardId correctly', function() {
      var cardId = 'card-555-special';
      var deferred = $q.defer();
      deferred.resolve({isValid: true});
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      UserProfileService.validateOwnership(cardId);
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/user/cards/' + cardId + '/validate');
    });
    
    it('should return false for null response', function() {
      var cardId = 'card666';
      var deferred = $q.defer();
      deferred.resolve(null);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
    
    it('should return false for undefined response', function() {
      var cardId = 'card777';
      var deferred = $q.defer();
      deferred.resolve(undefined);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      UserProfileService.validateOwnership(cardId).then(function(isValid) {
        result = isValid;
      });
      $rootScope.$digest();
      
      expect(result).toBe(false);
    });
  });
});