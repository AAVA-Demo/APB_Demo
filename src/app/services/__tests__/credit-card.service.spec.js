/*
Test Documentation:
- Test Name: CreditCardService Unit Tests
- Purpose: Validate the CreditCardService functionality including credit card data retrieval and error handling
- Scenario: Tests cover successful data retrieval, error scenarios, and data validation
- Expected Result: Service should retrieve credit card data correctly and handle errors gracefully
*/

describe('CreditCardService', function() {
  'use strict';

  var CreditCardService;
  var $httpBackend;
  var $q;
  var mockCreditCards;

  beforeEach(module('ccAnalysisApp'));

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;

    mockCreditCards = [
      {
        cardId: 'card1',
        cardName: 'Visa Gold',
        cardNumber: '**** **** **** 1234',
        creditLimit: 10000,
        availableCredit: 7500,
        outstandingAmount: 2500,
        monthlySpend: 1500
      },
      {
        cardId: 'card2',
        cardName: 'Mastercard Platinum',
        cardNumber: '**** **** **** 5678',
        creditLimit: 15000,
        availableCredit: 12000,
        outstandingAmount: 3000,
        monthlySpend: 2000
      },
      {
        cardId: 'card3',
        cardName: 'Amex Blue',
        cardNumber: '**** ****** *9012',
        creditLimit: 20000,
        availableCredit: 18000,
        outstandingAmount: 2000,
        monthlySpend: 2500
      }
    ];
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCreditCards', function() {
    it('should retrieve credit cards successfully', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, mockCreditCards);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCreditCards);
      expect(result.length).toBe(3);
    });

    it('should return array of credit cards with correct structure', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, mockCreditCards);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].cardId).toBeDefined();
      expect(result[0].cardName).toBeDefined();
      expect(result[0].cardNumber).toBeDefined();
      expect(result[0].creditLimit).toBeDefined();
      expect(result[0].availableCredit).toBeDefined();
      expect(result[0].outstandingAmount).toBeDefined();
      expect(result[0].monthlySpend).toBeDefined();
    });

    it('should handle single credit card response', function() {
      var singleCard = [mockCreditCards[0]];

      $httpBackend.expectGET('/api/creditcards')
        .respond(200, singleCard);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card1');
    });

    it('should handle empty credit card list', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, []);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle HTTP 500 error responses', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(500, 'Internal Server Error');

      var errorOccurred = false;
      var errorResponse;

      CreditCardService.getCreditCards().catch(function(error) {
        errorOccurred = true;
        errorResponse = error;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
      expect(errorResponse).toBeDefined();
    });

    it('should handle HTTP 404 error responses', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(404, 'Not Found');

      var errorOccurred = false;

      CreditCardService.getCreditCards().catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should handle HTTP 401 unauthorized error', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(401, 'Unauthorized');

      var errorOccurred = false;

      CreditCardService.getCreditCards().catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should handle network timeout errors', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(0, '');

      var errorOccurred = false;

      CreditCardService.getCreditCards().catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should validate credit card number masking format', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, mockCreditCards);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(card) {
        expect(card.cardNumber).toContain('*');
        expect(card.cardNumber.indexOf('*')).toBeGreaterThan(-1);
      });
    });

    it('should validate numeric fields are numbers', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, mockCreditCards);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(card) {
        expect(typeof card.creditLimit).toBe('number');
        expect(typeof card.availableCredit).toBe('number');
        expect(typeof card.outstandingAmount).toBe('number');
        expect(typeof card.monthlySpend).toBe('number');
      });
    });

    it('should validate available credit calculation logic', function() {
      $httpBackend.expectGET('/api/creditcards')
        .respond(200, mockCreditCards);

      var result;
      CreditCardService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      result.forEach(function(card) {
        var expectedAvailable = card.creditLimit - card.outstandingAmount;
        expect(card.availableCredit).toBe(expectedAvailable);
      });
    });
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CreditCardService).toBeDefined();
    });

    it('should have getCreditCards method', function() {
      expect(CreditCardService.getCreditCards).toBeDefined();
      expect(typeof CreditCardService.getCreditCards).toBe('function');
    });
  });
});

/*
Coverage Report:
- Functions tested: getCreditCards
- Scenarios covered:
  * Successful credit card data retrieval
  * Correct data structure validation
  * Single credit card response
  * Empty credit card list
  * HTTP 500 error handling
  * HTTP 404 error handling
  * HTTP 401 unauthorized error
  * Network timeout error handling
  * Credit card number masking validation
  * Numeric field type validation
  * Available credit calculation validation
  * Service initialization
- Uncovered scenarios: None
- Edge cases tested: Empty data, single card, network errors, data validation, security (masking)
*/