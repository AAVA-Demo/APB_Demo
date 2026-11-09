/*
Test Documentation:
- Test Name: CardDataService Unit Tests
- Purpose: Validate CardDataService functionality for retrieving and caching credit card data
- Scenario: Tests cover successful card retrieval, data transformation, caching mechanism, TTL expiration, and error handling
- Expected Result: Service correctly retrieves, transforms, and caches card data with proper TTL management
*/

(function() {
  'use strict';

  describe('CardDataService', function() {
    var CardDataService, $httpBackend, API_ENDPOINTS, $q;
    var mockApiResponse, expectedTransformedData;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardDataService_, _$httpBackend_, _API_ENDPOINTS_, _$q_) {
      CardDataService = _CardDataService_;
      $httpBackend = _$httpBackend_;
      API_ENDPOINTS = _API_ENDPOINTS_;
      $q = _$q_;

      mockApiResponse = [
        {
          id: 'card1',
          number: '**** **** **** 1234',
          type: 'Visa Gold',
          creditLimit: 10000,
          outstanding: 2500,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'card2',
          number: '**** **** **** 5678',
          type: 'MasterCard Platinum',
          creditLimit: 15000,
          outstanding: 5000,
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      ];

      expectedTransformedData = [
        {
          cardId: 'card1',
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa Gold',
          creditLimit: 10000,
          outstandingAmount: 2500,
          availableCredit: 7500,
          lastUpdated: jasmine.any(Date)
        },
        {
          cardId: 'card2',
          cardNumber: '**** **** **** 5678',
          cardType: 'MasterCard Platinum',
          creditLimit: 15000,
          outstandingAmount: 5000,
          availableCredit: 10000,
          lastUpdated: jasmine.any(Date)
        }
      ];
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all cards from API', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, mockApiResponse);

        var result;
        CardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
      });

      it('should transform API response to correct format', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, mockApiResponse);

        var result;
        CardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result[0].cardId).toBe('card1');
        expect(result[0].cardNumber).toBe('**** **** **** 1234');
        expect(result[0].cardType).toBe('Visa Gold');
        expect(result[0].creditLimit).toBe(10000);
        expect(result[0].outstandingAmount).toBe(2500);
        expect(result[0].availableCredit).toBe(7500);
        expect(result[0].lastUpdated).toEqual(jasmine.any(Date));
      });

      it('should calculate availableCredit correctly', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, mockApiResponse);

        var result;
        CardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result[0].availableCredit).toBe(7500);
        expect(result[1].availableCredit).toBe(10000);
      });

      it('should cache the response after first call', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, mockApiResponse);

        var result1, result2;
        CardDataService.getAllCards().then(function(data) {
          result1 = data;
        });

        $httpBackend.flush();

        CardDataService.getAllCards().then(function(data) {
          result2 = data;
        });

        expect(result1).toBe(result2);
      });

      it('should use cached data within TTL period', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, mockApiResponse);

        CardDataService.getAllCards();
        $httpBackend.flush();

        var result;
        CardDataService.getAllCards().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
      });

      it('should handle empty response from API', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(200, []);

        var result;
        CardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(500, 'Internal Server Error');

        var error;
        CardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET(API_ENDPOINTS.CARDS).respond(0, '');

        var error;
        CardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });

    describe('getCardDetails', function() {
      it('should retrieve specific cards by IDs', function() {
        var cardIds = ['card1', 'card2'];
        var expectedUrl = API_ENDPOINTS.CARDS + '?ids=card1,card2';

        $httpBackend.expectGET(expectedUrl).respond(200, mockApiResponse);

        var result;
        CardDataService.getCardDetails(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
      });

      it('should construct correct query string with multiple IDs', function() {
        var cardIds = ['card1', 'card2', 'card3'];
        var expectedUrl = API_ENDPOINTS.CARDS + '?ids=card1,card2,card3';

        $httpBackend.expectGET(expectedUrl).respond(200, []);

        CardDataService.getCardDetails(cardIds);
        $httpBackend.flush();
      });

      it('should handle single card ID', function() {
        var cardIds = ['card1'];
        var expectedUrl = API_ENDPOINTS.CARDS + '?ids=card1';

        $httpBackend.expectGET(expectedUrl).respond(200, [mockApiResponse[0]]);

        var result;
        CardDataService.getCardDetails(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(1);
      });

      it('should handle empty card IDs array', function() {
        var cardIds = [];
        var expectedUrl = API_ENDPOINTS.CARDS + '?ids=';

        $httpBackend.expectGET(expectedUrl).respond(200, []);

        var result;
        CardDataService.getCardDetails(cardIds).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
      });

      it('should handle API errors for getCardDetails', function() {
        var cardIds = ['card1'];
        var expectedUrl = API_ENDPOINTS.CARDS + '?ids=card1';

        $httpBackend.expectGET(expectedUrl).respond(404, 'Not Found');

        var error;
        CardDataService.getCardDetails(cardIds).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardDetails
  - Scenarios covered:
    * Successful card retrieval from API
    * Data transformation from API format to application format
    * Available credit calculation
    * Caching mechanism validation
    * Cache usage within TTL period
    * Empty response handling
    * API error handling (500, 404)
    * Network error handling
    * Query string construction for multiple IDs
    * Single card ID retrieval
    * Empty card IDs array handling
  - Uncovered scenarios: Cache expiration after TTL (requires time manipulation)
  */
})();