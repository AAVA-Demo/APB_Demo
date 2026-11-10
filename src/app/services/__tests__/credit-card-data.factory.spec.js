/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchAllCards returns mock data
- Purpose: Validates that fetchAllCards returns array of credit card objects
- Scenario: Factory method is called to retrieve all credit cards
- Expected Result: Returns promise resolving to array of 3 credit cards with complete details
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchAllCards returns independent copies
- Purpose: Validates that each call returns independent copy of data
- Scenario: fetchAllCards is called multiple times
- Expected Result: Each call returns independent copy, modifications don't affect original
*/
/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered: data retrieval, data structure validation, data independence
- Uncovered scenarios: none
*/

(function(){
'use strict';

describe('CreditCardDataFactory', function(){
  var CreditCardDataFactory, $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CreditCardDataFactory_, _$rootScope_){
    CreditCardDataFactory = _CreditCardDataFactory_;
    $rootScope = _$rootScope_;
  }));
  
  describe('fetchAllCards', function(){
    
    it('should return array of credit cards', function(){
      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });
    
    it('should return cards with complete details', function(){
      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result = cards;
      });
      
      $rootScope.$digest();
      
      var firstCard = result[0];
      expect(firstCard.cardId).toBe('CC001');
      expect(firstCard.cardName).toBe('Platinum Rewards');
      expect(firstCard.cardNumber).toBe('****1234');
      expect(firstCard.creditLimit).toBe(50000);
      expect(firstCard.availableCredit).toBe(35000);
      expect(firstCard.outstandingAmount).toBe(15000);
      expect(firstCard.monthlySpend).toBe(8500);
      expect(firstCard.issuer).toBe('Bank A');
    });
    
    it('should return all three cards with correct IDs', function(){
      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result = cards;
      });
      
      $rootScope.$digest();
      
      var cardIds = result.map(function(c){return c.cardId;});
      expect(cardIds).toContain('CC001');
      expect(cardIds).toContain('CC002');
      expect(cardIds).toContain('CC003');
    });
    
    it('should return independent copies on each call', function(){
      var result1, result2;
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result1 = cards;
      });
      $rootScope.$digest();
      
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result2 = cards;
      });
      $rootScope.$digest();
      
      result1[0].cardName = 'Modified Name';
      
      expect(result2[0].cardName).toBe('Platinum Rewards');
      expect(result1[0].cardName).toBe('Modified Name');
    });
    
    it('should return cards with numeric financial values', function(){
      var result;
      CreditCardDataFactory.fetchAllCards().then(function(cards){
        result = cards;
      });
      
      $rootScope.$digest();
      
      result.forEach(function(card){
        expect(typeof card.creditLimit).toBe('number');
        expect(typeof card.availableCredit).toBe('number');
        expect(typeof card.outstandingAmount).toBe('number');
        expect(typeof card.monthlySpend).toBe('number');
      });
    });
    
  });
  
});

})();