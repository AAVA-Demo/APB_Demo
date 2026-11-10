/*
Test Documentation:
- Test Name: SpendingAnalysisService - getCardWiseSpending success scenario
- Purpose: Validates that getCardWiseSpending successfully retrieves card spending data from API
- Scenario: HTTP GET request returns successful response with spending data
- Expected Result: Promise resolves with card spending analysis array
*/
/*
Test Documentation:
- Test Name: SpendingAnalysisService - getCardWiseSpending error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Promise rejects with error and logs error to console
*/
/*
Test Documentation:
- Test Name: SpendingAnalysisService - getMockCardWiseSpending success scenario
- Purpose: Validates that getMockCardWiseSpending returns mock spending analysis data
- Scenario: getMockCardWiseSpending is called without parameters
- Expected Result: Promise resolves with array of 5 card spending analysis objects
*/
/*
Coverage Report:
- Functions tested: getCardWiseSpending (success/error), getMockCardWiseSpending
- Scenarios covered: successful API call, failed API call, mock data retrieval, spending metrics validation
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('SpendingAnalysisService', function() {
    var SpendingAnalysisService, $httpBackend, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_SpendingAnalysisService_, _$httpBackend_, _$q_) {
      SpendingAnalysisService = _SpendingAnalysisService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardWiseSpending', function() {
      it('should successfully retrieve card spending data from API', function() {
        var mockSpending = [
          {cardId: 'C001', monthlySpend: 1200, totalSpend: 14400},
          {cardId: 'C002', monthlySpend: 2500, totalSpend: 30000}
        ];

        $httpBackend.expectGET('/api/cards/spending').respond(200, mockSpending);

        var result;
        SpendingAnalysisService.getCardWiseSpending().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockSpending);
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
      });

      it('should handle error when API call fails', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards/spending').respond(500, 'Internal Server Error');

        var errorResult;
        SpendingAnalysisService.getCardWiseSpending().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching card spending:', jasmine.any(Object));
      });

      it('should handle 403 forbidden error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards/spending').respond(403, 'Forbidden');

        var errorResult;
        SpendingAnalysisService.getCardWiseSpending().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getMockCardWiseSpending', function() {
      it('should return array of 5 card spending analysis objects', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(5);
      });

      it('should return spending data with all required properties', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        result.forEach(function(spending) {
          expect(spending).toEqual(jasmine.objectContaining({
            cardId: jasmine.any(String),
            monthlySpend: jasmine.any(Number),
            totalSpend: jasmine.any(Number),
            transactionCount: jasmine.any(Number),
            utilizationPercentage: jasmine.any(Number),
            topCategories: jasmine.any(Array)
          }));
        });
      });

      it('should return spending data with correct cardIds', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        expect(result[0].cardId).toBe('C001');
        expect(result[1].cardId).toBe('C002');
        expect(result[2].cardId).toBe('C003');
        expect(result[3].cardId).toBe('C004');
        expect(result[4].cardId).toBe('C005');
      });

      it('should return spending data with valid financial metrics', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        result.forEach(function(spending) {
          expect(spending.monthlySpend).toBeGreaterThan(0);
          expect(spending.totalSpend).toBeGreaterThan(0);
          expect(spending.transactionCount).toBeGreaterThan(0);
          expect(spending.utilizationPercentage).toBeGreaterThanOrEqual(0);
          expect(spending.utilizationPercentage).toBeLessThanOrEqual(100);
        });
      });

      it('should return spending data with totalSpend as multiple of monthlySpend', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        result.forEach(function(spending) {
          expect(spending.totalSpend).toBe(spending.monthlySpend * 12);
        });
      });

      it('should return spending data with topCategories array', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        result.forEach(function(spending) {
          expect(Array.isArray(spending.topCategories)).toBe(true);
          expect(spending.topCategories.length).toBeGreaterThan(0);
          expect(spending.topCategories.length).toBeLessThanOrEqual(3);
        });
      });

      it('should return spending data with valid category names', function() {
        var result;
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        result.forEach(function(spending) {
          spending.topCategories.forEach(function(category) {
            expect(validCategories).toContain(category);
          });
        });
      });

      it('should return spending data with varying utilization percentages', function() {
        var result;
        SpendingAnalysisService.getMockCardWiseSpending().then(function(data) {
          result = data;
        });

        var utilizations = result.map(function(spending) { return spending.utilizationPercentage; });
        var uniqueUtilizations = utilizations.filter(function(value, index, self) {
          return self.indexOf(value) === index;
        });

        expect(uniqueUtilizations.length).toBeGreaterThan(1);
      });
    });
  });
})();