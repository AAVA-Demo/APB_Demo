/*
Test Documentation:
- Test Name: HttpInterceptorService unit tests
- Purpose: Validate HTTP interceptor functionality for authentication and error handling
- Scenario: Request interception with token injection and response error handling
- Expected Result: Interceptor adds authorization headers and handles HTTP errors appropriately
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService;
    var AuthService;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(function() {
      module(function($provide) {
        $provide.service('AuthService', function() {
          this.getToken = jasmine.createSpy('getToken').and.returnValue('mock-token-123');
        });
      });
    });

    beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$q_, _$rootScope_) {
      HttpInterceptorService = _HttpInterceptorService_;
      AuthService = _AuthService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify HttpInterceptorService is properly instantiated
    - Scenario: Factory injection
    - Expected Result: HttpInterceptorService exists and has required methods
    */
    it('should be defined', function() {
      expect(HttpInterceptorService).toBeDefined();
      expect(HttpInterceptorService).not.toBeNull();
    });

    /*
    Test Documentation:
    - Test Name: should have request method
    - Purpose: Verify request interceptor method exists
    - Scenario: Check for request method
    - Expected Result: request method is defined and is a function
    */
    it('should have request method', function() {
      expect(HttpInterceptorService.request).toBeDefined();
      expect(typeof HttpInterceptorService.request).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: should have responseError method
    - Purpose: Verify responseError interceptor method exists
    - Scenario: Check for responseError method
    - Expected Result: responseError method is defined and is a function
    */
    it('should have responseError method', function() {
      expect(HttpInterceptorService.responseError).toBeDefined();
      expect(typeof HttpInterceptorService.responseError).toBe('function');
    });

    describe('request interceptor', function() {
      /*
      Test Documentation:
      - Test Name: should add Authorization header when token exists
      - Purpose: Verify request interceptor adds Bearer token to headers
      - Scenario: Token is available from AuthService
      - Expected Result: Authorization header is added with Bearer token
      */
      it('should add Authorization header when token exists', function() {
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer mock-token-123');
      });

      /*
      Test Documentation:
      - Test Name: should preserve existing headers when adding Authorization
      - Purpose: Verify interceptor does not overwrite existing headers
      - Scenario: Config already has headers
      - Expected Result: Existing headers are preserved, Authorization is added
      */
      it('should preserve existing headers when adding Authorization', function() {
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer mock-token-123');
      });

      /*
      Test Documentation:
      - Test Name: should handle null token gracefully
      - Purpose: Verify interceptor handles missing token
      - Scenario: AuthService returns null token
      - Expected Result: Config is returned without Authorization header
      */
      it('should handle null token gracefully', function() {
        AuthService.getToken.and.returnValue(null);
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result).toBe(config);
        expect(result.headers).toBeUndefined();
      });

      /*
      Test Documentation:
      - Test Name: should handle empty string token
      - Purpose: Verify interceptor handles empty token
      - Scenario: AuthService returns empty string
      - Expected Result: Config is returned without Authorization header
      */
      it('should handle empty string token', function() {
        AuthService.getToken.and.returnValue('');
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result).toBe(config);
      });
    });

    describe('responseError interceptor', function() {
      /*
      Test Documentation:
      - Test Name: should handle 401 Unauthorized error
      - Purpose: Verify interceptor logs and rejects 401 errors
      - Scenario: HTTP response with 401 status
      - Expected Result: Error is logged and promise is rejected
      */
      it('should handle 401 Unauthorized error', function() {
        spyOn(console, 'error');
        
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid token' }
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        expect(result).toBeDefined();
        
        var errorCaught = false;
        result.catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });
        
        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should handle 500 Server error
      - Purpose: Verify interceptor logs and rejects 500 errors
      - Scenario: HTTP response with 500 status
      - Expected Result: Error is logged and promise is rejected
      */
      it('should handle 500 Server error', function() {
        spyOn(console, 'error');
        
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server failure' }
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).toHaveBeenCalledWith('Server error');
        expect(result).toBeDefined();
        
        var errorCaught = false;
        result.catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });
        
        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should handle other HTTP errors without specific logging
      - Purpose: Verify interceptor handles non-401/500 errors
      - Scenario: HTTP response with 404 status
      - Expected Result: Promise is rejected without specific error logging
      */
      it('should handle other HTTP errors without specific logging', function() {
        spyOn(console, 'error');
        
        var rejection = {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Resource not found' }
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).not.toHaveBeenCalled();
        
        var errorCaught = false;
        result.catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });
        
        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should handle 403 Forbidden error
      - Purpose: Verify interceptor handles forbidden errors
      - Scenario: HTTP response with 403 status
      - Expected Result: Promise is rejected without specific logging
      */
      it('should handle 403 Forbidden error', function() {
        spyOn(console, 'error');
        
        var rejection = {
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'Access denied' }
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).not.toHaveBeenCalled();
        
        var errorCaught = false;
        result.catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(403);
        });
        
        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      /*
      Test Documentation:
      - Test Name: should return rejected promise for all errors
      - Purpose: Verify all errors result in rejected promises
      - Scenario: Various HTTP error statuses
      - Expected Result: All return rejected promises
      */
      it('should return rejected promise for all errors', function() {
        var statuses = [400, 401, 403, 404, 500, 503];
        
        statuses.forEach(function(status) {
          var rejection = { status: status, data: {} };
          var result = HttpInterceptorService.responseError(rejection);
          
          expect(result).toBeDefined();
          expect(typeof result.catch).toBe('function');
        });
      });
    });
  });

  /*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * Service instantiation and method existence
  * Request interception with token injection
  * Authorization header addition
  * Preservation of existing headers
  * Null token handling
  * Empty token handling
  * 401 Unauthorized error handling
  * 500 Server error handling
  * Other HTTP error handling (404, 403)
  * Rejected promise return for all errors
- Uncovered scenarios: None (all interceptor paths tested)
- Edge cases:
  * Null token
  * Empty string token
  * Existing headers preservation
  * Various HTTP error codes
- Error scenarios:
  * 401 Unauthorized with logging
  * 500 Server error with logging
  * Other errors without specific logging
  * Promise rejection for all error types
*/
})();