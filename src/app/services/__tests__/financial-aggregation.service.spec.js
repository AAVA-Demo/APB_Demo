/*
Test Documentation:
- Test Name: FinancialAggregationService - aggregateKPIs calculates totals correctly
- Purpose: Validates KPI aggregation across multiple credit cards
- Scenario: Given array of credit cards with financial data
- Expected Result: Returns aggregated KPIs including total spend, credit limit, available credit, and outstanding amount
*/
/*
Test Documentation:
- Test Name: FinancialAggregationService - aggregateKPIs handles empty cards array
- Purpose: Validates error handling for edge case
- Scenario: Given empty array or null
- Expected Result: Returns zero values for all KPIs
*/
/*
Coverage Report:
- Functions tested: aggregateKPIs
- Scenarios covered: valid cards, empty array, null input, credit utilization calculation
- Uncovered scenarios: none
*/

describe('FinancialAggregationService', function() {
  'use strict';

  beforeEach(module('creditCardApp.dashboard'));

  var FinancialAggregationService;

  beforeEach(inject(function(_FinancialAggregationService_) {
    FinancialAggregationService = _FinancialAggregationService_;
  }));

  describe('aggregateKPIs', function() {
    it('should aggregate KPIs from multiple cards correctly', function() {
      var cards = [
        {
          creditLimit: 10000,
          outstandingAmount: 2500,
          availableCredit: 7500,
          monthlySpend: 1200
        },
        {
          creditLimit: 15000,
          outstandingAmount: 4000,
          availableCredit: 11000,
          monthlySpend: 1800
        },
        {
          creditLimit: 20000,
          outstandingAmount: 5500,
          availableCredit: 14500,
          monthlySpend: 2300
        }
      ];

      var result = FinancialAggregationService.aggregateKPIs(cards);

      expect(result.totalMonthlySpend).toBe(5300);
      expect(result.totalCreditLimit).toBe(45000);
      expect(result.totalAvailableCredit).toBe(33000);
      expect(result.totalOutstanding).toBe(12000);
    });

    it('should calculate credit utilization percentage', function() {
      var cards = [
        {
          creditLimit: 10000,
          outstandingAmount: 3000,
          availableCredit: 7000,
          monthlySpend: 1000
        }
      ];

      var result = FinancialAggregationService.aggregateKPIs(cards);

      expect(result.creditUtilization).toBe(30);
    });

    it('should handle empty cards array', function() {
      var result = FinancialAggregationService.aggregateKPIs([]);

      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.creditUtilization).toBe(0);
    });

    it('should handle null cards input', function() {
      var result = FinancialAggregationService.aggregateKPIs(null);

      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
      expect(result.creditUtilization).toBe(0);
    });

    it('should handle cards with missing or undefined values', function() {
      var cards = [
        {
          creditLimit: 10000,
          outstandingAmount: 2500
        },
        {
          creditLimit: 15000,
          availableCredit: 11000
        }
      ];

      var result = FinancialAggregationService.aggregateKPIs(cards);

      expect(result.totalMonthlySpend).toBe(0);
      expect(result.totalCreditLimit).toBe(25000);
      expect(result.totalAvailableCredit).toBe(11000);
      expect(result.totalOutstanding).toBe(2500);
    });

    it('should return zero credit utilization when total credit limit is zero', function() {
      var cards = [
        {
          creditLimit: 0,
          outstandingAmount: 0,
          availableCredit: 0,
          monthlySpend: 0
        }
      ];

      var result = FinancialAggregationService.aggregateKPIs(cards);

      expect(result.creditUtilization).toBe(0);
    });
  });
});