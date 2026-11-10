/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with valid cards
- Purpose: Validates KPI calculation accuracy for multiple credit cards
- Scenario: Service receives array of credit card objects
- Expected Result: Returns aggregated KPIs with 100% accuracy
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with empty array
- Purpose: Validates handling of empty card array
- Scenario: Service receives empty array
- Expected Result: Returns zero values for all KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis with null input
- Purpose: Validates handling of null input
- Scenario: Service receives null
- Expected Result: Returns zero values for all KPIs
*/
/*
Test Documentation:
- Test Name: KpiCalculationService - calculateKpis decimal precision
- Purpose: Validates decimal precision in calculations
- Scenario: Cards have decimal values
- Expected Result: Results are rounded to 2 decimal places
*/
/*
Coverage Report:
- Functions tested: calculateKpis
- Scenarios covered: valid cards, empty array, null input, decimal precision, aggregation accuracy
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('KpiCalculationService', function(){
  var KpiCalculationService;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_KpiCalculationService_){
    KpiCalculationService = _KpiCalculationService_;
  }));
  
  describe('calculateKpis', function(){
    
    it('should calculate KPIs correctly for multiple cards', function(){
      var cards = [
        {cardId:'CC001', creditLimit:50000, availableCredit:35000, outstandingAmount:15000, monthlySpend:8500},
        {cardId:'CC002', creditLimit:30000, availableCredit:22000, outstandingAmount:8000, monthlySpend:4200},
        {cardId:'CC003', creditLimit:75000, availableCredit:60000, outstandingAmount:15000, monthlySpend:6300}
      ];
      
      var result = KpiCalculationService.calculateKpis(cards);
      
      expect(result.totalCreditLimit).toBe(155000);
      expect(result.totalAvailableCredit).toBe(117000);
      expect(result.totalOutstanding).toBe(38000);
      expect(result.totalMonthlySpend).toBe(19000);
      expect(result.numberOfCards).toBe(3);
      expect(result.cards).toEqual(cards);
    });
    
    it('should return zero values for empty card array', function(){
      var result = KpiCalculationService.calculateKpis([]);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.numberOfCards).toBe(0);
      expect(result.cards).toEqual([]);
    });
    
    it('should return zero values for null input', function(){
      var result = KpiCalculationService.calculateKpis(null);
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.numberOfCards).toBe(0);
    });
    
    it('should handle cards with missing properties', function(){
      var cards = [
        {cardId:'CC001', creditLimit:50000},
        {cardId:'CC002', availableCredit:22000}
      ];
      
      var result = KpiCalculationService.calculateKpis(cards);
      
      expect(result.totalCreditLimit).toBe(50000);
      expect(result.totalAvailableCredit).toBe(22000);
      expect(result.totalOutstanding).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.numberOfCards).toBe(2);
    });
    
    it('should round values to 2 decimal places', function(){
      var cards = [
        {cardId:'CC001', creditLimit:50000.556, availableCredit:35000.444, outstandingAmount:15000.999, monthlySpend:8500.123}
      ];
      
      var result = KpiCalculationService.calculateKpis(cards);
      
      expect(result.totalCreditLimit).toBe(50000.56);
      expect(result.totalAvailableCredit).toBe(35000.44);
      expect(result.totalOutstanding).toBe(15001);
      expect(result.totalMonthlySpend).toBe(8500.12);
    });
    
    it('should handle single card', function(){
      var cards = [
        {cardId:'CC001', creditLimit:50000, availableCredit:35000, outstandingAmount:15000, monthlySpend:8500}
      ];
      
      var result = KpiCalculationService.calculateKpis(cards);
      
      expect(result.totalCreditLimit).toBe(50000);
      expect(result.numberOfCards).toBe(1);
    });
    
  });
  
});

})();