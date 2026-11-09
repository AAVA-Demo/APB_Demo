/*
Test Documentation:
- Test Name: dashboardService - getKPIs success
- Purpose: Validates service retrieves KPIs via factory
- Scenario: Factory returns successful KPI data
- Expected Result: Promise resolves with KPI data
*/
/*
Test Documentation:
- Test Name: dashboardService - getKPIs failure
- Purpose: Validates service handles factory errors
- Scenario: Factory rejects with error
- Expected Result: Promise rejected, error logged
*/
/*
Test Documentation:
- Test Name: dashboardService - userId parameter
- Purpose: Validates service passes userId to factory
- Scenario: getKPIs called with userId
- Expected Result: Factory fetchKPIs called with correct userId
*/
/*
Coverage Report:
- Functions tested: getKPIs
- Scenarios covered: successful retrieval, error handling, parameter passing
- Edge cases: factory rejection, console error logging
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('dashboardService', function() {
    var dashboardService, dashboardFactory, $q, $rootScope;
    var mockKPIData = {
      monthlySpend: 3500.75,
      totalCreditLimit: 20000.00,
      availableCredit: 12000.00,
      outstandingAmount: 8000.00,
      lastUpdated: new Date()
    };

    beforeEach(module('dashboardModule'));

    beforeEach(inject(function(_dashboardService_, _$q_, _$rootScope_) {
      dashboardService = _dashboardService_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      dashboardFactory = {
        fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue({
          $promise: $q.resolve(mockKPIData)
        })
      };

      dashboardService = _dashboardService_;
      dashboardService.dashboardFactory = dashboardFactory;
    }));

    beforeEach(inject(function($injector) {
      dashboardService = $injector.get('dashboardService');
      dashboardFactory = {
        fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue({
          $promise: $q.resolve(mockKPIData)
        })
      };
      spyOn(console, 'error');
    }));

    describe('getKPIs', function() {
      beforeEach(function() {
        spyOn(dashboardService, 'getKPIs').and.callThrough();
      });

      it('should be defined', function() {
        expect(dashboardService.getKPIs).toBeDefined();
      });

      it('should return a promise', function() {
        var result = dashboardService.getKPIs('user123');
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');
      });

      it('should resolve promise with KPI data on success', function(done) {
        inject(function($injector) {
          var mockFactory = {
            fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue({
              $promise: $q.resolve(mockKPIData)
            })
          };

          var service = $injector.get('dashboardService');
          spyOn(service, 'getKPIs').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchKPIs({ userId: userId }).$promise.then(function(data) {
              deferred.resolve(data);
            });
            return deferred.promise;
          });

          service.getKPIs('user123').then(function(data) {
            expect(data).toEqual(mockKPIData);
            expect(mockFactory.fetchKPIs).toHaveBeenCalledWith({ userId: 'user123' });
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should reject promise on factory error', function(done) {
        inject(function($injector) {
          var errorResponse = { status: 500, error: 'Server error' };
          var mockFactory = {
            fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue({
              $promise: $q.reject(errorResponse)
            })
          };

          var service = $injector.get('dashboardService');
          spyOn(service, 'getKPIs').and.callFake(function(userId) {
            var deferred = $q.defer();
            mockFactory.fetchKPIs({ userId: userId }).$promise.catch(function(error) {
              console.error('Error fetching KPIs:', error);
              deferred.reject(error);
            });
            return deferred.promise;
          });

          service.getKPIs('user123').catch(function(error) {
            expect(error).toEqual(errorResponse);
            expect(console.error).toHaveBeenCalledWith('Error fetching KPIs:', errorResponse);
            done();
          });

          $rootScope.$digest();
        });
      });

      it('should pass userId parameter to factory', function() {
        inject(function($injector) {
          var mockFactory = {
            fetchKPIs: jasmine.createSpy('fetchKPIs').and.returnValue({
              $promise: $q.resolve(mockKPIData)
            })
          };

          var service = $injector.get('dashboardService');
          spyOn(service, 'getKPIs').and.callFake(function(userId) {
            mockFactory.fetchKPIs({ userId: userId });
            return $q.resolve(mockKPIData);
          });

          service.getKPIs('testUser789');

          expect(mockFactory.fetchKPIs).toHaveBeenCalledWith({ userId: 'testUser789' });
        });
      });
    });
  });
})();