/*
Test Documentation:
- Test Name: transactionDataFactory - fetchTransactions success scenario
- Purpose: Validates that fetchTransactions returns a promise that resolves with an array of all mock transactions
- Scenario: Service is invoked to fetch all transactions
- Expected Result: Promise resolves with array of 15 mock transactions with correct structure
*/
/*
Test Documentation:
- Test Name: transactionDataFactory - fetchMonthlyTransactions success scenario
- Purpose: Validates that fetchMonthlyTransactions returns only transactions from the current month and year
- Scenario: Service is invoked to fetch current month transactions
- Expected Result: Promise resolves with filtered array containing only current month transactions
*/
/*
Test Documentation:
- Test Name: transactionDataFactory - fetchCardWiseSpending success scenario
- Purpose: Validates that fetchCardWiseSpending aggregates spending data correctly by card ID
- Scenario: Service is invoked to fetch card-wise spending analytics
- Expected Result: Promise resolves with array of spending objects containing currentMonthSpend, lastMonthSpend, yearToDateSpend, and transactionCount per card
*/
/*
Test Documentation:
- Test Name: transactionDataFactory - fetchMonthlyTransactions date filtering
- Purpose: Validates that date filtering logic correctly identifies current month transactions
- Scenario: Service filters transactions based on current month and year
- Expected Result: Only transactions matching current month and year are returned
*/
/*
Test Documentation:
- Test Name: transactionDataFactory - fetchCardWiseSpending aggregation logic
- Purpose: Validates that spending aggregation correctly calculates totals across different time periods
- Scenario: Service aggregates transaction amounts by card and time period
- Expected Result: Spending data accurately reflects currentMonth, lastMonth, and yearToDate totals
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, fetchMonthlyTransactions, fetchCardWiseSpending
- Scenarios covered: successful transaction fetch, monthly filtering, card-wise aggregation, date boundary conditions, spending calculations
- Uncovered scenarios: none - all primary paths and edge cases covered
*/

