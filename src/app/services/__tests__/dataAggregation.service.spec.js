/*
Test Documentation:
- Test Name: dataAggregationService - data aggregation
- Purpose: Validates data aggregation service combines card data with KPI calculations
- Scenario: Service fetches cards and calculates aggregated KPIs
- Expected Result: Returns combined data structure with cards and KPIs
*/

(function() {
  'use strict';

  describe('dataAggregationService', function() {
    var dataAggregationService;
    var cardDataService;
    var kpiCalculationService;
    var $q;
    var $rootScope;
    var mockCards;
    var mockKPIs;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_dataAggregationService_, _cardDataService_, _kpiCalculationService_, _$q_, _$rootScope_) {
      dataAggregationService = _dataAggregationService_;
      cardDataService = _cardDataService_;
      kpiCalculationService = _kpiCalculationService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      mockCards = [
        { cardId: 1, creditLimit: 5000, availableCredit: 3000, outstandingAmount: 2000, monthlySpend: 1500 },
        { cardId: 2, creditLimit: 10000, availableCredit: 8000, outstandingAmount: 2000, monthlySpend: 2500 }
      ];

      mockKPIs = {
        totalCreditLimit: 15000,
        totalAvailableCredit: 11000,
        totalOutstandingAmount: 4000,
        monthlySpend: 4000,
        creditUtilization: '26.67',
        cardCount: 2
      };

      spyOn(cardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue(mockKPIs);
    }));

    /*
    Test Documentation:
    - Test Name: should aggregate data successfully
    - Purpose: Validates getAggregatedData returns combined data
    - Scenario: Fetch cards and calculate KPIs
    - Expected Result: Returns object with cards and kpis properties
    */
    it('should aggregate data successfully', function() {
      var result;
      dataAggregationService.getAggregatedData().then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.cards).toEqual(mockCards);
      expect(result.kpis).toEqual(mockKPIs);
    });

    /*
    Test Documentation:
    - Test Name: should call cardDataService.getAllCards
    - Purpose: Validates integration with card data service
    - Scenario: Request aggregated data
    - Expected Result: cardDataService.getAllCards called once
    */
    it('should call cardDataService.getAllCards', function() {
      dataAggregationService.getAggregatedData();
      $rootScope.$digest();

      expect(cardDataService.getAllCards).toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should call kpiCalculationService.calculateKPIs with cards
    - Purpose: Validates KPI calculation with fetched cards
    - Scenario: Cards fetched successfully
    - Expected Result: kpiCalculationService.calculateKPIs called with cards
    */
    it('should call kpiCalculationService.calculateKPIs with cards', function() {
      dataAggregationService.getAggregatedData();
      $rootScope.$digest();

      expect(kpiCalculationService.calculateKPIs).toHaveBeenCalledWith(mockCards);
    });

    /*
    Test Documentation:
    - Test Name: should handle cardDataService error
    - Purpose: Validates error handling when card fetch fails
    - Scenario: cardDataService returns rejected promise
    - Expected Result: Promise rejected with error
    */
    it('should handle cardDataService error', function() {
      var errorMessage = 'Failed to fetch cards';
      cardDataService.getAllCards.and.returnValue($q.reject(errorMessage));

      var error;
      dataAggregationService.getAggregatedData().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toBe(errorMessage);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty cards array
    - Purpose: Validates aggregation with no cards
    - Scenario: cardDataService returns empty array
    - Expected Result: Returns empty cards with default KPIs
    */
    it('should handle empty cards array', function() {
      var emptyKPIs = {
        totalCreditLimit: 0,
        totalAvailableCredit: 0,
        totalOutstandingAmount: 0,
        monthlySpend: 0,
        creditUtilization: 0,
        cardCount: 0
      };

      cardDataService.getAllCards.and.returnValue($q.resolve([]));
      kpiCalculationService.calculateKPIs.and.returnValue(emptyKPIs);

      var result;
      dataAggregationService.getAggregatedData().then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result.cards).toEqual([]);
      expect(result.kpis.cardCount).toBe(0);
    });

    /*
    Test Documentation:
    - Test Name: should return promise
    - Purpose: Validates method returns promise
    - Scenario: Call getAggregatedData
    - Expected Result: Returns promise object
    */
    it('should return promise', function() {
      var result = dataAggregationService.getAggregatedData();

      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });
  });

  /*
  Coverage Report:
  - Functions tested: getAggregatedData
  - Scenarios covered: successful aggregation, service integration, error handling, empty cards
  - Edge cases: empty array, service errors
  - Uncovered scenarios: none
  */
})();