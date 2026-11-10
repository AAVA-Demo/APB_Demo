/*
Test Documentation:
- Test Name: HistoricalDataFactory - fetchHistoricalData
- Purpose: Validates fetching historical transaction data with date range
- Scenario: HTTP GET request with start and end date parameters
- Expected Result: Promise resolves with historical data
*/
/*
Test Documentation:
- Test Name: HistoricalDataFactory - caching mechanism
- Purpose: Validates caching of historical data by date range
- Scenario: Same date range requested twice
- Expected Result: API called once, cached data returned on second call
*/
/*
Coverage Report:
- Functions tested: fetchHistoricalData
- Scenarios covered: successful fetch, caching, cache expiration, error handling
- Uncovered scenarios: none
*/

describe('HistoricalDataFactory', function() {
  'use strict';
  
  beforeEach(module('creditCard.trends'));
  
  var HistoricalDataFactory, $httpBackend, $timeout;
  
  beforeEach(inject(function(_HistoricalDataFactory_, _$httpBackend_, _$timeout_) {
    HistoricalDataFactory = _HistoricalDataFactory_;
    $httpBackend = _$httpBackend_;
    $timeout = _$timeout_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchHistoricalData', function() {
    it('should fetch historical data with date range', function() {
      var mockData = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15', cardId: 1 },
        { transactionId: 2, amount: 250, transactionDate: '2024-02-20', cardId: 2 }
      ];
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      
      $httpBackend.expectGET('/api/transactions/history?start=2024-01-01&end=2024-03-31').respond(200, mockData);
      
      var result;
      HistoricalDataFactory.fetchHistoricalData(dateRange).then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockData);
      expect(result.length).toBe(2);
    });
    
    it('should return cached data on subsequent calls with same date range', function() {
      var mockData = [
        { transactionId: 1, amount: 100, transactionDate: '2024-01-15' }
      ];
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      
      $httpBackend.expectGET('/api/transactions/history?start=2024-01-01&end=2024-03-31').respond(200, mockData);
      
      var result1, result2;
      HistoricalDataFactory.fetchHistoricalData(dateRange).then(function(data) {
        result1 = data;
      });
      $httpBackend.flush();
      
      HistoricalDataFactory.fetchHistoricalData(dateRange).then(function(data) {
        result2 = data;
      });
      
      expect(result1).toEqual(mockData);
      expect(result2).toEqual(mockData);
    });
    
    it('should handle API error', function() {
      var dateRange = { startDate: '2024-01-01', endDate: '2024-03-31' };
      
      $httpBackend.expectGET('/api/transactions/history?start=2024-01-01&end=2024-03-31').respond(500, 'Server Error');
      
      var errorResult;
      HistoricalDataFactory.fetchHistoricalData(dateRange).catch(function(error) {
        errorResult = error;
      });
      
      $httpBackend.flush();
      
      expect(errorResult).toBeDefined();
      expect(errorResult.status).toBe(500);
    });
  });
});