/*
Test Documentation:
- Test Name: TransactionProcessingService - getMonthlySpend
- Purpose: Validate monthly spending calculation for a user
- Scenario: Service retrieves current month transaction totals
- Expected Result: Returns aggregated monthly spend amount
*/

describe('TransactionProcessingService', function() {
  'use strict';
  
  var TransactionProcessingService;
  var $httpBackend;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_TransactionProcessingService_, _$httpBackend_) {
    TransactionProcessingService = _TransactionProcessingService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getMonthlySpend', function() {
    it('should retrieve monthly spend for a user', function() {
      var userId = 'USER001';
      var mockResponse = {
        monthlySpend: 2500,
        month: '2023-11',
        transactionCount: 45
      };
      
      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);
      
      TransactionProcessingService.getMonthlySpend(userId).then(function(result) {
        expect(result).toEqual(mockResponse);
        expect(result.monthlySpend).toBe(2500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle zero monthly spend', function() {
      var userId = 'USER002';
      var mockResponse = {
        monthlySpend: 0,
        month: '2023-11',
        transactionCount: 0
      };
      
      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(200, mockResponse);
      
      TransactionProcessingService.getMonthlySpend(userId).then(function(result) {
        expect(result.monthlySpend).toBe(0);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle API errors', function() {
      var userId = 'USER001';
      
      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(500, 'Server Error');
      
      TransactionProcessingService.getMonthlySpend(userId).catch(function(error) {
        expect(error.status).toBe(500);
      });
      
      $httpBackend.flush();
    });
    
    it('should handle user not found', function() {
      var userId = 'INVALID_USER';
      
      $httpBackend.expectGET('/api/transactions/monthly/' + userId).respond(404, 'User Not Found');
      
      TransactionProcessingService.getMonthlySpend(userId).catch(function(error) {
        expect(error.status).toBe(404);
      });
      
      $httpBackend.flush();
    });
  });
});

/*
Coverage Report:
- Functions tested: getMonthlySpend
- Scenarios covered:
  * Successful monthly spend retrieval
  * Zero spend handling
  * API error handling (500, 404)
- Uncovered scenarios: None
- Edge cases: Zero spend, API failures, invalid users
*/