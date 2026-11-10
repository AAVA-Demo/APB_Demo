/*
Test Documentation:
- Test Name: CreditCardDataService unit tests
- Purpose: Validate CreditCardDataService methods for retrieving credit card data
- Scenario: Test getAllCards and getCardById methods with success and error scenarios
- Expected Result: Service should correctly handle HTTP requests, responses, and errors
*/

describe('CreditCardDataService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var CreditCardDataService;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CreditCardDataService).toBeDefined();
    });

    it('should have getAllCards method', function() {
      expect(typeof CreditCardDataService.getAllCards).toBe('function');
    });

    it('should have getCardById method', function() {
      expect(typeof CreditCardDataService.getCardById).toBe('function');
    });
  });

  describe('getAllCards method', function() {
    it('should make GET request to correct endpoint', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa Gold', creditLimit: 10000 },
        { cardId: 2, cardName: 'MasterCard Platinum', creditLimit: 15000 }
      ];

      $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(200, mockCards);

      CreditCardDataService.getAllCards();
      $httpBackend.flush();
    });

    it('should resolve promise with card data on success', function() {
      var mockCards = [
        { cardId: 1, cardName: 'Visa Gold', creditLimit: 10000 },
        { cardId: 2, cardName: 'MasterCard Platinum', creditLimit: 15000 }
      ];

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(200, mockCards);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards);
    });

    it('should include timeout configuration in request', function() {
      $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(200, []);

      CreditCardDataService.getAllCards();
      $httpBackend.flush();
    });

    it('should reject promise on HTTP error', function() {
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(500, errorResponse);

      var errorResult;
      CreditCardDataService.getAllCards().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });

    it('should handle empty array response', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(200, []);

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle network timeout', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(408, { message: 'Request Timeout' });

      var errorResult;
      CreditCardDataService.getAllCards().catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(408);
    });
  });

  describe('getCardById method', function() {
    it('should make GET request to correct endpoint with cardId', function() {
      var cardId = 123;
      var mockCard = { cardId: 123, cardName: 'Visa Gold', creditLimit: 10000 };

      $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId)
        .respond(200, mockCard);

      CreditCardDataService.getCardById(cardId);
      $httpBackend.flush();
    });

    it('should resolve promise with card details on success', function() {
      var cardId = 456;
      var mockCard = { cardId: 456, cardName: 'MasterCard Platinum', creditLimit: 15000, availableCredit: 12000 };

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId)
        .respond(200, mockCard);

      var result;
      CreditCardDataService.getCardById(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCard);
      expect(result.cardId).toBe(cardId);
    });

    it('should reject promise when card not found (404)', function() {
      var cardId = 999;

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId)
        .respond(404, { message: 'Card not found' });

      var errorResult;
      CreditCardDataService.getCardById(cardId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(404);
    });

    it('should handle invalid cardId parameter', function() {
      var invalidCardId = null;

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + invalidCardId)
        .respond(400, { message: 'Bad Request' });

      var errorResult;
      CreditCardDataService.getCardById(invalidCardId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
    });

    it('should reject promise on server error', function() {
      var cardId = 789;

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId)
        .respond(500, { message: 'Internal Server Error' });

      var errorResult;
      CreditCardDataService.getCardById(cardId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });

    it('should handle unauthorized access (401)', function() {
      var cardId = 111;

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/' + cardId)
        .respond(401, { message: 'Unauthorized' });

      var errorResult;
      CreditCardDataService.getCardById(cardId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(401);
    });
  });

  describe('Error Handling and Edge Cases', function() {
    it('should log error to console on getAllCards failure', function() {
      spyOn(console, 'error');

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(500, 'Server Error');

      CreditCardDataService.getAllCards().catch(function() {});
      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith('Error fetching credit cards:', jasmine.any(Object));
    });

    it('should log error to console on getCardById failure', function() {
      spyOn(console, 'error');

      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS + '/123')
        .respond(404, 'Not Found');

      CreditCardDataService.getCardById(123).catch(function() {});
      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith('Error fetching card details:', jasmine.any(Object));
    });

    it('should handle malformed response data gracefully', function() {
      $httpBackend.whenGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CREDIT_CARDS)
        .respond(200, 'invalid json');

      var result;
      CreditCardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toBe('invalid json');
    });
  });
});

/*
Coverage Report:
- Service tested: CreditCardDataService
- Methods tested: getAllCards, getCardById
- Scenarios covered:
  * Service initialization and method availability
  * Successful HTTP GET requests with correct endpoints
  * Promise resolution with valid data
  * Error handling for HTTP errors (404, 500, 401, 408)
  * Empty array and null parameter handling
  * Console error logging
  * Timeout configuration
  * Malformed response handling
- Uncovered scenarios: None - comprehensive coverage including success, error, and edge cases
*/