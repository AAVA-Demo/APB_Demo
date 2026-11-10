/*
Test Documentation:
- Test Name: dashboardService - getCardData
- Purpose: Validates that getCardData retrieves card data after authentication
- Scenario: When getCardData is called, it should authenticate and return card data
- Expected Result: Returns a promise that resolves with an array of card objects
*/
/*
Test Documentation:
- Test Name: dashboardService - getCardData with authentication
- Purpose: Validates that getCardData calls authService.getAuthToken before retrieving data
- Scenario: When getCardData is called, it should first get auth token
- Expected Result: authService.getAuthToken is called, then card data is returned
*/
/*
Coverage Report:
- Functions tested: getCardData
- Scenarios covered: successful data retrieval with authentication, promise resolution, dependency injection
- Edge cases: authentication flow, promise chaining
- Uncovered scenarios: authentication failure (not implemented in mock service)
*/

describe('dashboardService', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));
  
  var dashboardService;
  var authService;
  var mockDataService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_dashboardService_, _authService_, _mockDataService_, _$q_, _$rootScope_) {
    dashboardService = _dashboardService_;
    authService = _authService_;
    mockDataService = _mockDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCardData', function() {
    it('should be defined', function() {
      expect(dashboardService.getCardData).toBeDefined();
      expect(typeof dashboardService.getCardData).toBe('function');
    });
    
    it('should return a promise', function() {
      var result = dashboardService.getCardData();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
    
    it('should call authService.getAuthToken', function(done) {
      spyOn(authService, 'getAuthToken').and.callThrough();
      dashboardService.getCardData().then(function() {
        expect(authService.getAuthToken).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should resolve with card data', function(done) {
      dashboardService.getCardData().then(function(cards) {
        expect(Array.isArray(cards)).toBe(true);
        expect(cards.length).toBe(3);
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return cards with required properties', function(done) {
      dashboardService.getCardData().then(function(cards) {
        expect(cards.length).toBeGreaterThan(0);
        cards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.totalLimit).toBeDefined();
          expect(card.outstandingBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
        });
        done();
      });
      $rootScope.$digest();
    });
    
    it('should call mockDataService.getCards', function(done) {
      spyOn(mockDataService, 'getCards').and.callThrough();
      dashboardService.getCardData().then(function() {
        expect(mockDataService.getCards).toHaveBeenCalled();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should handle authentication token retrieval', function(done) {
      spyOn(authService, 'getAuthToken').and.returnValue($q.resolve('test-token'));
      dashboardService.getCardData().then(function(cards) {
        expect(authService.getAuthToken).toHaveBeenCalled();
        expect(cards).toBeDefined();
        done();
      });
      $rootScope.$digest();
    });
    
    it('should return valid card data structure', function(done) {
      dashboardService.getCardData().then(function(cards) {
        cards.forEach(function(card) {
          expect(typeof card.totalLimit).toBe('number');
          expect(typeof card.outstandingBalance).toBe('number');
          expect(typeof card.availableCredit).toBe('number');
          expect(typeof card.monthlySpend).toBe('number');
        });
        done();
      });
      $rootScope.$digest();
    });
  });
  
  describe('service dependencies', function() {
    it('should have authService injected', function() {
      expect(authService).toBeDefined();
    });
    
    it('should have mockDataService injected', function() {
      expect(mockDataService).toBeDefined();
    });
  });
});