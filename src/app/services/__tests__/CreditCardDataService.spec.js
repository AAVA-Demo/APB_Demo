/*
Test Documentation:
- Test Name: CreditCardDataService Unit Tests
- Purpose: Validate credit card data retrieval functionality
- Scenario: Tests getCardDetails and getCards methods with success and error scenarios
- Expected Result: Service correctly retrieves card details and handles HTTP errors appropriately
*/

describe('CreditCardDataService', function() {
  var CreditCardDataService;
  var $httpBackend;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$rootScope_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardDetails', function() {
    it('should retrieve card details for a given userId', function() {
      var userId = 'user123';
      var mockResponse = [
        {cardId: 'card1', cardType: 'Visa', cardNumber: '****1234', creditLimit: 5000, availableCredit: 3000},
        {cardId: 'card2', cardType: 'Mastercard', cardNumber: '****5678', creditLimit: 10000, availableCredit: 8000}
      ];

      $httpBackend.expectGET('/api/cards/' + userId).respond(200, mockResponse);

      var result;
      CreditCardDataService.getCardDetails(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardId).toBe('card2');
    });

    it('should handle HTTP 404 error when user not found', function() {
      var userId = 'nonexistent';

      $httpBackend.expectGET('/api/cards/' + userId).respond(404, {error: 'User not found'});

      var error;
      CreditCardDataService.getCardDetails(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle HTTP 500 server error', function() {
      var userId = 'user456';

      $httpBackend.expectGET('/api/cards/' + userId).respond(500, {error: 'Internal server error'});

      var error;
      CreditCardDataService.getCardDetails(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle network timeout error', function() {
      var userId = 'user789';

      $httpBackend.expectGET('/api/cards/' + userId).respond(-1, null);

      var error;
      CreditCardDataService.getCardDetails(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should return empty array when no cards found', function() {
      var userId = 'user101';
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards/' + userId).respond(200, mockResponse);

      var result;
      CreditCardDataService.getCardDetails(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('getCards', function() {
    it('should retrieve cards for a given userId with query parameter', function() {
      var userId = 'user202';
      var mockResponse = [
        {cardId: 'card3', cardType: 'Amex', cardNumber: '****9012', creditLimit: 15000, availableCredit: 12000}
      ];

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, mockResponse);

      var result;
      CreditCardDataService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(1);
      expect(result[0].cardType).toBe('Amex');
    });

    it('should handle HTTP 401 unauthorized error', function() {
      var userId = 'user303';

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(401, {error: 'Unauthorized'});

      var error;
      CreditCardDataService.getCards(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    it('should handle HTTP 403 forbidden error', function() {
      var userId = 'user404';

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(403, {error: 'Forbidden'});

      var error;
      CreditCardDataService.getCards(userId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(403);
    });

    it('should retrieve multiple cards successfully', function() {
      var userId = 'user505';
      var mockResponse = [
        {cardId: 'card4', cardType: 'Visa', cardNumber: '****1111', creditLimit: 3000, availableCredit: 2500},
        {cardId: 'card5', cardType: 'Mastercard', cardNumber: '****2222', creditLimit: 7000, availableCredit: 5000},
        {cardId: 'card6', cardType: 'Discover', cardNumber: '****3333', creditLimit: 4000, availableCredit: 3500}
      ];

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, mockResponse);

      var result;
      CreditCardDataService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(3);
      expect(result[0].cardType).toBe('Visa');
      expect(result[1].cardType).toBe('Mastercard');
      expect(result[2].cardType).toBe('Discover');
    });

    it('should handle empty response for getCards', function() {
      var userId = 'user606';
      var mockResponse = [];

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, mockResponse);

      var result;
      CreditCardDataService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle malformed response data', function() {
      var userId = 'user707';

      $httpBackend.expectGET('/api/cards?userId=' + userId).respond(200, null);

      var result;
      CreditCardDataService.getCards(userId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeNull();
    });
  });

  describe('API endpoint construction', function() {
    it('should construct correct URL for getCardDetails', function() {
      var userId = 'testUser';

      $httpBackend.expectGET('/api/cards/testUser').respond(200, []);

      CreditCardDataService.getCardDetails(userId);

      $httpBackend.flush();
    });

    it('should construct correct URL with query parameter for getCards', function() {
      var userId = 'testUser2';

      $httpBackend.expectGET('/api/cards?userId=testUser2').respond(200, []);

      CreditCardDataService.getCards(userId);

      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardDetails, getCards
- Scenarios covered:
  * Successful card details retrieval
  * Successful cards retrieval with query parameter
  * HTTP 404 error handling
  * HTTP 500 server error handling
  * HTTP 401 unauthorized error handling
  * HTTP 403 forbidden error handling
  * Network timeout error handling
  * Empty response handling
  * Multiple cards retrieval
  * Malformed response data handling
  * Correct API endpoint construction
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: $http via $httpBackend
*/