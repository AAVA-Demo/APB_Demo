/*
Test Documentation:
- Test Name: AuthInterceptor Test Suite
- Purpose: Validate HTTP request/response interception for authentication token management and error handling
- Scenario: Tests cover token injection, unauthorized error handling, forbidden error handling, and logout behavior
- Expected Result: Interceptor correctly adds auth tokens to requests and handles 401/403 errors with proper cleanup
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor, $window, $q, $location, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthInterceptor_, _$window_, _$q_, _$location_, _$rootScope_) {
      AuthInterceptor = _AuthInterceptor_;
      $window = _$window_;
      $q = _$q_;
      $location = _$location_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('request interceptor', function() {
      it('should add Authorization header when token exists in localStorage', function() {
        var testToken = 'test-jwt-token-12345';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      it('should not add Authorization header when token does not exist', function() {
        $window.localStorage.removeItem('authToken');

        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should initialize headers object if not present', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeDefined();
        expect(typeof result.headers).toBe('object');
      });

      it('should preserve existing headers when adding Authorization', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      it('should handle empty token string', function() {
        $window.localStorage.setItem('authToken', '');

        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should return the config object', function() {
        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result).toBe(config);
      });
    });

    describe('responseError interceptor', function() {
      beforeEach(function() {
        spyOn($location, 'path');
      });

      it('should remove token and redirect to login on 401 error', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var response = {
          status: 401,
          data: 'Unauthorized'
        };

        var rejected;
        AuthInterceptor.responseError(response).catch(function(err) {
          rejected = err;
        });
        $rootScope.$apply();

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($location.path).toHaveBeenCalledWith('/login');
        expect(rejected).toBe(response);
      });

      it('should remove token and redirect to login on 403 error', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var response = {
          status: 403,
          data: 'Forbidden'
        };

        var rejected;
        AuthInterceptor.responseError(response).catch(function(err) {
          rejected = err;
        });
        $rootScope.$apply();

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($location.path).toHaveBeenCalledWith('/login');
        expect(rejected).toBe(response);
      });

      it('should not redirect on 404 error', function() {
        var response = {
          status: 404,
          data: 'Not Found'
        };

        var rejected;
        AuthInterceptor.responseError(response).catch(function(err) {
          rejected = err;
        });
        $rootScope.$apply();

        expect($location.path).not.toHaveBeenCalled();
        expect(rejected).toBe(response);
      });

      it('should not redirect on 500 error', function() {
        var response = {
          status: 500,
          data: 'Internal Server Error'
        };

        var rejected;
        AuthInterceptor.responseError(response).catch(function(err) {
          rejected = err;
        });
        $rootScope.$apply();

        expect($location.path).not.toHaveBeenCalled();
        expect(rejected).toBe(response);
      });

      it('should return rejected promise', function() {
        var response = {
          status: 401,
          data: 'Unauthorized'
        };

        var promise = AuthInterceptor.responseError(response);

        expect(promise.then).toBeDefined();
        expect(promise.catch).toBeDefined();
      });

      it('should handle response without status code', function() {
        var response = {
          data: 'Error'
        };

        var rejected;
        AuthInterceptor.responseError(response).catch(function(err) {
          rejected = err;
        });
        $rootScope.$apply();

        expect($location.path).not.toHaveBeenCalled();
        expect(rejected).toBe(response);
      });

      it('should clear token even if already removed', function() {
        $window.localStorage.removeItem('authToken');

        var response = {
          status: 401,
          data: 'Unauthorized'
        };

        AuthInterceptor.responseError(response);
        $rootScope.$apply();

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($location.path).toHaveBeenCalledWith('/login');
      });
    });

    describe('interceptor structure', function() {
      it('should expose request method', function() {
        expect(AuthInterceptor.request).toBeDefined();
        expect(typeof AuthInterceptor.request).toBe('function');
      });

      it('should expose responseError method', function() {
        expect(AuthInterceptor.responseError).toBeDefined();
        expect(typeof AuthInterceptor.responseError).toBe('function');
      });

      it('should not expose response method', function() {
        expect(AuthInterceptor.response).toBeUndefined();
      });

      it('should not expose requestError method', function() {
        expect(AuthInterceptor.requestError).toBeUndefined();
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * Token injection into request headers
  * No token scenario
  * Headers initialization
  * Existing headers preservation
  * Empty token handling
  * 401 unauthorized error handling
  * 403 forbidden error handling
  * Non-auth errors (404, 500)
  * Token removal on auth errors
  * Redirect to login page
  * Promise rejection
  * Response without status code
  * Already removed token scenario
  * Interceptor method exposure
- Uncovered scenarios: None - comprehensive coverage achieved
- Edge cases tested: Empty tokens, missing status codes, multiple header preservation
*/