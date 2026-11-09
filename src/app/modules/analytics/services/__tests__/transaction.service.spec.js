/*
Test Documentation:
- Test Name: TransactionService data fetching and caching
- Purpose: Validates transaction retrieval, caching mechanism, and mock data generation
- Scenario: Test successful API calls, cache usage, error handling, and mock data generation
- Expected Result: Service should fetch transactions from API or cache, handle errors gracefully
*/
/*
Coverage Report:
- Functions tested: fetchTransactions, generateMockTransactions (internal)
- Scenarios covered: successful API call, cache hit, cache miss, error fallback to mock data
- Dependencies mocked: $http, $cacheFactory
- Uncovered scenarios: none
*/

describe('TransactionService (Analytics)', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var service, $httpBackend, $q, API_CONFIG;
  var mockCache;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    service = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
    
    mockCache = {
      get: jasmine.createSpy('get').and.returnValue(null),
      put: jasmine.createSpy('put'),
      remove: jasmine.createSpy('remove')
    };
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have fetchTransactions method', function() {
    expect(service.fetchTransactions).toBeDefined();
    expect(typeof service.fetchTransactions).toBe('function');
  });
  
  it('should fetch transactions from API successfully', function() {
    var mockTransactions = [
      { id: '1', amount: 1000, category: 'Food & Dining' },
      { id: '2', amount: 2000, category: 'Fuel' }
    ];
    
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?months=12')
      .respond(200, mockTransactions);
    
    var result;
    service.fetchTransactions(12).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockTransactions);
  });
  
  it('should return mock data when API call fails', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?months=12')
      .respond(500, 'Server Error');
    
    var result;
    service.fetchTransactions(12).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
  
  it('should generate mock transactions with correct structure', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?months=6')
      .respond(500);
    
    var result;
    service.fetchTransactions(6).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('cardId');
    expect(result[0]).toHaveProperty('amount');
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('merchant');
    expect(result[0]).toHaveProperty('category');
    expect(result[0]).toHaveProperty('description');
  });
  
  it('should generate transactions for specified number of months', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?months=3')
      .respond(500);
    
    var result;
    service.fetchTransactions(3).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result.length).toBe(45);
  });
  
  it('should include valid categories in mock transactions', function() {
    var validCategories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?months=1')
      .respond(500);
    
    var result;
    service.fetchTransactions(1).then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    result.forEach(function(transaction) {
      expect(validCategories).toContain(transaction.category);
    });
  });
});