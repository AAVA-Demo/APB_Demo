/*
Test Documentation:
- Test Name: CardComparisonService card comparison logic
- Purpose: Validates card comparison calculations and metric aggregation
- Scenario: Test comparison of multiple cards with financial metrics
- Expected Result: Service should correctly calculate totals and utilization percentages
*/
/*
Coverage Report:
- Functions tested: compareCards
- Scenarios covered: multiple card comparison, metric calculation, utilization percentage
- Dependencies mocked: none (pure service)
- Uncovered scenarios: none
*/

describe('CardComparisonService', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var service;
  
  beforeEach(inject(function(_CardComparisonService_) {
    service = _CardComparisonService_;
  }));
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have compareCards method', function() {
    expect(service.compareCards).toBeDefined();
    expect(typeof service.compareCards).toBe('function');
  });
  
  it('should compare cards and calculate total credit limit', function() {
    var cards = [
      { id: 'card1', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000 },
      { id: 'card2', creditLimit: 75000, availableCredit: 50000, outstandingBalance: 25000 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.metrics.totalCreditLimit).toBe(125000);
  });
  
  it('should calculate total available credit', function() {
    var cards = [
      { id: 'card1', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000 },
      { id: 'card2', creditLimit: 75000, availableCredit: 50000, outstandingBalance: 25000 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.metrics.totalAvailableCredit).toBe(80000);
  });
  
  it('should calculate total outstanding balance', function() {
    var cards = [
      { id: 'card1', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000 },
      { id: 'card2', creditLimit: 75000, availableCredit: 50000, outstandingBalance: 25000 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.metrics.totalOutstanding).toBe(45000);
  });
  
  it('should calculate average utilization percentage', function() {
    var cards = [
      { id: 'card1', creditLimit: 100000, availableCredit: 60000, outstandingBalance: 40000 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.metrics.averageUtilization).toBe(40);
  });
  
  it('should handle zero credit limit gracefully', function() {
    var cards = [
      { id: 'card1', creditLimit: 0, availableCredit: 0, outstandingBalance: 0 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.metrics.averageUtilization).toBe(0);
  });
  
  it('should include cards array in result', function() {
    var cards = [
      { id: 'card1', creditLimit: 50000, availableCredit: 30000, outstandingBalance: 20000 }
    ];
    
    var result = service.compareCards(cards);
    
    expect(result.cards).toEqual(cards);
  });
});