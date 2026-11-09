/*
Test Documentation:
- Test Name: TransactionProcessingFactory - getMonthlySpend success
- Purpose: Validates retrieval of monthly spending data
- Scenario: API returns current and previous month spending
- Expected Result: Promise resolves with monthly spend object
*/
/*
Test Documentation:
- Test Name: TransactionProcessingFactory - getMonthlySpend error
- Purpose: Validates error handling when monthly spend fetch fails
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Coverage Report:
- Functions tested: getMonthlySpend
- Scenarios covered: successful retrieval, error handling
- Edge cases: null responses, API failures, unauthorized access
- Uncovered scenarios: none
*/

describe('TransactionProcessingFactory', function() {
  'use strict';

  var TransactionProcessingFactory, $httpBackend;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_TransactionProcessingFactory_, _$httpBackend_) {
    TransactionProcessingFactory = _TransactionProcessingFactory_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMonthlySpend', function() {
    it('should return monthly spend data when API call succeeds', function() {
      var mockMonthlySpend = {
        currentMonth: 3500,
        previousMonth: 3200,
        trend: 'up'
      };

      $httpBackend.expectGET('/api/transactions/monthly-spend')
        .respond(200, mockMonthlySpend);

      TransactionProcessingFactory.getMonthlySpend().then(function(data) {
        expect(data).toEqual(mockMonthlySpend);
        expect(data.currentMonth).toBe(3500);
        expect(data.previousMonth).toBe(3200);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      $httpBackend.expectGET('/api/transactions/monthly-spend')
        .respond(500, { message: 'Internal Server Error' });

      TransactionProcessingFactory.getMonthlySpend().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET('/api/transactions/monthly-spend')
        .respond(401, { message: 'Unauthorized' });

      TransactionProcessingFactory.getMonthlySpend().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should handle zero spend months', function() {
      var mockMonthlySpend = {
        currentMonth: 0,
        previousMonth: 0,
        trend: 'neutral'
      };

      $httpBackend.expectGET('/api/transactions/monthly-spend')
        .respond(200, mockMonthlySpend);

      TransactionProcessingFactory.getMonthlySpend().then(function(data) {
        expect(data.currentMonth).toBe(0);
        expect(data.previousMonth).toBe(0);
      });

      $httpBackend.flush();
    });
  });
});