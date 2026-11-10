/*
Test Documentation:
- Test Name: ApiService - GET request success
- Purpose: Validates that the ApiService correctly makes GET requests and returns data
- Scenario: Service makes a successful GET request to an endpoint
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: ApiService - GET request with parameters
- Purpose: Validates that GET requests include query parameters
- Scenario: Service makes GET request with params object
- Expected Result: HTTP request includes all parameters
*/
/*
Test Documentation:
- Test Name: ApiService - GET request error handling
- Purpose: Validates error handling for failed GET requests
- Scenario: GET request fails with HTTP error
- Expected Result: Promise rejects with error and logs to console
*/
/*
Test Documentation:
- Test Name: ApiService - POST request success
- Purpose: Validates that the ApiService correctly makes POST requests
- Scenario: Service makes a successful POST request with data
- Expected Result: Promise resolves with response data
*/
/*
Test Documentation:
- Test Name: ApiService - POST request error handling
- Purpose: Validates error handling for failed POST requests
- Scenario: POST request fails with HTTP error
- Expected Result: Promise rejects with error and logs to console
*/
/*
Coverage Report:
- Functions tested: get(), post()
- Scenarios covered: success cases, error handling, parameter passing
- Uncovered scenarios: network timeout, retry logic
*/

(function() {
  'use strict';

  describe('ApiService', function() {
    var ApiService, $httpBackend, $q;
    var baseUrl = '/api';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_ApiService_, _$httpBackend_, _$q_) {
      ApiService = _ApiService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('get()', function() {
      it('should make a successful GET request and return data', function() {
        var mockData = { cards: [{ id: 1, name: 'Test Card' }] };
        $httpBackend.expectGET(baseUrl + '/cards').respond(200, mockData);

        var result;
        ApiService.get('/cards').then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockData);
      });

      it('should include query parameters in GET request', function() {
        var params = { page: 1, size: 20 };
        $httpBackend.expectGET(baseUrl + '/transactions?page=1&size=20').respond(200, {});

        ApiService.get('/transactions', params);
        $httpBackend.flush();
      });

      it('should handle GET request errors and reject promise', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET(baseUrl + '/cards').respond(500, 'Server Error');

        var error;
        ApiService.get('/cards').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
      });

      it('should handle GET request with empty params', function() {
        $httpBackend.expectGET(baseUrl + '/cards').respond(200, {});
        ApiService.get('/cards', null);
        $httpBackend.flush();
      });
    });

    describe('post()', function() {
      it('should make a successful POST request with data', function() {
        var postData = { cardId: 123, amount: 100 };
        var mockResponse = { success: true, transactionId: 456 };
        $httpBackend.expectPOST(baseUrl + '/transactions', postData).respond(200, mockResponse);

        var result;
        ApiService.post('/transactions', postData).then(function(data) {
          result = data;
        });

        $httpBackend.flush();
        expect(result).toEqual(mockResponse);
      });

      it('should handle POST request errors and reject promise', function() {
        spyOn(console, 'error');
        var postData = { invalid: 'data' };
        $httpBackend.expectPOST(baseUrl + '/transactions', postData).respond(400, 'Bad Request');

        var error;
        ApiService.post('/transactions', postData).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();
        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('API Error:', jasmine.any(Object));
      });
    });
  });
})();