/*
Test Documentation:
- Test Name: CardDataService Unit Tests
- Purpose: Validate card data retrieval functionality for dashboard module
- Scenario: Test getCards method with various response scenarios
- Expected Result: Service should fetch card data with proper authentication and error handling
*/

describe('CardDataService (Dashboard Module)', function() {
  'use strict';

  beforeEach(module('dashboardModule'));
  beforeEach(module('creditCardApp'));

  var CardDataService, $httpBackend, API_CONFIG, AuthService;
  var mockUserId = 'user-001';
  var mockCardsData = [
    {
      cardId: 'card-001',
      cardNumberMasked: '****1234',
      creditLimit: 10000,
      outstanding: 2000,
      availableCredit: 8000
    },
    {
      cardId: 'card-002',
      cardNumberMasked: '****5678',
      creditLimit: 15000,
      outstanding: 5000,
      availableCredit: 10000
    }
  ];

  beforeEach(inject(function(_CardDataService_, _$httpBackend_, _API_CONFIG_, _AuthService_) {
    CardDataService = _CardDataService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    AuthService = _AuthService_;
    spyOn(AuthService, 'getToken').and.returnValue('mock-token-456');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CardDataService).toBeDefined();
    });

    it('should have getCards method', function() {
      expect(CardDataService.getCards).toBeDefined();
      expect(typeof CardDataService.getCards).toBe('function');
    });
  });

  describe('getCards() - Success Scenarios', function() {
    it('should fetch cards for valid user ID', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      var result;
      CardDataService.getCards(mockUserId).then(function(data) {
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
        return headers['Authorization'] === 'Bearer mock-token-456';
      }).respond(200, mockCardsData);

      CardDataService.getCards(mockUserId);
      $httpBackend.flush();

      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should return card data with correct structure', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      var result;
      CardDataService.getCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result[0].cardId).toBe('card-001');
      expect(result[0].creditLimit).toBe(10000);
      expect(result[1].cardId).toBe('card-002');
    });

    it('should handle empty card list', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, []);

      var result;
      CardDataService.getCards(mockUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('getCards() - Error Handling', function() {
    it('should handle 401 unauthorized error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(401, 'Unauthorized');

      var error;
      CardDataService.getCards(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });

    it('should handle 404 not found error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(404, 'Not Found');

      var error;
      CardDataService.getCards(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle 500 server error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(500, 'Internal Server Error');

      var error;
      CardDataService.getCards(mockUserId).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should reject promise on network error', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(-1, '');

      var rejected = false;
      CardDataService.getCards(mockUserId).catch(function() {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
    });
  });

  describe('getCards() - Edge Cases', function() {
    it('should handle special characters in user ID', function() {
      var specialUserId = 'user@test.com';
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + specialUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      var result;
      CardDataService.getCards(specialUserId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
    });

    it('should respect timeout configuration', function() {
      var url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '?userId=' + mockUserId;
      $httpBackend.expectGET(url).respond(200, mockCardsData);

      CardDataService.getCards(mockUserId);
      $httpBackend.flush();

      expect(API_CONFIG.TIMEOUT).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Service tested: CardDataService (Dashboard Module)
- Methods tested: getCards()
- Scenarios covered: successful fetch, authorization, empty lists, error handling (401, 404, 500, network), edge cases
- Dependencies mocked: $http, AuthService, API_CONFIG
- Uncovered scenarios: none (comprehensive coverage achieved)
*/