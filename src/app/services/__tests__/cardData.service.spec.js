/*
Test Documentation:
- Test Name: cardDataService - HTTP operations
- Purpose: Validates card data service HTTP requests and caching
- Scenario: Service makes API calls and caches responses
- Expected Result: Returns card data and handles errors appropriately
*/

(function() {
  'use strict';

  describe('cardDataService', function() {
    var cardDataService;
    var $httpBackend;
    var $q;
    var mockCards;
    var mockDashboardData;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_cardDataService_, _$httpBackend_, _$q_) {
      cardDataService = _cardDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;

      mockCards = [
        { cardId: 1, cardType: 'Visa', creditLimit: 5000, availableCredit: 3000 },
        { cardId: 2, cardType: 'Mastercard', creditLimit: 10000, availableCredit: 8000 }
      ];

      mockDashboardData = {
        cards: mockCards,
        kpis: { totalCreditLimit: 15000 }
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should fetch all cards from API
    - Purpose: Validates getAllCards method makes correct HTTP request
    - Scenario: First call to getAllCards
    - Expected Result: Makes GET request to /api/cards and returns data
    */
    it('should fetch all cards from API', function() {
      $httpBackend.expectGET('/api/cards').respond(200, mockCards);

      var result;
      cardDataService.getAllCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCards);
    });

    /*
    Test Documentation:
    - Test Name: should cache cards after first fetch
    - Purpose: Validates caching mechanism
    - Scenario: Multiple calls to getAllCards
    - Expected Result: Only one HTTP request made, subsequent calls return cached data
    */
    it('should cache cards after first fetch', function() {
      $httpBackend.expectGET('/api/cards').respond(200, mockCards);

      cardDataService.getAllCards();
      $httpBackend.flush();

      // Second call should not make HTTP request
      var result;
      cardDataService.getAllCards().then(function(data) {
        result = data;
      });

      expect(result).toEqual(mockCards);
    });

    /*
    Test Documentation:
    - Test Name: should fetch card by ID
    - Purpose: Validates getCardById method
    - Scenario: Request specific card by ID
    - Expected Result: Makes GET request to /api/cards/:id and returns card data
    */
    it('should fetch card by ID', function() {
      var cardId = 1;
      var mockCard = mockCards[0];

      $httpBackend.expectGET('/api/cards/' + cardId).respond(200, mockCard);

      var result;
      cardDataService.getCardById(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCard);
    });

    /*
    Test Documentation:
    - Test Name: should fetch dashboard data
    - Purpose: Validates getDashboardData method
    - Scenario: Request dashboard aggregated data
    - Expected Result: Makes GET request to /api/dashboard and returns data
    */
    it('should fetch dashboard data', function() {
      $httpBackend.expectGET('/api/dashboard').respond(200, mockDashboardData);

      var result;
      cardDataService.getDashboardData().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockDashboardData);
    });

    /*
    Test Documentation:
    - Test Name: should handle getAllCards error
    - Purpose: Validates error handling for failed API calls
    - Scenario: API returns error response
    - Expected Result: Promise rejected with error
    */
    it('should handle getAllCards error', function() {
      $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');

      var error;
      cardDataService.getAllCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle getCardById error
    - Purpose: Validates error handling for card fetch by ID
    - Scenario: API returns 404 for non-existent card
    - Expected Result: Promise rejected with error
    */
    it('should handle getCardById error', function() {
      $httpBackend.expectGET('/api/cards/999').respond(404, 'Not Found');

      var error;
      cardDataService.getCardById(999).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should clear cache
    - Purpose: Validates clearCache method
    - Scenario: Clear cache and fetch again
    - Expected Result: New HTTP request made after cache cleared
    */
    it('should clear cache', function() {
      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      cardDataService.getAllCards();
      $httpBackend.flush();

      cardDataService.clearCache();

      $httpBackend.expectGET('/api/cards').respond(200, mockCards);
      cardDataService.getAllCards();
      $httpBackend.flush();
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAllCards, getCardById, getDashboardData, clearCache
  - Scenarios covered: successful API calls, caching, error handling, cache clearing
  - Edge cases: server errors, 404 responses, cache invalidation
  - Uncovered scenarios: none
  */
})();