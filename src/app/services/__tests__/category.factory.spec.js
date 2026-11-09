/*
Test Documentation:
- Test Name: CategoryFactory Test Suite
- Purpose: Validate category classification service for predefined spending categories
- Scenario: Tests getCategoryMapping method to ensure all 9 categories are returned
- Expected Result: Array of 9 predefined categories returned successfully
*/

(function() {
  'use strict';

  describe('CategoryFactory', function() {
    var CategoryFactory, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryFactory_, _$rootScope_) {
      CategoryFactory = _CategoryFactory_;
      $rootScope = _$rootScope_;
    }));

    describe('getCategoryMapping', function() {
      it('should return all 9 predefined categories', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toBeDefined();
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data.length).toBe(9);
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Food & Dining category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Food & Dining');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Fuel category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Fuel');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Shopping category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Shopping');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Travel category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Travel');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Entertainment category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Entertainment');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Utilities category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Utilities');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Healthcare category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Healthcare');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Education category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Education');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should include Miscellaneous category', function(done) {
        CategoryFactory.getCategoryMapping().then(function(result) {
          expect(result.data).toContain('Miscellaneous');
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should return promise that resolves within expected time', function(done) {
        var startTime = new Date().getTime();

        CategoryFactory.getCategoryMapping().then(function(result) {
          var endTime = new Date().getTime();
          var duration = endTime - startTime;
          expect(duration).toBeGreaterThanOrEqual(200);
          expect(duration).toBeLessThan(400);
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);
      });

      it('should return consistent results on multiple calls', function(done) {
        var firstCall, secondCall;

        CategoryFactory.getCategoryMapping().then(function(result) {
          firstCall = result.data;
          return CategoryFactory.getCategoryMapping();
        }).then(function(result) {
          secondCall = result.data;
          expect(firstCall.length).toBe(secondCall.length);
          expect(firstCall).toEqual(secondCall);
          done();
        });

        setTimeout(function() {
          $rootScope.$apply();
        }, 300);

        setTimeout(function() {
          $rootScope.$apply();
        }, 600);
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getCategoryMapping
- Scenarios covered:
  * Returns all 9 categories
  * Each individual category presence verified
  * Promise resolution timing
  * Consistency across multiple calls
- Edge cases covered:
  * Multiple invocations
  * Timing constraints
- Uncovered scenarios: None - all 9 categories validated individually
*/