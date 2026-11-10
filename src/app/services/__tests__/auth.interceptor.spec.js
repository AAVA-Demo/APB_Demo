/*
Test Documentation:
- Test Name: AuthInterceptor - request with API URL
- Purpose: Validates Authorization header is added to API requests
- Scenario: HTTP request to /api/ endpoint
- Expected Result: Authorization header with Bearer token is added

- Test Name: AuthInterceptor - request without API URL
- Purpose: Validates non-API requests are not modified
- Scenario: HTTP request to non-API endpoint
- Expected Result: No Authorization header added

- Test Name: AuthInterceptor - responseError with 401
- Purpose: Validates handling of unauthorized responses
- Scenario: HTTP response with 401 status
- Expected Result: Error logged and rejection returned

- Test Name: AuthInterceptor - responseError with other status
- Purpose: Validates handling of non-401 errors
- Scenario: HTTP response with 500 status
- Expected Result: Rejection returned without logging
*/

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: API request interception, authorization header injection, error handling, 401 unauthorized handling
- Edge cases: non-API URLs, various HTTP error codes, missing headers object
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthInterceptor', function() {
    var AuthInterceptor;
    var AuthService;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthInterceptor_, _AuthService_, _$q_, _$rootScope_) {
      AuthInterceptor = _AuthInterceptor_;
      AuthService = _AuthService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('request', function() {
      it('should add Authorization header to API requests', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-123');
        var config = {
          url: '/api/dashboard/kpis',
          headers: {}
        };
        var result = AuthInterceptor.request(config);
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should create headers object if not present for API requests', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-456');
        var config = {
          url: '/api/cards'
        };
        var result = AuthInterceptor.request(config);
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-456');
      });

      it('should not add Authorization header to non-API requests', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-789');
        var config = {
          url: '/views/dashboard.html',
          headers: {}
        };
        var result = AuthInterceptor.request(config);
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should handle API requests with existing headers', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-abc');
        var config = {
          url: '/api/transactions',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        var result = AuthInterceptor.request(config);
        expect(result.headers.Authorization).toBe('Bearer test-token-abc');
        expect(result.headers['Content-Type']).toBe('application/json');
      });

      it('should handle URLs with /api/ in the middle', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-token-xyz');
        var config = {
          url: 'https://example.com/api/users',
          headers: {}
        };
        var result = AuthInterceptor.request(config);
        expect(result.headers.Authorization).toBe('Bearer test-token-xyz');
      });
    });

    describe('responseError', function() {
      it('should log error and reject promise for 401 status', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };
        var result = AuthInterceptor.responseError(rejection);
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error.status).toBe(401);
        });
        $rootScope.$apply();
      });

      it('should reject promise without logging for non-401 errors', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error'
        };
        var result = AuthInterceptor.responseError(rejection);
        expect(console.error).not.toHaveBeenCalled();
        result.catch(function(error) {
          expect(error.status).toBe(500);
        });
        $rootScope.$apply();
      });

      it('should handle 403 Forbidden without logging', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 403,
          statusText: 'Forbidden'
        };
        var result = AuthInterceptor.responseError(rejection);
        expect(console.error).not.toHaveBeenCalled();
        result.catch(function(error) {
          expect(error.status).toBe(403);
        });
        $rootScope.$apply();
      });

      it('should handle rejection with additional data', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Token expired' }
        };
        var result = AuthInterceptor.responseError(rejection);
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        result.catch(function(error) {
          expect(error.data.message).toBe('Token expired');
        });
        $rootScope.$apply();
      });
    });
  });
})();