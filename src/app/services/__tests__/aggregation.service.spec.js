/*
Test Documentation:
- Test Name: AggregationService Unit Tests
- Purpose: Validate consolidated metrics calculation, caching behavior, and error handling
- Scenario: Tests getConsolidatedMetrics with various card data, cache expiration, HTTP success/failure
- Expected Result: Correct KPI calculations, proper cache management, graceful error fallback
*/

(function() {
  'use strict';

  describe('AggregationService', function() {
    var AggregationService, $httpBackend, $q, API_ENDPOINTS;
    var mockCardsData, expectedKPIs;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AggregationService_, _$httpBackend_, _$q_, _API_ENDPOINTS_) {
      AggregationService = _AggregationService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_ENDPOINTS = _API_ENDPOINTS_;

      mockCardsData = [
        { cardId: 'card1', creditLimit: 50000, currentBalance: 12500, monthlySpend: 8500 },
        { cardId: 'card2', creditLimit: 100000, currentBalance: 45000, monthlySpend: 15000 }
      ];

      expectedKPIs = {
        monthlySpend: 23500,
        totalCreditLimit: 150000,
        availableCredit: 92500,
        outstandingAmount: 57500
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getConsolidatedMetrics', function() {
      it('should fetch and calculate KPIs from API successfully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardsAggregated).respond(200, mockCardsData);

        var result;
        AggregationService.getConsolidatedMetrics('test-token').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(expectedKPIs.monthlySpend);
        expect(result.totalCreditLimit).toBe(expectedKPIs.totalCreditLimit);
        expect(result.availableCredit).toBe(expectedKPIs.availableCredit);
        expect(result.outstandingAmount).toBe(expectedKPIs.outstandingAmount);
        expect(result.lastUpdated).toEqual(jasmine.any(Date));
      });

      it('should return cached data when cache is valid', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardsAggregated).respond(200, mockCardsData);

        var firstResult, secondResult;
        AggregationService.getConsolidatedMetrics('test-token').then(function(data) {
          firstResult = data;
        });

        $httpBackend.flush();

        // Second call should use cache, no HTTP request
        AggregationService.getConsolidatedMetrics('test-token').then(function(data) {
          secondResult = data;
        });

        expect(firstResult).toBe(secondResult);
      });

      it('should use mock data when API call fails', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardsAggregated).respond(500, 'Server Error');

        var result;
        AggregationService.getConsolidatedMetrics('test-token').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.monthlySpend).toBe(33000);
        expect(result.totalCreditLimit).toBe(225000);
        expect(result.availableCredit).toBe(145500);
        expect(result.outstandingAmount).toBe(79500);
      });

      it('should handle empty card data gracefully', function() {
        $httpBackend.expectGET(API_ENDPOINTS.cardsAggregated).respond(200, []);

        var result;
        AggregationService.getConsolidatedMetrics('test-token').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });
    });

    describe('_calculateKPIs', function() {
      it('should calculate KPIs correctly with valid card data', function() {
        var result = AggregationService._calculateKPIs(mockCardsData);

        expect(result.monthlySpend).toBe(23500);
        expect(result.totalCreditLimit).toBe(150000);
        expect(result.availableCredit).toBe(92500);
        expect(result.outstandingAmount).toBe(57500);
        expect(result.lastUpdated).toEqual(jasmine.any(Date));
      });

      it('should handle cards with missing fields', function() {
        var cardsWithMissingFields = [
          { cardId: 'card1', creditLimit: 50000 },
          { cardId: 'card2', currentBalance: 10000 }
        ];

        var result = AggregationService._calculateKPIs(cardsWithMissingFields);

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.availableCredit).toBe(40000);
        expect(result.outstandingAmount).toBe(10000);
      });

      it('should return zero values for empty array', function() {
        var result = AggregationService._calculateKPIs([]);

        expect(result.monthlySpend).toBe(0);
        expect(result.totalCreditLimit).toBe(0);
        expect(result.availableCredit).toBe(0);
        expect(result.outstandingAmount).toBe(0);
      });
    });

    describe('_getMockCardData', function() {
      it('should return valid mock card data', function() {
        var mockData = AggregationService._getMockCardData();

        expect(mockData).toEqual(jasmine.any(Array));
        expect(mockData.length).toBe(3);
        expect(mockData[0].cardId).toBe('card1');
        expect(mockData[0].creditLimit).toBe(50000);
        expect(mockData[0].currentBalance).toBe(12500);
        expect(mockData[0].monthlySpend).toBe(8500);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getConsolidatedMetrics, _calculateKPIs, _getMockCardData
  - Scenarios covered:
    * Successful API fetch and KPI calculation
    * Cache hit scenario (no duplicate HTTP calls)
    * API failure with mock data fallback
    * Empty card data handling
    * Missing card field handling
    * Mock data generation
  - Edge cases: Empty arrays, missing fields, API errors
  - Uncovered scenarios: Cache expiration after 30 seconds (time-dependent test)
  */
})();