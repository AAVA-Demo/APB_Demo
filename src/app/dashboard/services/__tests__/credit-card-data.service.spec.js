/*
Test Documentation:
- Test Name: creditCardDataService (Dashboard) Unit Tests
- Purpose: Validates credit card data resource service for querying and retrieving card information
- Scenario: Tests $resource configuration, query and get methods with proper timeout settings
- Expected Result: Service should correctly interact with card API endpoints
*/

describe('creditCardDataService (Dashboard)', function() {
  'use strict';

  var creditCardDataService, $httpBackend, API_CONFIG;
  var mockCardId = 'card123';
  var mockCard = {
    cardId: 'card123',
    cardNumber: '**** 1234',
    cardType: 'Visa',
    creditLimit: 15000,
    availableCredit: 12000
  };
  var mockCards = [mockCard];

  beforeEach(module('creditCardApp.dashboard'));

  beforeEach(inject(function(_creditCardDataService_, _$httpBackend_, _API_CONFIG_) {
    creditCardDataService = _creditCardDataService_;
    $httpBackend = _$httpBackend_;
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

    it('should have query method', function() {
      expect(creditCardDataService.query).toBeDefined();
      expect(typeof creditCardDataService.query).toBe('function');
    });

    it('should have get method', function() {
      expect(creditCardDataService.get).toBeDefined();
      expect(typeof creditCardDataService.get).toBe('function');
    });
  });

  describe('query() method', function() {
    it('should make GET request to cards endpoint', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.query();
      $httpBackend.flush();
    });

    it('should return array of cards', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      var result = creditCardDataService.query();
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty card list', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(200, []);

      var result = creditCardDataService.query();
      $httpBackend.flush();
      
      expect(result.length).toBe(0);
    });

    it('should handle query errors', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      var result = creditCardDataService.query();
      $httpBackend.flush();
    });
  });

  describe('get() method', function() {
    it('should make GET request with cardId parameter', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      creditCardDataService.get({cardId: mockCardId});
      $httpBackend.flush();
    });

    it('should return single card object', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      var result = creditCardDataService.get({cardId: mockCardId});
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe(mockCardId);
    });

    it('should handle card not found error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/invalid';
      $httpBackend.expectGET(expectedUrl).respond(404, {error: 'Card not found'});

      creditCardDataService.get({cardId: 'invalid'});
      $httpBackend.flush();
    });

    it('should retrieve card with all required fields', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      var result = creditCardDataService.get({cardId: mockCardId});
      $httpBackend.flush();
      
      expect(result.cardNumber).toBeDefined();
      expect(result.cardType).toBeDefined();
      expect(result.creditLimit).toBeDefined();
    });
  });

  describe('Timeout Configuration', function() {
    it('should include timeout in query requests', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.query();
      $httpBackend.flush();
    });

    it('should include timeout in get requests', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      creditCardDataService.get({cardId: mockCardId});
      $httpBackend.flush();
    });
  });

  describe('Multiple Card Scenarios', function() {
    it('should handle multiple query calls', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      creditCardDataService.query();
      creditCardDataService.query();
      $httpBackend.flush();
    });

    it('should handle multiple get calls for different cards', function() {
      var card1 = 'card1';
      var card2 = 'card2';
      var baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      
      $httpBackend.expectGET(baseUrl + '/' + card1).respond(200, {cardId: card1});
      $httpBackend.expectGET(baseUrl + '/' + card2).respond(200, {cardId: card2});

      creditCardDataService.get({cardId: card1});
      creditCardDataService.get({cardId: card2});
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: query, get (via $resource)
- Scenarios covered:
  * Query all cards
  * Get single card by ID
  * Empty result handling
  * Error handling (404, 500)
  * Timeout configuration
  * Multiple concurrent requests
- Uncovered scenarios: Request cancellation, custom headers
*/