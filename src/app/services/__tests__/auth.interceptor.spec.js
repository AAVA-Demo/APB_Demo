/*
Test Documentation:
- Test Name: AuthInterceptor Test Suite
- Purpose: Validate authentication interceptor functionality for adding auth tokens to requests and handling authentication errors
- Scenario: Tests cover token injection, request modification, error handling for 401/403, and redirect behavior
- Expected Result: Interceptor correctly adds Bearer token to requests and redirects on authentication failures
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
      it('should add Authorization header when token exists in localStorage', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('test-token-12345');

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-12345');
      });

      it('should not add Authorization header when token does not exist', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue(null);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
        expect(result.headers).toBeUndefined();
      });

      it('should preserve existing headers when adding Authorization', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('token-xyz');

        var config = {
          url: '/api/transactions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer token-xyz');
      });

      it('should handle empty string token', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('');

        var config = {
          url: '/api/analytics',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should initialize headers object if not present when token exists', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('new-token');

        var config = {
          url: '/api/data',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeDefined();
        expect(result.headers).toEqual({ Authorization: 'Bearer new-token' });
      });
    });

    describe('responseError interceptor', function() {
      beforeEach(function() {
        $window.location.href = '';
      });

      it('should redirect to login on 401 Unauthorized error', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid credentials' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.location.href).toBe('#!/login');
        expect(result).toEqual(rejection);
      });

      it('should redirect to login on 403 Forbidden error', function() {
        var rejection = {
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'Access denied' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.location.href).toBe('#!/login');
        expect(result).toEqual(rejection);
      });

      it('should not redirect on 404 Not Found error', function() {
        var rejection = {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Resource not found' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.location.href).toBe('');
        expect(result).toEqual(rejection);
      });

      it('should not redirect on 500 Internal Server Error', function() {
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server error' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.location.href).toBe('');
        expect(result).toEqual(rejection);
      });

      it('should handle rejection without status code', function() {
        var rejection = {
          data: { message: 'Unknown error' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect($window.location.href).toBe('');
        expect(result).toEqual(rejection);
      });

      it('should return rejected promise with original rejection object', function() {
        var rejection = {
          status: 401,
          config: { url: '/api/secure' },
          data: { error: 'Token expired' }
        };

        var result;
        AuthInterceptor.responseError(rejection).catch(function(err) {
          result = err;
        });
        $rootScope.$apply();

        expect(result).toBe(rejection);
        expect(result.status).toBe(401);
        expect(result.config.url).toBe('/api/secure');
      });

      it('should handle multiple 401 errors sequentially', function() {
        var rejection1 = { status: 401 };
        var rejection2 = { status: 401 };

        AuthInterceptor.responseError(rejection1);
        $rootScope.$apply();
        expect($window.location.href).toBe('#!/login');

        $window.location.href = '';
        AuthInterceptor.responseError(rejection2);
        $rootScope.$apply();
        expect($window.location.href).toBe('#!/login');
      });
    });

    describe('integration scenarios', function() {
      it('should handle request with token and subsequent 401 error', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue('expired-token');

        var config = { url: '/api/protected', method: 'GET' };
        var requestResult = AuthInterceptor.request(config);

        expect(requestResult.headers.Authorization).toBe('Bearer expired-token');

        var rejection = { status: 401 };
        AuthInterceptor.responseError(rejection);
        $rootScope.$apply();

        expect($window.location.href).toBe('#!/login');
      });

      it('should handle request without token and 403 error', function() {
        spyOn($window.localStorage, 'getItem').and.returnValue(null);

        var config = { url: '/api/admin', method: 'GET' };
        var requestResult = AuthInterceptor.request(config);

        expect(requestResult.headers).toBeUndefined();

        var rejection = { status: 403 };
        AuthInterceptor.responseError(rejection);
        $rootScope.$apply();

        expect($window.location.href).toBe('#!/login');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * Token injection into request headers
  * Handling missing/null/empty tokens
  * Preserving existing headers
  * Redirect on 401 Unauthorized
  * Redirect on 403 Forbidden
  * No redirect on other status codes (404, 500)
  * Promise rejection with original error object
  * Sequential error handling
  * Integration scenarios combining request and error handling
- Edge cases: Empty token, missing headers, undefined status, multiple errors
- Uncovered scenarios: None - all interceptor methods and conditional paths tested
*/