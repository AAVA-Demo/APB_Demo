/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards with cache
- Purpose: Verify that fetchAllCards returns cached data when cache is valid
- Scenario: Cards have been fetched within the 5-second cache duration
- Expected Result: Returns cached card data without making new requests
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards without cache
- Purpose: Verify that fetchAllCards returns fresh mock data when cache is expired or empty
- Scenario: No cached data exists or cache has expired
- Expected Result: Returns array of 5 mock credit cards with complete details
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards cache expiration
- Purpose: Verify that cache expires after 5 seconds and fresh data is returned
- Scenario: Cache duration (5000ms) has elapsed since last fetch
- Expected Result: New data is fetched and cache is updated
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards data structure validation
- Purpose: Verify that returned card data contains all required fields
- Scenario: Service returns card data
- Expected Result: Each card contains cardId, cardNumber, cardHolderName, cardType, creditLimit, availableCredit, outstandingBalance, currentMonthSpend, lastSyncTimestamp
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards returns deep copy
- Purpose: Verify that service returns a deep copy of cached data to prevent mutation
- Scenario: Cached data exists and is returned
- Expected Result: Modifying returned data does not affect cached data
*/
/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered: cache hit, cache miss, cache expiration, data structure validation, deep copy protection
- Edge cases: cache boundary conditions, data immutability
- Uncovered scenarios: network failures (not applicable with mock data), concurrent requests
*/

