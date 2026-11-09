/*
Test Documentation:
- Test Name: HttpInterceptorService - Request and Error Handling
- Purpose: Validates HTTP request interception, authentication header injection, and error response handling
- Scenario: Testing request interceptor for auth token injection and responseError for various HTTP error codes
- Expected Result: Auth headers are added to requests, appropriate error messages displayed for different error scenarios
*/

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection in request headers, 401 authentication errors, 500 server errors, generic errors
- Edge cases: missing auth token, undefined rejection data, various HTTP status codes
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService;
    var AuthService;
    var toastr;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _toastr_, _$q_, _$rootScope_) {
      HttpInterceptorService = _HttpInterceptorService_;
      AuthService = _AuthService_;
      toastr = _toastr_;
      $q = _$q_;
      $rootScope = _$rootScope_;

      // Spy on AuthService and toastr methods
      spyOn(AuthService, 'getAuthToken').and.returnValue('mock-token-12345');
      spyOn(toastr, 'error');
    }));

    describe('request interceptor', function() {
      /*
      Test Documentation:
      - Test Name: should add Authorization header when token exists
      - Purpose: Verify authentication token is injected into request headers
      - Scenario: Valid token is available from AuthService
      - Expected Result: Authorization header is added with Bearer token
      */
      it('should add Authorization header when token exists', function() {
        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(AuthService.getAuthToken).toHaveBeenCalled();
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer mock-token-12345');
      });

      /*
      Test Documentation:
      - Test Name: should preserve existing headers when adding Authorization
      - Purpose: Verify existing headers are not overwritten
      - Scenario: Request already has custom headers
      - Expected Result: Existing headers preserved, Authorization header added
      */
      it('should preserve existing headers when adding Authorization', function() {
        var config = {
          url: '/api/test',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer mock-token-12345');
      });

      /*
      Test Documentation:
      - Test Name: should handle missing token gracefully
      - Purpose: Verify interceptor works when no token is available
      - Scenario: AuthService returns null/undefined token
      - Expected Result: Request proceeds without Authorization header
      */
      it('should handle missing token gracefully', function() {
        AuthService.getAuthToken.and.returnValue(null);
        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeUndefined();
      });
    });

    describe('responseError interceptor', function() {
      /*
      Test Documentation:
      - Test Name: should display authentication error for 401 status
      - Purpose: Verify proper error handling for authentication failures
      - Scenario: HTTP 401 Unauthorized response
      - Expected Result: Displays authentication error message via toastr
      */
      it('should display authentication error for 401 status', function() {
        var rejection = {
          status: 401,
          data: { message: 'Unauthorized' }
        };

        HttpInterceptorService.responseError(rejection);

        expect(toastr.error).toHaveBeenCalledWith(
          'Authentication failed. Please login again.',
          'Error'
        );
      });

      /*
      Test Documentation:
      - Test Name: should display server error for 500 status
      - Purpose: Verify proper error handling for server errors
      - Scenario: HTTP 500 Internal Server Error response
      - Expected Result: Displays server error message via toastr
      */
      it('should display server error for 500 status', function() {
        var rejection = {
          status: 500,
          data: { message: 'Internal Server Error' }
        };

        HttpInterceptorService.responseError(rejection);

        expect(toastr.error).toHaveBeenCalledWith(
          'Server error. Please try again later.',
          'Error'
        );
      });

      /*
      Test Documentation:
      - Test Name: should display generic error for other status codes
      - Purpose: Verify error handling for non-401/500 errors
      - Scenario: HTTP 404 or other error response
      - Expected Result: Displays error message from response data
      */
      it('should display generic error for other status codes', function() {
        var rejection = {
          status: 404,
          data: { message: 'Resource not found' }
        };

        HttpInterceptorService.responseError(rejection);

        expect(toastr.error).toHaveBeenCalledWith(
          'Request failed: Resource not found',
          'Error'
        );
      });

      /*
      Test Documentation:
      - Test Name: should handle error with missing data message
      - Purpose: Verify error handling when response has no message
      - Scenario: Error response without data.message property
      - Expected Result: Displays 'Unknown error' message
      */
      it('should handle error with missing data message', function() {
        var rejection = {
          status: 400,
          data: {}
        };

        HttpInterceptorService.responseError(rejection);

        expect(toastr.error).toHaveBeenCalledWith(
          'Request failed: Unknown error',
          'Error'
        );
      });

      /*
      Test Documentation:
      - Test Name: should handle error with undefined data
      - Purpose: Verify error handling when response data is undefined
      - Scenario: Error response with no data property
      - Expected Result: Displays 'Unknown error' message
      */
      it('should handle error with undefined data', function() {
        var rejection = {
          status: 403
        };

        HttpInterceptorService.responseError(rejection);

        expect(toastr.error).toHaveBeenCalledWith(
          'Request failed: Unknown error',
          'Error'
        );
      });

      /*
      Test Documentation:
      - Test Name: should return rejected promise
      - Purpose: Verify error propagation through promise chain
      - Scenario: Any error response
      - Expected Result: Returns rejected promise with original rejection
      */
      it('should return rejected promise', function() {
        var rejection = {
          status: 500,
          data: { message: 'Server error' }
        };

        var result = HttpInterceptorService.responseError(rejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
      });

      /*
      Test Documentation:
      - Test Name: should handle multiple error types in sequence
      - Purpose: Verify interceptor handles different errors correctly
      - Scenario: Multiple different error responses
      - Expected Result: Each error type displays appropriate message
      */
      it('should handle multiple error types in sequence', function() {
        var rejection401 = { status: 401, data: {} };
        var rejection500 = { status: 500, data: {} };
        var rejection404 = { status: 404, data: { message: 'Not found' } };

        HttpInterceptorService.responseError(rejection401);
        expect(toastr.error).toHaveBeenCalledWith(
          'Authentication failed. Please login again.',
          'Error'
        );

        HttpInterceptorService.responseError(rejection500);
        expect(toastr.error).toHaveBeenCalledWith(
          'Server error. Please try again later.',
          'Error'
        );

        HttpInterceptorService.responseError(rejection404);
        expect(toastr.error).toHaveBeenCalledWith(
          'Request failed: Not found',
          'Error'
        );

        expect(toastr.error).toHaveBeenCalledTimes(3);
      });
    });
  });
})();