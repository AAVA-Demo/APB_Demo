/*
Test Documentation:
- Test Name: CategoryService Unit Tests
- Purpose: Validate category service functionality including category retrieval, caching, and error handling
- Scenario: Tests cover successful category fetch, cache behavior, fallback to default categories on error
- Expected Result: Categories should be retrieved correctly with proper caching and fallback mechanisms
*/

(function() {
  'use strict';

  describe('CategoryService', function() {
    var CategoryService, $httpBackend, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryService_, _$httpBackend_, _API_CONFIG_) {
      CategoryService = _CategoryService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCategories', function() {
      it('should fetch categories from API successfully', function(done) {
        var mockCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(200, mockCategories);

        CategoryService.getCategories().then(function(categories) {
          expect(categories).toEqual(mockCategories);
          expect(categories.length).toBe(5);
          done();
        });

        $httpBackend.flush();
      });

      it('should return cached categories on subsequent calls', function(done) {
        var mockCategories = ['Food & Dining', 'Fuel', 'Shopping'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(200, mockCategories);

        CategoryService.getCategories().then(function(firstCall) {
          expect(firstCall).toEqual(mockCategories);

          CategoryService.getCategories().then(function(secondCall) {
            expect(secondCall).toEqual(mockCategories);
            expect(secondCall).toBe(firstCall);
            done();
          });
        });

        $httpBackend.flush();
      });

      it('should return default categories when API call fails', function(done) {
        var defaultCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(500, { error: 'Server error' });

        CategoryService.getCategories().then(function(categories) {
          expect(categories).toEqual(defaultCategories);
          expect(categories.length).toBe(9);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network timeout gracefully', function(done) {
        var defaultCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(0, '');

        CategoryService.getCategories().then(function(categories) {
          expect(categories).toEqual(defaultCategories);
          done();
        });

        $httpBackend.flush();
      });

      it('should cache default categories after API failure', function(done) {
        var defaultCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(500, { error: 'Server error' });

        CategoryService.getCategories().then(function(firstCall) {
          expect(firstCall).toEqual(defaultCategories);

          CategoryService.getCategories().then(function(secondCall) {
            expect(secondCall).toEqual(defaultCategories);
            expect(secondCall).toBe(firstCall);
            done();
          });
        });

        $httpBackend.flush();
      });

      it('should return all predefined categories in correct order', function(done) {
        var mockCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];

        $httpBackend.expectGET(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CATEGORIES)
          .respond(200, mockCategories);

        CategoryService.getCategories().then(function(categories) {
          expect(categories[0]).toBe('Food & Dining');
          expect(categories[8]).toBe('Miscellaneous');
          expect(categories.indexOf('Healthcare')).toBe(6);
          done();
        });

        $httpBackend.flush();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: getCategories
- Scenarios covered:
  * Successful API call with category retrieval
  * Cache hit on subsequent calls
  * API failure with fallback to default categories
  * Network timeout handling
  * Caching of default categories after failure
  * Predefined category order validation
- Uncovered scenarios: Custom category creation (out of scope), category modification
- Edge cases tested: Network failures, server errors, cache behavior, default fallback
*/