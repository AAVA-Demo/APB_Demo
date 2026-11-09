/*
Test Documentation:
- Test Name: CategoryAPI Factory - fetchCategories success
- Purpose: Validates that fetchCategories successfully retrieves category data
- Scenario: Valid userId provided, API returns success response with categories
- Expected Result: Promise resolves with category data array
*/
/*
Test Documentation:
- Test Name: CategoryAPI Factory - fetchCategories API error
- Purpose: Validates error handling when API call fails
- Scenario: API returns error response
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: CategoryAPI Factory - fetchCategories with empty result
- Purpose: Validates handling when user has no categories
- Scenario: API returns empty array
- Expected Result: Promise resolves with empty array
*/
/*
Coverage Report:
- Functions tested: fetchCategories
- Scenarios covered: success response, API error, empty result, invalid userId, error logging
- Uncovered scenarios: category data validation (business logic layer responsibility)
*/

(function() {
  'use strict';

  describe('CategoryAPI Factory', function() {
    var CategoryAPI, $httpBackend, $q, API_CONFIG;
    var baseUrl = 'https://api.creditcard.demo';
    var categoriesEndpoint = '/api/categories';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CategoryAPI_, _$httpBackend_, _$q_, _API_CONFIG_) {
      CategoryAPI = _CategoryAPI_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('fetchCategories', function() {
      it('should successfully fetch categories with valid userId', function() {
        var userId = 'user123';
        var mockResponse = [
          { categoryId: 'cat1', categoryName: 'Food & Dining', totalAmount: 1500 },
          { categoryId: 'cat2', categoryName: 'Fuel', totalAmount: 800 },
          { categoryId: 'cat3', categoryName: 'Shopping', totalAmount: 2000 }
        ];

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CategoryAPI.fetchCategories(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(3);
        expect(result[0].categoryName).toBe('Food & Dining');
        expect(result[1].totalAmount).toBe(800);
      });

      it('should handle API error and reject promise', function() {
        var userId = 'user123';
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        CategoryAPI.fetchCategories(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Fetch categories API error:', jasmine.any(Object));
      });

      it('should return empty array when no categories exist', function() {
        var userId = 'newUser';
        var mockResponse = [];

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CategoryAPI.fetchCategories(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle 404 Not Found error for invalid userId', function() {
        var userId = 'invalidUser';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(404, { message: 'User not found' });

        var error;
        CategoryAPI.fetchCategories(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle all predefined spending categories', function() {
        var userId = 'user123';
        var mockResponse = [
          { categoryId: 'cat1', categoryName: 'Food & Dining', totalAmount: 1500 },
          { categoryId: 'cat2', categoryName: 'Fuel', totalAmount: 800 },
          { categoryId: 'cat3', categoryName: 'Shopping', totalAmount: 2000 },
          { categoryId: 'cat4', categoryName: 'Travel', totalAmount: 3000 },
          { categoryId: 'cat5', categoryName: 'Entertainment', totalAmount: 500 },
          { categoryId: 'cat6', categoryName: 'Utilities', totalAmount: 1200 },
          { categoryId: 'cat7', categoryName: 'Healthcare', totalAmount: 900 },
          { categoryId: 'cat8', categoryName: 'Education', totalAmount: 1500 },
          { categoryId: 'cat9', categoryName: 'Miscellaneous', totalAmount: 600 }
        ];

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CategoryAPI.fetchCategories(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(9);
        expect(result[3].categoryName).toBe('Travel');
        expect(result[8].categoryName).toBe('Miscellaneous');
      });

      it('should handle network timeout error', function() {
        var userId = 'user123';

        spyOn(console, 'error');

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        CategoryAPI.fetchCategories(userId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle categories with zero amounts', function() {
        var userId = 'user123';
        var mockResponse = [
          { categoryId: 'cat1', categoryName: 'Food & Dining', totalAmount: 0 },
          { categoryId: 'cat2', categoryName: 'Fuel', totalAmount: 0 }
        ];

        var expectedUrl = baseUrl + categoriesEndpoint + '?userId=' + userId;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        CategoryAPI.fetchCategories(userId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(2);
        expect(result[0].totalAmount).toBe(0);
        expect(result[1].totalAmount).toBe(0);
      });
    });
  });
})();