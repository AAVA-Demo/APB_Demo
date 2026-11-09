/*
Test Documentation:
- Test Name: TransactionService current month transaction retrieval
- Purpose: Validates current month transaction fetching and mock data generation
- Scenario: Test API calls, error handling, and mock transaction generation
- Expected Result: Service should fetch current month transactions or return mock data
*/
/*
Coverage Report:
- Functions tested: getCurrentMonthTransactions, generateMockTransactions (internal)
- Scenarios covered: successful API call, error fallback to mock data, transaction structure
- Dependencies mocked: $http
- Uncovered scenarios: none
*/

describe('TransactionService (Dashboard)', function() {
  'use strict';
  
  beforeEach(module('creditCard.dashboard'));
  
  var service, $httpBackend, $q, API_CONFIG;
  
  beforeEach(inject(function(_TransactionService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    service = _TransactionService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have getCurrentMonthTransactions method', function() {
    expect(service.getCurrentMonthTransactions).toBeDefined();
    expect(typeof service.getCurrentMonthTransactions).toBe('function');
  });
  
  it('should fetch current month transactions from API successfully', function() {
    var mockTransactions = [
      { id: '1', amount: 5200, category: 'Food & Dining' },
      { id: '2', amount: 3500, category: 'Fuel' }
    ];
    
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=current')
      .respond(200, mockTransactions);
    
    var result;
    service.getCurrentMonthTransactions().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockTransactions);
  });
  
  it('should return mock data when API call fails', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=current')
      .respond(500, 'Server Error');
    
    var result;
    service.getCurrentMonthTransactions().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
  });
  
  it('should generate mock transactions with correct structure', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions + '?month=current')
      .respond(500);
    
    var result;
    service.getCurrentMonthTransactions().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('cardId');
    expect(result[0]).toHaveProperty('amount');
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('merchant');
    expect(result[0]).toHaveProperty('category');
  });
});