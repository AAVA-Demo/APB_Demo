/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate credit card data retrieval operations
- Scenario: Tests getCards and getCardById methods with success and error scenarios
- Expected Result: Service correctly fetches card data and handles errors appropriately
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, AuthService, $q;
    var mockUserId = 'user123';
    var mockCards = [
      {
        cardId: 'card001',
        cardType: 'Visa Gold',
        cardNumber: '****1234',
        cardholderName: 'John Doe',
        creditLimit: 10000,
        availableCredit: 7500,
        outstandingAmount: 2500
      },
      {
        cardId: 'card002',
        cardType: 'Mastercard Platinum',
        cardNumber: '****5678',
        cardholderName: 'John Doe',
        creditLimit: 15000,
        availableCredit: 12000,
        outstandingAmount: 3000
      }
    ];
    var mockCard = mockCards[0];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _AuthService_, _$q_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      AuthService = _AuthService_;
      $q = _$q_;
      spyOn(AuthService, 'getUserId').and.returnValue(mockUserId);
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify service is properly instantiated
    - Scenario: Service injection
    - Expected Result: Service object exists with required methods
    */
    it('should be defined', function() {
      expect(CreditCardService).toBeDefined();
      expect(CreditCardService.getCards).toBeDefined();
      expect(CreditCardService.getCardById).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should fetch all cards for a user
    - Purpose: Validate successful retrieval of all user cards
    - Scenario: Call getCards with userId
    - Expected Result: HTTP GET to /api/cards with userId param, returns array of cards
    */
    it('should fetch all cards for a user', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(200, mockCards);

      var result;
      CreditCardService.getCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCards);
      expect(result.length).toBe(2);
    });

    /*
    Test Documentation:
    - Test Name: should use default userId from AuthService when not provided
    - Purpose: Validate fallback to AuthService.getUserId()
    - Scenario: Call getCards without userId parameter
    - Expected Result: AuthService.getUserId() called, request uses returned userId
    */
    it('should use default userId from AuthService when not provided', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(200, mockCards);

      CreditCardService.getCards();
      $httpBackend.flush();

      expect(AuthService.getUserId).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle error when fetching cards
    - Purpose: Validate error handling on failed card retrieval
    - Scenario: API returns 500 error
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle error when fetching cards', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(500, 'Internal Server Error');

      spyOn(console, 'error');
      var errorResult;
      CreditCardService.getCards(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should fetch a specific card by ID
    - Purpose: Validate retrieval of individual card details
    - Scenario: Call getCardById with valid cardId
    - Expected Result: HTTP GET to /api/cards/:id, returns card object
    */
    it('should fetch a specific card by ID', function() {
      var cardId = 'card001';
      $httpBackend.expectGET('/api/cards/' + cardId)
        .respond(200, mockCard);

      var result;
      CreditCardService.getCardById(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCard);
      expect(result.cardId).toBe(cardId);
    });

    /*
    Test Documentation:
    - Test Name: should handle error when fetching card by ID
    - Purpose: Validate error handling for invalid card ID
    - Scenario: API returns 404 Not Found
    - Expected Result: Promise rejected, error logged to console
    */
    it('should handle error when fetching card by ID', function() {
      var cardId = 'invalid-card';
      $httpBackend.expectGET('/api/cards/' + cardId)
        .respond(404, 'Card not found');

      spyOn(console, 'error');
      var errorResult;
      CreditCardService.getCardById(cardId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalledWith('Error fetching card:', jasmine.any(Object));
    });

    /*
    Test Documentation:
    - Test Name: should handle empty cards array response
    - Purpose: Validate handling of user with no cards
    - Scenario: API returns empty array
    - Expected Result: Service returns empty array without errors
    */
    it('should handle empty cards array response', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(200, []);

      var result;
      CreditCardService.getCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should handle network timeout when fetching cards
    - Purpose: Validate behavior on network timeout
    - Scenario: HTTP request times out
    - Expected Result: Promise rejected with timeout error
    */
    it('should handle network timeout when fetching cards', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(408, 'Request Timeout');

      spyOn(console, 'error');
      var errorResult;
      CreditCardService.getCards(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle unauthorized access
    - Purpose: Validate handling of 401 Unauthorized error
    - Scenario: API returns 401 error
    - Expected Result: Promise rejected with auth error
    */
    it('should handle unauthorized access', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(401, 'Unauthorized');

      spyOn(console, 'error');
      var errorResult;
      CreditCardService.getCards(mockUserId).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle malformed card data response
    - Purpose: Validate handling of unexpected response format
    - Scenario: API returns non-array response for getCards
    - Expected Result: Service returns whatever API provides
    */
    it('should handle malformed card data response', function() {
      var malformedData = { error: false, data: 'not-an-array' };
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(200, malformedData);

      var result;
      CreditCardService.getCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(malformedData);
    });

    /*
    Test Documentation:
    - Test Name: should handle null cardId parameter
    - Purpose: Validate handling of null/undefined cardId
    - Scenario: Call getCardById with null
    - Expected Result: HTTP GET to /api/cards/null
    */
    it('should handle null cardId parameter', function() {
      $httpBackend.expectGET('/api/cards/null')
        .respond(400, 'Invalid card ID');

      spyOn(console, 'error');
      var errorResult;
      CreditCardService.getCardById(null).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect(console.error).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple concurrent card requests
    - Purpose: Validate service handles parallel requests
    - Scenario: Call getCards and getCardById simultaneously
    - Expected Result: Both requests processed independently
    */
    it('should handle multiple concurrent card requests', function() {
      $httpBackend.expectGET('/api/cards?userId=' + mockUserId)
        .respond(200, mockCards);
      $httpBackend.expectGET('/api/cards/card001')
        .respond(200, mockCard);

      var result1, result2;
      CreditCardService.getCards(mockUserId).then(function(data) {
        result1 = data;
      });
      CreditCardService.getCardById('card001').then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1).toEqual(mockCards);
      expect(result2).toEqual(mockCard);
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCards, getCardById
- Scenarios covered:
  * Successful card retrieval (all cards and by ID)
  * Error handling (500, 404, 401, 408 errors)
  * Default userId from AuthService
  * Empty cards array
  * Network timeout
  * Unauthorized access
  * Malformed response data
  * Null/undefined parameters
  * Concurrent requests
- Edge cases: Empty response, malformed data, null cardId, network errors
- Uncovered scenarios: Card data validation, pagination support
*/