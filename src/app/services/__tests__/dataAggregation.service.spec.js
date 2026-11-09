/*
Test Documentation:
- Test Name: dataAggregationService - getAggregatedData
- Purpose: Validates aggregation of card data with KPI calculations
- Scenario: Tests successful aggregation, error handling, KPI calculation integration
- Expected Result: Returns cards and calculated KPIs
*/
/*
Coverage Report:
- Functions tested: getAggregatedData
- Scenarios covered: successful aggregation, error handling, KPI calculation
- Uncovered scenarios: none
*/

describe('dataAggregationService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var dataAggregationService;
  var cardDataService;
  var kpiCalculationService;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_dataAggregationService_, _cardDataService_, _kpiCalculationService_, _$q_, _$rootScope_) {
    dataAggregationService = _dataAggregationService_;
    cardDataService = _cardDataService_;
    kpiCalculationService = _kpiCalculationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getAggregatedData', function() {
    it('should aggregate cards and KPIs successfully', function() {
      var mockCards = [
        { cardId: '1', creditLimit: 5000, availableCredit: 3000 },
        { cardId: '2', creditLimit: 3000, availableCredit: 2000 }
      ];

      var mockKPIs = {
        totalCreditLimit: 8000,
        totalAvailableCredit: 5000
      };

      spyOn(cardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue(mockKPIs);

      var result;
      dataAggregationService.getAggregatedData().then(function(data) {
        result = data;
      });

      $rootScope.$apply();

      expect(result.cards).toEqual(mockCards);
      expect(result.kpis).toEqual(mockKPIs);
      expect(kpiCalculationService.calculateKPIs).toHaveBeenCalledWith(mockCards);
    });

    it('should handle error from cardDataService', function() {
      spyOn(cardDataService, 'getAllCards').and.returnValue($q.reject('Error'));

      var error;
      dataAggregationService.getAggregatedData().catch(function(err) {
        error = err;
      });

      $rootScope.$apply();

      expect(error).toBe('Error');
    });

    it('should call kpiCalculationService with retrieved cards', function() {
      var mockCards = [{ cardId: '1' }];
      spyOn(cardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn(kpiCalculationService, 'calculateKPIs').and.returnValue({});

      dataAggregationService.getAggregatedData();
      $rootScope.$apply();

      expect(kpiCalculationService.calculateKPIs).toHaveBeenCalledWith(mockCards);
    });
  });
});