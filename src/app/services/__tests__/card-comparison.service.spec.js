/*
Test Documentation:
- Test Name: CardComparisonService - compareCards
- Purpose: Validates that compareCards fetches card details and returns comparison data
- Scenario: User compares multiple cards
- Expected Result: Returns array with cardName, utilizationRate, monthlySpend, availableCredit for each card
*/
/*
Test Documentation:
- Test Name: CardComparisonService - compareCards with unknown card
- Purpose: Validates that compareCards handles unknown card IDs gracefully
- Scenario: User provides card ID that doesn't exist
- Expected Result: Returns 'Unknown' for cardName and 0 for metrics
*/
/*
Coverage Report:
- Functions tested: compareCards
- Scenarios covered: valid cards, unknown cards, multiple cards comparison
- Uncovered scenarios: none
*/

describe('CardComparisonService', function() {
  'use strict';

  var CardComparisonService, CreditCardDataService, $q, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CardComparisonService_, _CreditCardDataService_, _$q_, _$rootScope_) {
    CardComparisonService = _CardComparisonService_;
    CreditCardDataService = _CreditCardDataService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('compareCards', function() {
    it('should return comparison data for valid card IDs', function() {
      var mockCards = [
        {cardId: 'card1', cardType: 'Visa', lastFourDigits: '1234', utilizationRate: 30, monthlySpend: 12000, availableCredit: 35000},
        {cardId: 'card2', cardType: 'MasterCard', lastFourDigits: '5678', utilizationRate: 27, monthlySpend: 6500, availableCredit: 22000}
      ];
      spyOn(CreditCardDataService, 'fetchAllCards').and.returnValue($q.resolve(mockCards));

      var result;
      CardComparisonService.compareCards(['card1', 'card2']).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].cardName).toBe('Visa 1234');
      expect(result[0].utilizationRate).toBe(30);
      expect(result[0].monthlySpend).toBe(12000);
      expect(result[0].availableCredit).toBe(35000);
    });

    it('should handle unknown card IDs gracefully', function() {
      var mockCards = [
        {cardId: 'card1', cardType: 'Visa', lastFourDigits: '1234', utilizationRate: 30, monthlySpend: 12000, availableCredit: 35000}
      ];
      spyOn(CreditCardDataService, 'fetchAllCards').and.returnValue($q.resolve(mockCards));

      var result;
      CardComparisonService.compareCards(['card1', 'card999']).then(function(data) {
        result = data;
      });
      $rootScope.$digest();

      expect(result.length).toBe(2);
      expect(result[1].cardId).toBe('card999');
      expect(result[1].cardName).toBe('Unknown');
      expect(result[1].utilizationRate).toBe(0);
      expect(result[1].monthlySpend).toBe(0);
      expect(result[1].availableCredit).toBe(0);
    });

    it('should call fetchAllCards for each card ID', function() {
      spyOn(CreditCardDataService, 'fetchAllCards').and.returnValue($q.resolve([]));

      CardComparisonService.compareCards(['card1', 'card2', 'card3']);
      $rootScope.$digest();

      expect(CreditCardDataService.fetchAllCards.calls.count()).toBe(3);
    });
  });
});