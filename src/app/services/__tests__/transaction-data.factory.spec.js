/*
Test Documentation:
- Test Name: TransactionDataFactory - Multiple Methods
- Purpose: Validates transaction data retrieval, filtering, pagination, and individual transaction lookup
- Scenario: Factory provides comprehensive transaction management capabilities
- Expected Result: All methods return properly structured transaction data with correct pagination and filtering
*/
/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions, getTransactions, fetchTransactions, getTransactionById
- Scenarios covered: data retrieval, filtering by card, pagination, individual lookup, date filtering, data structure validation
- Edge cases: invalid transaction IDs, empty filters, boundary pagination, data immutability
- Uncovered scenarios: HTTP error handling (not applicable for mock implementation)
*/

(function() {
  'use strict';

  describe('TransactionDataFactory', function() {
    var TransactionDataFactory, $q, $timeout, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TransactionDataFactory_, _$q_, _$timeout_, _API_CONFIG_) {
      TransactionDataFactory = _TransactionDataFactory_;
      $q = _$q_;
      $timeout = _$timeout_;
      API_CONFIG = _API_CONFIG_;
    }));

    describe('getCurrentMonthTransactions', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Validates that getCurrentMonthTransactions returns a promise
      - Scenario: Call getCurrentMonthTransactions method
      - Expected Result: Returns object with then method
      */
      it('should return a promise', function() {
        var result = TransactionDataFactory.getCurrentMonthTransactions();
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      /*
      Test Documentation:
      - Test Name: should resolve with an array of transactions
      - Purpose: Validates successful data retrieval
      - Scenario: Call getCurrentMonthTransactions and wait for resolution
      - Expected Result: Promise resolves with array of transaction objects
      */
      it('should resolve with an array of transactions', function(done) {
        TransactionDataFactory.getCurrentMonthTransactions().then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBeGreaterThanOrEqual(0);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should filter transactions for current month only
      - Purpose: Validates month filtering logic
      - Scenario: Retrieve current month transactions and verify dates
      - Expected Result: All transactions are from the current month
      */
      it('should filter transactions for current month only', function(done) {
        var currentMonth = new Date().getMonth();
        TransactionDataFactory.getCurrentMonthTransactions().then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.transactionDate.getMonth()).toBe(currentMonth);
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return transactions with all required fields
      - Purpose: Validates data structure integrity
      - Scenario: Retrieve transactions and verify required properties
      - Expected Result: Each transaction contains all mandatory fields
      */
      it('should return transactions with all required fields', function(done) {
        TransactionDataFactory.getCurrentMonthTransactions().then(function(transactions) {
          if (transactions.length > 0) {
            transactions.forEach(function(txn) {
              expect(txn.transactionId).toBeDefined();
              expect(txn.cardId).toBeDefined();
              expect(txn.cardName).toBeDefined();
              expect(txn.merchantName).toBeDefined();
              expect(txn.merchantCategory).toBeDefined();
              expect(txn.amount).toBeDefined();
              expect(txn.currency).toBeDefined();
              expect(txn.transactionDate).toBeDefined();
              expect(txn.postingDate).toBeDefined();
              expect(txn.status).toBeDefined();
              expect(txn.description).toBeDefined();
              expect(txn.referenceNumber).toBeDefined();
            });
          }
          done();
        });
        $timeout.flush();
      });
    });

    describe('getTransactions', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Validates that getTransactions returns a promise
      - Scenario: Call getTransactions method
      - Expected Result: Returns object with then method
      */
      it('should return a promise', function() {
        var result = TransactionDataFactory.getTransactions({});
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
      });

      /*
      Test Documentation:
      - Test Name: should resolve with all transactions
      - Purpose: Validates retrieval of complete transaction dataset
      - Scenario: Call getTransactions without filters
      - Expected Result: Returns array with 120 transactions
      */
      it('should resolve with all transactions', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          expect(Array.isArray(transactions)).toBe(true);
          expect(transactions.length).toBe(120);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return transactions with correct data types
      - Purpose: Validates data type consistency
      - Scenario: Verify numeric, string, and date fields have correct types
      - Expected Result: All fields have appropriate data types
      */
      it('should return transactions with correct data types', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          var txn = transactions[0];
          expect(typeof txn.transactionId).toBe('string');
          expect(typeof txn.cardId).toBe('string');
          expect(typeof txn.merchantName).toBe('string');
          expect(typeof txn.amount).toBe('number');
          expect(txn.transactionDate instanceof Date).toBe(true);
          expect(txn.postingDate instanceof Date).toBe(true);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should include predefined transactions
      - Purpose: Validates presence of known test data
      - Scenario: Retrieve all transactions and check for TXN001
      - Expected Result: TXN001 exists with correct Starbucks details
      */
      it('should include predefined transactions', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          var txn001 = transactions.find(function(t) { return t.transactionId === 'TXN001'; });
          expect(txn001).toBeDefined();
          expect(txn001.merchantName).toBe('Starbucks');
          expect(txn001.merchantCategory).toBe('Food & Dining');
          expect(txn001.amount).toBe(450);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should include all spending categories
      - Purpose: Validates category diversity in dataset
      - Scenario: Retrieve transactions and verify all 9 categories exist
      - Expected Result: All categories present in transaction data
      */
      it('should include all spending categories', function(done) {
        var expectedCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          var foundCategories = [];
          transactions.forEach(function(txn) {
            if (foundCategories.indexOf(txn.merchantCategory) === -1) {
              foundCategories.push(txn.merchantCategory);
            }
          });
          expectedCategories.forEach(function(cat) {
            expect(foundCategories.indexOf(cat)).toBeGreaterThan(-1);
          });
          done();
        });
        $timeout.flush();
      });
    });

    describe('fetchTransactions', function() {
      /*
      Test Documentation:
      - Test Name: should return paginated results
      - Purpose: Validates pagination functionality
      - Scenario: Fetch first page with 50 records per page
      - Expected Result: Returns 50 transactions with pagination metadata
      */
      it('should return paginated results', function(done) {
        TransactionDataFactory.fetchTransactions(1, 50, {}).then(function(response) {
          expect(response.transactions).toBeDefined();
          expect(response.pagination).toBeDefined();
          expect(response.transactions.length).toBe(50);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return correct pagination metadata
      - Purpose: Validates pagination object structure and values
      - Scenario: Fetch page 1 with pageSize 50
      - Expected Result: Pagination contains currentPage, pageSize, totalRecords, totalPages, hasNextPage, hasPreviousPage
      */
      it('should return correct pagination metadata', function(done) {
        TransactionDataFactory.fetchTransactions(1, 50, {}).then(function(response) {
          var pagination = response.pagination;
          expect(pagination.currentPage).toBe(1);
          expect(pagination.pageSize).toBe(50);
          expect(pagination.totalRecords).toBe(120);
          expect(pagination.totalPages).toBe(3);
          expect(pagination.hasNextPage).toBe(true);
          expect(pagination.hasPreviousPage).toBe(false);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should handle page 2 correctly
      - Purpose: Validates pagination for middle pages
      - Scenario: Fetch page 2 with pageSize 50
      - Expected Result: Returns 50 transactions with correct pagination flags
      */
      it('should handle page 2 correctly', function(done) {
        TransactionDataFactory.fetchTransactions(2, 50, {}).then(function(response) {
          expect(response.transactions.length).toBe(50);
          expect(response.pagination.currentPage).toBe(2);
          expect(response.pagination.hasNextPage).toBe(true);
          expect(response.pagination.hasPreviousPage).toBe(true);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should handle last page correctly
      - Purpose: Validates pagination for final page
      - Scenario: Fetch page 3 with pageSize 50
      - Expected Result: Returns 20 transactions with hasNextPage false
      */
      it('should handle last page correctly', function(done) {
        TransactionDataFactory.fetchTransactions(3, 50, {}).then(function(response) {
          expect(response.transactions.length).toBe(20);
          expect(response.pagination.currentPage).toBe(3);
          expect(response.pagination.hasNextPage).toBe(false);
          expect(response.pagination.hasPreviousPage).toBe(true);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should filter by cardId
      - Purpose: Validates card-based filtering
      - Scenario: Fetch transactions filtered by CC001
      - Expected Result: Returns only transactions for CC001
      */
      it('should filter by cardId', function(done) {
        TransactionDataFactory.fetchTransactions(1, 50, {cardId: 'CC001'}).then(function(response) {
          response.transactions.forEach(function(txn) {
            expect(txn.cardId).toBe('CC001');
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should not filter when cardId is all
      - Purpose: Validates all cards filter option
      - Scenario: Fetch transactions with cardId set to 'all'
      - Expected Result: Returns transactions from all cards
      */
      it('should not filter when cardId is all', function(done) {
        TransactionDataFactory.fetchTransactions(1, 50, {cardId: 'all'}).then(function(response) {
          var cardIds = [];
          response.transactions.forEach(function(txn) {
            if (cardIds.indexOf(txn.cardId) === -1) {
              cardIds.push(txn.cardId);
            }
          });
          expect(cardIds.length).toBeGreaterThan(1);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should handle custom page sizes
      - Purpose: Validates flexible page size configuration
      - Scenario: Fetch transactions with pageSize 10
      - Expected Result: Returns exactly 10 transactions
      */
      it('should handle custom page sizes', function(done) {
        TransactionDataFactory.fetchTransactions(1, 10, {}).then(function(response) {
          expect(response.transactions.length).toBe(10);
          expect(response.pagination.pageSize).toBe(10);
          expect(response.pagination.totalPages).toBe(12);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should resolve after 300ms timeout
      - Purpose: Validates asynchronous behavior timing
      - Scenario: Call fetchTransactions and verify timeout
      - Expected Result: Promise does not resolve before timeout flush
      */
      it('should resolve after 300ms timeout', function() {
        var resolved = false;
        TransactionDataFactory.fetchTransactions(1, 50, {}).then(function() {
          resolved = true;
        });
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });
    });

    describe('getTransactionById', function() {
      /*
      Test Documentation:
      - Test Name: should return a promise
      - Purpose: Validates that getTransactionById returns a promise
      - Scenario: Call getTransactionById method
      - Expected Result: Returns object with then method
      */
      it('should return a promise', function() {
        var result = TransactionDataFactory.getTransactionById('TXN001');
        expect(result).toBeDefined();
        expect(result.then).toBeDefined();
      });

      /*
      Test Documentation:
      - Test Name: should retrieve specific transaction by ID
      - Purpose: Validates individual transaction lookup
      - Scenario: Fetch transaction TXN001
      - Expected Result: Returns correct transaction with all details
      */
      it('should retrieve specific transaction by ID', function(done) {
        TransactionDataFactory.getTransactionById('TXN001').then(function(txn) {
          expect(txn).toBeDefined();
          expect(txn.transactionId).toBe('TXN001');
          expect(txn.merchantName).toBe('Starbucks');
          expect(txn.amount).toBe(450);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should retrieve transaction TXN004 correctly
      - Purpose: Validates retrieval of different transaction
      - Scenario: Fetch transaction TXN004
      - Expected Result: Returns MakeMyTrip travel transaction
      */
      it('should retrieve transaction TXN004 correctly', function(done) {
        TransactionDataFactory.getTransactionById('TXN004').then(function(txn) {
          expect(txn).toBeDefined();
          expect(txn.transactionId).toBe('TXN004');
          expect(txn.merchantName).toBe('MakeMyTrip');
          expect(txn.merchantCategory).toBe('Travel');
          expect(txn.amount).toBe(15000);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return undefined for non-existent transaction
      - Purpose: Validates error handling for invalid IDs
      - Scenario: Fetch transaction with non-existent ID
      - Expected Result: Returns undefined
      */
      it('should return undefined for non-existent transaction', function(done) {
        TransactionDataFactory.getTransactionById('INVALID_ID').then(function(txn) {
          expect(txn).toBeUndefined();
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should return immutable data (deep copy)
      - Purpose: Validates data immutability
      - Scenario: Retrieve transaction, modify it, retrieve again
      - Expected Result: Second retrieval returns unmodified data
      */
      it('should return immutable data (deep copy)', function(done) {
        TransactionDataFactory.getTransactionById('TXN001').then(function(txn1) {
          txn1.merchantName = 'Modified Merchant';
          TransactionDataFactory.getTransactionById('TXN001').then(function(txn2) {
            expect(txn2.merchantName).toBe('Starbucks');
            done();
          });
          $timeout.flush();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should resolve after 200ms timeout
      - Purpose: Validates asynchronous behavior timing
      - Scenario: Call getTransactionById and verify timeout
      - Expected Result: Promise resolves after timeout flush
      */
      it('should resolve after 200ms timeout', function() {
        var resolved = false;
        TransactionDataFactory.getTransactionById('TXN001').then(function() {
          resolved = true;
        });
        expect(resolved).toBe(false);
        $timeout.flush();
        expect(resolved).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should retrieve generated transactions
      - Purpose: Validates dynamically generated transaction data
      - Scenario: Fetch transaction TXN050 (generated)
      - Expected Result: Returns valid transaction with proper structure
      */
      it('should retrieve generated transactions', function(done) {
        TransactionDataFactory.getTransactionById('TXN050').then(function(txn) {
          expect(txn).toBeDefined();
          expect(txn.transactionId).toBe('TXN050');
          expect(txn.currency).toBe('INR');
          expect(txn.status).toBe('Posted');
          done();
        });
        $timeout.flush();
      });
    });

    describe('Data Integrity', function() {
      /*
      Test Documentation:
      - Test Name: should have consistent transaction IDs
      - Purpose: Validates uniqueness of transaction IDs
      - Scenario: Retrieve all transactions and check for duplicates
      - Expected Result: All transaction IDs are unique
      */
      it('should have consistent transaction IDs', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          var ids = transactions.map(function(t) { return t.transactionId; });
          var uniqueIds = ids.filter(function(id, index) {
            return ids.indexOf(id) === index;
          });
          expect(ids.length).toBe(uniqueIds.length);
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should have valid amounts
      - Purpose: Validates transaction amounts are positive numbers
      - Scenario: Retrieve transactions and verify amounts
      - Expected Result: All amounts are positive numbers
      */
      it('should have valid amounts', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.amount).toBeGreaterThan(0);
            expect(typeof txn.amount).toBe('number');
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should have valid card IDs
      - Purpose: Validates card IDs match expected values
      - Scenario: Retrieve transactions and verify card IDs
      - Expected Result: All card IDs are CC001, CC002, or CC003
      */
      it('should have valid card IDs', function(done) {
        var validCardIds = ['CC001', 'CC002', 'CC003'];
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(validCardIds.indexOf(txn.cardId)).toBeGreaterThan(-1);
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should have INR currency for all transactions
      - Purpose: Validates currency consistency
      - Scenario: Retrieve transactions and verify currency
      - Expected Result: All transactions use INR currency
      */
      it('should have INR currency for all transactions', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.currency).toBe('INR');
          });
          done();
        });
        $timeout.flush();
      });

      /*
      Test Documentation:
      - Test Name: should have Posted status for all transactions
      - Purpose: Validates transaction status consistency
      - Scenario: Retrieve transactions and verify status
      - Expected Result: All transactions have Posted status
      */
      it('should have Posted status for all transactions', function(done) {
        TransactionDataFactory.getTransactions({}).then(function(transactions) {
          transactions.forEach(function(txn) {
            expect(txn.status).toBe('Posted');
          });
          done();
        });
        $timeout.flush();
      });
    });
  });
})();