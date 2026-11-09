/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor with valid token
- Purpose: Validates that the request interceptor adds Authorization header when token exists in localStorage
- Scenario: Token exists in localStorage and request is intercepted
- Expected Result: Authorization header is added to request config with Bearer token
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor without token
- Purpose: Validates that the request interceptor does not add Authorization header when no token exists
- Scenario: No token in localStorage and request is intercepted
- Scenario: Expected Result: Request config is returned without Authorization header
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError with 401 status
- Purpose: Validates that 401 errors are logged and rejected properly
- Scenario: HTTP response returns 401 Unauthorized status
- Expected Result: Error is logged to console and promise is rejected
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError with 500 status
- Purpose: Validates that 500 errors are logged and rejected properly
- Scenario: HTTP response returns 500 Internal Server Error status
- Expected Result: Error is logged to console and promise is rejected
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError with other status codes
- Purpose: Validates that non-401/500 errors are rejected without specific logging
- Scenario: HTTP response returns error status other than 401 or 500
- Expected Result: Promise is rejected without specific error logging
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: 
  * request with valid token
  * request without token
  * responseError with 401 status
  * responseError with 500 status
  * responseError with other status codes
- Uncovered scenarios: None - all primary and error paths covered
- Edge cases tested: Missing token, various HTTP error codes
*/

describe('HttpInterceptorService', function() {
  'use strict';

  var HttpInterceptorService;
  var $q;
  var $injector;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_HttpInterceptorService_, _$q_, _$injector_) {
    HttpInterceptorService = _HttpInterceptorService_;
    $q = _$q_;
    $injector = _$injector_;
  }));

  afterEach(function() {
    localStorage.clear();
  });

  describe('request interceptor', function() {
    it('should add Authorization header when token exists in localStorage', function() {
      var mockToken = 'test-auth-token-12345';
      localStorage.setItem('authToken', mockToken);

      var config = {
        url: '/api/test',
        method: 'GET'
      };

      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
    });

    it('should not add Authorization header when no token exists in localStorage', function() {
      var config = {
        url: '/api/test',
        method: 'GET'
      };

      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeUndefined();
    });

    it('should preserve existing headers when adding Authorization header', function() {
      var mockToken = 'test-auth-token-67890';
      localStorage.setItem('authToken', mockToken);

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
        data: { message: 'Authentication required' }
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).toHaveBeenCalledWith('Unauthorized access');
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toEqual(rejection);
      });
    });

    it('should log error and reject promise when status is 500', function() {
      var rejection = {
        status: 500,
        statusText: 'Internal Server Error',
        data: { message: 'Server error occurred' }
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).toHaveBeenCalledWith('Server error');
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toEqual(rejection);
      });
    });

    it('should reject promise without specific logging for other status codes', function() {
      var rejection = {
        status: 404,
        statusText: 'Not Found',
        data: { message: 'Resource not found' }
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toEqual(rejection);
      });
    });

    it('should reject promise for 403 Forbidden status', function() {
      var rejection = {
        status: 403,
        statusText: 'Forbidden',
        data: { message: 'Access denied' }
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toEqual(rejection);
      });
    });

    it('should reject promise for 400 Bad Request status', function() {
      var rejection = {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Invalid request parameters' }
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).not.toHaveBeenCalled();
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toEqual(rejection);
      });
    });
  });

  describe('edge cases', function() {
    it('should handle null token in localStorage', function() {
      localStorage.setItem('authToken', null);

      var config = {
        url: '/api/test',
        method: 'GET'
      };

      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeUndefined();
    });

    it('should handle empty string token in localStorage', function() {
      localStorage.setItem('authToken', '');

      var config = {
        url: '/api/test',
        method: 'GET'
      };

      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeUndefined();
    });

    it('should handle rejection object without status property', function() {
      var rejection = {
        statusText: 'Unknown Error',
        data: null
      };

      var result = HttpInterceptorService.responseError(rejection);

      expect(console.error).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});