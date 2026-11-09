/*
Test Documentation:
- Test Name: CreditCardAPI Factory - getCreditSummary success
- Purpose: Validates that getCreditSummary successfully retrieves credit summary data
- Scenario: Valid userId provided, API returns success response
- Expected Result: Promise resolves with credit summary data
*/
/*
Test Documentation:
- Test Name: CreditCardAPI Factory - fetchCards success
- Purpose: Validates that fetchCards successfully retrieves all user credit cards
- Scenario: Valid userId provided, API returns array of cards
- Expected Result: Promise resolves with cards array
*/
/*
Test Documentation:
- Test Name: CreditCardAPI Factory - error handling
- Purpose: Validates error handling for both getCreditSummary and fetchCards
- Scenario: API returns error responses
- Expected Result: Promises are rejected and errors are logged
*/
/*
Coverage Report:
- Functions tested: getCreditSummary, fetchCards
- Scenarios covered: success responses, API errors, empty results, invalid userId, error logging
- Uncovered scenarios: card data masking (handled at service layer)
*/

(function() {
  'use strict';

  describe('CreditCardAPI Factory', function() {
    var CreditCardAPI, $httpBackend, $q, API_CONFIG;
    var baseUrl = 'https://api.creditcard.demo';
    var cardsEndpoint = '/api/cards';
    var cardsSummaryEndpoint = '/api/cards/summary';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardAPI_, _$httpBackend_, _$q_, _API_CONFIG_) {
      CreditCardAPI = _CreditCardAPI_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCreditSummary', function() {
      it('should successfully fetch credit summary with valid userId', function() {
        var userId = 'user123';
        var mockResponse = {
          userId: 'user123',
          totalCreditLimit: 50000,
          totalAvailableCredit: 35000,
          totalOutstanding: 15000,
          numberOfCards: 3
        };

        var expectedUrl = baseUrl + cardsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CreditCardAPI.getCreditSummary(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.totalAvailableCredit).toBe(35000);
        expect(result.numberOfCards).toBe(3);
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + cardsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        CreditCardAPI.getCreditSummary(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Credit summary API error:', jasmine.any(Object));
      });

      it('should handle 404 error for invalid userId', function() {
        var userId = 'invalidUser';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + cardsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(404, { message: 'User not found' });

        var error;
        CreditCardAPI.getCreditSummary(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle zero credit limit scenario', function() {
        var userId = 'newUser';
        var mockResponse = {
          userId: 'newUser',
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0,
          numberOfCards: 0
        };

        var expectedUrl = baseUrl + cardsSummaryEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CreditCardAPI.getCreditSummary(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.totalCreditLimit).toBe(0);
        expect(result.numberOfCards).toBe(0);
      });
    });

    describe('fetchCards', function() {
      it('should successfully fetch all cards with valid userId', function() {
        var userId = 'user123';
        var mockResponse = [
          {
            cardId: 'card1',
            cardNumber: '**** **** **** 1234',
            cardType: 'Visa',
            cardHolderName: 'John Doe',
            expiryDate: '12/25',
            creditLimit: 20000,
            availableCredit: 15000,
            outstandingAmount: 5000
          },
          {
            cardId: 'card2',
            cardNumber: '**** **** **** 5678',
            cardType: 'Mastercard',
            cardHolderName: 'John Doe',
            expiryDate: '06/26',
            creditLimit: 30000,
            availableCredit: 20000,
            outstandingAmount: 10000
          }
        ];

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CreditCardAPI.fetchCards(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
        expect(result[0].cardType).toBe('Visa');
        expect(result[1].cardType).toBe('Mastercard');
        expect(result[0].cardNumber).toContain('****');
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        CreditCardAPI.fetchCards(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Fetch cards API error:', jasmine.any(Object));
      });

      it('should return empty array when user has no cards', function() {
        var userId = 'newUser';
        var mockResponse = [];

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CreditCardAPI.fetchCards(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle multiple cards (up to 50 cards)', function() {
        var userId = 'user123';
        var mockResponse = [];
        for (var i = 1; i <= 50; i++) {
          mockResponse.push({
            cardId: 'card' + i,
            cardNumber: '**** **** **** ' + (1000 + i),
            cardType: i % 2 === 0 ? 'Visa' : 'Mastercard',
            creditLimit: 10000 * i,
            availableCredit: 8000 * i,
            outstandingAmount: 2000 * i
          });
        }

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CreditCardAPI.fetchCards(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(50);
        expect(result[0].cardId).toBe('card1');
        expect(result[49].cardId).toBe('card50');
      });

      it('should handle 401 Unauthorized error', function() {
        var userId = 'user123';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(401, { message: 'Unauthorized' });

        var error;
        CreditCardAPI.fetchCards(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network timeout error', function() {
        var userId = 'user123';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + cardsEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        CreditCardAPI.fetchCards(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();