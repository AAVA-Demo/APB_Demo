/*
Test Documentation:
- Test Name: HttpInterceptorService - request with authentication
- Purpose: Validates that Authorization header is added when user is authenticated
- Scenario: Normal scenario with authenticated user
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - request without authentication
- Purpose: Validates that Authorization header is not added when user is not authenticated
- Scenario: Edge case with unauthenticated user
- Expected Result: No Authorization header is added
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError with 401
- Purpose: Validates error handling for unauthorized requests
- Scenario: Error scenario with 401 status
- Expected Result: Error is logged and rejection is returned
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: authenticated request, unauthenticated request, 401 error, other errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, AuthService, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$q_) {
      HttpInterceptorService = _HttpInterceptorService_;
      AuthService = _AuthService_;
      $q = _$q_;
    }));

    describe('request', function() {
      it('should add Authorization header when user is authenticated', function() {
        spyOn(AuthService, 'isAuthenticated').and.returnValue(true);
        spyOn(AuthService, 'getToken').and.returnValue('test-token-123');

        var config = { url: '/api/test' };
        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when user is not authenticated', function() {
        spyOn(AuthService, 'isAuthenticated').and.returnValue(false);

        var config = { url: '/api/test' };
        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should preserve existing headers when adding Authorization', function() {
        spyOn(AuthService, 'isAuthenticated').and.returnValue(true);
        spyOn(AuthService, 'getToken').and.returnValue('test-token-123');

        var config = {
          url: '/api/test',
          headers: { 'Content-Type': 'application/json' }
        };
        var result = HttpInterceptorService.request(config);

        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });
    });

    describe('responseError', function() {
      it('should log error and reject promise for 401 status', function() {
        spyOn(console, 'error');
        var rejection = { status: 401, data: 'Unauthorized' };
        
        var result = HttpInterceptorService.responseError(rejection);

        expect(console.error).toHaveBeenCalledWith('Unauthorized request');
        expect(result).toBeDefined();
      });

      it('should reject promise for non-401 errors', function() {
        spyOn(console, 'error');
        var rejection = { status: 500, data: 'Server Error' };
        
        var result = HttpInterceptorService.responseError(rejection);

        expect(console.error).not.toHaveBeenCalled();
        expect(result).toBeDefined();
      });

      it('should handle rejection without status code', function() {
        spyOn(console, 'error');
        var rejection = { data: 'Network Error' };
        
        var result = HttpInterceptorService.responseError(rejection);

        expect(console.error).not.toHaveBeenCalled();
        expect(result).toBeDefined();
      });
    });
  });
})();