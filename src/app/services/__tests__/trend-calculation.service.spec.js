/*
Test Documentation:
- Test Name: TrendCalculationService - calculateTrends with valid transactions
- Purpose: Validates trend calculation including monthly aggregation and card-wise breakdown
- Scenario: Service receives array of transactions spanning multiple months
- Expected Result: Returns monthlyTrends, cardWiseSpend, and dateRange
*/
/*
Test Documentation:
- Test Name: TrendCalculationService - calculateTrends with empty transactions
- Purpose: Validates handling of empty transaction array
- Scenario: Service receives empty array
- Expected Result: Returns empty arrays and null date range
*/
/*
Test Documentation:
- Test Name: TrendCalculationService - calculateTrends monthly aggregation
- Purpose: Validates monthly spend aggregation accuracy
- Scenario: Multiple transactions in same month
- Expected Result: Transactions correctly aggregated by month
*/
/*
Test Documentation:
- Test Name: TrendCalculationService - calculateTrends card-wise breakdown
- Purpose: Validates card-wise spending calculation and percentage accuracy
- Scenario: Transactions across multiple cards
- Expected Result: Card totals and percentages calculated correctly
*/
/*
Coverage Report:
- Functions tested: calculateTrends
- Scenarios covered: valid transactions, empty transactions, monthly aggregation, card-wise breakdown, percentage calculations, date range
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('TrendCalculationService', function(){
  var TrendCalculationService;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TrendCalculationService_){
    TrendCalculationService = _TrendCalculationService_;
  }));
  
  describe('calculateTrends', function(){
    
    it('should calculate trends for valid transactions', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC002', cardName:'Gold', amount:2000, date:new Date('2024-02-15')},
        {transactionId:'T003', cardId:'CC001', cardName:'Platinum', amount:1500, date:new Date('2024-02-20')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      expect(result.monthlyTrends).toBeDefined();
      expect(result.cardWiseSpend).toBeDefined();
      expect(result.dateRange).toBeDefined();
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.cardWiseSpend.length).toBe(2);
    });
    
    it('should return empty result for empty transactions', function(){
      var result = TrendCalculationService.calculateTrends([]);
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.cardWiseSpend).toEqual([]);
      expect(result.dateRange.startDate).toBeNull();
      expect(result.dateRange.endDate).toBeNull();
    });
    
    it('should return empty result for null transactions', function(){
      var result = TrendCalculationService.calculateTrends(null);
      
      expect(result.monthlyTrends).toEqual([]);
      expect(result.cardWiseSpend).toEqual([]);
    });
    
    it('should aggregate transactions by month correctly', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC001', cardName:'Platinum', amount:500, date:new Date('2024-01-20')},
        {transactionId:'T003', cardId:'CC002', cardName:'Gold', amount:2000, date:new Date('2024-02-15')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      expect(result.monthlyTrends.length).toBe(2);
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[0].totalSpend).toBe(1500);
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[1].totalSpend).toBe(2000);
    });
    
    it('should sort monthly trends chronologically', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-03-15')},
        {transactionId:'T002', cardId:'CC001', cardName:'Platinum', amount:2000, date:new Date('2024-01-15')},
        {transactionId:'T003', cardId:'CC001', cardName:'Platinum', amount:1500, date:new Date('2024-02-15')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      expect(result.monthlyTrends[0].month).toBe('2024-01');
      expect(result.monthlyTrends[1].month).toBe('2024-02');
      expect(result.monthlyTrends[2].month).toBe('2024-03');
    });
    
    it('should calculate card-wise spend correctly', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC001', cardName:'Platinum', amount:500, date:new Date('2024-01-20')},
        {transactionId:'T003', cardId:'CC002', cardName:'Gold', amount:2000, date:new Date('2024-01-25')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      var cc001 = result.cardWiseSpend.find(function(c){return c.cardId === 'CC001';});
      var cc002 = result.cardWiseSpend.find(function(c){return c.cardId === 'CC002';});
      
      expect(cc001.totalSpend).toBe(1500);
      expect(cc001.cardName).toBe('Platinum');
      expect(cc002.totalSpend).toBe(2000);
      expect(cc002.cardName).toBe('Gold');
    });
    
    it('should calculate percentages correctly', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC002', cardName:'Gold', amount:3000, date:new Date('2024-01-20')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      var cc001 = result.cardWiseSpend.find(function(c){return c.cardId === 'CC001';});
      var cc002 = result.cardWiseSpend.find(function(c){return c.cardId === 'CC002';});
      
      expect(cc001.percentage).toBe(25);
      expect(cc002.percentage).toBe(75);
    });
    
    it('should round amounts to 2 decimal places', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000.556, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC001', cardName:'Platinum', amount:500.444, date:new Date('2024-01-20')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      var cc001 = result.cardWiseSpend.find(function(c){return c.cardId === 'CC001';});
      expect(cc001.totalSpend).toBe(1501);
    });
    
    it('should calculate correct date range', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')},
        {transactionId:'T002', cardId:'CC002', cardName:'Gold', amount:2000, date:new Date('2024-05-20')},
        {transactionId:'T003', cardId:'CC001', cardName:'Platinum', amount:1500, date:new Date('2024-03-10')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      expect(result.dateRange.startDate).toEqual(new Date('2024-01-15'));
      expect(result.dateRange.endDate).toEqual(new Date('2024-05-20'));
    });
    
    it('should handle single transaction', function(){
      var transactions = [
        {transactionId:'T001', cardId:'CC001', cardName:'Platinum', amount:1000, date:new Date('2024-01-15')}
      ];
      
      var result = TrendCalculationService.calculateTrends(transactions);
      
      expect(result.monthlyTrends.length).toBe(1);
      expect(result.cardWiseSpend.length).toBe(1);
      expect(result.cardWiseSpend[0].percentage).toBe(100);
    });
    
  });
  
});

})();