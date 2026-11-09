/*
Test Documentation:
- Test Name: CardwiseAnalyzer Unit Tests
- Purpose: Validate card-wise spending analysis
- Scenario: Test analyzeByCard with transactions and card data
- Expected Result: Factory should correctly analyze spending by individual cards
*/

(function(){
'use strict';

describe('CardwiseAnalyzer', function() {
  var CardwiseAnalyzer;

  beforeEach(module('spendTrendsModule'));

  beforeEach(inject(function(_CardwiseAnalyzer_) {
    CardwiseAnalyzer = _CardwiseAnalyzer_;
  }));

  describe('analyzeByCard', function() {
    it('should analyze spending by card', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-02-10'},
        {cardId: 2, amount: 75, transactionDate: '2024-01-20'}
      ];

      var cards = [
        {cardId: 1, cardType: 'Visa', cardNumber: '1234'},
        {cardId: 2, cardType: 'Mastercard', cardNumber: '5678'}
      ];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe(1);
      expect(result[0].cardName).toBe('Visa - 1234');
      expect(result[0].totalSpend).toBe(150);
      expect(result[1].cardId).toBe(2);
      expect(result[1].totalSpend).toBe(75);
    });

    it('should include monthly breakdown per card', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-02-10'}
      ];

      var cards = [{cardId: 1, cardType: 'Visa', cardNumber: '1234'}];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result[0].monthlyData.length).toBe(2);
      expect(result[0].monthlyData[0].month).toBe('2024-01');
      expect(result[0].monthlyData[0].spend).toBe(100);
      expect(result[0].monthlyData[1].month).toBe('2024-02');
      expect(result[0].monthlyData[1].spend).toBe(50);
    });

    it('should sort monthly data chronologically', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-03-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-01-10'}
      ];

      var cards = [{cardId: 1, cardType: 'Visa', cardNumber: '1234'}];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result[0].monthlyData[0].month).toBe('2024-01');
      expect(result[0].monthlyData[1].month).toBe('2024-03');
    });

    it('should handle cards with no transactions', function() {
      var transactions = [{cardId: 1, amount: 100, transactionDate: '2024-01-15'}];

      var cards = [
        {cardId: 1, cardType: 'Visa', cardNumber: '1234'},
        {cardId: 2, cardType: 'Mastercard', cardNumber: '5678'}
      ];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result[1].totalSpend).toBe(0);
      expect(result[1].monthlyData.length).toBe(0);
    });

    it('should ignore transactions for unknown cards', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 999, amount: 50, transactionDate: '2024-01-20'}
      ];

      var cards = [{cardId: 1, cardType: 'Visa', cardNumber: '1234'}];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(100);
    });

    it('should aggregate multiple transactions in same month', function() {
      var transactions = [
        {cardId: 1, amount: 100, transactionDate: '2024-01-15'},
        {cardId: 1, amount: 50, transactionDate: '2024-01-20'}
      ];

      var cards = [{cardId: 1, cardType: 'Visa', cardNumber: '1234'}];

      var result = CardwiseAnalyzer.analyzeByCard(transactions, cards);

      expect(result[0].monthlyData.length).toBe(1);
      expect(result[0].monthlyData[0].spend).toBe(150);
    });

    it('should handle empty transaction list', function() {
      var cards = [{cardId: 1, cardType: 'Visa', cardNumber: '1234'}];

      var result = CardwiseAnalyzer.analyzeByCard([], cards);

      expect(result.length).toBe(1);
      expect(result[0].totalSpend).toBe(0);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: analyzeByCard
- Scenarios covered: Card-wise aggregation, monthly breakdown, sorting, cards without transactions, unknown cards, empty lists
- Edge cases: No transactions, unknown card IDs, multiple transactions per month
- Uncovered scenarios: None - all card-wise analysis logic covered
*/