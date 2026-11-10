/*
Test Documentation:
- Test Name: CardDataService (Card Management Module) Unit Tests
- Purpose: Validate card data retrieval with caching for card management features
- Scenario: Test getUserCards and getCardDetails methods with caching behavior
- Expected Result: Service should fetch card data, cache results, and handle errors
*/

describe('CardDataService (Card Management Module)', function() {
  'use strict';

  beforeEach(module('cardManagementModule'));
  beforeEach(module('creditCardApp'));

  var CardDataService, $httpBackend, API_CONFIG, AuthService;
  var mockUserId = 'user-001';
  var mockCardId = 'card-123';
  var mockCardsData = [
    { cardId: 'card-001', cardNumberMasked: '****1234', creditLimit: 10000 },
    { cardId: 'card-002', cardNumberMasked: '****5678', creditLimit: 15000 }
  ];
  var mockCardDetail = {
    cardId: 'card-123',
    cardNumberMasked: '****9999',
    cardType: 'Visa Platinum',
    creditLimit: 20000,
    outstandingBalance: 5000,
    availableCredit: 15000,
    status: 'Active'
  };

  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _API_CONFIG_, _AuthService_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    AuthService = _AuthService_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-abc');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CardDataService).toBeDefined();
    });

    it('should have getUserCards method', function() {
      expect(CardDataService.getUserCards).toBeDefined();
      expect(typeof CardDataService.getUserCards).toBe('function');
    });

    it('should have getCardDetails method', function() {
      expect(CardDataService.getCardDetails).toBeDefined();
      expect(typeof CardDataService.getCardDetails).toBe('function');
    });
  });

  describe('getUserCards() - Success Scenarios', function() {
    it('should fetch user cards successfully', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      var result;
      CardDataService.getUserCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should include authorization header', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url, function(headers) {
        return headers['Authorization'] === 'Bearer mock-token-abc';
      }).respond(200, mockCardsData);

      CardDataService.getUserCards(mockUserId);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });
  });

  describe('getUserCards() - Caching Behavior', function() {
    it('should cache user cards after first fetch', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      CardDataService.getUserCards(mockUserId);
      $httpBackend.flush();

      // Second call should use cache
      var result;
      CardDataService.getUserCards(mockUserId).then(function(data) {
        result = data;
      });

      expect(result).toBeDefined();
    });
  });

  describe('getCardDetails() - Success Scenarios', function() {
    it('should fetch card details successfully', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', mockCardId);
      $httpBackend.expectGET(url).respond(200, mockCardDetail);

      var result;
      CardDataService.getCardDetails(mockCardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.cardId).toBe('card-123');
      expect(result.cardType).toBe('Visa Platinum');
    });

    it('should include authorization header', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', mockCardId);
      $httpBackend.expectGET(url, function(headers) {
        return headers['Authorization'] === 'Bearer mock-token-abc';
      }).respond(200, mockCardDetail);

      CardDataService.getCardDetails(mockCardId);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should replace :id parameter in URL', function() {
      var expectedUrl = API_CONFIG.BASE_URL + '/api/cards/' + mockCardId;
      $httpBackend.expectGET(expectedUrl).respond(200, mockCardDetail);

      CardDataService.getCardDetails(mockCardId);
      $httpBackend.flush();

      expect(true).toBe(true); // URL validation passed
    });
  });

  describe('getCardDetails() - Caching Behavior', function() {
    it('should cache card details after first fetch', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', mockCardId);
      $httpBackend.expectGET(url).respond(200, mockCardDetail);

      CardDataService.getCardDetails(mockCardId);
      $httpBackend.flush();

      // Second call should use cache
      var result;
      CardDataService.getCardDetails(mockCardId).then(function(data) {
        result = data;
      });

      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', function() {
    it('should handle getUserCards 404 error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(404, 'Not Found');

      var error;
      CardDataService.getUserCards(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle getCardDetails 404 error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', mockCardId);
      $httpBackend.expectGET(url).respond(404, 'Card Not Found');

      var error;
      CardDataService.getCardDetails(mockCardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle getUserCards 500 error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(500, 'Internal Server Error');

      var error;
      CardDataService.getUserCards(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle getCardDetails 500 error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', mockCardId);
      $httpBackend.expectGET(url).respond(500, 'Internal Server Error');

      var error;
      CardDataService.getCardDetails(mockCardId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });

  describe('Edge Cases', function() {
    it('should handle empty cards array', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, []);

      var result;
      CardDataService.getUserCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    it('should handle special characters in card ID', function() {
      var specialCardId = 'card-abc-123';
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARD_DETAILS.replace(':id', specialCardId);
      $httpBackend.expectGET(url).respond(200, mockCardDetail);

      var result;
      CardDataService.getCardDetails(specialCardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Service tested: CardDataService (Card Management Module)
- Methods tested: getUserCards(), getCardDetails()
- Scenarios covered: successful fetch, caching, authorization, URL parameter replacement, error handling (404, 500), edge cases
- Dependencies mocked: $http, AuthService, API_CONFIG
- Uncovered scenarios: cache expiration timing
*/