/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards - success scenario
- Purpose: Validates that fetchAllCards retrieves all credit cards for current user
- Scenario: Service makes HTTP GET request to user cards endpoint
- Expected Result: Returns array of card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchAllCards - empty data handling
- Purpose: Validates that service handles empty or null responses gracefully
- Scenario: API returns empty array or null
- Expected Result: Returns empty array without errors
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchTransactions - success scenario
- Purpose: Validates that fetchTransactions retrieves transactions with query parameters
- Scenario: Service fetches transactions with custom filter parameters
- Expected Result: Returns array of transaction objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - fetchTransactions - parameter handling
- Purpose: Validates that service correctly passes query parameters to API
- Scenario: Service called with various filter parameters
- Expected Result: HTTP request includes all specified parameters
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - error handling
- Purpose: Validates that service handles API errors for all methods
- Scenario: HTTP requests fail with error responses
- Expected Result: Promises are rejected and errors are logged
*/
/*
Coverage Report:
- Functions tested: fetchAllCards, fetchTransactions
- Scenarios covered: success paths, error handling, edge cases (empty data, null responses, parameter passing)
- Uncovered scenarios: network timeout, malformed response data
*/

describe('CreditCardDataService', function() {
  'use strict';
  
  beforeEach(module('app.dashboard'));
  
  var CreditCardDataService, $httpBackend, $q;
  var mockCards = [
    {
      cardId: 'card1',
      cardType: 'Visa',
      creditLimit: 5000,
      outstandingAmount: 2500
    },
    {
      cardId: 'card2',
      cardType: 'MasterCard',
      creditLimit: 10000,
      outstandingAmount: 3000
    }
  ];
  var mockTransactions = [
    {
      transactionId: 'txn1',
      amount: 150.50,
      category: 'Food & Dining',
      date: '2023-01-15'
    },
    {
      transactionId: 'txn2',
      amount: 75.00,
      category: 'Fuel',
      date: '2023-01-16'
    }
  ];
  
  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('fetchAllCards', function() {
    
    it('should fetch all cards for current user', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, mockCards);
      
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardId).toBe('card2');
    });
    
    it('should handle empty cards array', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, []);
      
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle null response data', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(200, null);
      
      var result;
      CreditCardDataService.fetchAllCards().then(function(cards) {
        result = cards;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(500, 'Internal Server Error');
      
      var error;
      CreditCardDataService.fetchAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should reject promise on 404 error', function() {
      $httpBackend.expectGET('/api/users/current/cards')
        .respond(404, 'User not found');
      
      var error;
      CreditCardDataService.fetchAllCards().catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });
  
  describe('fetchTransactions', function() {
    
    it('should fetch transactions with query parameters', function() {
      var params = {month: 'current', cardId: 'card1'};
      
      $httpBackend.expectGET('/api/transactions?cardId=card1&month=current')
        .respond(200, mockTransactions);
      
      var result;
      CreditCardDataService.fetchTransactions(params).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].transactionId).toBe('txn1');
    });
    
    it('should handle empty parameters object', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(200, mockTransactions);
      
      var result;
      CreditCardDataService.fetchTransactions({}).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(2);
    });
    
    it('should handle null parameters', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(200, mockTransactions);
      
      var result;
      CreditCardDataService.fetchTransactions(null).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(2);
    });
    
    it('should handle empty transactions array', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(200, []);
      
      var result;
      CreditCardDataService.fetchTransactions({}).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should handle null response data', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(200, null);
      
      var result;
      CreditCardDataService.fetchTransactions({}).then(function(transactions) {
        result = transactions;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual([]);
    });
    
    it('should reject promise on API error', function() {
      $httpBackend.expectGET('/api/transactions')
        .respond(500, 'Internal Server Error');
      
      var error;
      CreditCardDataService.fetchTransactions({}).catch(function(err) {
        error = err;
      });
      
      $httpBackend.flush();
      
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });
    
    it('should pass multiple query parameters correctly', function() {
      var params = {
        month: 'current',
        cardId: 'card1',
        category: 'Food & Dining'
      };
      
      $httpBackend.expectGET('/api/transactions?cardId=card1&category=Food%20%26%20Dining&month=current')
        .respond(200, mockTransactions);
      
      CreditCardDataService.fetchTransactions(params);
      $httpBackend.flush();
    });
  });
});