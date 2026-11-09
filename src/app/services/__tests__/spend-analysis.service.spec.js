/*
Test Documentation:
- Test Name: SpendAnalysisService Unit Tests
- Purpose: Validate SpendAnalysisService functionality including card spend retrieval, error handling, and batch processing
- Scenario: Tests cover normal operation, error scenarios, empty data handling, and multiple card processing
- Expected Result: Service returns correct spend data for individual and multiple cards with proper error handling
*/

(function() {
  'use strict';

  describe('SpendAnalysisService', function() {
    var SpendAnalysisService, $httpBackend, $rootScope, $q;
    var API_BASE = '/api';
    var mockCardId = 'card001';
    var mockSpendData = {
      monthlySpend: 1200.50,
      yearlySpend: 14500.75,
      lastTransactionDate: '2023-11-15T10:30:00Z',
      transactionCount: 45
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_SpendAnalysisService_, _$httpBackend_, _$rootScope_, _$q_) {
      SpendAnalysisService = _SpendAnalysisService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify SpendAnalysisService is properly instantiated
    - Scenario: Service is injected
    - Expected Result: Service object and methods exist
    */
    it('should be defined', function() {
      expect(SpendAnalysisService).toBeDefined();
      expect(SpendAnalysisService.getCardSpend).toBeDefined();
      expect(SpendAnalysisService.getAllCardsSpend).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should fetch card spend data successfully
    - Purpose: Validate successful retrieval of spend data for a card
    - Scenario: User requests spend analysis for specific card
    - Expected Result: Returns spend object with all required fields
    */
    it('getCardSpend - should fetch card spend data successfully', function() {
      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, mockSpendData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.cardId).toBe(mockCardId);
      expect(result.monthlySpend).toBe(1200.50);
      expect(result.yearlySpend).toBe(14500.75);
      expect(result.lastTransactionDate instanceof Date).toBe(true);
      expect(result.transactionCount).toBe(45);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should include cardId in response
    - Purpose: Validate cardId is included in returned spend object
    - Scenario: getCardSpend is called with cardId
    - Expected Result: Response includes the requested cardId
    */
    it('getCardSpend - should include cardId in response', function() {
      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, mockSpendData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.cardId).toBe(mockCardId);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should convert lastTransactionDate to Date object
    - Purpose: Validate date string conversion to Date object
    - Scenario: API returns lastTransactionDate as ISO string
    - Expected Result: lastTransactionDate is converted to Date instance
    */
    it('getCardSpend - should convert lastTransactionDate to Date object', function() {
      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, mockSpendData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.lastTransactionDate).toBeDefined();
      expect(result.lastTransactionDate instanceof Date).toBe(true);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle missing optional fields
    - Purpose: Validate handling of incomplete spend data
    - Scenario: API returns spend data with missing fields
    - Expected Result: Missing fields default to 0 or null
    */
    it('getCardSpend - should handle missing optional fields', function() {
      var incompleteData = {
        monthlySpend: 500
      };

      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, incompleteData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(500);
      expect(result.yearlySpend).toBe(0);
      expect(result.lastTransactionDate).toBeNull();
      expect(result.transactionCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle HTTP errors gracefully
    - Purpose: Validate error handling for failed API requests
    - Scenario: API returns 500 error
    - Expected Result: Returns default spend object with zero values
    */
    it('getCardSpend - should handle HTTP errors gracefully', function() {
      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(500, 'Internal Server Error');

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.cardId).toBe(mockCardId);
      expect(result.monthlySpend).toBe(0);
      expect(result.yearlySpend).toBe(0);
      expect(result.lastTransactionDate).toBeNull();
      expect(result.transactionCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle 404 not found error
    - Purpose: Validate handling of non-existent card
    - Scenario: API returns 404 for invalid cardId
    - Expected Result: Returns default spend object with zero values
    */
    it('getCardSpend - should handle 404 not found error', function() {
      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(404, 'Not Found');

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.cardId).toBe(mockCardId);
      expect(result.monthlySpend).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle null lastTransactionDate
    - Purpose: Validate handling of cards with no transactions
    - Scenario: API returns null for lastTransactionDate
    - Expected Result: lastTransactionDate remains null
    */
    it('getCardSpend - should handle null lastTransactionDate', function() {
      var noTransactionData = {
        monthlySpend: 0,
        yearlySpend: 0,
        lastTransactionDate: null,
        transactionCount: 0
      };

      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, noTransactionData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.lastTransactionDate).toBeNull();
    });

    /*
    Test Documentation:
    - Test Name: getAllCardsSpend - should fetch spend for multiple cards
    - Purpose: Validate batch processing of multiple card spend requests
    - Scenario: User requests spend data for multiple cards
    - Expected Result: Returns array of spend objects for all cards
    */
    it('getAllCardsSpend - should fetch spend for multiple cards', function() {
      var cardIds = ['card001', 'card002', 'card003'];
      
      $httpBackend.expectGET(API_BASE + '/cards/card001/spend')
        .respond(200, { monthlySpend: 1000, yearlySpend: 12000, transactionCount: 30 });
      $httpBackend.expectGET(API_BASE + '/cards/card002/spend')
        .respond(200, { monthlySpend: 1500, yearlySpend: 18000, transactionCount: 45 });
      $httpBackend.expectGET(API_BASE + '/cards/card003/spend')
        .respond(200, { monthlySpend: 800, yearlySpend: 9600, transactionCount: 20 });

      var result;
      SpendAnalysisService.getAllCardsSpend(cardIds).then(function(spendArray) {
        result = spendArray;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('card001');
      expect(result[0].monthlySpend).toBe(1000);
      expect(result[1].cardId).toBe('card002');
      expect(result[1].monthlySpend).toBe(1500);
      expect(result[2].cardId).toBe('card003');
      expect(result[2].monthlySpend).toBe(800);
    });

    /*
    Test Documentation:
    - Test Name: getAllCardsSpend - should handle empty cardIds array
    - Purpose: Validate handling of empty input
    - Scenario: getAllCardsSpend called with empty array
    - Expected Result: Returns empty array
    */
    it('getAllCardsSpend - should handle empty cardIds array', function() {
      var result;
      SpendAnalysisService.getAllCardsSpend([]).then(function(spendArray) {
        result = spendArray;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getAllCardsSpend - should handle single card
    - Purpose: Validate batch processing with single card
    - Scenario: getAllCardsSpend called with one cardId
    - Expected Result: Returns array with single spend object
    */
    it('getAllCardsSpend - should handle single card', function() {
      var cardIds = ['card001'];
      
      $httpBackend.expectGET(API_BASE + '/cards/card001/spend')
        .respond(200, mockSpendData);

      var result;
      SpendAnalysisService.getAllCardsSpend(cardIds).then(function(spendArray) {
        result = spendArray;
      });

      $httpBackend.flush();

      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card001');
    });

    /*
    Test Documentation:
    - Test Name: getAllCardsSpend - should handle partial failures
    - Purpose: Validate resilience when some card requests fail
    - Scenario: Some cards return errors while others succeed
    - Expected Result: Failed cards return default spend objects
    */
    it('getAllCardsSpend - should handle partial failures', function() {
      var cardIds = ['card001', 'card002'];
      
      $httpBackend.expectGET(API_BASE + '/cards/card001/spend')
        .respond(200, { monthlySpend: 1000, yearlySpend: 12000, transactionCount: 30 });
      $httpBackend.expectGET(API_BASE + '/cards/card002/spend')
        .respond(500, 'Internal Server Error');

      var result;
      SpendAnalysisService.getAllCardsSpend(cardIds).then(function(spendArray) {
        result = spendArray;
      });

      $httpBackend.flush();

      expect(result.length).toBe(2);
      expect(result[0].monthlySpend).toBe(1000);
      expect(result[1].monthlySpend).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle zero spend values
    - Purpose: Validate handling of cards with no spending
    - Scenario: Card has zero monthly and yearly spend
    - Expected Result: Returns spend object with zero values
    */
    it('getCardSpend - should handle zero spend values', function() {
      var zeroSpendData = {
        monthlySpend: 0,
        yearlySpend: 0,
        lastTransactionDate: null,
        transactionCount: 0
      };

      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, zeroSpendData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(0);
      expect(result.yearlySpend).toBe(0);
      expect(result.transactionCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: getCardSpend - should handle large spend values
    - Purpose: Validate handling of high spending amounts
    - Scenario: Card has very high monthly and yearly spend
    - Expected Result: Returns accurate large numeric values
    */
    it('getCardSpend - should handle large spend values', function() {
      var largeSpendData = {
        monthlySpend: 50000.99,
        yearlySpend: 600000.50,
        lastTransactionDate: '2023-11-15T10:30:00Z',
        transactionCount: 500
      };

      $httpBackend.expectGET(API_BASE + '/cards/' + mockCardId + '/spend')
        .respond(200, largeSpendData);

      var result;
      SpendAnalysisService.getCardSpend(mockCardId).then(function(spend) {
        result = spend;
      });

      $httpBackend.flush();

      expect(result.monthlySpend).toBe(50000.99);
      expect(result.yearlySpend).toBe(600000.50);
      expect(result.transactionCount).toBe(500);
    });
  });

  /*
  Coverage Report:
  - Functions tested: getCardSpend, getAllCardsSpend
  - Scenarios covered:
    * Successful spend data retrieval
    * CardId inclusion in response
    * Date string to Date object conversion
    * Missing optional fields handling
    * HTTP error handling (500, 404)
    * Null lastTransactionDate handling
    * Multiple cards batch processing
    * Empty cardIds array
    * Single card in batch
    * Partial failures in batch processing
    * Zero spend values
    * Large spend values
  - Uncovered scenarios:
    * Network timeout scenarios
    * Concurrent request handling
    * Invalid date format handling
    * Negative spend values (if applicable)
  */
})();