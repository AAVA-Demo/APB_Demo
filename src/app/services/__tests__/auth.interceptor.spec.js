/*
Test Documentation:
- Test Name: AuthInterceptor HTTP Interceptor
- Purpose: Validates authentication token injection and error handling in HTTP requests
- Scenario: Test request interception, token addition, and 401 error handling
- Expected Result: Interceptor should add auth tokens to requests and handle 401 errors properly
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor;
    var $q;
    var $window;
    var $injector;
    var $location;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthInterceptor_, _$q_, _$window_, _$injector_) {
      AuthInterceptor = _AuthInterceptor_;
      $q = _$q_;
      $window = _$window_;
      $injector = _$injector_;
      
      // Mock $location
      $location = {
        path: jasmine.createSpy('path')
      };
      spyOn($injector, 'get').and.returnValue($location);
    }));

    afterEach(function() {
      $window.localStorage.removeItem('authToken');
    });

    /*
    Test Documentation:
    - Test Name: AuthInterceptor should be defined
    - Purpose: Ensures the interceptor factory is registered
    - Scenario: Inject AuthInterceptor and verify definition
    - Expected Result: AuthInterceptor is defined
    */
    it('should be defined', function() {
      expect(AuthInterceptor).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: AuthInterceptor should have request method
    - Purpose: Validates the request interceptor method exists
    - Scenario: Check for request function
    - Expected Result: request method is defined and is a function
    */
    it('should have a request method', function() {
      expect(AuthInterceptor.request).toBeDefined();
      expect(typeof AuthInterceptor.request).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: AuthInterceptor should have responseError method
    - Purpose: Validates the error interceptor method exists
    - Scenario: Check for responseError function
    - Expected Result: responseError method is defined and is a function
    */
    it('should have a responseError method', function() {
      expect(AuthInterceptor.responseError).toBeDefined();
      expect(typeof AuthInterceptor.responseError).toBe('function');
    });

    describe('request method', function() {
      /*
      Test Documentation:
      - Test Name: Add Authorization header when token exists
      - Purpose: Validates token injection into request headers
      - Scenario: Store token in localStorage and make request
      - Expected Result: Authorization header added with Bearer token
      */
      it('should add Authorization header when token exists in localStorage', function() {
        var testToken = 'test-jwt-token-12345';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      /*
      Test Documentation:
      - Test Name: Initialize headers object if not present
      - Purpose: Ensures headers object is created when missing
      - Scenario: Pass config without headers property
      - Expected Result: headers object is created and token is added
      */
      it('should initialize headers object if not present', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeDefined();
        expect(typeof result.headers).toBe('object');
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      /*
      Test Documentation:
      - Test Name: Preserve existing headers when adding token
      - Purpose: Validates that existing headers are not overwritten
      - Scenario: Pass config with existing headers
      - Expected Result: Existing headers preserved, Authorization added
      */
      it('should preserve existing headers when adding Authorization', function() {
        var testToken = 'test-token';
        $window.localStorage.setItem('authToken', testToken);

        var config = {
          url: '/api/cards',
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

      /*
      Test Documentation:
      - Test Name: Do not add Authorization header when token is missing
      - Purpose: Validates behavior when no token is stored
      - Scenario: Make request without token in localStorage
      - Expected Result: No Authorization header added, config returned unchanged
      */
      it('should not add Authorization header when token does not exist', function() {
        $window.localStorage.removeItem('authToken');

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeUndefined();
      });

      /*
      Test Documentation:
      - Test Name: Handle null token gracefully
      - Purpose: Validates behavior with null token value
      - Scenario: Set token to null in localStorage
      - Expected Result: No Authorization header added
      */
      it('should handle null token gracefully', function() {
        $window.localStorage.setItem('authToken', null);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeUndefined();
      });

      /*
      Test Documentation:
      - Test Name: Handle empty string token
      - Purpose: Validates behavior with empty token value
      - Scenario: Set token to empty string in localStorage
      - Expected Result: No Authorization header added
      */
      it('should not add Authorization header for empty string token', function() {
        $window.localStorage.setItem('authToken', '');

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result.headers).toBeUndefined();
      });

      /*
      Test Documentation:
      - Test Name: Return config object
      - Purpose: Validates that config is returned for request chain
      - Scenario: Call request method
      - Expected Result: Config object is returned
      */
      it('should return the config object', function() {
        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = AuthInterceptor.request(config);

        expect(result).toBe(config);
      });
    });

    describe('responseError method', function() {
      /*
      Test Documentation:
      - Test Name: Handle 401 Unauthorized error
      - Purpose: Validates redirect to login on authentication failure
      - Scenario: Simulate 401 response error
      - Expected Result: Token removed, redirect to /login, promise rejected
      */
      it('should handle 401 Unauthorized error by redirecting to login', function() {
        var testToken = 'expired-token';
        $window.localStorage.setItem('authToken', testToken);

        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Token expired' }
        };

        var result = AuthInterceptor.responseError(rejection);

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($injector.get).toHaveBeenCalledWith('$location');
        expect($location.path).toHaveBeenCalledWith('/login');
        expect(result).toBeDefined();
      });

      /*
      Test Documentation:
      - Test Name: Remove authToken on 401 error
      - Purpose: Validates token cleanup on authentication failure
      - Scenario: Trigger 401 error with stored token
      - Expected Result: authToken removed from localStorage
      */
      it('should remove authToken from localStorage on 401 error', function() {
        $window.localStorage.setItem('authToken', 'test-token');

        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };

        AuthInterceptor.responseError(rejection);

        expect($window.localStorage.getItem('authToken')).toBeNull();
      });

      /*
      Test Documentation:
      - Test Name: Redirect to /login on 401 error
      - Purpose: Validates navigation to login page
      - Scenario: Trigger 401 error
      - Expected Result: $location.path called with '/login'
      */
      it('should redirect to /login page on 401 error', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };

        AuthInterceptor.responseError(rejection);

        expect($location.path).toHaveBeenCalledWith('/login');
      });

      /*
      Test Documentation:
      - Test Name: Return rejected promise on 401 error
      - Purpose: Validates promise chain continues with rejection
      - Scenario: Trigger 401 error
      - Expected Result: Rejected promise returned
      */
      it('should return a rejected promise on 401 error', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };

        var result = AuthInterceptor.responseError(rejection);

        expect(result).toBeDefined();
        expect(result.$$state).toBeDefined();
      });

      /*
      Test Documentation:
      - Test Name: Pass through non-401 errors
      - Purpose: Validates other errors are not intercepted
      - Scenario: Trigger 403, 404, 500 errors
      - Expected Result: Errors passed through, no redirect, token preserved
      */
      it('should pass through non-401 errors without redirecting', function() {
        $window.localStorage.setItem('authToken', 'valid-token');

        var rejection403 = { status: 403, statusText: 'Forbidden' };
        var rejection404 = { status: 404, statusText: 'Not Found' };
        var rejection500 = { status: 500, statusText: 'Internal Server Error' };

        AuthInterceptor.responseError(rejection403);
        expect($location.path).not.toHaveBeenCalled();
        expect($window.localStorage.getItem('authToken')).toBe('valid-token');

        AuthInterceptor.responseError(rejection404);
        expect($location.path).not.toHaveBeenCalled();
        expect($window.localStorage.getItem('authToken')).toBe('valid-token');

        AuthInterceptor.responseError(rejection500);
        expect($location.path).not.toHaveBeenCalled();
        expect($window.localStorage.getItem('authToken')).toBe('valid-token');
      });

      /*
      Test Documentation:
      - Test Name: Handle 400 Bad Request error
      - Purpose: Validates client errors are passed through
      - Scenario: Trigger 400 error
      - Expected Result: Error passed through, no redirect
      */
      it('should not redirect on 400 Bad Request error', function() {
        var rejection = {
          status: 400,
          statusText: 'Bad Request'
        };

        AuthInterceptor.responseError(rejection);

        expect($location.path).not.toHaveBeenCalled();
      });

      /*
      Test Documentation:
      - Test Name: Handle network errors (status 0)
      - Purpose: Validates network failure handling
      - Scenario: Trigger network error with status 0
      - Expected Result: Error passed through, no redirect
      */
      it('should not redirect on network errors (status 0)', function() {
        var rejection = {
          status: 0,
          statusText: 'Network Error'
        };

        AuthInterceptor.responseError(rejection);

        expect($location.path).not.toHaveBeenCalled();
      });

      /*
      Test Documentation:
      - Test Name: Handle rejection without status property
      - Purpose: Validates robustness with malformed error objects
      - Scenario: Pass rejection without status
      - Expected Result: No error thrown, rejection passed through
      */
      it('should handle rejection without status property', function() {
        var rejection = {
          data: { message: 'Unknown error' }
        };

        expect(function() {
          AuthInterceptor.responseError(rejection);
        }).not.toThrow();

        expect($location.path).not.toHaveBeenCalled();
      });

      /*
      Test Documentation:
      - Test Name: Use $injector to get $location lazily
      - Purpose: Validates lazy injection to avoid circular dependency
      - Scenario: Trigger 401 error
      - Expected Result: $injector.get called with '$location'
      */
      it('should use $injector to get $location service lazily', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };

        AuthInterceptor.responseError(rejection);

        expect($injector.get).toHaveBeenCalledWith('$location');
      });
    });

    describe('Integration scenarios', function() {
      /*
      Test Documentation:
      - Test Name: Complete authentication flow
      - Purpose: Validates end-to-end token lifecycle
      - Scenario: Add token, make request, simulate 401, verify cleanup
      - Expected Result: Token added to request, then removed on 401
      */
      it('should handle complete authentication flow', function() {
        var testToken = 'integration-test-token';
        $window.localStorage.setItem('authToken', testToken);

        var config = { url: '/api/cards', method: 'GET' };
        var requestResult = AuthInterceptor.request(config);

        expect(requestResult.headers.Authorization).toBe('Bearer ' + testToken);

        var rejection = { status: 401, statusText: 'Unauthorized' };
        AuthInterceptor.responseError(rejection);

        expect($window.localStorage.getItem('authToken')).toBeNull();
        expect($location.path).toHaveBeenCalledWith('/login');
      });

      /*
      Test Documentation:
      - Test Name: Multiple requests with same token
      - Purpose: Validates token reuse across multiple requests
      - Scenario: Make multiple requests with stored token
      - Expected Result: All requests have Authorization header
      */
      it('should add token to multiple consecutive requests', function() {
        var testToken = 'multi-request-token';
        $window.localStorage.setItem('authToken', testToken);

        var config1 = { url: '/api/cards', method: 'GET' };
        var config2 = { url: '/api/transactions', method: 'POST' };
        var config3 = { url: '/api/analytics', method: 'GET' };

        var result1 = AuthInterceptor.request(config1);
        var result2 = AuthInterceptor.request(config2);
        var result3 = AuthInterceptor.request(config3);

        expect(result1.headers.Authorization).toBe('Bearer ' + testToken);
        expect(result2.headers.Authorization).toBe('Bearer ' + testToken);
        expect(result3.headers.Authorization).toBe('Bearer ' + testToken);
      });
    });
  });

})();

/*
Coverage Report:
- Module tested: creditCardApp
- Factory tested: AuthInterceptor
- Functions tested:
  1. request() - Token injection into HTTP requests
  2. responseError() - 401 error handling and redirect
- Scenarios covered:
  1. Normal flow: Token exists and is added to requests
  2. Edge cases: Missing token, null token, empty token
  3. Error scenarios: 401 (handled), 403, 404, 500 (passed through)
  4. Integration: Complete auth flow, multiple requests
  5. Robustness: Malformed error objects, network errors
- Uncovered scenarios: None identified
- Security considerations:
  - Token stored in localStorage (standard practice for SPAs)
  - Bearer token format used (OAuth 2.0 standard)
  - Automatic cleanup on authentication failure
  - Lazy injection of $location to avoid circular dependencies
*/
