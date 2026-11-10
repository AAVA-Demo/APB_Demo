/*
Test Documentation:
- Test Name: TransactionDataService - fetchTransactions
- Purpose: Validate transaction data retrieval with optional card filtering
- Scenario: Service fetches transactions after session validation, with optional filtering by card IDs
- Expected Result: Returns paginated transaction data with filtering support
*/
/*
Coverage Report:
- Functions tested: fetchTransactions
- Scenarios covered: fetch all transactions, filter by single card, filter by multiple cards, session validation, rejection on auth failure, pagination metadata
- Uncovered scenarios: none
*/

describe('TransactionDataService', function() {
  'use strict';

  var TransactionDataService, AuthService, $q, $rootScope, $timeout;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionDataService_, _AuthService_, _$q_, _$rootScope_, _$timeout_) {
    TransactionDataService = _TransactionDataService_;
    AuthService = _AuthService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  describe('fetchTransactions', function() {
    it('should return a promise', function() {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      var result = TransactionDataService.fetchTransactions();
      expect(result.then).toBeDefined();
      expect(typeof result.then).toBe('function');
    });

    it('should validate session before fetching transactions', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions().then(function() {
        expect(AuthService.validateSession).toHaveBeenCalled();
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should fetch all transactions when no cardIds provided', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions().then(function(response) {
        expect(response.transactions).toBeDefined();
        expect(Array.isArray(response.transactions)).toBe(true);
        expect(response.transactions.length).toBe(10);
        expect(response.totalCount).toBe(10);
        expect(response.pageSize).toBe(50);
        expect(response.currentPage).toBe(1);
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should filter transactions by single cardId', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions(['CC001']).then(function(response) {
        expect(response.transactions.length).toBeGreaterThan(0);
        response.transactions.forEach(function(txn) {
          expect(txn.cardId).toBe('CC001');
        });
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should filter transactions by multiple cardIds', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions(['CC001', 'CC002']).then(function(response) {
        expect(response.transactions.length).toBeGreaterThan(0);
        response.transactions.forEach(function(txn) {
          expect(['CC001', 'CC002']).toContain(txn.cardId);
        });
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should reject when session validation fails', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.reject({valid: false, message: 'Auth failed'}));
      TransactionDataService.fetchTransactions().catch(function(error) {
        expect(error.valid).toBe(false);
        done();
      });
      $rootScope.$apply();
    });

    it('should include complete transaction details', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions().then(function(response) {
        var txn = response.transactions[0];
        expect(txn.transactionId).toBeDefined();
        expect(txn.cardId).toBeDefined();
        expect(txn.cardNumber).toBeDefined();
        expect(txn.amount).toBeDefined();
        expect(txn.currency).toBeDefined();
        expect(txn.category).toBeDefined();
        expect(txn.date).toBeDefined();
        expect(txn.description).toBeDefined();
        expect(txn.merchantName).toBeDefined();
        expect(txn.status).toBeDefined();
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should return empty array when filtering by non-existent cardId', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions(['CC999']).then(function(response) {
        expect(response.transactions.length).toBe(0);
        expect(response.totalCount).toBe(0);
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });

    it('should include all expected transaction categories', function(done) {
      spyOn(AuthService, 'validateSession').and.returnValue($q.resolve({valid: true}));
      TransactionDataService.fetchTransactions().then(function(response) {
        var categories = response.transactions.map(function(t) { return t.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        done();
      });
      $rootScope.$apply();
      $timeout.flush();
    });
  });
});