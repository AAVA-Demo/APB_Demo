/*
Test Documentation:
- Test Name: cardTransactionFactory - getCardSpending success
- Purpose: Verify that getCardSpending successfully retrieves card spending data for a given card ID
- Scenario: Valid card ID is provided and API returns spending data
- Expected Result: Promise resolves with spending data from API response
*/
/*
Test Documentation:
- Test Name: cardTransactionFactory - getCardSpending error handling
- Purpose: Verify that getCardSpending handles API errors gracefully
- Scenario: API call fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getCardSpending
- Scenarios covered: successful API call, error handling, correct endpoint construction
- Uncovered scenarios: none
*/

describe('cardTransactionFactory', function() {
  'use strict';

  var cardTransactionFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_cardTransactionFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    cardTransactionFactory = _cardTransactionFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCardSpending', function() {
    it('should successfully retrieve card spending data for valid card ID', function() {
      var cardId = 'card123';
      var mockSpendingData = {
        monthlySpend: 1500.00,
        totalSpend: 15000.00,
        transactions: []
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId + '/spending')
        .respond(200, mockSpendingData);

      var result;
      cardTransactionFactory.getCardSpending(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockSpendingData);
      expect(result.monthlySpend).toBe(1500.00);
      expect(result.totalSpend).toBe(15000.00);
    });

    it('should handle API errors and reject promise', function() {
      var cardId = 'invalidCard';
      var errorResponse = { status: 404, statusText: 'Not Found' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId + '/spending')
        .respond(404, errorResponse);

      var rejected = false;
      cardTransactionFactory.getCardSpending(cardId).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching card spending:', jasmine.any(Object));
    });

    it('should construct correct API endpoint with card ID', function() {
      var cardId = 'card456';
      var mockData = { monthlySpend: 500 };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/card456/spending')
        .respond(200, mockData);

      cardTransactionFactory.getCardSpending(cardId);
      $httpBackend.flush();
    });

    it('should handle empty spending data', function() {
      var cardId = 'card789';
      var emptyData = {};

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/cards/' + cardId + '/spending')
        .respond(200, emptyData);

      var result;
      cardTransactionFactory.getCardSpending(cardId).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(emptyData);
    });
  });
});