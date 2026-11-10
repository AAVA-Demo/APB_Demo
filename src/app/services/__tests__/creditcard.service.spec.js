/*
Test Documentation:
- Test Name: CreditCardService - getAllCards success
- Purpose: Validates successful retrieval of all credit cards
- Scenario: HTTP GET to /api/creditcards returns card array
- Expected Result: Promise resolves with card data array
*/
/*
Test Documentation:
- Test Name: CreditCardService - getAllCards handles error
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET to /api/creditcards returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardById success
- Purpose: Validates retrieval of specific card by ID
- Scenario: HTTP GET to /api/creditcards/:cardId returns card object
- Expected Result: Promise resolves with single card data
*/
/*
Test Documentation:
- Test Name: CreditCardService - getCardById handles not found
- Purpose: Validates error handling when card does not exist
- Scenario: HTTP GET to /api/creditcards/:cardId returns 404
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardById
- Scenarios covered: success responses, HTTP errors, 404 not found, empty data
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var CreditCardService, $httpBackend, $rootScope;
  var API_BASE = '/api/creditcards';

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$rootScope_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    it('should fetch all credit cards successfully', function(done) {
      var mockCards = [
        { cardId: 'card1', cardType: 'Visa', creditLimit: 5000, outstandingAmount: 1000 },
        { cardId: 'card2', cardType: 'MasterCard', creditLimit: 10000, outstandingAmount: 3000 }
      ];

      $httpBackend.expectGET(API_BASE).respond(200, mockCards);

      CreditCardService.getAllCards().then(function(result) {
        expect(result).toEqual(mockCards);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardType).toBe('MasterCard');
        done();
      });

      $httpBackend.flush();
    });

    it('should handle HTTP error when fetching all cards', function(done) {
      $httpBackend.expectGET(API_BASE).respond(500, 'Internal Server Error');

      CreditCardService.getAllCards().catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should return empty array when no cards exist', function(done) {
      $httpBackend.expectGET(API_BASE).respond(200, []);

      CreditCardService.getAllCards().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle unauthorized access', function(done) {
      $httpBackend.expectGET(API_BASE).respond(401, 'Unauthorized');

      CreditCardService.getAllCards().catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });

      $httpBackend.flush();
    });
  });

  describe('getCardById', function() {
    it('should fetch card by ID successfully', function(done) {
      var mockCard = {
        cardId: 'card1',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingAmount: 1000,
        availableCredit: 4000
      };

      $httpBackend.expectGET(API_BASE + '/card1').respond(200, mockCard);

      CreditCardService.getCardById('card1').then(function(result) {
        expect(result).toEqual(mockCard);
        expect(result.cardId).toBe('card1');
        expect(result.availableCredit).toBe(4000);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle 404 when card not found', function(done) {
      $httpBackend.expectGET(API_BASE + '/invalidCard').respond(404, 'Card not found');

      CreditCardService.getCardById('invalidCard').catch(function(error) {
        expect(error.status).toBe(404);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle server error when fetching card by ID', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1').respond(500, 'Internal Server Error');

      CreditCardService.getCardById('card1').catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle network timeout', function(done) {
      $httpBackend.expectGET(API_BASE + '/card1').respond(-1, '');

      CreditCardService.getCardById('card1').catch(function(error) {
        expect(error.status).toBe(-1);
        done();
      });

      $httpBackend.flush();
    });
  });
});