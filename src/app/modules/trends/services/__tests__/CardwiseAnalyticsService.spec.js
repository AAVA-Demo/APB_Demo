/*
Test Documentation:
- Test Name: CardwiseAnalyticsService - analyzeByCard
- Purpose: Validates aggregation of spending by card with monthly breakdown
- Scenario: Transactions from multiple cards are analyzed
- Expected Result: Returns array of card analytics with monthly breakdowns
*/
/*
Coverage Report:
- Functions tested: analyzeByCard
- Scenarios covered: multiple cards, single card, monthly breakdown, empty list
- Uncovered scenarios: none
*/

describe('CardwiseAnalyticsService', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var CardwiseAnalyticsService;
  
  beforeEach(inject(function(_CardwiseAnalyticsService_) {
    CardwiseAnalyticsService = _CardwiseAnalyticsService_;
  }));
  
  describe('analyzeByCard', function() {
    it('should analyze spending by card', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1, cardName: 'Visa Gold' },
        { transactionId: 2, amount: 200, transactionDate: '2024-01-20', cardId: 1, cardName: 'Visa Gold' },
        { transactionId: 3, amount: 150, transactionDate: '2024-02-10', cardId: 2, cardName: 'MasterCard' }
      ];
      
      var result = CardwiseAnalyticsService.analyzeByCard(transactions);
      
      expect(result.length).toBe(2);
      
      var visaCard = result.find(function(c) { return c.cardId === 1; });
      expect(visaCard.cardName).toBe('Visa Gold');
      expect(visaCard.totalSpend).toBe(300);
      expect(visaCard.transactionCount).toBe(2);
      expect(visaCard.monthlyBreakdown.length).toBe(1);
      
      var masterCard = result.find(function(c) { return c.cardId === 2; });
      expect(masterCard.totalSpend).toBe(150);
      expect(masterCard.transactionCount).toBe(1);
    });
    
    it('should create monthly breakdown for each card', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1, cardName: 'Visa' },
        { transactionId: 2, amount: 200, transactionDate: '2024-02-20', cardId: 1, cardName: 'Visa' },
        { transactionId: 3, amount: 150, transactionDate: '2024-03-10', cardId: 1, cardName: 'Visa' }
      ];
      
      var result = CardwiseAnalyticsService.analyzeByCard(transactions);
      
      expect(result.length).toBe(1);
      expect(result[0].monthlyBreakdown.length).toBe(3);
      expect(result[0].monthlyBreakdown[0].month).toBe('2024-01');
      expect(result[0].monthlyBreakdown[0].totalSpend).toBe(100);
      expect(result[0].monthlyBreakdown[1].month).toBe('2024-02');
      expect(result[0].monthlyBreakdown[2].month).toBe('2024-03');
    });
    
    it('should handle transactions without card name', function() {
      var transactions = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 }
      ];
      
      var result = CardwiseAnalyticsService.analyzeByCard(transactions);
      
      expect(result.length).toBe(1);
      expect(result[0].cardName).toBe('Card 1');
    });
    
    it('should handle empty transaction list', function() {
      var result = CardwiseAnalyticsService.analyzeByCard([]);
      expect(result.length).toBe(0);
    });
  });
});