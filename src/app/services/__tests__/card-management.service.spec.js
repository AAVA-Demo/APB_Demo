/*
Test Documentation:
- Test Name: CardManagementService - getAllCards
- Purpose: Validates delegation to CreditCardService for retrieving all cards
- Scenario: User requests all credit cards through management service
- Expected Result: Returns promise resolving to array of cards
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails
- Purpose: Validates aggregation of card details with transactions and calculated fields
- Scenario: User requests detailed view of specific card
- Expected Result: Returns enhanced card object with transactions, monthlySpend, dueDate, minimumPayment
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails
- Scenarios covered: successful retrieval, data aggregation, monthly spend calculation, error handling, promise resolution
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService;
    var CreditCardService;
    var TransactionService;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardManagementService_, _CreditCardService_, _TransactionService_, _$q_, _$rootScope_) {
      CardManagementService = _CardManagementService_;
      CreditCardService = _CreditCardService_;
      TransactionService = _TransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('getAllCards', function() {
      it('should delegate to CreditCardService.getAllCards', function(done) {
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
        CardManagementService.getAllCards('user-123');
        expect(CreditCardService.getAllCards).toHaveBeenCalledWith('user-123');
        done();
      });

      it('should return promise from CreditCardService', function(done) {
        var mockCards = [{cardId: 'card-1', cardType: 'Visa'}];
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
        CardManagementService.getAllCards('user-123').then(function(cards) {
          expect(cards).toEqual(mockCards);
          done();
        });
        $rootScope.$apply();
      });

      it('should handle null userId', function(done) {
        spyOn(CreditCardService, 'getAllCards').and.returnValue($q.resolve([]));
        CardManagementService.getAllCards(null);
        expect(CreditCardService.getAllCards).toHaveBeenCalledWith(null);
        done();
      });
    });

    describe('getCardDetails', function() {
      var mockCard;
      var mockTransactions;

      beforeEach(function() {
        mockCard = {
          cardId: 'card-1',
          cardNumber: '**** 1234',
          cardType: 'Visa',
          creditLimit: 10000,
          currentBalance: 3500,
          availableCredit: 6500
        };

        mockTransactions = [
          {id: 't1', cardId: 'card-1', amount: 125.50, date: new Date(), category: 'Food & Dining'},
          {id: 't2', cardId: 'card-1', amount: 60.00, date: new Date(), category: 'Fuel'},
          {id: 't3', cardId: 'card-1', amount: 200.00, date: new Date('2023-12-15'), category: 'Shopping'}
        ];
      });

      it('should call CreditCardService.getCardById and TransactionService.getTransactionsByCard', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function() {
          expect(CreditCardService.getCardById).toHaveBeenCalledWith('card-1');
          expect(TransactionService.getTransactionsByCard).toHaveBeenCalledWith('card-1');
          done();
        });
        $rootScope.$apply();
      });

      it('should return card details with transactions', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.cardId).toBe('card-1');
          expect(cardDetail.transactions).toBeDefined();
          expect(Array.isArray(cardDetail.transactions)).toBe(true);
          expect(cardDetail.transactions.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should calculate monthly spend from current month transactions', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.monthlySpend).toBeDefined();
          expect(typeof cardDetail.monthlySpend).toBe('number');
          expect(cardDetail.monthlySpend).toBeGreaterThanOrEqual(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should add dueDate property', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.dueDate).toBeDefined();
          expect(cardDetail.dueDate instanceof Date).toBe(true);
          done();
        });
        $rootScope.$apply();
      });

      it('should calculate minimumPayment as 5% of current balance', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.minimumPayment).toBeDefined();
          expect(cardDetail.minimumPayment).toBe(mockCard.currentBalance * 0.05);
          expect(cardDetail.minimumPayment).toBe(175);
          done();
        });
        $rootScope.$apply();
      });

      it('should reject promise when card is not found', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.reject({message: 'Card not found'}));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve([]));

        CardManagementService.getCardDetails('invalid-card').then(
          function() {
            fail('Promise should have been rejected');
            done();
          },
          function(error) {
            expect(error.message).toBe('Card not found');
            done();
          }
        );
        $rootScope.$apply();
      });

      it('should reject promise when transaction retrieval fails', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.reject({message: 'Transaction error'}));

        CardManagementService.getCardDetails('card-1').then(
          function() {
            fail('Promise should have been rejected');
            done();
          },
          function(error) {
            expect(error.message).toBe('Transaction error');
            done();
          }
        );
        $rootScope.$apply();
      });

      it('should handle card with no transactions', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve([]));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.transactions).toEqual([]);
          expect(cardDetail.monthlySpend).toBe(0);
          done();
        });
        $rootScope.$apply();
      });

      it('should preserve all original card properties', function(done) {
        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(mockTransactions));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.cardId).toBe(mockCard.cardId);
          expect(cardDetail.cardNumber).toBe(mockCard.cardNumber);
          expect(cardDetail.cardType).toBe(mockCard.cardType);
          expect(cardDetail.creditLimit).toBe(mockCard.creditLimit);
          expect(cardDetail.currentBalance).toBe(mockCard.currentBalance);
          expect(cardDetail.availableCredit).toBe(mockCard.availableCredit);
          done();
        });
        $rootScope.$apply();
      });

      it('should filter transactions by current month and year for monthly spend', function(done) {
        var now = new Date();
        var currentMonthTxns = [
          {id: 't1', cardId: 'card-1', amount: 100, date: now, category: 'Food & Dining'},
          {id: 't2', cardId: 'card-1', amount: 50, date: now, category: 'Fuel'}
        ];
        var oldTxn = {id: 't3', cardId: 'card-1', amount: 200, date: new Date('2023-01-01'), category: 'Shopping'};
        var allTxns = currentMonthTxns.concat([oldTxn]);

        spyOn(CreditCardService, 'getCardById').and.returnValue($q.resolve(mockCard));
        spyOn(TransactionService, 'getTransactionsByCard').and.returnValue($q.resolve(allTxns));

        CardManagementService.getCardDetails('card-1').then(function(cardDetail) {
          expect(cardDetail.monthlySpend).toBe(150);
          done();
        });
        $rootScope.$apply();
      });
    });
  });
})();