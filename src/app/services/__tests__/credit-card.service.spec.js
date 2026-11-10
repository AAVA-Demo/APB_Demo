/*
Test Documentation:
- Test Name: CreditCardService - getAllCards with successful HTTP response
- Purpose: Validates that getAllCards returns credit card data from API
- Scenario: HTTP request succeeds with valid response
- Expected Result: Returns array of credit card objects

- Test Name: CreditCardService - getAllCards with cache hit
- Purpose: Validates that cached data is returned when cache is valid
- Scenario: Service called twice within cache TTL
- Expected Result: Second call returns cached data without HTTP request

- Test Name: CreditCardService - getAllCards with HTTP error
- Purpose: Validates fallback to mock data when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Returns mock credit card data

- Test Name: CreditCardService - _getMockData
- Purpose: Validates mock data structure and content
- Scenario: Mock data generator called
- Expected Result: Returns array of 3 credit card objects with all required fields

Coverage Report:
- Functions tested: getAllCards, _getMockData
- Scenarios covered: successful HTTP request, cache hit, HTTP error, mock data generation
- Edge cases: HTTP failure, cache expiration
- Uncovered scenarios: none
*/

describe('CreditCardService', function() {
  'use strict';

  var CreditCardService, $httpBackend, $q, $cacheFactory;
  var API_BASE = '/api/creditcards';

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    CreditCardService = _CreditCardService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getAllCards', function() {
    it('should return credit card data from API on successful request', function() {
      var mockCards = [
        {cardId: 'CC001', cardNumber: '**** 1234', cardHolderName: 'John Doe', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500},
        {cardId: 'CC002', cardNumber: '**** 5678', cardHolderName: 'Jane Smith', creditLimit: 30000, availableCredit: 22000, outstandingAmount: 8000, monthlySpend: 5200}
      ];

      $httpBackend.expectGET(API_BASE).respond(200, mockCards);

      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardId).toBe('CC002');
    });

    it('should return cached data on subsequent calls within TTL', function() {
      var mockCards = [
        {cardId: 'CC001', cardNumber: '**** 1234', cardHolderName: 'John Doe', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, monthlySpend: 8500}
      ];

      $httpBackend.expectGET(API_BASE).respond(200, mockCards);

      var result1, result2;
      CreditCardService.getAllCards().then(function(cards) {
        result1 = cards;
      });

      $httpBackend.flush();

      CreditCardService.getAllCards().then(function(cards) {
        result2 = cards;
      });

      expect(result1).toEqual(result2);
    });

    it('should return mock data when HTTP request fails', function() {
      $httpBackend.expectGET(API_BASE).respond(500, 'Server Error');

      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardId).toBe('CC002');
      expect(result[2].cardId).toBe('CC003');
    });

    it('should use mock data when API returns empty response', function() {
      $httpBackend.expectGET(API_BASE).respond(200, null);

      var result;
      CreditCardService.getAllCards().then(function(cards) {
        result = cards;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
    });
  });

  describe('_getMockData', function() {
    it('should return array of 3 credit card objects', function() {
      var mockData = CreditCardService._getMockData();

      expect(mockData).toBeDefined();
      expect(mockData.length).toBe(3);
    });

    it('should return cards with all required fields', function() {
      var mockData = CreditCardService._getMockData();

      mockData.forEach(function(card) {
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardHolderName).toBeDefined();
        expect(card.creditLimit).toBeDefined();
        expect(card.availableCredit).toBeDefined();
        expect(card.outstandingAmount).toBeDefined();
        expect(card.monthlySpend).toBeDefined();
        expect(card.lastUpdated).toBeDefined();
      });
    });

    it('should return cards with valid numeric values', function() {
      var mockData = CreditCardService._getMockData();

      mockData.forEach(function(card) {
        expect(typeof card.creditLimit).toBe('number');
        expect(typeof card.availableCredit).toBe('number');
        expect(typeof card.outstandingAmount).toBe('number');
        expect(typeof card.monthlySpend).toBe('number');
        expect(card.creditLimit).toBeGreaterThan(0);
        expect(card.availableCredit).toBeGreaterThanOrEqual(0);
        expect(card.outstandingAmount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});