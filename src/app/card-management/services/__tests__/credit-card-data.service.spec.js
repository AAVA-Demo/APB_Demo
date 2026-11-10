/*
Test Documentation:
- Test Name: creditCardDataService (Card Management) Unit Tests
- Purpose: Validates credit card data service for fetching card details with mock data fallback
- Scenario: Tests getCardDetails with various input scenarios and error handling
- Expected Result: Service should fetch card details or provide mock data on failure
*/

describe('creditCardDataService (Card Management)', function() {
  'use strict';

  var creditCardDataService, $httpBackend, $q, API_CONFIG;
  var mockCardIds = ['card1', 'card2', 'card3'];
  var mockCards = [
    {
      cardId: 'card1',
      userId: 'user123',
      cardNumber: '**** 1234',
      cardType: 'Visa',
      cardName: 'Chase Sapphire',
      creditLimit: 15000,
      availableCredit: 12000,
      outstandingBalance: 3000,
      expiryDate: '12/25',
      isActive: true
    },
    {
      cardId: 'card2',
      userId: 'user123',
      cardNumber: '**** 5678',
      cardType: 'MasterCard',
      cardName: 'Citi Rewards',
      creditLimit: 20000,
      availableCredit: 15000,
      outstandingBalance: 5000,
      expiryDate: '08/26',
      isActive: true
    }
  ];

  beforeEach(module('creditCardApp.cardManagement'));

  beforeEach(inject(function(_creditCardDataService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    creditCardDataService = _creditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(creditCardDataService).toBeDefined();
    });

    it('should have getCardDetails method', function() {
      expect(creditCardDataService.getCardDetails).toBeDefined();
      expect(typeof creditCardDataService.getCardDetails).toBe('function');
    });
  });

  describe('getCardDetails() - Success Scenarios', function() {
    it('should make GET request with comma-separated card IDs', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.getCardDetails(mockCardIds);
      $httpBackend.flush();
    });

    it('should return array of card details on success', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(2);
      });
      $httpBackend.flush();
    });

    it('should return cards with all required fields', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        data.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingBalance).toBeDefined();
        });
      });
      $httpBackend.flush();
    });
  });

  describe('getCardDetails() - Edge Cases', function() {
    it('should return empty array when cardIds is null', function() {
      creditCardDataService.getCardDetails(null).then(function(data) {
        expect(data).toEqual([]);
      });
    });

    it('should return empty array when cardIds is undefined', function() {
      creditCardDataService.getCardDetails(undefined).then(function(data) {
        expect(data).toEqual([]);
      });
    });

    it('should return empty array when cardIds is empty array', function() {
      creditCardDataService.getCardDetails([]).then(function(data) {
        expect(data).toEqual([]);
      });
    });

    it('should handle single card ID', function() {
      var singleId = ['card1'];
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=card1';
      $httpBackend.expectGET(expectedUrl).respond(200, [mockCards[0]]);

      creditCardDataService.getCardDetails(singleId).then(function(data) {
        expect(data.length).toBe(1);
        expect(data[0].cardId).toBe('card1');
      });
      $httpBackend.flush();
    });
  });

  describe('getCardDetails() - Error Handling', function() {
    it('should return mock cards on API failure', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
      });
      $httpBackend.flush();
    });

    it('should return mock cards on network error', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(-1, '');

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
      });
      $httpBackend.flush();
    });
  });

  describe('Mock Data Generation', function() {
    it('should generate valid mock card structure', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        expect(data.length).toBe(3);
        data.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.userId).toBe('user123');
          expect(card.cardNumber).toMatch(/\*\*\*\* \d{4}/);
          expect(card.cardType).toBeDefined();
          expect(card.creditLimit).toBeGreaterThan(0);
        });
      });
      $httpBackend.flush();
    });

    it('should generate different card types in mock data', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        var cardTypes = data.map(function(card) { return card.cardType; });
        expect(cardTypes).toContain('Visa');
        expect(cardTypes).toContain('MasterCard');
        expect(cardTypes).toContain('Amex');
      });
      $httpBackend.flush();
    });

    it('should generate realistic financial values in mock data', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        data.forEach(function(card) {
          expect(card.creditLimit).toBeGreaterThan(0);
          expect(card.availableCredit).toBeLessThanOrEqual(card.creditLimit);
          expect(card.outstandingBalance).toBeGreaterThanOrEqual(0);
          var calculated = card.creditLimit - card.outstandingBalance;
          expect(Math.abs(card.availableCredit - calculated)).toBeLessThan(0.1);
        });
      });
      $httpBackend.flush();
    });

    it('should set all mock cards as active', function() {
      var idsParam = mockCardIds.join(',');
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + idsParam;
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      creditCardDataService.getCardDetails(mockCardIds).then(function(data) {
        data.forEach(function(card) {
          expect(card.isActive).toBe(true);
        });
      });
      $httpBackend.flush();
    });
  });

  describe('Multiple Request Scenarios', function() {
    it('should handle multiple concurrent requests', function() {
      var ids1 = ['card1', 'card2'];
      var ids2 = ['card3'];
      var expectedUrl1 = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + ids1.join(',');
      var expectedUrl2 = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?ids=' + ids2.join(',');
      
      $httpBackend.expectGET(expectedUrl1).respond(200, [mockCards[0]]);
      $httpBackend.expectGET(expectedUrl2).respond(200, [mockCards[1]]);

      creditCardDataService.getCardDetails(ids1);
      creditCardDataService.getCardDetails(ids2);
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails, getMockCards (internal)
- Scenarios covered:
  * Successful API call with multiple card IDs
  * Single card ID request
  * Empty/null/undefined input handling
  * Error handling with mock data fallback
  * Mock data structure and validation
  * Financial consistency in mock data
  * Multiple concurrent requests
- Uncovered scenarios: Request cancellation, partial failures
*/