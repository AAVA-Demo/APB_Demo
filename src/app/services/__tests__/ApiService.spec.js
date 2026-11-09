/*
Test Documentation:
- Test Name: ApiService Unit Tests
- Purpose: Validate API service methods for credit card and transaction data retrieval
- Scenario: Test getCreditCards, getTransactions, and getCardDetails methods with success and error scenarios
- Expected Result: All methods should properly handle HTTP requests and responses
*/

(function(){
'use strict';

describe('ApiService', function() {
  var ApiService, $httpBackend, $rootScope;
  var baseUrl = '/api';

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_ApiService_, _$httpBackend_, _$rootScope_) {
    ApiService = _ApiService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCreditCards', function() {
    it('should fetch credit cards successfully', function() {
      var mockCards = [{cardId: 1, cardNumber: '1234'}, {cardId: 2, cardNumber: '5678'}];
      $httpBackend.expectGET(baseUrl + '/creditcards').respond(200, mockCards);

      var result;
      ApiService.getCreditCards().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards);
    });

    it('should handle error when fetching credit cards fails', function() {
      $httpBackend.expectGET(baseUrl + '/creditcards').respond(500, 'Server Error');

      var error;
      ApiService.getCreditCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(500);
    });

    it('should handle network error', function() {
      $httpBackend.expectGET(baseUrl + '/creditcards').respond(0, '');

      var error;
      ApiService.getCreditCards().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
    });
  });

  describe('getTransactions', function() {
    it('should fetch transactions with parameters successfully', function() {
      var mockTransactions = [{id: 1, amount: 100}, {id: 2, amount: 200}];
      var params = {tagged: true};
      $httpBackend.expectGET(baseUrl + '/transactions?tagged=true').respond(200, mockTransactions);

      var result;
      ApiService.getTransactions(params).then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });

    it('should fetch transactions without parameters', function() {
      var mockTransactions = [{id: 1, amount: 100}];
      $httpBackend.expectGET(baseUrl + '/transactions').respond(200, mockTransactions);

      var result;
      ApiService.getTransactions().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockTransactions);
    });

    it('should handle error when fetching transactions fails', function() {
      $httpBackend.expectGET(baseUrl + '/transactions').respond(404, 'Not Found');

      var error;
      ApiService.getTransactions().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();
      expect(error).toBeDefined();
      expect(error.status).toBe(404);
    });
  });

  describe('getCardDetails', function() {
    it('should call getCreditCards method', function() {
      var mockCards = [{cardId: 1}];
      $httpBackend.expectGET(baseUrl + '/creditcards').respond(200, mockCards);

      var result;
      ApiService.getCardDetails().then(function(data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockCards);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getCreditCards, getTransactions, getCardDetails
- Scenarios covered: Success responses, HTTP errors (500, 404), network errors, with/without parameters
- Edge cases: Empty parameters, network failures
- Uncovered scenarios: None - all primary paths covered
*/