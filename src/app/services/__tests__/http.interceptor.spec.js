/*
Test Documentation:
- Test Name: httpInterceptor - request with existing token
- Purpose: Validates that request interceptor adds Authorization header when token exists
- Scenario: Token exists in sessionStorage and HTTP request is made
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: httpInterceptor - request without token
- Purpose: Validates that request interceptor handles missing token gracefully
- Scenario: No token in sessionStorage and HTTP request is made
- Expected Result: Request config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: httpInterceptor - responseError with 401 status
- Purpose: Validates that responseError logs error for unauthorized access
- Scenario: HTTP response returns 401 status
- Expected Result: Error is logged and rejection is returned
*/
/*
Test Documentation:
- Test Name: httpInterceptor - responseError with other status
- Purpose: Validates that responseError handles non-401 errors
- Scenario: HTTP response returns non-401 error status
- Expected Result: Rejection is returned without logging
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, missing token handling, 401 error handling, other error handling
- Edge cases: missing token, various HTTP error codes
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('httpInterceptor', function() {
    var httpInterceptor;
    var $window;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_httpInterceptor_, _$window_, _$q_, _$rootScope_) {
      httpInterceptor = _httpInterceptor_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      
      // Clear sessionStorage before each test
      $window.sessionStorage.clear();
    }));

    describe('request interceptor', function() {
      it('should add Authorization header when token exists in sessionStorage', function() {
        var testToken = 'test-bearer-token-123';
        $window.sessionStorage.setItem('authToken', testToken);
        
        var config = {
          headers: {},
          url: '/api/test'
        };
        
        var result = httpInterceptor.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });

      it('should not add Authorization header when token does not exist', function() {
        var config = {
          headers: {},
          url: '/api/test'
        };
        
        var result = httpInterceptor.request(config);
        
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should return the config object', function() {
        var config = {
          headers: {},
          url: '/api/test',
          method: 'GET'
        };
        
        var result = httpInterceptor.request(config);
        
        expect(result).toBe(config);
        expect(result.url).toBe('/api/test');
        expect(result.method).toBe('GET');
      });

      it('should preserve existing headers', function() {
        var testToken = 'test-token';
        $window.sessionStorage.setItem('authToken', testToken);
        
        var config = {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          },
          url: '/api/test'
        };
        
        var result = httpInterceptor.request(config);
        
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer ' + testToken);
      });
    });

    describe('responseError interceptor', function() {
      beforeEach(function() {
        spyOn(console, 'error');
      });

      it('should log error and reject promise when status is 401', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: 'Unauthorized access'
        };
        
        var result;
        var errorCaught = false;
        
        httpInterceptor.responseError(rejection).catch(function(err) {
          result = err;
          errorCaught = true;
        });
        
        $rootScope.$digest();
        
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        expect(errorCaught).toBe(true);
        expect(result).toBe(rejection);
      });

      it('should reject promise without logging when status is not 401', function() {
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: 'Server error'
        };
        
        var result;
        var errorCaught = false;
        
        httpInterceptor.responseError(rejection).catch(function(err) {
          result = err;
          errorCaught = true;
        });
        
        $rootScope.$digest();
        
        expect(console.error).not.toHaveBeenCalled();
        expect(errorCaught).toBe(true);
        expect(result).toBe(rejection);
      });

      it('should handle 403 Forbidden status', function() {
        var rejection = {
          status: 403,
          statusText: 'Forbidden'
        };
        
        var errorCaught = false;
        
        httpInterceptor.responseError(rejection).catch(function() {
          errorCaught = true;
        });
        
        $rootScope.$digest();
        
        expect(console.error).not.toHaveBeenCalled();
        expect(errorCaught).toBe(true);
      });

      it('should handle 404 Not Found status', function() {
        var rejection = {
          status: 404,
          statusText: 'Not Found'
        };
        
        var errorCaught = false;
        
        httpInterceptor.responseError(rejection).catch(function() {
          errorCaught = true;
        });
        
        $rootScope.$digest();
        
        expect(console.error).not.toHaveBeenCalled();
        expect(errorCaught).toBe(true);
      });
    });

    describe('edge cases', function() {
      it('should handle config without headers object', function() {
        var testToken = 'test-token';
        $window.sessionStorage.setItem('authToken', testToken);
        
        var config = {
          url: '/api/test'
        };
        
        // This should not throw an error
        expect(function() {
          httpInterceptor.request(config);
        }).not.toThrow();
      });

      it('should handle empty token string', function() {
        $window.sessionStorage.setItem('authToken', '');
        
        var config = {
          headers: {},
          url: '/api/test'
        };
        
        var result = httpInterceptor.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer ');
      });
    });
  });
})();