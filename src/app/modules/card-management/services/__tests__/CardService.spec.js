/*
Test Documentation:
- Test Name: CardService
- Purpose: Verify card data fetching and comparison functionality
- Scenario: Fetch all cards, get card details, and calculate portfolio comparison
- Expected Result: Service should return properly formatted card data
*/

describe('CardService', function() {
  'use strict';

  var CardService;
  var $httpBackend;
  var API_CONFIG;
  var AuthService;
  var CardFactory;

  beforeEach(module('cardManagementModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardService_, _$httpBackend_, _API_CONFIG_, _AuthService_, _CardFactory_) {
    CardService = _CardService_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    AuthService = _AuthService_;
    CardFactory = _CardFactory_;

    spyOn(AuthService, 'getAuthToken').and.returnValue('test-token');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify service exists
  - Scenario: Inject CardService
  - Expected Result: Service should be defined
  */
  it('should be defined', function() {
    expect(CardService).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should fetch all cards successfully
  - Purpose: Verify card list retrieval
  - Scenario: Call getAllCards with valid response
  - Expected Result: Should return array of card objects
  */
  it('should fetch all cards successfully', function() {
    var mockResponse = {
      cards: [
        { cardId: 'card1', cardType: 'Visa', creditLimit: 10000 },
        { cardId: 'card2', cardType: 'Mastercard', creditLimit: 15000 }
      ]
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(200, mockResponse);

    var result;
    CardService.getAllCards().then(function(cards) {
      result = cards;
    });

    $httpBackend.flush();

    expect(result.length).toBe(2);
    expect(result[0].cardId).toBe('card1');
    expect(result[1].cardId).toBe('card2');
  });

  /*
  Test Documentation:
  - Test Name: should include auth header in request
  - Purpose: Verify authentication header is sent
  - Scenario: Make API call and check headers
  - Expected Result: Authorization header should be present
  */
  it('should include auth header in request', function() {
    $httpBackend.expectGET(
      API_CONFIG.baseUrl + API_CONFIG.endpoints.cards,
      function(headers) {
        return headers['Authorization'] === 'Bearer test-token';
      }
    ).respond(200, { cards: [] });

    CardService.getAllCards();
    $httpBackend.flush();

    expect(AuthService.getAuthToken).toHaveBeenCalled();
  });

  /*
  Test Documentation:
  - Test Name: should fetch card details by ID
  - Purpose: Verify individual card retrieval
  - Scenario: Call getCardDetails with cardId
  - Expected Result: Should return single card object
  */
  it('should fetch card details by ID', function() {
    var mockCard = {
      cardId: 'card123',
      cardType: 'Visa',
      creditLimit: 10000,
      availableCredit: 7000
    };

    $httpBackend.expectGET(API_CONFIG.baseUrl + '/api/cards/card123')
      .respond(200, mockCard);

    var result;
    CardService.getCardDetails('card123').then(function(card) {
      result = card;
    });

    $httpBackend.flush();

    expect(result.cardId).toBe('card123');
    expect(result.cardType).toBe('Visa');
  });

  /*
  Test Documentation:
  - Test Name: should handle API error for getAllCards
  - Purpose: Verify error handling
  - Scenario: API returns error
  - Expected Result: Promise should be rejected
  */
  it('should handle API error for getAllCards', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.cards)
      .respond(500, 'Server Error');

    var error;
    CardService.getAllCards().catch(function(err) {
      error = err;
    });

    $httpBackend.flush();

    expect(error).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should calculate card comparison totals
  - Purpose: Verify portfolio aggregation
  - Scenario: Pass array of cards to getCardComparison
  - Expected Result: Should return totals for all cards
  */
  it('should calculate card comparison totals', function() {
    var cards = [
      CardFactory.create({ creditLimit: 10000, availableCredit: 7000, outstandingBalance: 3000 }),
      CardFactory.create({ creditLimit: 15000, availableCredit: 10000, outstandingBalance: 5000 })
    ];

    var comparison = CardService.getCardComparison(cards);

    expect(comparison.totalCreditLimit).toBe(25000);
    expect(comparison.totalAvailableCredit).toBe(17000);
    expect(comparison.totalOutstanding).toBe(8000);
    expect(comparison.cards).toEqual(cards);
  });

  /*
  Test Documentation:
  - Test Name: should handle empty card array in comparison
  - Purpose: Verify comparison with no cards
  - Scenario: Pass empty array to getCardComparison
  - Expected Result: All totals should be zero
  */
  it('should handle empty card array in comparison', function() {
    var comparison = CardService.getCardComparison([]);

    expect(comparison.totalCreditLimit).toBe(0);
    expect(comparison.totalAvailableCredit).toBe(0);
    expect(comparison.totalOutstanding).toBe(0);
  });
});

/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, getCardComparison
- Scenarios covered: successful fetch, error handling, authentication, portfolio aggregation
- Uncovered scenarios: network timeout (requires additional setup)
*/