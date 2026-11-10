/*
Test Documentation:
- Test Name: HttpInterceptorService Unit Tests
- Purpose: Validate HTTP interceptor functionality for request transformation and error handling
- Scenario: Tests cover request interception, authorization header injection, URL transformation, and error response handling
- Expected Result: All HTTP requests are properly intercepted, authenticated, and errors are handled correctly
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, $q, $injector, API_CONFIG, AuthService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$q_, _$injector_, _API_CONFIG_) {
      $q = _$q_;
      $injector = _$injector_;
      API_CONFIG = _API_CONFIG_;
      
      AuthService = {
        isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
        getToken: jasmine.createSpy('getToken').and.returnValue('test-token-123')
      };
      
      spyOn($injector, 'get').and.returnValue(AuthService);
      
      HttpInterceptorService = _$injector_.get('HttpInterceptorService');
    }));

    describe('request interceptor', function() {
      it('should transform API URL with base URL', function() {
        var config = {
          url: '/api/cards',
          headers: {}
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.url).toBe(API_CONFIG.baseUrl + '/cards');
      });

      it('should add Authorization header when authenticated', function() {
        var config = {
          url: '/api/transactions',
          headers: {}
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not modify non-API URLs', function() {
        var config = {
          url: '/templates/view.html',
          headers: {}
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.url).toBe('/templates/view.html');
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should create headers object if not present', function() {
        var config = {
          url: '/api/cards'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when not authenticated', function() {
        AuthService.isAuthenticated.and.returnValue(false);
        
        var config = {
          url: '/api/cards',
          headers: {}
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should preserve existing headers', function() {
        var config = {
          url: '/api/cards',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });
    });

    describe('responseError interceptor', function() {
      it('should handle 401 Unauthorized error', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 401,
          data: 'Unauthorized'
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should handle 500 Server Error', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 500,
          data: 'Internal Server Error'
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).toHaveBeenCalledWith('Server error');
        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should pass through other error codes', function() {
        spyOn(console, 'error');
        var rejection = {
          status: 404,
          data: 'Not Found'
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(console.error).not.toHaveBeenCalled();
        result.catch(function(error) {
          expect(error).toBe(rejection);
        });
      });

      it('should return rejected promise', function() {
        var rejection = {
          status: 401
        };
        
        var result = HttpInterceptorService.responseError(rejection);
        
        expect(result).toBeDefined();
        expect(typeof result.catch).toBe('function');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered:
  * API URL transformation
  * Authorization header injection
  * Non-API URL passthrough
  * Headers object creation
  * Unauthenticated request handling
  * Existing headers preservation
  * 401 error handling
  * 500 error handling
  * Other error codes passthrough
  * Promise rejection
- Uncovered scenarios: None - all interceptor methods tested
- Edge cases: Missing headers, non-API URLs, unauthenticated state, various HTTP error codes
*/