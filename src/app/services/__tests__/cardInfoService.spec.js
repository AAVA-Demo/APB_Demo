/*
Test Documentation:
- Test Name: cardInfoService - getCards with authentication
- Purpose: Validates retrieval of card information with proper authentication and masking
- Scenario: Given valid authentication token, when getCards is called, then card data should be returned with masked card numbers
- Expected Result: Returns card data with masked card numbers (last 4 digits visible)
*/
/*
Test Documentation:
- Test Name: cardInfoService - maskCardNumber
- Purpose: Validates card number masking functionality
- Scenario: Given full card number, when maskCardNumber is called, then only last 4 digits should be visible
- Expected Result: Returns masked card number in format ****-****-****-XXXX
*/
/*
Test Documentation:
- Test Name: cardInfoService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when getCards is called, then error should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getCards, maskCardNumber
- Scenarios covered: authenticated retrieval, card masking, edge cases (short card numbers), error handling
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('cardInfoService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var cardInfoService;
  var authService;
  var $httpBackend;

  beforeEach(inject(function(_cardInfoService_, _authService_, _$httpBackend_) {
    cardInfoService = _cardInfoService_;
    authService = _authService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCards', function() {
    it('should retrieve cards with masked card numbers', function() {
      spyOn(authService, 'getToken').and.returnValue('mock-token');

      var mockCards = [
        { cardId: 'card1', cardNumber: '1234567890123456', cardHolderName: 'John Doe' },
        { cardId: 'card2', cardNumber: '9876543210987654', cardHolderName: 'Jane Smith' }
      ];

      $httpBackend.expectGET('/api/cards', function(headers) {
        return headers.Authorization === 'Bearer mock-token';
      }).respond(200, mockCards);

      cardInfoService.getCards().then(function(response) {
        expect(response.length).toBe(2);
        expect(response[0].cardNumber).toBe('****-****-****-3456');
        expect(response[1].cardNumber).toBe('****-****-****-7654');
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving cards', function() {
      spyOn(authService, 'getToken').and.returnValue('invalid-token');

      $httpBackend.expectGET('/api/cards').respond(401, { error: 'Unauthorized' });

      cardInfoService.getCards().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });
  });

  describe('maskCardNumber', function() {
    it('should mask card number showing only last 4 digits', function() {
      var cardNumber = '1234567890123456';

      var masked = cardInfoService.maskCardNumber(cardNumber);

      expect(masked).toBe('****-****-****-3456');
    });

    it('should handle short card numbers', function() {
      var shortCard = '123';

      var masked = cardInfoService.maskCardNumber(shortCard);

      expect(masked).toBe('****-****-****-****');
    });

    it('should handle null or undefined card numbers', function() {
      var masked1 = cardInfoService.maskCardNumber(null);
      var masked2 = cardInfoService.maskCardNumber(undefined);

      expect(masked1).toBe('****-****-****-****');
      expect(masked2).toBe('****-****-****-****');
    });

    it('should handle empty string card number', function() {
      var masked = cardInfoService.maskCardNumber('');

      expect(masked).toBe('****-****-****-****');
    });
  });
});