/*
Test Documentation:
- Test Name: AuthInterceptor - request with valid token
- Purpose: Validates that Authorization header is added to requests when token exists
- Scenario: HTTP request made with valid token in localStorage
- Expected Result: Request config includes Authorization Bearer token header
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request without token
- Purpose: Validates that demo token is used when no token exists in localStorage
- Scenario: HTTP request made without token in localStorage
- Expected Result: Request config includes demo Authorization Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - responseError with 401 status
- Purpose: Validates error handling for unauthorized responses
- Scenario: HTTP response returns 401 Unauthorized status
- Expected Result: Error logged to console and promise rejected
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: valid token, missing token, demo token fallback, 401 error, other errors
- Edge cases: null token, undefined token, various HTTP error codes
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor, $window, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthInterceptor_, _$window_, _$q_, _$rootScope_) {
      AuthInterceptor = _AuthInterceptor_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('request interceptor', function() {
      it('should add Authorization header with valid token from localStorage', function() {
        var testToken = 'test-auth-token-xyz';
        spyOn($window.localStorage, 'getItem').and.returnValue(testToken);

        var config = {
          headers: {},
          url: '/api/test'
        };

        var result = AuthInterceptor.request(config);

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      it('should use demo token when no token in localStorage', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue(null);

        var config = {
          headers: {},
          url: '/api/test'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers.Authorization).toBe('Bearer demo-token-12345');
      });

      it('should use demo token when localStorage returns undefined', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue(undefined);

        var config = {
          headers: {},
          url: '/api/test'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers.Authorization).toBe('Bearer demo-token-12345');
      });

      it('should preserve existing headers when adding Authorization', function() {
        var testToken = 'test-token';
        spyOn($window.localStorage, 'getItem').and.returnValue(testToken);

        var config = {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          },
          url: '/api/test'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
      });

      it('should return config object unchanged except for Authorization header', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('token');

        var config = {
          headers: {},
          url: '/api/test',
          method: 'GET',
          params: { id: 123 }
        };

        var result = AuthInterceptor.request(config);

        expect(result.url).toBe('/api/test');
        expect(result.method).toBe('GET');
        expect(result.params).toEqual({ id: 123 });
      });
    });

    describe('responseError interceptor', function() {
      it('should log error and reject promise for 401 Unauthorized', function() {
        spyOn(console, 'error');

        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Authentication required' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });

        $rootScope.$apply();

        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        expect(result).toEqual(rejection);
      });

      it('should reject promise without logging for non-401 errors', function() {
        spyOn(console, 'error');

        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server error' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });

        $rootScope.$apply();

        expect(console.error).not.toHaveBeenCalledWith('Unauthorized access');
        expect(result).toEqual(rejection);
      });

      it('should handle 403 Forbidden without unauthorized logging', function() {
        spyOn(console, 'error');

        var rejection = {
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'Access denied' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });

        $rootScope.$apply();

        expect(console.error).not.toHaveBeenCalledWith('Unauthorized access');
        expect(result.status).toBe(403);
      });

      it('should handle 404 Not Found errors', function() {
        var rejection = {
          status: 404,
          statusText: 'Not Found',
          data: null
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });

        $rootScope.$apply();

        expect(result).toEqual(rejection);
      });

      it('should handle network errors with status -1', function() {
        spyOn(console, 'error');

        var rejection = {
          status: -1,
          statusText: '',
          data: null
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });

        $rootScope.$apply();

        expect(result).toEqual(rejection);
        expect(console.error).not.toHaveBeenCalledWith('Unauthorized access');
      });
    });

    describe('factory initialization', function() {
      it('should be defined', function() {
        expect(AuthInterceptor).toBeDefined();
      });

      it('should have request method', function() {
        expect(AuthInterceptor.request).toBeDefined();
        expect(typeof AuthInterceptor.request).toBe('function');
      });

      it('should have responseError method', function() {
        expect(AuthInterceptor.responseError).toBeDefined();
        expect(typeof AuthInterceptor.responseError).toBe('function');
      });
    });
  });
})();