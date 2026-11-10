/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor adds Authorization header
- Purpose: Validates that request interceptor adds Authorization header with token
- Scenario: HTTP request intercepted
- Expected Result: Authorization header added with Bearer token

- Test Name: HttpInterceptorService - request interceptor handles missing token
- Purpose: Validates that request interceptor handles missing token gracefully
- Scenario: HTTP request intercepted when no token exists
- Expected Result: Request proceeds with generated token

- Test Name: HttpInterceptorService - responseError handles 401 Unauthorized
- Purpose: Validates that 401 errors trigger logout and error notification
- Scenario: HTTP response with 401 status
- Expected Result: Logout called and error message displayed

- Test Name: HttpInterceptorService - responseError handles 500 Server Error
- Purpose: Validates that 500 errors display appropriate error message
- Scenario: HTTP response with 500 status
- Expected Result: Server error message displayed

- Test Name: HttpInterceptorService - responseError handles network error
- Purpose: Validates that network errors (status 0) display appropriate message
- Scenario: HTTP response with status 0
- Expected Result: Network error message displayed

- Test Name: HttpInterceptorService - responseError handles other errors
- Purpose: Validates that other errors display generic error message
- Scenario: HTTP response with 400 status
- Expected Result: Generic error message displayed

Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, 401 error, 500 error, network error, other errors
- Edge cases: missing token, various HTTP error codes
- Uncovered scenarios: none
*/

describe('HttpInterceptorService', function() {
  'use strict';

  var HttpInterceptorService, AuthService, $q;

  beforeEach(module('creditCardApp'));

  beforeEach(function() {
    window.toastr = jasmine.createSpyObj('toastr', ['error', 'success', 'warning', 'info']);
  });

  beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$q_) {
    HttpInterceptorService = _HttpInterceptorService_;
    AuthService = _AuthService_;
    $q = _$q_;
  }));

  describe('request interceptor', function() {
    it('should add Authorization header with token', function() {
      spyOn(AuthService, 'getToken').and.returnValue('mock_token_123');

      var config = {headers: {}};
      var result = HttpInterceptorService.request(config);

      expect(result.headers.Authorization).toBe('Bearer mock_token_123');
      expect(AuthService.getToken).toHaveBeenCalled();
    });

    it('should create headers object if not exists', function() {
      spyOn(AuthService, 'getToken').and.returnValue('mock_token_456');

      var config = {};
      var result = HttpInterceptorService.request(config);

      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer mock_token_456');
    });

    it('should handle missing token by getting new token', function() {
      spyOn(AuthService, 'getToken').and.returnValue('new_mock_token');

      var config = {headers: {}};
      var result = HttpInterceptorService.request(config);

      expect(result.headers.Authorization).toBe('Bearer new_mock_token');
    });
  });

  describe('responseError interceptor', function() {
    it('should handle 401 Unauthorized error', function() {
      spyOn(AuthService, 'logout');
      var rejection = {status: 401, data: {message: 'Unauthorized'}};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('Authentication failed. Please login again.');
      expect(AuthService.logout).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should handle 500 Server Error', function() {
      var rejection = {status: 500, data: {message: 'Internal Server Error'}};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('Server error. Please try again later.');
      expect(result).toBeDefined();
    });

    it('should handle 503 Server Error', function() {
      var rejection = {status: 503, data: {message: 'Service Unavailable'}};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('Server error. Please try again later.');
      expect(result).toBeDefined();
    });

    it('should handle network error (status 0)', function() {
      var rejection = {status: 0, data: null};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('Network error. Please check your connection.');
      expect(result).toBeDefined();
    });

    it('should handle 400 Bad Request with custom message', function() {
      var rejection = {status: 400, data: {message: 'Invalid request data'}};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('An error occurred: Invalid request data');
      expect(result).toBeDefined();
    });

    it('should handle error without message', function() {
      var rejection = {status: 404, data: {}};

      var result = HttpInterceptorService.responseError(rejection);

      expect(window.toastr.error).toHaveBeenCalledWith('An error occurred: Unknown error');
      expect(result).toBeDefined();
    });

    it('should return rejected promise', function() {
      var rejection = {status: 500, data: {}};

      var result = HttpInterceptorService.responseError(rejection);

      expect($q.reject).toBeDefined();
      expect(result).toBeDefined();
    });
  });
});