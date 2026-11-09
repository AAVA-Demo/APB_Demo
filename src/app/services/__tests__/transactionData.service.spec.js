/*
Test Documentation:
- Test Name: transactionDataService - getTransactions
- Purpose: Validates transaction data retrieval from API
- Scenario: Tests successful fetch, error handling
- Expected Result: Returns transaction data or handles errors properly
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful fetch, error handling
- Uncovered scenarios: none
*/

describe('transactionDataService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var transactionDataService;
  var $httpBackend;
  var $q;
  var $rootScope;

  beforeEach(inject(function(_transactionDataService_, _$httpBackend_, _$q_, _$rootScope_) {
    transactionDataService = _transactionDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should retrieve transactions from API', function() {
      var mockTransactions = [
        { transactionId: '1', amount: 100 },
        { transactionId: '2', amount: 50 }
      ];

      $httpBackend.expectGET('/api/transactions').respond(200, mockTransactions);

      var result;
      transactionDataService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
    });

    it('should handle API error', function() {
      $httpBackend.expectGET('/api/transactions').respond(500, 'Server Error');

      var error;
      transactionDataService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
  });
});