/*
Test Documentation:
- Test Name: CardComparisonService - compareCards
- Purpose: Validates side-by-side comparison of multiple credit cards
- Scenario: User selects multiple cards for comparison
- Expected Result: Returns comparison data with utilizationRate, monthlySpend, and availableCredit for each selected card
*/
/*
Coverage Report:
- Functions tested: compareCards
- Scenarios covered: successful card comparison, filtering by cardIds, card name generation
- Uncovered scenarios: none
*/

describe('CardComparisonService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardComparisonService, CreditCardDataService, $q, $rootScope;
  
  beforeEach(inject(function(_CardComparisonService_, _CreditCardDataService_, _$q_, _$rootScope_) {
    CardComparisonService = _CardComparisonService_;
    CreditCardDataService = _CreditCardDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('compareCards', function() {
    it('should return comparison data for selected cards', function(done) {
      var mockCards = [
        { cardId: 'C001', cardType: 'Visa', maskedNumber: '**** **** **** 9012', utilizationRate: 30, monthlySpend: 12000, availableCredit: 35000 },
        { cardId: 'C002', cardType: 'MasterCard', maskedNumber: '**** **** **** 9903', utilizationRate: 33.33, monthlySpend: 18000, availableCredit: 50000 },
        { cardId: 'C003', cardType: 'Amex', maskedNumber: '**** **** **** 0005', utilizationRate: 20, monthlySpend: 15000, availableCredit: 80000 }
      ];
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      
      CardComparisonService.compareCards(['C001', 'C003']).then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('C001');
        expect(result[0].cardName).toBe('Visa 9012');
        expect(result[0].utilizationRate).toBe(30);
        expect(result[1].cardId).toBe('C003');
        expect(result[1].cardName).toBe('Amex 0005');
        done();
      });
      $rootScope.$apply();
    });
    
    it('should filter cards by provided cardIds', function(done) {
      var mockCards = [
        { cardId: 'C001', cardType: 'Visa', maskedNumber: '**** **** **** 9012', utilizationRate: 30, monthlySpend: 12000, availableCredit: 35000 },
        { cardId: 'C002', cardType: 'MasterCard', maskedNumber: '**** **** **** 9903', utilizationRate: 33.33, monthlySpend: 18000, availableCredit: 50000 }
      ];
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      
      CardComparisonService.compareCards(['C002']).then(function(result) {
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('C002');
        done();
      });
      $rootScope.$apply();
    });
    
    it('should return empty array if no matching cards found', function(done) {
      var mockCards = [
        { cardId: 'C001', cardType: 'Visa', maskedNumber: '**** **** **** 9012', utilizationRate: 30, monthlySpend: 12000, availableCredit: 35000 }
      ];
      spyOn(CreditCardDataService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      
      CardComparisonService.compareCards(['C999']).then(function(result) {
        expect(result.length).toBe(0);
        done();
      });
      $rootScope.$apply();
    });
  });
});