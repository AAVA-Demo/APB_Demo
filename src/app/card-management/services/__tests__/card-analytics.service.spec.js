/*
Test Documentation:
- Test Name: cardAnalyticsService Unit Tests
- Purpose: Validates card analytics service for retrieving card-specific spending analytics
- Scenario: Tests getCardAnalytics with success and error scenarios including mock data
- Expected Result: Service should fetch analytics or provide mock data on failure
*/

describe('cardAnalyticsService', function() {
  'use strict';

  var cardAnalyticsService, $httpBackend, $q, API_CONFIG;
  var mockCardId = 'card123';
  var mockAnalytics = {
    cardId: 'card123',
    spending: {
      thisMonth: 1234.56,
      lastMonth: 987.65,
      trend: 'up'
    },
    utilization: 45.2,
    patterns: {
      topCategory: 'Food & Dining',
      avgTransaction: 78.90
    }
  };

  beforeEach(module('creditCardApp.cardManagement'));

  beforeEach(inject(function(_cardAnalyticsService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    cardAnalyticsService = _cardAnalyticsService_;
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
      expect(cardAnalyticsService).toBeDefined();
    });

    it('should have getCardAnalytics method', function() {
      expect(cardAnalyticsService.getCardAnalytics).toBeDefined();
      expect(typeof cardAnalyticsService.getCardAnalytics).toBe('function');
    });
  });

  describe('getCardAnalytics() - Success Scenarios', function() {
    it('should make GET request to correct endpoint with cardId', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId);
      $httpBackend.flush();
    });

    it('should return analytics data on success', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data).toEqual(mockAnalytics);
      });
      $httpBackend.flush();
    });

    it('should return analytics with cardId field', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.cardId).toBe(mockCardId);
      });
      $httpBackend.flush();
    });

    it('should return analytics with spending object', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.spending).toBeDefined();
        expect(data.spending.thisMonth).toBeDefined();
        expect(data.spending.lastMonth).toBeDefined();
        expect(data.spending.trend).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should return analytics with utilization field', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.utilization).toBeDefined();
        expect(typeof data.utilization).toBe('number');
      });
      $httpBackend.flush();
    });

    it('should return analytics with patterns object', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.patterns).toBeDefined();
        expect(data.patterns.topCategory).toBeDefined();
        expect(data.patterns.avgTransaction).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('getCardAnalytics() - Error Handling', function() {
    it('should return mock analytics on 500 server error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(500, {error: 'Server Error'});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.cardId).toBe(mockCardId);
      });
      $httpBackend.flush();
    });

    it('should return mock analytics on 404 not found', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(404, {error: 'Card not found'});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data).toBeDefined();
        expect(data.spending).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should return mock analytics on network error', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(-1, '');

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data).toBeDefined();
      });
      $httpBackend.flush();
    });
  });

  describe('Mock Analytics Generation', function() {
    it('should generate valid mock analytics structure', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.cardId).toBe(mockCardId);
        expect(data.spending).toBeDefined();
        expect(data.utilization).toBeDefined();
        expect(data.patterns).toBeDefined();
      });
      $httpBackend.flush();
    });

    it('should generate realistic spending values in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.spending.thisMonth).toBe(1234.56);
        expect(data.spending.lastMonth).toBe(987.65);
        expect(data.spending.trend).toBe('up');
      });
      $httpBackend.flush();
    });

    it('should generate valid utilization percentage in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.utilization).toBe(45.2);
        expect(data.utilization).toBeGreaterThanOrEqual(0);
        expect(data.utilization).toBeLessThanOrEqual(100);
      });
      $httpBackend.flush();
    });

    it('should generate valid patterns in mock data', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(500, {});

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(data.patterns.topCategory).toBe('Food & Dining');
        expect(data.patterns.avgTransaction).toBe(78.90);
      });
      $httpBackend.flush();
    });
  });

  describe('Multiple Card Scenarios', function() {
    it('should handle analytics requests for different cards', function() {
      var card1 = 'card1';
      var card2 = 'card2';
      var baseUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards;
      
      $httpBackend.expectGET(baseUrl + '/' + card1 + '/analytics').respond(200, {cardId: card1});
      $httpBackend.expectGET(baseUrl + '/' + card2 + '/analytics').respond(200, {cardId: card2});

      cardAnalyticsService.getCardAnalytics(card1);
      cardAnalyticsService.getCardAnalytics(card2);
      $httpBackend.flush();
    });

    it('should handle concurrent requests for same card', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId);
      cardAnalyticsService.getCardAnalytics(mockCardId);
      $httpBackend.flush();
    });
  });

  describe('Analytics Data Validation', function() {
    it('should validate spending trend values', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(['up', 'down', 'stable']).toContain(data.spending.trend);
      });
      $httpBackend.flush();
    });

    it('should validate numeric fields are numbers', function() {
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.cards + '/' + mockCardId + '/analytics';
      $httpBackend.expectGET(expectedUrl).respond(200, mockAnalytics);

      cardAnalyticsService.getCardAnalytics(mockCardId).then(function(data) {
        expect(typeof data.spending.thisMonth).toBe('number');
        expect(typeof data.spending.lastMonth).toBe('number');
        expect(typeof data.utilization).toBe('number');
        expect(typeof data.patterns.avgTransaction).toBe('number');
      });
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getCardAnalytics, getMockAnalytics (internal)
- Scenarios covered:
  * Successful analytics retrieval
  * Complete analytics structure validation
  * Error handling (500, 404, network errors)
  * Mock analytics generation
  * Multiple card requests
  * Concurrent requests
  * Data type validation
- Uncovered scenarios: Analytics caching, time-based filtering
*/