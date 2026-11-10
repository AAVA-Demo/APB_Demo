/*
Test Documentation:
- Test Name: KPIDataProviderService - setTransactionData
- Purpose: Validates transaction data storage
- Scenario: Transaction data is set
- Expected Result: Data is stored internally
*/
/*
Test Documentation:
- Test Name: KPIDataProviderService - getTransactionData success
- Purpose: Validates transaction data retrieval when data exists
- Scenario: Data has been previously set
- Expected Result: Promise resolves with stored data
*/
/*
Test Documentation:
- Test Name: KPIDataProviderService - getTransactionData failure
- Purpose: Validates error handling when no data exists
- Scenario: No data has been set
- Expected Result: Promise rejects with error message
*/
/*
Coverage Report:
- Functions tested: setTransactionData, getTransactionData
- Scenarios covered: data storage, successful retrieval, failed retrieval, null data, empty array
- Edge cases: null data, undefined data, empty arrays, large datasets
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('KPIDataProviderService', function() {
    var KPIDataProviderService, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_KPIDataProviderService_, _$rootScope_) {
      KPIDataProviderService = _KPIDataProviderService_;
      $rootScope = _$rootScope_;
    }));

    describe('setTransactionData', function() {
      it('should store transaction data', function() {
        var testData = [
          { transactionId: 'txn-001', amount: 100, category: 'Food' },
          { transactionId: 'txn-002', amount: 200, category: 'Fuel' }
        ];
        
        expect(function() {
          KPIDataProviderService.setTransactionData(testData);
        }).not.toThrow();
      });

      it('should accept null as transaction data', function() {
        expect(function() {
          KPIDataProviderService.setTransactionData(null);
        }).not.toThrow();
      });

      it('should accept undefined as transaction data', function() {
        expect(function() {
          KPIDataProviderService.setTransactionData(undefined);
        }).not.toThrow();
      });

      it('should accept empty array as transaction data', function() {
        expect(function() {
          KPIDataProviderService.setTransactionData([]);
        }).not.toThrow();
      });

      it('should overwrite previously set data', function() {
        var firstData = [{ transactionId: 'txn-001', amount: 100 }];
        var secondData = [{ transactionId: 'txn-002', amount: 200 }];
        
        KPIDataProviderService.setTransactionData(firstData);
        KPIDataProviderService.setTransactionData(secondData);
        
        var result;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result = data;
        });
        $rootScope.$apply();
        
        expect(result).toEqual(secondData);
        expect(result).not.toEqual(firstData);
      });
    });

    describe('getTransactionData', function() {
      it('should return promise that resolves with transaction data when data exists', function() {
        var testData = [
          { transactionId: 'txn-001', amount: 100, category: 'Food' },
          { transactionId: 'txn-002', amount: 200, category: 'Fuel' }
        ];
        
        KPIDataProviderService.setTransactionData(testData);
        
        var result;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result = data;
        });
        $rootScope.$apply();
        
        expect(result).toEqual(testData);
      });

      it('should return promise that rejects when no data has been set', function() {
        var errorResult;
        KPIDataProviderService.getTransactionData().catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();
        
        expect(errorResult).toBe('No transaction data available');
      });

      it('should reject with error message when data is null', function() {
        KPIDataProviderService.setTransactionData(null);
        
        var errorResult;
        KPIDataProviderService.getTransactionData().catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();
        
        expect(errorResult).toBe('No transaction data available');
      });

      it('should reject with error message when data is undefined', function() {
        KPIDataProviderService.setTransactionData(undefined);
        
        var errorResult;
        KPIDataProviderService.getTransactionData().catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();
        
        expect(errorResult).toBe('No transaction data available');
      });

      it('should resolve with empty array when empty array was set', function() {
        KPIDataProviderService.setTransactionData([]);
        
        var result;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result = data;
        });
        $rootScope.$apply();
        
        expect(result).toEqual([]);
      });

      it('should handle large transaction datasets', function() {
        var largeDataset = [];
        for (var i = 0; i < 1000; i++) {
          largeDataset.push({
            transactionId: 'txn-' + i,
            amount: Math.random() * 1000,
            category: 'Category-' + (i % 10)
          });
        }
        
        KPIDataProviderService.setTransactionData(largeDataset);
        
        var result;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result = data;
        });
        $rootScope.$apply();
        
        expect(result.length).toBe(1000);
        expect(result).toEqual(largeDataset);
      });

      it('should maintain data integrity with complex transaction objects', function() {
        var complexData = [
          {
            transactionId: 'txn-001',
            amount: 100.50,
            category: 'Food & Dining',
            merchant: 'Test Restaurant',
            date: new Date('2024-01-15'),
            metadata: {
              location: 'New York',
              paymentMethod: 'Credit Card'
            },
            tags: ['business', 'meal']
          }
        ];
        
        KPIDataProviderService.setTransactionData(complexData);
        
        var result;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result = data;
        });
        $rootScope.$apply();
        
        expect(result).toEqual(complexData);
        expect(result[0].metadata.location).toBe('New York');
        expect(result[0].tags).toEqual(['business', 'meal']);
      });
    });

    describe('integration scenarios', function() {
      it('should allow multiple set and get operations', function() {
        var data1 = [{ transactionId: 'txn-001', amount: 100 }];
        var data2 = [{ transactionId: 'txn-002', amount: 200 }];
        var data3 = [{ transactionId: 'txn-003', amount: 300 }];
        
        KPIDataProviderService.setTransactionData(data1);
        var result1;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result1 = data;
        });
        $rootScope.$apply();
        expect(result1).toEqual(data1);
        
        KPIDataProviderService.setTransactionData(data2);
        var result2;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result2 = data;
        });
        $rootScope.$apply();
        expect(result2).toEqual(data2);
        
        KPIDataProviderService.setTransactionData(data3);
        var result3;
        KPIDataProviderService.getTransactionData().then(function(data) {
          result3 = data;
        });
        $rootScope.$apply();
        expect(result3).toEqual(data3);
      });

      it('should handle rapid successive calls', function() {
        var testData = [{ transactionId: 'txn-001', amount: 100 }];
        
        KPIDataProviderService.setTransactionData(testData);
        
        var results = [];
        for (var i = 0; i < 5; i++) {
          KPIDataProviderService.getTransactionData().then(function(data) {
            results.push(data);
          });
        }
        $rootScope.$apply();
        
        expect(results.length).toBe(5);
        results.forEach(function(result) {
          expect(result).toEqual(testData);
        });
      });

      it('should maintain data consistency across promise chains', function() {
        var testData = [{ transactionId: 'txn-001', amount: 100 }];
        
        KPIDataProviderService.setTransactionData(testData);
        
        var result1, result2;
        KPIDataProviderService.getTransactionData()
          .then(function(data) {
            result1 = data;
            return KPIDataProviderService.getTransactionData();
          })
          .then(function(data) {
            result2 = data;
          });
        $rootScope.$apply();
        
        expect(result1).toEqual(testData);
        expect(result2).toEqual(testData);
        expect(result1).toEqual(result2);
      });
    });
  });
})();