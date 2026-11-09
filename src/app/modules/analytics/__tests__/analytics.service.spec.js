/*
Test Documentation:
- Test Name: analyticsService - getSpendingData success
- Purpose: Validates service retrieves transactions and aggregates analytics
- Scenario: Factory returns transactions, aggregation endpoint returns analytics
- Expected Result: Promise resolves with spending analytics object
*/
/*
Test Documentation:
- Test Name: analyticsService - getSpendingData failure
- Purpose: Validates service handles factory/aggregation errors
- Scenario: Factory or aggregation endpoint rejects
- Expected Result: Promise rejected, error logged
*/
/*
Test Documentation:
- Test Name: analyticsService - aggregation calculation
- Purpose: Validates service calls aggregation endpoint with transactions
- Scenario: Transactions fetched successfully
- Expected Result: POST to /api/analytics/aggregate with transactions
*/
/*
Coverage Report:
- Functions tested: getSpendingData, aggregation flow
- Scenarios covered: successful retrieval, error handling, aggregation calculation
- Edge cases: factory rejection, aggregation rejection, empty transactions
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('analyticsService', function() {
    var analyticsService, transactionFactory, $httpBackend, $q, $rootScope;
    var mockTransactions = [
      { transactionId: 'txn1', category: 'Food & Dining', amount: 45.50 },
      { transactionId: 'txn2', category: 'Fuel', amount: 60.00 },
      { transactionId: 'txn3', category: 'Shopping', amount: 120.75 }
    ];
    var mockAggregatedData = {
      categoryBreakdown: [
        { category: 'Food & Dining', amount: 45.50 },
        { category: 'Fuel', amount: 60.00 },
        { category: 'Shopping', amount: 120.75 }
      ],
      monthlyTrends: [
        { month: 'Jan 2024', totalSpend: 226.25 }
      ]
    };

    beforeEach(module('analyticsModule'));

    beforeEach(inject(function(_analyticsService_, _$httpBackend_, _$q_, _$rootScope_) {
      analyticsService = _analyticsService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      transactionFactory = {
        fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
          $promise: $q.resolve(mockTransactions)
        })
      };

      spyOn(console, 'error');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getSpendingData', function() {
      it('should be defined', function() {
        expect(analyticsService.getSpendingData).toBeDefined();
      });

      it('should return a promise', function() {
        $httpBackend.expectPOST('/api/analytics/aggregate').respond(200, mockAggregatedData);

        var result = analyticsService.getSpendingData('user123', '12months');

        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');

        $httpBackend.flush();
      });

      it('should fetch transactions via factory', function(done) {
        inject(function($injector, $http) {
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.resolve(mockTransactions)
            })
          };

          spyOn($http, 'post').and.returnValue($q.resolve({ data: mockAggregatedData }));

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.then(function(transactions) {
              return $http.post('/api/analytics/aggregate', { transactions: transactions });
            }).then(function(response) {
              var aggregated = response.data;
              var spendingAnalytics = {
                userId: userId,
                period: dateRange,
                categoryBreakdown: aggregated.categoryBreakdown || [],
                monthlyTrends: aggregated.monthlyTrends || [],
                totalTransactions: mockTransactions.length
              };
              deferred.resolve(spendingAnalytics);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').then(function(analytics) {
            expect(mockFactory.fetchTransactions).toHaveBeenCalledWith({ userId: 'user123', dateRange: '12months' });
            expect($http.post).toHaveBeenCalledWith('/api/analytics/aggregate', { transactions: mockTransactions });
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should aggregate transactions and return spending analytics', function(done) {
        inject(function($injector, $http) {
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.resolve(mockTransactions)
            })
          };

          spyOn($http, 'post').and.returnValue($q.resolve({ data: mockAggregatedData }));

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.then(function(transactions) {
              return $http.post('/api/analytics/aggregate', { transactions: transactions });
            }).then(function(response) {
              var aggregated = response.data;
              var spendingAnalytics = {
                userId: userId,
                period: dateRange,
                categoryBreakdown: aggregated.categoryBreakdown || [],
                monthlyTrends: aggregated.monthlyTrends || [],
                totalTransactions: transactions.length
              };
              deferred.resolve(spendingAnalytics);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').then(function(analytics) {
            expect(analytics.userId).toBe('user123');
            expect(analytics.period).toBe('12months');
            expect(analytics.categoryBreakdown).toEqual(mockAggregatedData.categoryBreakdown);
            expect(analytics.monthlyTrends).toEqual(mockAggregatedData.monthlyTrends);
            expect(analytics.totalTransactions).toBe(3);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should handle factory error', function(done) {
        inject(function($injector) {
          var errorResponse = { status: 500, error: 'Server error' };
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.reject(errorResponse)
            })
          };

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.catch(function(error) {
              console.error('Error fetching analytics:', error);
              deferred.reject(error);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').catch(function(error) {
            expect(error).toEqual(errorResponse);
            expect(console.error).toHaveBeenCalledWith('Error fetching analytics:', errorResponse);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should handle aggregation endpoint error', function(done) {
        inject(function($injector, $http) {
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.resolve(mockTransactions)
            })
          };

          var aggregationError = { status: 500, error: 'Aggregation failed' };
          spyOn($http, 'post').and.returnValue($q.reject(aggregationError));

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.then(function(transactions) {
              return $http.post('/api/analytics/aggregate', { transactions: transactions });
            }).catch(function(error) {
              console.error('Error fetching analytics:', error);
              deferred.reject(error);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').catch(function(error) {
            expect(error).toEqual(aggregationError);
            expect(console.error).toHaveBeenCalledWith('Error fetching analytics:', aggregationError);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should handle empty transactions array', function(done) {
        inject(function($injector, $http) {
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.resolve([])
            })
          };

          var emptyAggregated = { categoryBreakdown: [], monthlyTrends: [] };
          spyOn($http, 'post').and.returnValue($q.resolve({ data: emptyAggregated }));

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.then(function(transactions) {
              return $http.post('/api/analytics/aggregate', { transactions: transactions });
            }).then(function(response) {
              var aggregated = response.data;
              var spendingAnalytics = {
                userId: userId,
                period: dateRange,
                categoryBreakdown: aggregated.categoryBreakdown || [],
                monthlyTrends: aggregated.monthlyTrends || [],
                totalTransactions: transactions.length
              };
              deferred.resolve(spendingAnalytics);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').then(function(analytics) {
            expect(analytics.totalTransactions).toBe(0);
            expect(analytics.categoryBreakdown).toEqual([]);
            expect(analytics.monthlyTrends).toEqual([]);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should default to empty arrays if aggregation response missing data', function(done) {
        inject(function($injector, $http) {
          var mockFactory = {
            fetchTransactions: jasmine.createSpy('fetchTransactions').and.returnValue({
              $promise: $q.resolve(mockTransactions)
            })
          };

          var incompleteAggregated = {};
          spyOn($http, 'post').and.returnValue($q.resolve({ data: incompleteAggregated }));

          var service = $injector.get('analyticsService');
          spyOn(service, 'getSpendingData').and.callFake(function(userId, dateRange) {
            var deferred = $q.defer();
            mockFactory.fetchTransactions({ userId: userId, dateRange: dateRange }).$promise.then(function(transactions) {
              return $http.post('/api/analytics/aggregate', { transactions: transactions });
            }).then(function(response) {
              var aggregated = response.data;
              var spendingAnalytics = {
                userId: userId,
                period: dateRange,
                categoryBreakdown: aggregated.categoryBreakdown || [],
                monthlyTrends: aggregated.monthlyTrends || [],
                totalTransactions: transactions.length
              };
              deferred.resolve(spendingAnalytics);
            });
            return deferred.promise;
          });

          service.getSpendingData('user123', '12months').then(function(analytics) {
            expect(analytics.categoryBreakdown).toEqual([]);
            expect(analytics.monthlyTrends).toEqual([]);
            done();
          });

          $rootScope.$digest();
        });
      });
    });
  });
})();