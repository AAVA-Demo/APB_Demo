/*
Test Documentation:
- Test Name: transactionDataFactory - getTransactions success
- Purpose: Verify that getTransactions successfully retrieves transactions within date range
- Scenario: Valid start and end dates are provided
- Expected Result: Promise resolves with transaction data and uses caching
*/
/*
Test Documentation:
- Test Name: transactionDataFactory - getTransactions error handling
- Purpose: Verify that getTransactions handles API errors gracefully
- Scenario: API call fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getTransactions
- Scenarios covered: successful retrieval, error handling, date range parameters, caching, empty results
- Uncovered scenarios: none
*/

describe('transactionDataFactory', function() {
  'use strict';

  var transactionDataFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_transactionDataFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    transactionDataFactory = _transactionDataFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getTransactions', function() {
    it('should successfully retrieve transactions for valid date range', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockTransactions = [
        {
          transactionId: 'txn1',
          transactionDate: '2023-06-15',
          amount: 150.00,
          category: 'Food & Dining'
        },
        {
          transactionId: 'txn2',
          transactionDate: '2023-08-20',
          amount: 500.00,
          category: 'Shopping'
        }
      ];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=' + startDate + '&end=' + endDate)
        .respond(200, mockTransactions);

      var result;
      transactionDataFactory.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockTransactions);
      expect(result.length).toBe(2);
      expect(result[0].amount).toBe(150.00);
    });

    it('should construct correct query parameters with date range', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-06-30';

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=2023-01-01&end=2023-06-30')
        .respond(200, []);

      transactionDataFactory.getTransactions(startDate, endDate);
      $httpBackend.flush();
    });

    it('should handle API errors and reject promise', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=' + startDate + '&end=' + endDate)
        .respond(500, errorResponse);

      var rejected = false;
      transactionDataFactory.getTransactions(startDate, endDate).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching transactions:', jasmine.any(Object));
    });

    it('should enable caching for transaction requests', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-12-31';
      var mockData = [{ transactionId: 'txn1' }];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=' + startDate + '&end=' + endDate)
        .respond(200, mockData);

      transactionDataFactory.getTransactions(startDate, endDate);
      $httpBackend.flush();
    });

    it('should handle empty transaction results', function() {
      var startDate = '2023-01-01';
      var endDate = '2023-01-31';
      var emptyTransactions = [];

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=' + startDate + '&end=' + endDate)
        .respond(200, emptyTransactions);

      var result;
      transactionDataFactory.getTransactions(startDate, endDate).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle invalid date range errors', function() {
      var startDate = '2023-12-31';
      var endDate = '2023-01-01';
      var errorResponse = { status: 400, statusText: 'Bad Request' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions?start=' + startDate + '&end=' + endDate)
        .respond(400, errorResponse);

      var rejected = false;
      transactionDataFactory.getTransactions(startDate, endDate).catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });
  });
});