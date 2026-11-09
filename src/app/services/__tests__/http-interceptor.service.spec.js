/*
Test Documentation:
- Test Name: HttpInterceptorService Unit Tests
- Purpose: Validate HTTP request interception, Authorization header injection, and error handling
- Scenario: Tests cover request modification with auth tokens, error response handling, and integration with AuthService
- Expected Result: Interceptor should correctly add Authorization headers to requests and handle response errors appropriately
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, AuthService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$injector_, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      
      AuthService = _$injector_.get('AuthService');
      HttpInterceptorService = _$injector_.get('HttpInterceptorService');
    }));

    describe('request interceptor', function() {
      it('should add Authorization header when token exists', function() {
        var mockToken = 'test-token-123';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should not add Authorization header when token is null', function() {
        spyOn(AuthService, 'getToken').and.returnValue(null);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should not add Authorization header when token is empty string', function() {
        spyOn(AuthService, 'getToken').and.returnValue('');

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeUndefined();
      });

      it('should preserve existing headers when adding Authorization', function() {
        var mockToken = 'test-token-456';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config = {
          url: '/api/cards',
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
      });

      it('should initialize headers object if not present', function() {
        var mockToken = 'test-token-789';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config = {
          url: '/api/cards',
          method: 'GET'
        };

        var result = HttpInterceptorService.request(config);

        expect(result.headers).toBeDefined();
        expect(typeof result.headers).toBe('object');
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should return config object unchanged except for headers', function() {
        var mockToken = 'test-token-abc';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config = {
          url: '/api/transactions',
          method: 'POST',
          data: { amount: 100 },
          timeout: 5000
        };

        var result = HttpInterceptorService.request(config);

        expect(result.url).toBe(config.url);
        expect(result.method).toBe(config.method);
        expect(result.data).toEqual(config.data);
        expect(result.timeout).toBe(config.timeout);
      });

      it('should handle multiple consecutive requests', function() {
        var mockToken = 'test-token-multi';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config1 = { url: '/api/cards', method: 'GET' };
        var config2 = { url: '/api/transactions', method: 'POST' };
        var config3 = { url: '/api/analytics', method: 'GET' };

        var result1 = HttpInterceptorService.request(config1);
        var result2 = HttpInterceptorService.request(config2);
        var result3 = HttpInterceptorService.request(config3);

        expect(result1.headers.Authorization).toBe('Bearer ' + mockToken);
        expect(result2.headers.Authorization).toBe('Bearer ' + mockToken);
        expect(result3.headers.Authorization).toBe('Bearer ' + mockToken);
      });
    });

    describe('responseError interceptor', function() {
      it('should reject promise with error object', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { error: 'Invalid token' }
        };

        var result = HttpInterceptorService.responseError(rejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(rejection);
        });

        $rootScope.$apply();
      });

      it('should handle 401 Unauthorized errors', function() {
        var rejection = {
          status: 401,
          statusText: 'Unauthorized'
        };

        var errorCaught = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(401);
        });

        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      it('should handle 403 Forbidden errors', function() {
        var rejection = {
          status: 403,
          statusText: 'Forbidden'
        };

        var errorCaught = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(403);
        });

        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      it('should handle 500 Internal Server Error', function() {
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server crashed' }
        };

        var errorCaught = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(500);
          expect(error.data.message).toBe('Server crashed');
        });

        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      it('should handle network errors (status 0)', function() {
        var rejection = {
          status: 0,
          statusText: ''
        };

        var errorCaught = false;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(0);
        });

        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      it('should preserve error data in rejection', function() {
        var rejection = {
          status: 400,
          statusText: 'Bad Request',
          data: {
            errors: [
              { field: 'cardNumber', message: 'Invalid format' },
              { field: 'cvv', message: 'Required' }
            ]
          },
          config: {
            url: '/api/cards',
            method: 'POST'
          }
        };

        HttpInterceptorService.responseError(rejection).catch(function(error) {
          expect(error.data.errors).toBeDefined();
          expect(error.data.errors.length).toBe(2);
          expect(error.config.url).toBe('/api/cards');
        });

        $rootScope.$apply();
      });
    });

    describe('integration scenarios', function() {
      it('should work with $http service flow', function() {
        var mockToken = 'integration-token';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);

        var config = {
          url: '/api/cards',
          method: 'GET',
          headers: {}
        };

        var modifiedConfig = HttpInterceptorService.request(config);
        expect(modifiedConfig.headers.Authorization).toBe('Bearer ' + mockToken);

        var rejection = { status: 401 };
        var errorHandled = false;
        HttpInterceptorService.responseError(rejection).catch(function() {
          errorHandled = true;
        });

        $rootScope.$apply();
        expect(errorHandled).toBe(true);
      });

      it('should handle token changes between requests', function() {
        var token1 = 'token-1';
        var token2 = 'token-2';
        var getTokenSpy = spyOn(AuthService, 'getToken');

        getTokenSpy.and.returnValue(token1);
        var config1 = HttpInterceptorService.request({ url: '/api/cards' });
        expect(config1.headers.Authorization).toBe('Bearer ' + token1);

        getTokenSpy.and.returnValue(token2);
        var config2 = HttpInterceptorService.request({ url: '/api/transactions' });
        expect(config2.headers.Authorization).toBe('Bearer ' + token2);
      });
    });

    describe('edge cases', function() {
      it('should handle undefined config object gracefully', function() {
        spyOn(AuthService, 'getToken').and.returnValue('token');
        
        expect(function() {
          HttpInterceptorService.request(undefined);
        }).toThrow();
      });

      it('should handle null rejection in responseError', function() {
        var result = HttpInterceptorService.responseError(null);
        
        var errorCaught = false;
        result.catch(function(error) {
          errorCaught = true;
          expect(error).toBeNull();
        });

        $rootScope.$apply();
        expect(errorCaught).toBe(true);
      });

      it('should handle very long token strings', function() {
        var longToken = new Array(1000).join('a');
        spyOn(AuthService, 'getToken').and.returnValue(longToken);

        var config = { url: '/api/test' };
        var result = HttpInterceptorService.request(config);

        expect(result.headers.Authorization).toBe('Bearer ' + longToken);
      });

      it('should handle special characters in token', function() {
        var specialToken = 'token!@#$%^&*()';
        spyOn(AuthService, 'getToken').and.returnValue(specialToken);

        var config = { url: '/api/test' };
        var result = HttpInterceptorService.request(config);

        expect(result.headers.Authorization).toBe('Bearer ' + specialToken);
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * Authorization header injection with valid token
  * Skipping header injection when token is null/empty
  * Preserving existing headers
  * Initializing headers object when missing
  * Handling multiple HTTP error codes (401, 403, 500, 0)
  * Promise rejection with error data preservation
  * Integration with AuthService
  * Token changes between requests
  * Edge cases (undefined config, null rejection, special characters)
- Uncovered scenarios:
  * Request timeout handling
  * Request cancellation
  * Response success interception
  * Token refresh on 401 errors
  * Retry logic for failed requests
  * Request/response transformation
*/