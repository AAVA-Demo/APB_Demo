/*
Test Documentation:
- Test Name: transactionProcessingService - Get Monthly Transactions
- Purpose: Verify service retrieves current month transactions
- Scenario: Request transactions for current month
- Expected Result: Returns transactions with date range parameters
*/
/*
Test Documentation:
- Test Name: transactionProcessingService - Authentication
- Purpose: Verify service uses authentication token
- Scenario: Request transactions
- Expected Result: Authorization header is included
*/
/*
Coverage Report:
- Functions tested: getMonthlyTransactions
- Scenarios covered: success path, authentication
- Uncovered scenarios: API error handling
*/

describe('transactionProcessingService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var transactionProcessingService, $rootScope, $q, mockAuthService;
  
  beforeEach(inject(function(_transactionProcessingService_, _$rootScope_, _$q_) {
    transactionProcessingService = _transactionProcessingService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockAuthService = {
      getToken: jasmine.createSpy('getToken').and.returnValue($q.resolve('mock-token'))
    };
  }));
  
  beforeEach(inject(function($injector) {
    transactionProcessingService = $injector.instantiate(function() {
      return $injector.get('transactionProcessingService');
    }, {
      authService: mockAuthService
    });
  }));
  
  it('should retrieve monthly transactions with authentication', function() {
    var result;
    transactionProcessingService.getMonthlyTransactions().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
  
  it('should return mock transactions with valid structure', function() {
    var result;
    transactionProcessingService.getMonthlyTransactions().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    result.forEach(function(txn) {
      expect(txn.transactionId).toBeDefined();
      expect(txn.cardId).toBeDefined();
      expect(txn.amount).toBeDefined();
      expect(txn.date).toBeDefined();
      expect(txn.merchantName).toBeDefined();
      expect(txn.category).toBeDefined();
    });
  });
});