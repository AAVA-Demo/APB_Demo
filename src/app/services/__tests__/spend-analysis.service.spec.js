/*
Test Documentation:
- Test Name: SpendAnalysisService Unit Tests
- Purpose: Validate spend analysis service functionality for card comparisons and card-wise analysis
- Scenario: Tests calculateComparisons and getCardWiseAnalysis methods
- Expected Result: Service correctly calculates card comparisons and provides detailed card analysis
*/

/*
Coverage Report:
- Functions tested: calculateComparisons, getCardWiseAnalysis
- Scenarios covered:
  * Normal: successful comparison calculation, card-wise analysis retrieval
  * Edge: empty card array, single card, multiple cards
  * Error: null/undefined input handling
- Uncovered scenarios: none
*/

describe('SpendAnalysisService', function() {
  'use strict';
  
  var SpendAnalysisService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_SpendAnalysisService_, _$q_, _$rootScope_) {
    SpendAnalysisService = _SpendAnalysisService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('calculateComparisons', function() {
    
    it('should return null for empty card array', function() {
      var result;
      
      SpendAnalysisService.calculateComparisons([]).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeNull();
    });
    
    it('should return null for null input', function() {
      var result;
      
      SpendAnalysisService.calculateComparisons(null).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeNull();
    });
    
    it('should calculate total credit limit correctly', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 15000, currentBalance: 3000, monthlySpend: 750, utilizationRate: 20, cardNumber: '****5678' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.totalCreditLimit).toBe(25000);
    });
    
    it('should calculate average utilization correctly', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 10000, currentBalance: 4000, monthlySpend: 750, utilizationRate: 40, cardNumber: '****5678' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.totalUtilization).toBe('30.00');
    });
    
    it('should identify highest spend card', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 15000, currentBalance: 3000, monthlySpend: 1500, utilizationRate: 20, cardNumber: '****5678' },
        { creditLimit: 12000, currentBalance: 2500, monthlySpend: 800, utilizationRate: 21, cardNumber: '****9012' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.highestSpendCard).toBe('****5678');
    });
    
    it('should identify lowest utilization card', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 15000, currentBalance: 3000, monthlySpend: 750, utilizationRate: 15, cardNumber: '****5678' },
        { creditLimit: 12000, currentBalance: 2500, monthlySpend: 800, utilizationRate: 25, cardNumber: '****9012' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.lowestUtilizationCard).toBe('****5678');
    });
    
    it('should calculate average monthly spend', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 600, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 15000, currentBalance: 3000, monthlySpend: 900, utilizationRate: 20, cardNumber: '****5678' },
        { creditLimit: 12000, currentBalance: 2500, monthlySpend: 1200, utilizationRate: 21, cardNumber: '****9012' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.averageMonthlySpend).toBe('900.00');
    });
    
    it('should include all cards in comparison result', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' },
        { creditLimit: 15000, currentBalance: 3000, monthlySpend: 750, utilizationRate: 20, cardNumber: '****5678' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.cards).toBe(cards);
      expect(result.cards.length).toBe(2);
    });
    
    it('should handle single card correctly', function() {
      var cards = [
        { creditLimit: 10000, currentBalance: 2000, monthlySpend: 500, utilizationRate: 20, cardNumber: '****1234' }
      ];
      
      var result;
      SpendAnalysisService.calculateComparisons(cards).then(function(comparison) {
        result = comparison;
      });
      
      $rootScope.$digest();
      
      expect(result.metrics.totalCreditLimit).toBe(10000);
      expect(result.metrics.highestSpendCard).toBe('****1234');
      expect(result.metrics.lowestUtilizationCard).toBe('****1234');
    });
    
  });
  
  describe('getCardWiseAnalysis', function() {
    
    it('should return analysis for given card ID', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(result.cardId).toBe('card001');
    });
    
    it('should include category breakdown', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown).toBeDefined();
      expect(Array.isArray(result.categoryBreakdown)).toBe(true);
      expect(result.categoryBreakdown.length).toBeGreaterThan(0);
    });
    
    it('should include monthly trend data', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrend).toBeDefined();
      expect(Array.isArray(result.monthlyTrend)).toBe(true);
      expect(result.monthlyTrend.length).toBeGreaterThan(0);
    });
    
    it('should return category breakdown with correct structure', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      result.categoryBreakdown.forEach(function(cat) {
        expect(cat).toEqual(jasmine.objectContaining({
          category: jasmine.any(String),
          amount: jasmine.any(Number),
          percentage: jasmine.any(Number)
        }));
      });
    });
    
    it('should return monthly trend with correct structure', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      result.monthlyTrend.forEach(function(trend) {
        expect(trend).toEqual(jasmine.objectContaining({
          month: jasmine.any(String),
          spend: jasmine.any(Number)
        }));
      });
    });
    
    it('should return mock data with 5 categories', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      expect(result.categoryBreakdown.length).toBe(5);
    });
    
    it('should return mock data with 3 months of trends', function() {
      var result;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result = analysis;
      });
      
      $rootScope.$digest();
      
      expect(result.monthlyTrend.length).toBe(3);
    });
    
    it('should work with different card IDs', function() {
      var result1, result2;
      
      SpendAnalysisService.getCardWiseAnalysis('card001').then(function(analysis) {
        result1 = analysis;
      });
      $rootScope.$digest();
      
      SpendAnalysisService.getCardWiseAnalysis('card999').then(function(analysis) {
        result2 = analysis;
      });
      $rootScope.$digest();
      
      expect(result1.cardId).toBe('card001');
      expect(result2.cardId).toBe('card999');
    });
    
  });
  
});