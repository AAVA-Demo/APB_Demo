/*
Test Documentation:
- Test Name: CardAnalyticsFactory Unit Tests
- Purpose: Validate card analytics calculations including utilization, monthly spend, and utilization classification
- Scenario: Tests cover utilization calculation, monthly spend aggregation, and utilization class determination
- Expected Result: All analytics calculations produce accurate results with proper edge case handling
*/

(function() {
  'use strict';

  describe('CardAnalyticsFactory', function() {
    var CardAnalyticsFactory;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_CardAnalyticsFactory_) {
      CardAnalyticsFactory = _CardAnalyticsFactory_;
    }));

    describe('calculateUtilization', function() {
      it('should calculate utilization percentage correctly', function() {
        var card = {
          creditLimit: 50000,
          currentBalance: 15000
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(30);
      });

      it('should return 0 when card is null', function() {
        var utilization = CardAnalyticsFactory.calculateUtilization(null);
        expect(utilization).toBe(0);
      });

      it('should return 0 when creditLimit is 0', function() {
        var card = {
          creditLimit: 0,
          currentBalance: 15000
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(0);
      });

      it('should return 0 when creditLimit is null', function() {
        var card = {
          creditLimit: null,
          currentBalance: 15000
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(0);
      });

      it('should round utilization to nearest integer', function() {
        var card = {
          creditLimit: 30000,
          currentBalance: 10001
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(33);
      });

      it('should handle 100% utilization', function() {
        var card = {
          creditLimit: 50000,
          currentBalance: 50000
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(100);
      });

      it('should handle very low utilization', function() {
        var card = {
          creditLimit: 100000,
          currentBalance: 100
        };
        
        var utilization = CardAnalyticsFactory.calculateUtilization(card);
        
        expect(utilization).toBe(0);
      });
    });

    describe('calculateMonthlySpend', function() {
      it('should calculate monthly spend from current month transactions', function() {
        var now = new Date();
        var transactions = [
          { amount: 2500, transactionDate: now, transactionType: 'Debit' },
          { amount: 1800, transactionDate: now, transactionType: 'Debit' },
          { amount: 3200, transactionDate: now, transactionType: 'Debit' }
        ];
        
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(transactions);
        
        expect(monthlySpend).toBe(7500);
      });

      it('should return 0 when transactions array is empty', function() {
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend([]);
        expect(monthlySpend).toBe(0);
      });

      it('should return 0 when transactions is null', function() {
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(null);
        expect(monthlySpend).toBe(0);
      });

      it('should only include Debit transactions', function() {
        var now = new Date();
        var transactions = [
          { amount: 2500, transactionDate: now, transactionType: 'Debit' },
          { amount: 1000, transactionDate: now, transactionType: 'Credit' },
          { amount: 1800, transactionDate: now, transactionType: 'Debit' }
        ];
        
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(transactions);
        
        expect(monthlySpend).toBe(4300);
      });

      it('should only include current month transactions', function() {
        var now = new Date();
        var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
        var transactions = [
          { amount: 2500, transactionDate: now, transactionType: 'Debit' },
          { amount: 1000, transactionDate: lastMonth, transactionType: 'Debit' },
          { amount: 1800, transactionDate: now, transactionType: 'Debit' }
        ];
        
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(transactions);
        
        expect(monthlySpend).toBe(4300);
      });

      it('should handle null amounts gracefully', function() {
        var now = new Date();
        var transactions = [
          { amount: 2500, transactionDate: now, transactionType: 'Debit' },
          { amount: null, transactionDate: now, transactionType: 'Debit' },
          { amount: 1800, transactionDate: now, transactionType: 'Debit' }
        ];
        
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(transactions);
        
        expect(monthlySpend).toBe(4300);
      });

      it('should only include current year transactions', function() {
        var now = new Date();
        var lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 15);
        var transactions = [
          { amount: 2500, transactionDate: now, transactionType: 'Debit' },
          { amount: 1000, transactionDate: lastYear, transactionType: 'Debit' }
        ];
        
        var monthlySpend = CardAnalyticsFactory.calculateMonthlySpend(transactions);
        
        expect(monthlySpend).toBe(2500);
      });
    });

    describe('getUtilizationClass', function() {
      it('should return critical for utilization >= 80%', function() {
        expect(CardAnalyticsFactory.getUtilizationClass(80)).toBe('critical');
        expect(CardAnalyticsFactory.getUtilizationClass(90)).toBe('critical');
        expect(CardAnalyticsFactory.getUtilizationClass(100)).toBe('critical');
      });

      it('should return high for utilization >= 60% and < 80%', function() {
        expect(CardAnalyticsFactory.getUtilizationClass(60)).toBe('high');
        expect(CardAnalyticsFactory.getUtilizationClass(70)).toBe('high');
        expect(CardAnalyticsFactory.getUtilizationClass(79)).toBe('high');
      });

      it('should return normal for utilization < 60%', function() {
        expect(CardAnalyticsFactory.getUtilizationClass(0)).toBe('normal');
        expect(CardAnalyticsFactory.getUtilizationClass(30)).toBe('normal');
        expect(CardAnalyticsFactory.getUtilizationClass(59)).toBe('normal');
      });

      it('should handle boundary values correctly', function() {
        expect(CardAnalyticsFactory.getUtilizationClass(59.9)).toBe('normal');
        expect(CardAnalyticsFactory.getUtilizationClass(60)).toBe('high');
        expect(CardAnalyticsFactory.getUtilizationClass(79.9)).toBe('high');
        expect(CardAnalyticsFactory.getUtilizationClass(80)).toBe('critical');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: calculateUtilization, calculateMonthlySpend, getUtilizationClass
- Scenarios covered:
  * Utilization percentage calculation
  * Null card handling
  * Zero credit limit handling
  * Null credit limit handling
  * Rounding to nearest integer
  * 100% utilization
  * Very low utilization
  * Monthly spend calculation
  * Empty transactions array
  * Null transactions
  * Debit vs Credit filtering
  * Current month filtering
  * Null amount handling
  * Current year filtering
  * Utilization classification (critical/high/normal)
  * Boundary value testing
- Uncovered scenarios: None - all analytics calculations tested
- Edge cases: Null values, zero values, boundary conditions, date filtering, transaction type filtering
*/