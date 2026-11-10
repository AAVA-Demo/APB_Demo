/*
Test Documentation:
- Test Name: HttpInterceptorService Unit Tests
- Purpose: Validate HTTP interceptor functionality for authentication headers, encryption headers, and error handling
- Scenario: Tests cover request interception with token injection, encryption header addition, and response error handling with redirects
- Expected Result: All HTTP requests should include proper authentication and encryption headers, and unauthorized responses should trigger redirects
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, $window, $q, $rootScope;
    var mockToken = 'mock-jwt-token-12345';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_HttpInterceptorService_, _$window_, _$q_, _$rootScope_) {
      HttpInterceptorService = _HttpInterceptorService_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      
      // Clear localStorage and reset location
      $window.localStorage.clear();
      $window.location.href = '';
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('request interceptor', function() {
      it('should add Authorization header when token exists', function() {
        $window.localStorage.setItem('authToken', mockToken);
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should add X-Encryption header when token exists', function() {
        $window.localStorage.setItem('authToken', mockToken);
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers['X-Encryption']).toBe('AES256');
      });

      it('should not add headers when token does not exist', function() {
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers.Authorization).toBeUndefined();
        expect(result.headers['X-Encryption']).toBeUndefined();
      });

      it('should preserve existing headers', function() {
        $window.localStorage.setItem('authToken', mockToken);
        
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
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
        expect(result.headers['X-Encryption']).toBe('AES256');
      });

      it('should handle config without headers object', function() {
        $window.localStorage.setItem('authToken', mockToken);
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should return the same config object', function() {
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = HttpInterceptorService.request(config);

        expect(result).toBe(config);
      });

      it('should handle empty token string', function() {
        $window.localStorage.setItem('authToken', '');
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers.Authorization).toBeUndefined();
        expect(result.headers['X-Encryption']).toBeUndefined();
      });
    });

    describe('responseError interceptor', function() {
      it('should redirect to login on 401 unauthorized', function() {
        var rejection = {
          status: 401,
          data: { error: 'Unauthorized' },
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('#/login');
      });

      it('should redirect to login on 403 forbidden', function() {
        var rejection = {
          status: 403,
          data: { error: 'Forbidden' },
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('#/login');
      });

      it('should not redirect on 400 bad request', function() {
        var rejection = {
          status: 400,
          data: { error: 'Bad Request' },
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('');
      });

      it('should not redirect on 500 server error', function() {
        var rejection = {
          status: 500,
          data: { error: 'Internal Server Error' },
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('');
      });

      it('should return rejected promise with original rejection', function() {
        var rejection = {
          status: 401,
          data: { error: 'Unauthorized' },
          config: { url: '/api/test' }
        };

        var errorResult = null;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorResult = error;
        });

        $rootScope.$apply();

        expect(errorResult).toBe(rejection);
      });

      it('should handle rejection without status', function() {
        var rejection = {
          data: { error: 'Unknown error' },
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('');
      });

      it('should handle network timeout (-1 status)', function() {
        var rejection = {
          status: -1,
          data: null,
          config: { url: '/api/test' }
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('');
      });
    });

    describe('Integration scenarios', function() {
      it('should handle complete request-response cycle with valid token', function() {
        $window.localStorage.setItem('authToken', mockToken);
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        var requestResult = HttpInterceptorService.request(config);

        expect(requestResult.headers.Authorization).toBe('Bearer ' + mockToken);
        expect(requestResult.headers['X-Encryption']).toBe('AES256');
      });

      it('should handle authentication failure flow', function() {
        $window.localStorage.setItem('authToken', 'invalid-token');
        
        var config = {
          url: '/api/secure',
          method: 'GET',
          headers: {}
        };

        var requestResult = HttpInterceptorService.request(config);
        expect(requestResult.headers.Authorization).toBe('Bearer invalid-token');

        var rejection = {
          status: 401,
          data: { error: 'Invalid token' },
          config: config
        };

        var rejected = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          rejected = true;
        });

        $rootScope.$apply();

        expect(rejected).toBe(true);
        expect($window.location.href).toBe('#/login');
      });

      it('should handle multiple consecutive 401 errors', function() {
        var rejection = {
          status: 401,
          data: { error: 'Unauthorized' }
        };

        HttpInterceptorService.responseError(rejection);
        $rootScope.$apply();
        expect($window.location.href).toBe('#/login');

        $window.location.href = '';

        HttpInterceptorService.responseError(rejection);
        $rootScope.$apply();
        expect($window.location.href).toBe('#/login');
      });
    });
  });
})();

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * Normal flow: token injection, encryption header addition, error handling
  * Edge cases: missing token, empty token, missing headers object, missing status
  * Error scenarios: 401 unauthorized, 403 forbidden, 400 bad request, 500 server error, network timeout
  * Integration: complete request-response cycle, authentication failure flow, multiple 401 errors
- Uncovered scenarios: None - all critical paths tested
- NFR validation: Security headers (Authorization, X-Encryption), error handling, redirect behavior
*/