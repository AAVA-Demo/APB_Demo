/*
Test Documentation:
- Test Name: cardManagementService Unit Tests
- Purpose: Validates card management service for retrieving card lists and individual card details
- Scenario: Tests getCards and getCard methods with success and error scenarios
- Expected Result: Service should correctly fetch card data from API endpoints
*/

describe('cardManagementService', function() {
  'use strict';

  var cardManagementService, $httpBackend, API_CONFIG;
  var mockUserId = 'user123';
  var mockCardId = 'card456';
  var mockCards = [
    {cardId: 'card1', cardName: 'Card 1'},
    {cardId: 'card2', cardName: 'Card 2'}
  ];
  var mockCard = {cardId: mockCardId, cardName: 'Test Card', creditLimit: 10000};

  beforeEach(module('creditCardApp.cardManagement'));

  beforeEach(inject(function(_cardManagementService_, _$httpBackend_, _API_CONFIG_) {
    cardManagementService = _cardManagementService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(cardManagementService).toBeDefined();
    });

    it('should have getCards method', function() {
      expect(cardManagementService.getCards).toBeDefined();
      expect(typeof cardManagementService.getCards).toBe('function');
    });

    it('should have getCard method', function() {
      expect(cardManagementService.getCard).toBeDefined();
      expect(typeof cardManagementService.getCard).toBe('function');
    });
  });

  describe('getCards()', function() {
    it('should make GET request with userId parameter', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      cardManagementService.getCards(mockUserId);
      $httpBackend.flush();
    });

    it('should return array of cards on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      cardManagementService.getCards(mockUserId).then(function(data) {
        expect(data).toEqual(mockCards);
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBe(2);
      });
      $httpBackend.flush();
    });

    it('should handle empty card list', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, []);

      cardManagementService.getCards(mockUserId).then(function(data) {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
      });
      $httpBackend.flush();
    });

    it('should handle server errors', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      cardManagementService.getCards(mockUserId).catch(function(error) {
        expect(error.status).toBe(500);
      });
      $httpBackend.flush();
    });

    it('should handle unauthorized access', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(401, {error: 'Unauthorized'});

      cardManagementService.getCards(mockUserId).catch(function(error) {
        expect(error.status).toBe(401);
      });
      $httpBackend.flush();
    });
  });

  describe('getCard()', function() {
    it('should make GET request with cardId', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      cardManagementService.getCard(mockCardId);
      $httpBackend.flush();
    });

    it('should return single card object on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      cardManagementService.getCard(mockCardId).then(function(data) {
        expect(data).toEqual(mockCard);
        expect(data.cardId).toBe(mockCardId);
      });
      $httpBackend.flush();
    });

    it('should handle card not found', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/invalid';
      $httpBackend.expectGET(expectedUrl).respond(404, {error: 'Card not found'});

      cardManagementService.getCard('invalid').catch(function(error) {
        expect(error.status).toBe(404);
      });
      $httpBackend.flush();
    });

    it('should return card with all details', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      cardManagementService.getCard(mockCardId).then(function(data) {
        expect(data.cardId).toBeDefined();
        expect(data.cardName).toBeDefined();
        expect(data.creditLimit).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('Multiple Request Scenarios', function() {
    it('should handle multiple getCards calls', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      cardManagementService.getCards(mockUserId);
      cardManagementService.getCards(mockUserId);
      $httpBackend.flush();
    });

    it('should handle multiple getCard calls for different cards', function() {
      var card1 = 'card1';
      var card2 = 'card2';
      var baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      
      $httpBackend.expectGET(baseUrl + '/' + card1).respond(200, {cardId: card1});
      $httpBackend.expectGET(baseUrl + '/' + card2).respond(200, {cardId: card2});

      cardManagementService.getCard(card1);
      cardManagementService.getCard(card2);
      $httpBackend.flush();
    });
  });

  describe('Data Validation', function() {
    it('should validate card structure in getCards response', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '?userId=' + mockUserId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCards);

      cardManagementService.getCards(mockUserId).then(function(data) {
        data.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardName).toBeDefined();
        });
      });
      $httpBackend.flush();
    });

    it('should validate card structure in getCard response', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCard);

      cardManagementService.getCard(mockCardId).then(function(data) {
        expect(typeof data).toBe('object');
        expect(data.cardId).toBe(mockCardId);
      });
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCards, getCard
- Scenarios covered:
  * Successful card list retrieval
  * Successful single card retrieval
  * Empty result handling
  * Error handling (404, 401, 500)
  * Multiple concurrent requests
  * Data structure validation
- Uncovered scenarios: Network timeout, request cancellation
*/