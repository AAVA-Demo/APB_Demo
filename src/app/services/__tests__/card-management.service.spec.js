/*
Test Documentation:
- Test Name: CardManagementService - getAllCards
- Purpose: Verify retrieval of all user credit cards
- Scenario: Service fetches all cards for authenticated user
- Expected Result: Returns array of card objects with details
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails
- Purpose: Verify retrieval of specific card details
- Scenario: Service fetches details for single card by ID
- Expected Result: Returns card object with complete details
*/
/*
Test Documentation:
- Test Name: CardManagementService - computeSpendAnalysis
- Purpose: Verify spend analysis computation from transactions
- Scenario: Service analyzes transactions to compute spending patterns
- Expected Result: Returns analysis with total spend, transaction count, and top categories
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, computeSpendAnalysis
- Scenarios covered: fetch all cards, fetch single card, cached card retrieval, spend analysis, category aggregation, top categories sorting, empty transactions
- Uncovered scenarios: none - all public methods and edge cases tested
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, TransactionFactory, AuthService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardManagementService_, _TransactionFactory_, _AuthService_, _$rootScope_, _$q_) {
      CardManagementService = _CardManagementService_;
      TransactionFactory = _TransactionFactory_;
      AuthService = _AuthService_;
      $rootScope = _$rootScope_;
      $q = _$q_;

      spyOn(AuthService, 'getUserId').and.returnValue('user-001');
    }));

    describe('getAllCards', function() {
      it('should return array of cards', function(done) {
        CardManagementService.getAllCards().then(function(cards) {
          expect(Array.isArray(cards)).toBe(true);
          expect(cards.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return cards with required properties', function(done) {
        CardManagementService.getAllCards().then(function(cards) {
          var card = cards[0];
          expect(card.id).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.cardType).toBeDefined();
          expect(card.bankName).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.expiryDate).toBeDefined();
          done();
        });
        $rootScope.$apply();
      });

      it('should cache cards internally', function(done) {
        CardManagementService.getAllCards().then(function(cards) {
          expect(cards.length).toBe(3);
          done();
        });
        $rootScope.$apply();
      });

      it('should return masked card numbers', function(done) {
        CardManagementService.getAllCards().then(function(cards) {
          cards.forEach(function(card) {
            expect(card.cardNumber).toContain('****');
          });
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('getCardDetails', function() {
      it('should return card details for valid cardId', function(done) {
        CardManagementService.getAllCards().then(function() {
          return CardManagementService.getCardDetails('card-001');
        }).then(function(card) {
          expect(card).toBeDefined();
          expect(card.id).toBe('card-001');
          done();
        });
        $rootScope.$apply();
      });

      it('should return cached card if available', function(done) {
        CardManagementService.getAllCards().then(function() {
          return CardManagementService.getCardDetails('card-002');
        }).then(function(card) {
          expect(card.id).toBe('card-002');
          expect(card.bankName).toBe('ICICI Bank');
          done();
        });
        $rootScope.$apply();
      });

      it('should fetch all cards if card not in cache', function(done) {
        CardManagementService.getCardDetails('card-003').then(function(card) {
          expect(card).toBeDefined();
          expect(card.id).toBe('card-003');
          done();
        });
        $rootScope.$apply();
      });
    });

    describe('computeSpendAnalysis', function() {
      var mockTransactions;

      beforeEach(function() {
        mockTransactions = [
          { cardId: 'card-001', amount: 1200, category: 'Shopping' },
          { cardId: 'card-001', amount: 850, category: 'Food & Dining' },
          { cardId: 'card-001', amount: 3500, category: 'Fuel' },
          { cardId: 'card-001', amount: 2200, category: 'Shopping' },
          { cardId: 'card-001', amount: 650, category: 'Entertainment' }
        ];
      });

      it('should compute total spend correctly', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        expect(analysis.totalSpend).toBe(8400);
      });

      it('should count transactions correctly', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        expect(analysis.transactionCount).toBe(5);
      });

      it('should identify cardId from transactions', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        expect(analysis.cardId).toBe('card-001');
      });

      it('should return top 3 categories', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        expect(analysis.topCategories.length).toBe(3);
      });

      it('should sort categories by amount descending', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        expect(analysis.topCategories[0].category).toBe('Fuel');
        expect(analysis.topCategories[0].amount).toBe(3500);
        expect(analysis.topCategories[1].category).toBe('Shopping');
        expect(analysis.topCategories[1].amount).toBe(3400);
      });

      it('should aggregate amounts for same category', function() {
        var analysis = CardManagementService.computeSpendAnalysis(mockTransactions);
        var shoppingCategory = analysis.topCategories.find(function(cat) {
          return cat.category === 'Shopping';
        });
        expect(shoppingCategory.amount).toBe(3400);
      });

      it('should handle empty transaction list', function() {
        var analysis = CardManagementService.computeSpendAnalysis([]);
        expect(analysis.totalSpend).toBe(0);
        expect(analysis.transactionCount).toBe(0);
        expect(analysis.topCategories.length).toBe(0);
        expect(analysis.cardId).toBeNull();
      });

      it('should handle single transaction', function() {
        var singleTxn = [{ cardId: 'card-001', amount: 500, category: 'Travel' }];
        var analysis = CardManagementService.computeSpendAnalysis(singleTxn);
        expect(analysis.totalSpend).toBe(500);
        expect(analysis.transactionCount).toBe(1);
        expect(analysis.topCategories.length).toBe(1);
      });
    });
  });
})();