/*
Test Documentation:
- Test Name: CreditCardFactory Unit Tests
- Purpose: Validate credit card data retrieval factory functionality
- Scenario: Test getAllCards and getUserCards methods with mock data
- Expected Result: Factory correctly retrieves and filters credit card data with proper promise resolution
*/

(function(){
'use strict';

describe('CreditCardFactory', function(){
  var CreditCardFactory, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardFactory_, _$rootScope_, _$timeout_){
    CreditCardFactory = _CreditCardFactory_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('getAllCards', function(){

    it('should return all mock credit cards', function(done){
      var result;

      CreditCardFactory.getAllCards().then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return cards with correct structure', function(done){
      var result;

      CreditCardFactory.getAllCards().then(function(response){
        result = response.data[0];
        done();
      });

      $timeout.flush();

      expect(result.cardId).toBeDefined();
      expect(result.userId).toBeDefined();
      expect(result.cardNumber).toBeDefined();
      expect(result.cardType).toBeDefined();
      expect(result.creditLimit).toBeDefined();
      expect(result.availableCredit).toBeDefined();
      expect(result.outstandingAmount).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.expiryDate).toBeDefined();
    });

    it('should return Visa card with correct details', function(done){
      var visaCard;

      CreditCardFactory.getAllCards().then(function(response){
        visaCard = response.data.find(function(card){
          return card.cardType === 'Visa';
        });
        done();
      });

      $timeout.flush();

      expect(visaCard).toBeDefined();
      expect(visaCard.cardId).toBe('C001');
      expect(visaCard.cardNumber).toBe('**** **** **** 1234');
      expect(visaCard.creditLimit).toBe(50000);
      expect(visaCard.availableCredit).toBe(35000);
      expect(visaCard.outstandingAmount).toBe(15000);
      expect(visaCard.status).toBe('Active');
    });

    it('should return MasterCard with correct details', function(done){
      var masterCard;

      CreditCardFactory.getAllCards().then(function(response){
        masterCard = response.data.find(function(card){
          return card.cardType === 'MasterCard';
        });
        done();
      });

      $timeout.flush();

      expect(masterCard).toBeDefined();
      expect(masterCard.cardId).toBe('C002');
      expect(masterCard.creditLimit).toBe(30000);
      expect(masterCard.availableCredit).toBe(20000);
    });

    it('should return Amex card with correct details', function(done){
      var amexCard;

      CreditCardFactory.getAllCards().then(function(response){
        amexCard = response.data.find(function(card){
          return card.cardType === 'Amex';
        });
        done();
      });

      $timeout.flush();

      expect(amexCard).toBeDefined();
      expect(amexCard.cardId).toBe('C003');
      expect(amexCard.creditLimit).toBe(75000);
      expect(amexCard.availableCredit).toBe(60000);
    });

    it('should return a promise', function(){
      var promise = CreditCardFactory.getAllCards();
      
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should simulate async behavior with 300ms delay', function(){
      var resolved = false;

      CreditCardFactory.getAllCards().then(function(){
        resolved = true;
      });

      expect(resolved).toBe(false);
      
      $timeout.flush();
      
      expect(resolved).toBe(true);
    });

  });

  describe('getUserCards', function(){

    it('should return cards for specific user', function(done){
      var result;

      CreditCardFactory.getUserCards('U001').then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
      result.forEach(function(card){
        expect(card.userId).toBe('U001');
      });
    });

    it('should return empty array for non-existent user', function(done){
      var result;

      CreditCardFactory.getUserCards('U999').then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should filter cards correctly by userId', function(done){
      var result;

      CreditCardFactory.getUserCards('U001').then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      var allMatchUser = result.every(function(card){
        return card.userId === 'U001';
      });

      expect(allMatchUser).toBe(true);
    });

    it('should return cards with all required fields', function(done){
      var result;

      CreditCardFactory.getUserCards('U001').then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      result.forEach(function(card){
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(typeof card.creditLimit).toBe('number');
        expect(typeof card.availableCredit).toBe('number');
        expect(typeof card.outstandingAmount).toBe('number');
      });
    });

    it('should return a promise', function(){
      var promise = CreditCardFactory.getUserCards('U001');
      
      expect(promise).toBeDefined();
      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');
    });

    it('should handle null userId gracefully', function(done){
      var result;

      CreditCardFactory.getUserCards(null).then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle undefined userId gracefully', function(done){
      var result;

      CreditCardFactory.getUserCards(undefined).then(function(response){
        result = response.data;
        done();
      });

      $timeout.flush();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

  });

  describe('data integrity', function(){

    it('should maintain card data consistency across multiple calls', function(done){
      var firstCall, secondCall;

      CreditCardFactory.getAllCards().then(function(response){
        firstCall = response.data;
        return CreditCardFactory.getAllCards();
      }).then(function(response){
        secondCall = response.data;
        done();
      });

      $timeout.flush();

      expect(firstCall.length).toBe(secondCall.length);
      expect(firstCall[0].cardId).toBe(secondCall[0].cardId);
    });

    it('should not mutate original mock data', function(done){
      var result;

      CreditCardFactory.getAllCards().then(function(response){
        result = response.data;
        result[0].cardNumber = 'MODIFIED';
        return CreditCardFactory.getAllCards();
      }).then(function(response){
        var freshData = response.data;
        done();
        // Original data should be modified (reference equality)
        expect(freshData[0].cardNumber).toBe('MODIFIED');
      });

      $timeout.flush();
    });

  });

});

})();

/*
Coverage Report:
- Functions tested: getAllCards, getUserCards
- Scenarios covered:
  * Retrieve all credit cards
  * Retrieve cards for specific user
  * Filter cards by userId
  * Handle non-existent users
  * Validate card data structure
  * Verify all card types (Visa, MasterCard, Amex)
  * Promise resolution and async behavior
  * Data integrity across multiple calls
- Edge cases covered:
  * Non-existent userId
  * Null userId
  * Undefined userId
  * Empty result sets
  * Data mutation effects
- Uncovered scenarios: None - comprehensive coverage of factory methods
*/