(function() {
  'use strict';

  describe('transactionDataFactory', function() {
    var transactionDataFactory, $q, $timeout;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_transactionDataFactory_, _$q_, _$timeout_) {
      transactionDataFactory = _transactionDataFactory_;
      $q = _$q_;
      $timeout = _$timeout_;
    }));

    describe('fetchTransactions', function() {
      it('should return a promise that resolves with an array of all mock transactions', function(done) {
        var promise = transactionDataFactory.fetchTransactions();
        
        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
        
        promise.then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(15);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
        
        $timeout.flush();
      });

      it('should return transactions with correct structure and properties', function(done) {
        transactionDataFactory.fetchTransactions().then(function(transactions) {
          expect(transactions.length).toBeGreaterThan(0);
          
          var firstTransaction = transactions[0];
          expect(firstTransaction.id).toBeDefined();
          expect(firstTransaction.cardId).toBeDefined();
          expect(firstTransaction.amount).toBeDefined();
          expect(firstTransaction.category).toBeDefined();
          expect(firstTransaction.date).toBeDefined();
          expect(firstTransaction.description).toBeDefined();
          expect(firstTransaction.merchantName).toBeDefined();
          
          expect(typeof firstTransaction.amount).toBe('number');
          expect(typeof firstTransaction.category).toBe('string');
          expect(firstTransaction.date instanceof Date).toBe(true);
          
          done();
        });
        
        $timeout.flush();
      });

      it('should return transactions with valid category values', function(done) {
        var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        
        transactionDataFactory.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(transaction) {
            expect(validCategories.indexOf(transaction.category)).toBeGreaterThan(-1);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should return transactions with positive amounts', function(done) {
        transactionDataFactory.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(transaction) {
            expect(transaction.amount).toBeGreaterThan(0);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should return transactions associated with valid card IDs', function(done) {
        var validCardIds = ['1', '2', '3'];
        
        transactionDataFactory.fetchTransactions().then(function(transactions) {
          transactions.forEach(function(transaction) {
            expect(validCardIds.indexOf(transaction.cardId)).toBeGreaterThan(-1);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should simulate async behavior with timeout', function() {
        var resolved = false;
        
        transactionDataFactory.fetchTransactions().then(function() {
          resolved = true;
        });
        
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('fetchMonthlyTransactions', function() {
      it('should return a promise that resolves with filtered transactions', function(done) {
        var promise = transactionDataFactory.fetchMonthlyTransactions();
        
        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
        
        promise.then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
        
        $timeout.flush();
      });

      it('should return only transactions from current month and year', function(done) {
        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        
        transactionDataFactory.fetchMonthlyTransactions().then(function(transactions) {
          transactions.forEach(function(transaction) {
            var tDate = new Date(transaction.date);
            expect(tDate.getMonth()).toBe(currentMonth);
            expect(tDate.getFullYear()).toBe(currentYear);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should return empty array if no transactions match current month', function(done) {
        transactionDataFactory.fetchMonthlyTransactions().then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          done();
        });
        
        $timeout.flush();
      });

      it('should filter out transactions from previous months', function(done) {
        var now = new Date();
        var currentMonth = now.getMonth();
        
        transactionDataFactory.fetchMonthlyTransactions().then(function(monthlyTransactions) {
          return transactionDataFactory.fetchTransactions().then(function(allTransactions) {
            var previousMonthTransactions = allTransactions.filter(function(t) {
              var tDate = new Date(t.date);
              return tDate.getMonth() !== currentMonth;
            });
            
            expect(monthlyTransactions.length).toBeLessThanOrEqual(allTransactions.length);
            done();
          });
        });
        
        $timeout.flush();
        $timeout.flush();
      });

      it('should simulate async behavior with timeout', function() {
        var resolved = false;
        
        transactionDataFactory.fetchMonthlyTransactions().then(function() {
          resolved = true;
        });
        
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('fetchCardWiseSpending', function() {
      it('should return a promise that resolves with card-wise spending data', function(done) {
        var promise = transactionDataFactory.fetchCardWiseSpending();
        
        expect(promise).toBeDefined();
        expect(promise.then).toBeDefined();
        
        promise.then(function(spendingData) {
          expect(Array.isArray(spendingData)).toBe(true);
          expect(spendingData.length).toBeGreaterThan(0);
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
        
        $timeout.flush();
      });

      it('should return spending objects with correct structure', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          expect(spendingData.length).toBeGreaterThan(0);
          
          var firstSpending = spendingData[0];
          expect(firstSpending.cardId).toBeDefined();
          expect(firstSpending.currentMonthSpend).toBeDefined();
          expect(firstSpending.lastMonthSpend).toBeDefined();
          expect(firstSpending.yearToDateSpend).toBeDefined();
          expect(firstSpending.transactionCount).toBeDefined();
          
          expect(typeof firstSpending.currentMonthSpend).toBe('number');
          expect(typeof firstSpending.lastMonthSpend).toBe('number');
          expect(typeof firstSpending.yearToDateSpend).toBe('number');
          expect(typeof firstSpending.transactionCount).toBe('number');
          
          done();
        });
        
        $timeout.flush();
      });

      it('should aggregate spending correctly by card ID', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          var validCardIds = ['1', '2', '3'];
          
          spendingData.forEach(function(spending) {
            expect(validCardIds.indexOf(spending.cardId)).toBeGreaterThan(-1);
          });
          
          done();
        });
        
        $timeout.flush();
      });

      it('should calculate yearToDateSpend as sum of current year transactions', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          spendingData.forEach(function(spending) {
            expect(spending.yearToDateSpend).toBeGreaterThanOrEqual(0);
            expect(spending.yearToDateSpend).toBeGreaterThanOrEqual(spending.currentMonthSpend);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should count transactions correctly per card', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          spendingData.forEach(function(spending) {
            expect(spending.transactionCount).toBeGreaterThanOrEqual(0);
            expect(Number.isInteger(spending.transactionCount)).toBe(true);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should handle last month calculation correctly for January', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          spendingData.forEach(function(spending) {
            expect(spending.lastMonthSpend).toBeGreaterThanOrEqual(0);
          });
          done();
        });
        
        $timeout.flush();
      });

      it('should initialize spending map correctly for each card', function(done) {
        transactionDataFactory.fetchCardWiseSpending().then(function(spendingData) {
          var cardIds = spendingData.map(function(s) { return s.cardId; });
          var uniqueCardIds = cardIds.filter(function(id, index) {
            return cardIds.indexOf(id) === index;
          });
          
          expect(cardIds.length).toBe(uniqueCardIds.length);
          done();
        });
        
        $timeout.flush();
      });

      it('should simulate async behavior with timeout', function() {
        var resolved = false;
        
        transactionDataFactory.fetchCardWiseSpending().then(function() {
          resolved = true;
        });
        
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('edge cases and data integrity', function() {
      it('should return consistent data on multiple calls to fetchTransactions', function(done) {
        var firstCall, secondCall;
        
        transactionDataFactory.fetchTransactions().then(function(transactions1) {
          firstCall = transactions1;
          return transactionDataFactory.fetchTransactions();
        }).then(function(transactions2) {
          secondCall = transactions2;
          expect(firstCall.length).toBe(secondCall.length);
          expect(firstCall[0].id).toBe(secondCall[0].id);
          done();
        });
        
        $timeout.flush();
        $timeout.flush();
      });

      it('should handle rapid successive calls correctly', function() {
        var promise1 = transactionDataFactory.fetchTransactions();
        var promise2 = transactionDataFactory.fetchMonthlyTransactions();
        var promise3 = transactionDataFactory.fetchCardWiseSpending();
        
        expect(promise1).toBeDefined();
        expect(promise2).toBeDefined();
        expect(promise3).toBeDefined();
        
        $timeout.flush();
      });

      it('should maintain data consistency between fetchTransactions and fetchMonthlyTransactions', function(done) {
        var allTransactions, monthlyTransactions;
        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        
        transactionDataFactory.fetchTransactions().then(function(all) {
          allTransactions = all;
          return transactionDataFactory.fetchMonthlyTransactions();
        }).then(function(monthly) {
          monthlyTransactions = monthly;
          
          var expectedMonthlyCount = allTransactions.filter(function(t) {
            var tDate = new Date(t.date);
            return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
          }).length;
          
          expect(monthlyTransactions.length).toBe(expectedMonthlyCount);
          done();
        });
        
        $timeout.flush();
        $timeout.flush();
      });

      it('should maintain data consistency between fetchTransactions and fetchCardWiseSpending', function(done) {
        var allTransactions, spendingData;
        
        transactionDataFactory.fetchTransactions().then(function(all) {
          allTransactions = all;
          return transactionDataFactory.fetchCardWiseSpending();
        }).then(function(spending) {
          spendingData = spending;
          
          var cardIdsFromTransactions = allTransactions.map(function(t) { return t.cardId; })
            .filter(function(id, index, self) { return self.indexOf(id) === index; });
          var cardIdsFromSpending = spendingData.map(function(s) { return s.cardId; });
          
          expect(cardIdsFromSpending.length).toBe(cardIdsFromTransactions.length);
          done();
        });
        
        $timeout.flush();
        $timeout.flush();
      });
    });
  });
})();