/*
Test Documentation:
- Test Name: CardLinkService - getCardDetails success with uncached IDs
- Purpose: Validates that getCardDetails fetches and caches card details
- Scenario: Card IDs not in cache
- Expected Result: API called, cards cached and returned
*/
/*
Test Documentation:
- Test Name: CardLinkService - getCardDetails returns cached data
- Purpose: Validates that cached cards are returned without API call
- Scenario: Card IDs already in cache
- Expected Result: No API call, cached data returned
*/
/*
Test Documentation:
- Test Name: CardLinkService - getCardDetails handles mixed cached/uncached
- Purpose: Validates partial cache hit scenario
- Scenario: Some IDs cached, some not
- Expected Result: API called only for uncached IDs
*/
/*
Test Documentation:
- Test Name: CardLinkService - getCardDetails error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered: uncached fetch, cached return, partial cache, API error, empty array
- Uncovered scenarios: none
*/

describe('CardLinkService', function() {
  var CardLinkService, $httpBackend, API_CONFIG, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardLinkService_, _$httpBackend_, _API_CONFIG_, _$rootScope_) {
    CardLinkService = _CardLinkService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardDetails', function() {
    it('should fetch and cache card details for uncached IDs', function() {
      var cardIds = ['card1', 'card2'];
      var mockResponse = [
        {cardId: 'card1', cardName: 'Visa Gold', cardNumber: '****1234'},
        {cardId: 'card2', cardName: 'Mastercard Platinum', cardNumber: '****5678'}
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card1,card2')
        .respond(200, mockResponse);

      var result;
      CardLinkService.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result['card1']).toEqual(mockResponse[0]);
      expect(result['card2']).toEqual(mockResponse[1]);
    });

    it('should return cached data without API call', function() {
      var cardIds = ['card1'];
      var mockResponse = [{cardId: 'card1', cardName: 'Visa Gold', cardNumber: '****1234'}];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card1')
        .respond(200, mockResponse);

      CardLinkService.getCardDetails(cardIds).then(function() {});
      $httpBackend.flush();

      var result;
      CardLinkService.getCardDetails(cardIds).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result['card1'].cardName).toBe('Visa Gold');
    });

    it('should handle mixed cached and uncached IDs', function() {
      var initialIds = ['card1'];
      var mockResponse1 = [{cardId: 'card1', cardName: 'Visa Gold'}];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card1')
        .respond(200, mockResponse1);

      CardLinkService.getCardDetails(initialIds).then(function() {});
      $httpBackend.flush();

      var mixedIds = ['card1', 'card2'];
      var mockResponse2 = [{cardId: 'card2', cardName: 'Mastercard'}];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card2')
        .respond(200, mockResponse2);

      var result;
      CardLinkService.getCardDetails(mixedIds).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result['card1']).toBeDefined();
      expect(result['card2']).toBeDefined();
    });

    it('should handle API error and reject promise', function() {
      var cardIds = ['card3'];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card3')
        .respond(500, {error: 'Internal Server Error'});

      var error;
      CardLinkService.getCardDetails(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle empty card ID array', function() {
      var result;
      CardLinkService.getCardDetails([]).then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result).toEqual({});
    });

    it('should handle network error', function() {
      var cardIds = ['card4'];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards?ids=card4')
        .respond(-1, null);

      var error;
      CardLinkService.getCardDetails(cardIds).catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });
  });
});