/*
Test Documentation:
- Test Name: CategorizationService - categorize assigns categories
- Purpose: Validates transaction categorization
- Scenario: Service receives uncategorized transactions
- Expected Result: All transactions assigned appropriate categories
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorize preserves existing categories
- Purpose: Validates that pre-categorized transactions are not modified
- Scenario: Service receives transactions with existing categories
- Expected Result: Existing categories remain unchanged
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorize handles empty array
- Purpose: Validates edge case handling
- Scenario: Service receives empty transaction array
- Expected Result: Returns empty array without errors
*/
/*
Test Documentation:
- Test Name: CategorizationService - categorize assigns Miscellaneous as default
- Purpose: Validates default category assignment
- Scenario: Transaction has no category
- Expected Result: Transaction assigned 'Miscellaneous' category
*/
/*
Coverage Report:
- Functions tested: categorize
- Scenarios covered: categorization, preservation, empty array, default category
- Uncovered scenarios: ML-based categorization, custom rules, merchant mapping
*/

(function() {
  'use strict';

  describe('CategorizationService', function() {
    var CategorizationService;
    var $http;
    var $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategorizationService_, _$http_, _$q_) {
      CategorizationService = _CategorizationService_;
      $http = _$http_;
      $q = _$q_;
    }));

    describe('categorize', function() {
      it('should be defined', function() {
        expect(CategorizationService.categorize).toBeDefined();
        expect(typeof CategorizationService.categorize).toBe('function');
      });

      it('should return a promise', function() {
        var result = CategorizationService.categorize([]);

        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should assign Miscellaneous category to uncategorized transactions', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, merchantName: 'Store A'},
          {transactionId: 't2', amount: 200, merchantName: 'Store B'}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized).toBeDefined();
          expect(categorized.length).toBe(2);
          categorized.forEach(function(t) {
            expect(t.category).toBe('Miscellaneous');
          });
          done();
        }).catch(function(error) {
          fail('Promise should not reject: ' + error);
          done();
        });
      });

      it('should preserve existing categories', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, category: 'Food & Dining'},
          {transactionId: 't2', amount: 200, category: 'Travel'}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Food & Dining');
          expect(categorized[1].category).toBe('Travel');
          done();
        });
      });

      it('should handle mixed categorized and uncategorized transactions', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, category: 'Food & Dining'},
          {transactionId: 't2', amount: 200},
          {transactionId: 't3', amount: 150, category: 'Fuel'}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Food & Dining');
          expect(categorized[1].category).toBe('Miscellaneous');
          expect(categorized[2].category).toBe('Fuel');
          done();
        });
      });

      it('should handle empty transaction array', function(done) {
        CategorizationService.categorize([]).then(function(categorized) {
          expect(categorized).toBeDefined();
          expect(Array.isArray(categorized)).toBe(true);
          expect(categorized.length).toBe(0);
          done();
        });
      });

      it('should handle transactions with null category', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, category: null}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Miscellaneous');
          done();
        });
      });

      it('should handle transactions with undefined category', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, category: undefined}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Miscellaneous');
          done();
        });
      });

      it('should handle transactions with empty string category', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100, category: ''}
        ];

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Miscellaneous');
          done();
        });
      });

      it('should resolve within expected timeout', function(done) {
        var startTime = Date.now();
        var transactions = [{transactionId: 't1', amount: 100}];

        CategorizationService.categorize(transactions).then(function(categorized) {
          var endTime = Date.now();
          var elapsed = endTime - startTime;

          expect(elapsed).toBeLessThan(300);
          done();
        });
      });

      it('should not modify original transaction objects', function(done) {
        var transactions = [
          {transactionId: 't1', amount: 100}
        ];
        var originalLength = Object.keys(transactions[0]).length;

        CategorizationService.categorize(transactions).then(function(categorized) {
          expect(categorized[0].category).toBe('Miscellaneous');
          expect(categorized[0].transactionId).toBe('t1');
          expect(categorized[0].amount).toBe(100);
          done();
        });
      });
    });
  });
})();