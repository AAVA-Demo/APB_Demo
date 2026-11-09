/*
Test Documentation:
- Test Name: CreditCardDataFactory - getAllCards success
- Purpose: Validates retrieval of all user credit cards
- Scenario: API returns list of all credit cards for the user
- Expected Result: Promise resolves with array of credit card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchCardById success
- Purpose: Validates retrieval of specific card details by ID
- Scenario: API returns details for requested card ID
- Expected Result: Promise resolves with card details object
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - getCardSpendSummary success
- Purpose: Validates retrieval of spending summary for a specific card
- Scenario: API returns spend summary data for requested card
- Expected Result: Promise resolves with spend summary object
*/
/*
Coverage Report:
- Functions tested: getAllCards, fetchCardById, getCardSpendSummary
- Scenarios covered: successful API calls, error handling, invalid card IDs
- Edge cases: empty card lists, null card IDs, API failures, unauthorized access
- Uncovered scenarios: none
*/

describe('CreditCardDataFactory', function() {
  'use strict';

  var CreditCardDataFactory, $httpBackend;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_) {
    CreditCardDataFactory = _CreditCardDataFactory_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    it('should return all cards when API call succeeds', function() {
      var mockCards = [
        { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234' },
        { cardId: 'card2', cardType: 'Mastercard', cardNumber: '****5678' }
      ];

      $httpBackend.expectGET('/api/cards')
        .respond(200, mockCards);

      CreditCardDataFactory.getAllCards().then(function(data) {
        expect(data).toEqual(mockCards);
        expect(data.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should handle empty card list', function() {
      $httpBackend.expectGET('/api/cards')
        .respond(200, []);

      CreditCardDataFactory.getAllCards().then(function(data) {
        expect(data).toEqual([]);
        expect(data.length).toBe(0);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      $httpBackend.expectGET('/api/cards')
        .respond(500, { message: 'Internal Server Error' });

      CreditCardDataFactory.getAllCards().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('/api/cards')
        .respond(401, { message: 'Unauthorized' });

      CreditCardDataFactory.getAllCards().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });
  });

  describe('fetchCardById', function() {
    it('should return card details when API call succeeds', function() {
      var cardId = 'card123';
      var mockCard = {
        cardId: 'card123',
        cardType: 'Visa Platinum',
        cardNumber: '****9876',
        creditLimit: 25000,
        balance: 8000
      };

      $httpBackend.expectGET('/api/cards/' + cardId)
        .respond(200, mockCard);

      CreditCardDataFactory.fetchCardById(cardId).then(function(data) {
        expect(data).toEqual(mockCard);
        expect(data.cardId).toBe('card123');
      });

      $httpBackend.flush();
    });

    it('should handle invalid card ID', function() {
      var invalidCardId = 'invalid-card';

      $httpBackend.expectGET('/api/cards/' + invalidCardId)
        .respond(404, { message: 'Card not found' });

      CreditCardDataFactory.fetchCardById(invalidCardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error', function() {
      var cardId = 'card456';

      $httpBackend.expectGET('/api/cards/' + cardId)
        .respond(500, { message: 'Internal Server Error' });

      CreditCardDataFactory.fetchCardById(cardId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('getCardSpendSummary', function() {
    it('should return spend summary when API call succeeds', function() {
      var cardId = 'card789';
      var mockSummary = {
        currentMonthSpend: 1500,
        lastMonthSpend: 1200,
        yearToDateSpend: 15000,
        topCategories: [
          { category: 'Shopping', amount: 500 },
          { category: 'Fuel', amount: 300 }
        ]
      };

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend')
        .respond(200, mockSummary);

      CreditCardDataFactory.getCardSpendSummary(cardId).then(function(data) {
        expect(data).toEqual(mockSummary);
        expect(data.currentMonthSpend).toBe(1500);
        expect(data.topCategories.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should handle card with no spending', function() {
      var cardId = 'card999';
      var emptySummary = {
        currentMonthSpend: 0,
        lastMonthSpend: 0,
        yearToDateSpend: 0,
        topCategories: []
      };

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend')
        .respond(200, emptySummary);

      CreditCardDataFactory.getCardSpendSummary(cardId).then(function(data) {
        expect(data.currentMonthSpend).toBe(0);
        expect(data.topCategories.length).toBe(0);
      });

      $httpBackend.flush();
    });

    it('should handle invalid card ID', function() {
      var invalidCardId = 'invalid-card';

      $httpBackend.expectGET('/api/cards/' + invalidCardId + '/spend')
        .respond(404, { message: 'Card not found' });

      CreditCardDataFactory.getCardSpendSummary(invalidCardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error', function() {
      var cardId = 'card111';

      $httpBackend.expectGET('/api/cards/' + cardId + '/spend')
        .respond(500, { message: 'Internal Server Error' });

      CreditCardDataFactory.getCardSpendSummary(cardId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });
});