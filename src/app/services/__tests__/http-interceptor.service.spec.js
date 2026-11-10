/*
Test Documentation:
- Test Name: httpInterceptor - request with auth token
- Purpose: Validates that Authorization header is added when token exists
- Scenario: localStorage contains authToken
- Expected Result: Request config includes Bearer token in Authorization header

- Test Name: httpInterceptor - request without auth token
- Purpose: Validates request proceeds without token when none exists
- Scenario: localStorage has no authToken
- Expected Result: Request config has no Authorization header added

- Test Name: httpInterceptor - responseError 401 unauthorized
- Purpose: Validates broadcast of unauthorized event on 401 error
- Scenario: Response status is 401
- Expected Result: Broadcasts 'auth:unauthorized' event

- Test Name: httpInterceptor - responseError 500 server error
- Purpose: Validates broadcast of server error event on 5xx errors
- Scenario: Response status is 500 or higher
- Expected Result: Broadcasts 'http:serverError' event with rejection

- Test Name: httpInterceptor - responseError other errors
- Purpose: Validates that non-401/5xx errors are rejected without broadcast
- Scenario: Response status is 400, 403, 404, etc.
- Expected Result: Promise is rejected without broadcasting events

Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, 401 handling, 500+ handling, other errors
- Edge cases: missing token, various HTTP status codes
- Uncovered scenarios: token expiration validation (handled by backend)
*/

(function() {
  'use strict';

  describe('httpInterceptor', function() {
    var httpInterceptor, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_httpInterceptor_, _$rootScope_, _$q_) {
      httpInterceptor = _httpInterceptor_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    beforeEach(function() {
      localStorage.clear();
    });

    describe('request', function() {
      it('should add Authorization header when auth token exists', function() {
        var token = 'test-jwt-token-123';
        localStorage.setItem('authToken', token);

        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = httpInterceptor.request(config);

        expect(result.headers.Authorization).toBe('Bearer ' + token);
      });

      it('should not add Authorization header when no token exists', function() {
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = httpInterceptor.request(config);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should return the config object', function() {
        var config = {
          url: '/api/test',
          method: 'POST',
          headers: {},
          data: { test: 'data' }
        };

        var result = httpInterceptor.request(config);

        expect(result).toBe(config);
        expect(result.url).toBe('/api/test');
        expect(result.data).toEqual({ test: 'data' });
      });

      it('should preserve existing headers', function() {
        localStorage.setItem('authToken', 'token-123');

        var config = {
          url: '/api/test',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        var result = httpInterceptor.request(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer token-123');
      });
    });

    describe('responseError', function() {
      it('should broadcast auth:unauthorized event on 401 error', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid token' }
        };

        var result = httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).toHaveBeenCalledWith('auth:unauthorized');

        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should broadcast http:serverError event on 500 error', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server error' }
        };

        var result = httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).toHaveBeenCalledWith('http:serverError', rejection);

        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should broadcast http:serverError event on 503 error', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 503,
          statusText: 'Service Unavailable'
        };

        httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).toHaveBeenCalledWith('http:serverError', rejection);
      });

      it('should not broadcast events for 400 bad request', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 400,
          statusText: 'Bad Request'
        };

        var result = httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).not.toHaveBeenCalled();

        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should not broadcast events for 404 not found', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 404,
          statusText: 'Not Found'
        };

        httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).not.toHaveBeenCalled();
      });

      it('should not broadcast events for 403 forbidden', function() {
        spyOn($rootScope, '$broadcast');

        var rejection = {
          status: 403,
          statusText: 'Forbidden'
        };

        httpInterceptor.responseError(rejection);

        expect($rootScope.$broadcast).not.toHaveBeenCalled();
      });

      it('should always reject the promise', function() {
        var rejection = { status: 400 };
        var errorCaught = false;

        httpInterceptor.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });

        expect(errorCaught).toBe(true);
      });
    });
  });
})();