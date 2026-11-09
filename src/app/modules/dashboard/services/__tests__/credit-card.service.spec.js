/*
Test Documentation:
- Test Name: CreditCardService functionality
- Purpose: Validate credit card data retrieval and caching
- Scenario: Test getAllCards and getCardById methods
- Expected Result: Cards retrieved from API and cached properly
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, API_CONFIG, $q;
    var mockCards = [
      { cardId: 'card1', cardName: 'Visa Gold', creditLimit: 5000, status: 'Active' },
      { cardId: 'card2', cardName: 'Mastercard Platinum', creditLimit: 10000, status: 'Active' }
    ];

    beforeEach(module('app.dashboard'));
    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_CONFIG_, _$q_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure service is injectable
    - Scenario: Inject CreditCardService
    - Expected Result: Service is defined
    */
    it('should be defined', function() {
      expect(CreditCardService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getAllCards should retrieve all credit cards
    - Purpose: Validate card retrieval from API
    - Scenario: HTTP GET to /creditcards endpoint
    - Expected Result: Returns array of cards
    */
    it('getAllCards should retrieve all credit cards', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
        .respond(200, mockCards);

      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: getAllCards should handle API errors
    - Purpose: Validate error handling
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected with error
    */
    it('getAllCards should handle API errors', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards)
        .respond(500, 'Server error');

      var error;
      CreditCardService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    /*
    Test Documentation:
    - Test Name: getCardById should retrieve specific card
    - Purpose: Validate single card retrieval
    - Scenario: HTTP GET to /creditcards/:id
    - Expected Result: Returns specific card object
    */
    it('getCardById should retrieve specific card', function() {
      var cardId = 'card1';
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards + '/' + cardId)
        .respond(200, mockCards[0]);

      var result;
      CreditCardService.getCardById(cardId).then(function(card) {
        result = card;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards[0]);
      expect(result.cardId).toBe('card1');
    });

    /*
    Test Documentation:
    - Test Name: getCardById should use cache on subsequent calls
    - Purpose: Validate caching mechanism
    - Scenario: Call getCardById twice with same ID
    - Expected Result: Second call returns cached data without HTTP request
    */
    it('getCardById should use cache on subsequent calls', function() {
      var cardId = 'card1';
      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.creditCards + '/' + cardId)
        .respond(200, mockCards[0]);

      CreditCardService.getCardById(cardId);
      $httpBackend.flush();

      var result;
      CreditCardService.getCardById(cardId).then(function(card) {
        result = card;
      });

      expect(result).toEqual(mockCards[0]);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardById
  - Scenarios covered: successful retrieval, error handling, caching
  - Uncovered scenarios: timeout scenarios
  */
})();