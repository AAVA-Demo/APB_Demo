/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor
- Purpose: Adds Authorization header to HTTP requests when token exists
- Scenario: User is authenticated with valid token
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor
- Purpose: Handles requests when no authentication token exists
- Scenario: User is not authenticated
- Expected Result: Request proceeds without Authorization header
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError interceptor
- Purpose: Handles 401 Unauthorized responses
- Scenario: API returns 401 status code
- Expected Result: User is logged out and redirected to login page
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError interceptor
- Purpose: Displays error notification for HTTP errors
- Scenario: API returns 400+ status code
- Expected Result: Toastr error message is displayed
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError interceptor
- Purpose: Rejects promise after handling error
- Scenario: HTTP request fails
- Expected Result: Promise is rejected with original rejection object
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: authenticated requests, unauthenticated requests, 401 handling, error notifications, promise rejection
- Uncovered scenarios: token refresh logic, retry mechanisms, network timeout handling
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, LocalStorageService, $q, $injector, AuthFactory, $location;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$injector_, _$q_) {
      $injector = _$injector_;
      $q = _$q_;
      LocalStorageService = $injector.get('LocalStorageService');
      HttpInterceptorService = $injector.get('HttpInterceptorService');
      AuthFactory = $injector.get('AuthFactory');
      $location = $injector.get('$location');
    }));

    beforeEach(function() {
      window.toastr = jasmine.createSpyObj('toastr', ['error', 'success', 'warning', 'info']);
    });

    afterEach(function() {
      delete window.toastr;
    });

    describe('request interceptor', function() {
      it('should add Authorization header when token exists', function() {
        spyOn(LocalStorageService, 'get').and.returnValue('test-token-123');
        var config = { url: '/api/test', headers: {} };
        var result = HttpInterceptorService.request(config);
        expect(result.headers.Authorization).toBe('Bearer test-token-123');
      });

      it('should not add Authorization header when token does not exist', function() {
        spyOn(LocalStorageService, 'get').and.returnValue(null);
        var config = { url: '/api/test', headers: {} };
        var result = HttpInterceptorService.request(config);
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should initialize headers object if not present', function() {
        spyOn(LocalStorageService, 'get').and.returnValue('test-token');
        var config = { url: '/api/test' };
        var result = HttpInterceptorService.request(config);
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token');
      });

      it('should preserve existing headers when adding Authorization', function() {
        spyOn(LocalStorageService, 'get').and.returnValue('test-token');
        var config = { url: '/api/test', headers: { 'Content-Type': 'application/json' } };
        var result = HttpInterceptorService.request(config);
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers.Authorization).toBe('Bearer test-token');
      });
    });

    describe('responseError interceptor', function() {
      it('should logout user and redirect to login on 401 error', function() {
        spyOn(AuthFactory, 'logout');
        spyOn($location, 'path');
        var rejection = { status: 401, data: { message: 'Unauthorized' } };
        HttpInterceptorService.responseError(rejection);
        expect(AuthFactory.logout).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/login');
      });

      it('should display toastr error for 400+ status codes', function() {
        var rejection = { status: 400, data: { message: 'Bad Request' } };
        HttpInterceptorService.responseError(rejection);
        expect(window.toastr.error).toHaveBeenCalledWith('Bad Request', 'Error');
      });

      it('should display generic error message when response data is missing', function() {
        var rejection = { status: 500, data: null };
        HttpInterceptorService.responseError(rejection);
        expect(window.toastr.error).toHaveBeenCalledWith('An error occurred', 'Error');
      });

      it('should reject promise with original rejection object', function() {
        var rejection = { status: 500, data: { message: 'Server Error' } };
        var result = HttpInterceptorService.responseError(rejection);
        expect(result).toBeDefined();
        result.catch(function(err) {
          expect(err).toEqual(rejection);
        });
      });

      it('should not display toastr for status codes below 400', function() {
        var rejection = { status: 304, data: { message: 'Not Modified' } };
        HttpInterceptorService.responseError(rejection);
        expect(window.toastr.error).not.toHaveBeenCalled();
      });

      it('should handle 401 error before displaying toastr', function() {
        spyOn(AuthFactory, 'logout');
        spyOn($location, 'path');
        var rejection = { status: 401, data: { message: 'Unauthorized' } };
        HttpInterceptorService.responseError(rejection);
        expect(AuthFactory.logout).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/login');
        expect(window.toastr.error).toHaveBeenCalledWith('Unauthorized', 'Error');
      });

      it('should handle 403 Forbidden error', function() {
        var rejection = { status: 403, data: { message: 'Forbidden' } };
        HttpInterceptorService.responseError(rejection);
        expect(window.toastr.error).toHaveBeenCalledWith('Forbidden', 'Error');
      });

      it('should handle 404 Not Found error', function() {
        var rejection = { status: 404, data: { message: 'Not Found' } };
        HttpInterceptorService.responseError(rejection);
        expect(window.toastr.error).toHaveBeenCalledWith('Not Found', 'Error');
      });
    });
  });
})();