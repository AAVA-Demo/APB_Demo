/*
Test Documentation:
- Test Name: transactionFactory - getMonthlySpend success
- Purpose: Verify that getMonthlySpend successfully retrieves current month spending data
- Scenario: API returns monthly spend data for current month
- Expected Result: Promise resolves with monthly spend data
*/
/*
Test Documentation:
- Test Name: transactionFactory - getMonthlySpend error handling
- Purpose: Verify that getMonthlySpend handles API errors gracefully
- Scenario: API call fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend
- Scenarios covered: successful retrieval, error handling, current month calculation, endpoint construction
- Uncovered scenarios: none
*/

describe('transactionFactory', function() {
  'use strict';

  var transactionFactory;
  var $httpBackend;
  var API_CONFIG;
  var $q;
  var $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_transactionFactory_, _$httpBackend_, _API_CONFIG_, _$q_, _$rootScope_) {
    transactionFactory = _transactionFactory_;
    $httpBackend = _$httpBackend_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {
    it('should successfully retrieve monthly spend for current month', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var mockMonthlyData = {
        totalSpend: 2500.00,
        transactionCount: 45,
        month: currentMonth
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(200, mockMonthlyData);

      var result;
      transactionFactory.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockMonthlyData);
      expect(result.totalSpend).toBe(2500.00);
      expect(result.month).toBe(currentMonth);
    });

    it('should construct correct API endpoint with current month parameter', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(200, { totalSpend: 0 });

      transactionFactory.getMonthlySpend();
      $httpBackend.flush();
    });

    it('should handle API errors and reject promise', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var errorResponse = { status: 500, statusText: 'Internal Server Error' };

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(500, errorResponse);

      var rejected = false;
      transactionFactory.getMonthlySpend().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching monthly spend:', jasmine.any(Object));
    });

    it('should handle zero monthly spend', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var zeroSpendData = {
        totalSpend: 0,
        transactionCount: 0,
        month: currentMonth
      };

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(200, zeroSpendData);

      var result;
      transactionFactory.getMonthlySpend().then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result.totalSpend).toBe(0);
      expect(result.transactionCount).toBe(0);
    });

    it('should handle network errors', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);

      spyOn(console, 'error');

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(0, '');

      var rejected = false;
      transactionFactory.getMonthlySpend().catch(function(error) {
        rejected = true;
      });

      $httpBackend.flush();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    it('should use ISO date format for month parameter', function() {
      var currentMonth = new Date().toISOString().substring(0, 7);
      var regex = /^\d{4}-\d{2}$/;

      expect(currentMonth).toMatch(regex);

      $httpBackend.expectGET(API_CONFIG.baseUrl + '/transactions/monthly?month=' + currentMonth)
        .respond(200, {});

      transactionFactory.getMonthlySpend();
      $httpBackend.flush();
    });
  });
});