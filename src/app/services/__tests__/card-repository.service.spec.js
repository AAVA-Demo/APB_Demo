/*
Test Documentation:
- Test Name: CardRepositoryService - getUserCards returns user cards
- Purpose: Validates card retrieval by user ID
- Scenario: Service fetches cards for authenticated user
- Expected Result: Returns array of user's credit cards
*/
/*
Test Documentation:
- Test Name: CardRepositoryService - getUserCards filters by userId
- Purpose: Validates data isolation between users
- Scenario: Service filters cards by user ID
- Expected Result: Returns only cards belonging to specified user
*/
/*
Test Documentation:
- Test Name: CardRepositoryService - addCard creates new card
- Purpose: Validates card addition functionality
- Scenario: User adds new credit card
- Expected Result: Card added with masked number and generated ID
*/
/*
Test Documentation:
- Test Name: CardRepositoryService - addCard masks card number
- Purpose: Validates security requirement for card masking
- Scenario: New card added with full card number
- Expected Result: Card number masked showing only last 4 digits
*/
/*
Test Documentation:
- Test Name: CardRepositoryService - addCard initializes card metrics
- Purpose: Validates default values for new cards
- Scenario: New card added without balance
- Expected Result: Outstanding balance is 0, available credit equals limit
*/
/*
Coverage Report:
- Functions tested: getUserCards, addCard
- Scenarios covered: card retrieval, filtering, addition, masking, initialization
- Uncovered scenarios: card deletion, card update, invalid card data
*/

(function() {
  'use strict';

  describe('CardRepositoryService', function() {
    var CardRepositoryService;
    var $http;
    var $q;
    var $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardRepositoryService_, _$http_, _$q_, _$timeout_) {
      CardRepositoryService = _CardRepositoryService_;
      $http = _$http_;
      $q = _$q_;
      $timeout = _$timeout_;
    }));

    describe('getUserCards', function() {
      it('should be defined', function() {
        expect(CardRepositoryService.getUserCards).toBeDefined();
        expect(typeof CardRepositoryService.getUserCards).toBe('function');
      });

      it('should return a promise', function() {
        var result = CardRepositoryService.getUserCards('user123');

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should return cards for valid user ID', function(done) {
        CardRepositoryService.getUserCards('user123').then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should filter cards by user ID', function(done) {
        CardRepositoryService.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.userId).toBe('user123');
          });
          done();
        });
      });

      it('should return cards with required properties', function(done) {
        CardRepositoryService.getUserCards('user123').then(function(cards) {
          expect(cards.length).toBeGreaterThan(0);
          
          var card = cards[0];
          expect(card.cardId).toBeDefined();
          expect(card.userId).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardHolderName).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.issuer).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.outstandingBalance).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.expiryDate).toBeDefined();
          done();
        });
      });

      it('should return masked card numbers', function(done) {
        CardRepositoryService.getUserCards('user123').then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toMatch(/^\*{4}\d{4}$/);
          });
          done();
        });
      });

      it('should return empty array for non-existent user', function(done) {
        CardRepositoryService.getUserCards('nonexistent').then(function(cards) {
          expect(cards).toBeDefined();
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(0);
          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();

        CardRepositoryService.getUserCards('user123').then(function(cards) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(700);
          done();
        });
      });
    });

    describe('addCard', function() {
      var newCard;

      beforeEach(function() {
        newCard = {
          userId: 'user123',
          cardNumber: '1234567890123456',
          cardHolderName: 'Jane Smith',
          cardType: 'Visa',
          issuer: 'Bank C',
          creditLimit: 20000,
          expiryDate: '12/27'
        };
      });

      it('should be defined', function() {
        expect(CardRepositoryService.addCard).toBeDefined();
        expect(typeof CardRepositoryService.addCard).toBe('function');
      });

      it('should return a promise', function() {
        var result = CardRepositoryService.addCard(newCard);

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should add card and return it with generated ID', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          expect(addedCard).toBeDefined();
          expect(addedCard.cardId).toBeDefined();
          expect(addedCard.cardId).toMatch(/^c\d+$/);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should mask card number showing only last 4 digits', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          expect(addedCard.cardNumber).toBe('****3456');
          expect(addedCard.cardNumber).toMatch(/^\*{4}\d{4}$/);
          done();
        });
      });

      it('should initialize outstanding balance to 0', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          expect(addedCard.outstandingBalance).toBe(0);
          done();
        });
      });

      it('should set available credit equal to credit limit', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          expect(addedCard.availableCredit).toBe(addedCard.creditLimit);
          expect(addedCard.availableCredit).toBe(20000);
          done();
        });
      });

      it('should preserve all card properties', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          expect(addedCard.userId).toBe(newCard.userId);
          expect(addedCard.cardHolderName).toBe(newCard.cardHolderName);
          expect(addedCard.cardType).toBe(newCard.cardType);
          expect(addedCard.issuer).toBe(newCard.issuer);
          expect(addedCard.creditLimit).toBe(newCard.creditLimit);
          expect(addedCard.expiryDate).toBe(newCard.expiryDate);
          done();
        });
      });

      it('should make card retrievable after addition', function(done) {
        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          return CardRepositoryService.getUserCards('user123');
        }).then(function(cards) {
          var found = cards.find(function(c) { return c.cardHolderName === 'Jane Smith'; });
          expect(found).toBeDefined();
          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();

        CardRepositoryService.addCard(newCard).then(function(addedCard) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(700);
          done();
        });
      });
    });
  });
})();