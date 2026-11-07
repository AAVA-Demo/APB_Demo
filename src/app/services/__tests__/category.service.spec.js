/*
Test Documentation:
- Test Name: CategoryService Unit Tests
- Purpose: Validate the CategoryService functionality including category spending retrieval, caching, and error handling
- Scenario: Tests cover successful data retrieval, cache hit scenarios, default period handling, and error scenarios
- Expected Result: All service methods should work correctly with proper caching and error handling
*/

describe('CategoryService', function() {
  'use strict';

  var CategoryService;
  var $httpBackend;
  var $q;
  var $cacheFactory;
  var mockCategoryData;

  beforeEach(module('ccAnalysisApp'));

  beforeEach(inject(function(_CategoryService_, _$httpBackend_, _$q_, _$cacheFactory_) {
    CategoryService = _CategoryService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $cacheFactory = _$cacheFactory_;

    mockCategoryData = {
      categories: [
        { category: 'Food & Dining', amount: 500.00, color: '#FF6384' },
        { category: 'Fuel', amount: 300.00, color: '#36A2EB' },
        { category: 'Shopping', amount: 750.00, color: '#FFCE56' },
        { category: 'Travel', amount: 1200.00, color: '#4BC0C0' },
        { category: 'Entertainment', amount: 250.00, color: '#9966FF' },
        { category: 'Utilities', amount: 400.00, color: '#FF9F40' },
        { category: 'Healthcare', amount: 600.00, color: '#FF6384' },
        { category: 'Education', amount: 800.00, color: '#C9CBCF' },
        { category: 'Miscellaneous', amount: 150.00, color: '#4BC0C0' }
      ]
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCategorySpending', function() {
    it('should retrieve category spending data successfully with period parameter', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, mockCategoryData);

      var result;
      CategoryService.getCategorySpending(period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCategoryData);
      expect(result.categories.length).toBe(9);
    });

    it('should use default period when no parameter provided', function() {
      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, mockCategoryData);

      var result;
      CategoryService.getCategorySpending().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCategoryData);
    });

    it('should handle 60days period parameter', function() {
      var period = '60days';

      $httpBackend.expectGET('/api/analytics/categories?period=60days')
        .respond(200, mockCategoryData);

      var result;
      CategoryService.getCategorySpending(period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCategoryData);
    });

    it('should handle 90days period parameter', function() {
      var period = '90days';

      $httpBackend.expectGET('/api/analytics/categories?period=90days')
        .respond(200, mockCategoryData);

      var result;
      CategoryService.getCategorySpending(period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockCategoryData);
    });

    it('should return cached data on subsequent calls with same period', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, mockCategoryData);

      var firstResult, secondResult;

      CategoryService.getCategorySpending(period).then(function(data) {
        firstResult = data;
      });

      $httpBackend.flush();

      CategoryService.getCategorySpending(period).then(function(data) {
        secondResult = data;
      });

      expect(secondResult).toEqual(firstResult);
      expect(secondResult).toEqual(mockCategoryData);
    });

    it('should handle HTTP 500 error responses', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(500, 'Internal Server Error');

      var errorOccurred = false;
      CategoryService.getCategorySpending(period).catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should handle HTTP 404 error responses', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(404, 'Not Found');

      var errorOccurred = false;
      CategoryService.getCategorySpending(period).catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should handle network timeout errors', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(0, '');

      var errorOccurred = false;
      CategoryService.getCategorySpending(period).catch(function(error) {
        errorOccurred = true;
      });

      $httpBackend.flush();

      expect(errorOccurred).toBe(true);
    });

    it('should create unique cache keys for different periods', function() {
      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, { categories: [mockCategoryData.categories[0]] });

      $httpBackend.expectGET('/api/analytics/categories?period=60days')
        .respond(200, { categories: [mockCategoryData.categories[1]] });

      var result1, result2;

      CategoryService.getCategorySpending('30days').then(function(data) {
        result1 = data;
      });

      $httpBackend.flush();

      CategoryService.getCategorySpending('60days').then(function(data) {
        result2 = data;
      });

      $httpBackend.flush();

      expect(result1).not.toEqual(result2);
    });

    it('should handle empty category data', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, { categories: [] });

      var result;
      CategoryService.getCategorySpending(period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.categories).toEqual([]);
      expect(Array.isArray(result.categories)).toBe(true);
    });

    it('should validate all 9 predefined categories in response', function() {
      var period = '30days';

      $httpBackend.expectGET('/api/analytics/categories?period=30days')
        .respond(200, mockCategoryData);

      var result;
      CategoryService.getCategorySpending(period).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      var categoryNames = result.categories.map(function(cat) { return cat.category; });
      expect(categoryNames).toContain('Food & Dining');
      expect(categoryNames).toContain('Fuel');
      expect(categoryNames).toContain('Shopping');
      expect(categoryNames).toContain('Travel');
      expect(categoryNames).toContain('Entertainment');
      expect(categoryNames).toContain('Utilities');
      expect(categoryNames).toContain('Healthcare');
      expect(categoryNames).toContain('Education');
      expect(categoryNames).toContain('Miscellaneous');
    });
  });

  describe('Service Initialization', function() {
    it('should be defined', function() {
      expect(CategoryService).toBeDefined();
    });

    it('should have getCategorySpending method', function() {
      expect(CategoryService.getCategorySpending).toBeDefined();
      expect(typeof CategoryService.getCategorySpending).toBe('function');
    });
  });
});

/*
Coverage Report:
- Functions tested: getCategorySpending
- Scenarios covered:
  * Successful category data retrieval with period parameter
  * Default period handling (30days)
  * 60days and 90days period handling
  * Cache hit on subsequent calls
  * HTTP 500 error handling
  * HTTP 404 error handling
  * Network timeout error handling
  * Unique cache key generation for different periods
  * Empty category data handling
  * All 9 predefined categories validation
  * Service initialization
- Uncovered scenarios: None
- Edge cases tested: Empty data, network errors, cache behavior, all category types
*/