describe('CreditCardDataService', function() {
  var CreditCardDataService, $q, $rootScope, AuthService, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$q_, _$rootScope_, _AuthService_, _$timeout_) {
    CreditCardDataService = _CreditCardDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    AuthService = _AuthService_;
    $timeout = _$timeout_;
  }));

  describe('fetchAllCards', function() {
    it('should return array of 5 credit cards on first call', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
    });

    it('should return cards with all required fields', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result[0].cardId).toBeDefined();
      expect(result[0].cardNumber).toBeDefined();
      expect(result[0].cardHolderName).toBeDefined();
      expect(result[0].cardType).toBeDefined();
      expect(result[0].creditLimit).toBeDefined();
      expect(result[0].availableCredit).toBeDefined();
      expect(result[0].outstandingBalance).toBeDefined();
      expect(result[0].currentMonthSpend).toBeDefined();
      expect(result[0].lastSyncTimestamp).toBeDefined();
    });

    it('should return cards with correct data types', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      var card = result[0];
      expect(typeof card.cardId).toBe('string');
      expect(typeof card.cardNumber).toBe('string');
      expect(typeof card.cardHolderName).toBe('string');
      expect(typeof card.cardType).toBe('string');
      expect(typeof card.creditLimit).toBe('number');
      expect(typeof card.availableCredit).toBe('number');
      expect(typeof card.outstandingBalance).toBe('number');
      expect(typeof card.currentMonthSpend).toBe('number');
      expect(card.lastSyncTimestamp instanceof Date).toBe(true);
    });

    it('should return cached data on subsequent calls within cache duration', function() {
      var result1, result2;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result1 = cards;
      });
      $rootScope.$apply();

      var firstCallTimestamp = result1[0].lastSyncTimestamp;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result2 = cards;
      });
      $rootScope.$apply();

      expect(result2[0].lastSyncTimestamp).toEqual(firstCallTimestamp);
    });

    it('should return deep copy of cached data to prevent mutation', function() {
      var result1, result2;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result1 = cards;
      });
      $rootScope.$apply();

      result1[0].cardHolderName = 'Modified Name';

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result2 = cards;
      });
      $rootScope.$apply();

      expect(result2[0].cardHolderName).toBe('John Doe');
      expect(result2[0].cardHolderName).not.toBe('Modified Name');
    });

    it('should refresh data after cache duration expires', function() {
      jasmine.clock().install();

      var result1, result2;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result1 = cards;
      });
      $rootScope.$apply();

      var firstCallTimestamp = result1[0].lastSyncTimestamp.getTime();

      jasmine.clock().tick(5001);

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result2 = cards;
      });
      $rootScope.$apply();

      var secondCallTimestamp = result2[0].lastSyncTimestamp.getTime();
      expect(secondCallTimestamp).toBeGreaterThan(firstCallTimestamp);

      jasmine.clock().uninstall();
    });

    it('should return consistent card IDs across calls', function() {
      var result1, result2;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result1 = cards;
      });
      $rootScope.$apply();

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result2 = cards;
      });
      $rootScope.$apply();

      expect(result1[0].cardId).toBe(result2[0].cardId);
      expect(result1[1].cardId).toBe(result2[1].cardId);
      expect(result1[2].cardId).toBe(result2[2].cardId);
      expect(result1[3].cardId).toBe(result2[3].cardId);
      expect(result1[4].cardId).toBe(result2[4].cardId);
    });

    it('should return cards with valid financial calculations', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      result.forEach(function(card) {
        expect(card.creditLimit).toBeGreaterThan(0);
        expect(card.availableCredit).toBeGreaterThanOrEqual(0);
        expect(card.outstandingBalance).toBeGreaterThanOrEqual(0);
        expect(card.currentMonthSpend).toBeGreaterThanOrEqual(0);
        expect(card.availableCredit + card.outstandingBalance).toBeLessThanOrEqual(card.creditLimit + 1);
      });
    });

    it('should return cards with masked card numbers', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      result.forEach(function(card) {
        expect(card.cardNumber).toContain('****');
        expect(card.cardNumber.length).toBeGreaterThan(10);
      });
    });

    it('should return cards with valid card types', function() {
      var result;
      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      var validCardTypes = ['Visa', 'MasterCard', 'Amex'];
      result.forEach(function(card) {
        expect(validCardTypes).toContain(card.cardType);
      });
    });
  });

  describe('Cache Management', function() {
    it('should maintain cache for exactly 5 seconds', function() {
      jasmine.clock().install();

      var result1, result2, result3;

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result1 = cards;
      });
      $rootScope.$apply();

      jasmine.clock().tick(4999);

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result2 = cards;
      });
      $rootScope.$apply();

      expect(result1[0].lastSyncTimestamp).toEqual(result2[0].lastSyncTimestamp);

      jasmine.clock().tick(2);

      CreditCardDataService.fetchAllCards('user123').then(function(cards) {
        result3 = cards;
      });
      $rootScope.$apply();

      expect(result3[0].lastSyncTimestamp).not.toEqual(result1[0].lastSyncTimestamp);

      jasmine.clock().uninstall();
    });

    it('should handle multiple rapid successive calls efficiently', function() {
      var results = [];

      for (var i = 0; i < 10; i++) {
        CreditCardDataService.fetchAllCards('user123').then(function(cards) {
          results.push(cards);
        });
      }

      $rootScope.$apply();

      expect(results.length).toBe(10);
      var firstTimestamp = results[0][0].lastSyncTimestamp;
      results.forEach(function(result) {
        expect(result[0].lastSyncTimestamp).toEqual(firstTimestamp);
      });
    });
  });

  describe('Edge Cases', function() {
    it('should handle undefined userId parameter', function() {
      var result;
      CreditCardDataService.fetchAllCards(undefined).then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should handle null userId parameter', function() {
      var result;
      CreditCardDataService.fetchAllCards(null).then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should handle empty string userId parameter', function() {
      var result;
      CreditCardDataService.fetchAllCards('').then(function(cards) {
        result = cards;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.length).toBe(5);
    });

    it('should return promise that resolves asynchronously', function() {
      var resolved = false;
      CreditCardDataService.fetchAllCards('user123').then(function() {
        resolved = true;
      });

      expect(resolved).toBe(false);

      $rootScope.$apply();

      expect(resolved).toBe(true);
    });
  });
});