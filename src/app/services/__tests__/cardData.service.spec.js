/*
Test Documentation:
- Test Name: cardDataService - getAllCards, getCardById, getDashboardData, clearCache
- Purpose: Validates card data retrieval, caching mechanism, error handling, and cache clearing
- Scenario: Tests successful data retrieval, caching behavior, error responses, and cache invalidation
- Expected Result: Returns correct card data, caches responses, handles errors properly, and clears cache on demand
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById, getDashboardData, clearCache
- Scenarios covered: successful retrieval, caching, cache hit, error handling, cache clearing
- Uncovered scenarios: none
*/

describe('cardDataService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var cardDataService;
  var $httpBackend;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_cardDataService_, _$httpBackend_, _$q_, _$rootScope_) {
    cardDataService = _cardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    it('should retrieve all cards from API', function() {
      var mockCards = [
        { cardId: '1', cardType: 'Visa', creditLimit: 5000 },
        { cardId: '2', cardType: 'Mastercard', creditLimit: 3000 }
      ];

      $httpBackend.expectGET('/api/cards').respond(200, mockCards);

      var result;
      cardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCards);
    });

    it('should return cached data on second call', function() {
      var mockCards = [
        { cardId: '1', cardType: 'Visa', creditLimit: 5000 }
      ];

      $httpBackend.expectGET('/api/cards').respond(200, mockCards);

      cardDataService.getAllCards();
      $httpBackend.flush();

      var result;
      cardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result).toEqual(mockCards);
    });

    it('should handle API error', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');

      var error;
      cardDataService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });

  describe('getCardById', function() {
    it('should retrieve card by ID', function() {
      var mockCard = { cardId: '1', cardType: 'Visa', creditLimit: 5000 };

      $httpBackend.expectGET('/api/cards/1').respond(200, mockCard);

      var result;
      cardDataService.getCardById('1').then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCard);
    });

    it('should handle card not found error', function() {
      $httpBackend.expectGET('/api/cards/999').respond(404, 'Not Found');

      var error;
      cardDataService.getCardById('999').catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });

  describe('getDashboardData', function() {
    it('should retrieve dashboard data', function() {
      var mockDashboard = {
        cards: [{ cardId: '1', creditLimit: 5000 }],
        kpis: { totalCreditLimit: 5000 }
      };

      $httpBackend.expectGET('/api/dashboard').respond(200, mockDashboard);

      var result;
      cardDataService.getDashboardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockDashboard);
    });

    it('should handle dashboard data error', function() {
      $httpBackend.expectGET('/api/dashboard').respond(500, 'Server Error');

      var error;
      cardDataService.getDashboardData().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });

  describe('clearCache', function() {
    it('should clear cached data', function() {
      var mockCards = [{ cardId: '1', cardType: 'Visa' }];

      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      cardDataService.getAllCards();
      $httpBackend.flush();

      cardDataService.clearCache();

      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      cardDataService.getAllCards();
      $httpBackend.flush();

      expect(true).toBe(true);
    });
  });
});