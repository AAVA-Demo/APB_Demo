/*
Test Documentation:
- Test Name: CardOverviewFactory - getCards success
- Purpose: Validates that getCards returns card data successfully
- Scenario: API returns card list
- Expected Result: Promise resolves with card data
*/
/*
Test Documentation:
- Test Name: CardOverviewFactory - getCards empty response
- Purpose: Validates handling of empty card list
- Scenario: API returns empty array
- Expected Result: Promise resolves with empty array
*/
/*
Test Documentation:
- Test Name: CardOverviewFactory - getCards error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error
- Expected Result: Promise rejected with error
*/
/*
Coverage Report:
- Functions tested: getCards
- Scenarios covered: success with data, empty response, API error, network error
- Uncovered scenarios: none
*/

describe('CardOverviewFactory', function() {
  var CardOverviewFactory, $httpBackend, API_CONFIG;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardOverviewFactory_, _$httpBackend_, _API_CONFIG_) {
    CardOverviewFactory = _CardOverviewFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards', function() {
    it('should return card data successfully', function() {
      var mockResponse = [
        {
          cardId: 'card1',
          cardName: 'Visa Gold',
          cardNumber: '****1234',
          creditLimit: 50000,
          availableCredit: 30000,
          outstandingAmount: 20000,
          status: 'active'
        },
        {
          cardId: 'card2',
          cardName: 'Mastercard Platinum',
          cardNumber: '****5678',
          creditLimit: 100000,
          availableCredit: 80000,
          outstandingAmount: 20000,
          status: 'active'
        }
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockResponse);

      var result;
      CardOverviewFactory.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockResponse);
      expect(result.length).toBe(2);
      expect(result[0].cardName).toBe('Visa Gold');
      expect(result[1].creditLimit).toBe(100000);
    });

    it('should handle empty card list', function() {
      var mockResponse = [];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(200, mockResponse);

      var result;
      CardOverviewFactory.getCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle API error and reject promise', function() {
      var errorResponse = {status: 500, statusText: 'Internal Server Error'};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(500, errorResponse);

      var error;
      CardOverviewFactory.getCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle 404 error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(404, {error: 'Not Found'});

      var error;
      CardOverviewFactory.getCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });

    it('should handle network error', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(-1, null);

      var error;
      CardOverviewFactory.getCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should handle unauthorized access', function() {
      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards')
        .respond(401, {error: 'Unauthorized'});

      var error;
      CardOverviewFactory.getCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(401);
    });
  });
});