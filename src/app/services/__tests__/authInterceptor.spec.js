/*
Test Documentation:
- Test Name: authInterceptor - request adds Authorization header when token exists
- Purpose: Validates that HTTP requests are intercepted and Authorization header is added
- Scenario: Token is available from authFactory
- Expected Result: Request config includes Authorization header with Bearer token

- Test Name: authInterceptor - request initializes headers object if not present
- Purpose: Validates that headers object is created when config.headers is undefined
- Scenario: Request config has no headers property
- Expected Result: headers object is created and Authorization header is added

- Test Name: authInterceptor - request does not add Authorization header when no token
- Purpose: Validates behavior when no authentication token is available
- Scenario: authFactory.getToken returns null or empty
- Expected Result: Request config is returned without Authorization header

- Test Name: authInterceptor - responseError redirects to login on 401 status
- Purpose: Validates that unauthorized responses trigger redirect to login
- Scenario: HTTP response has 401 status code
- Expected Result: $location.path is called with '/login' and promise is rejected

- Test Name: authInterceptor - responseError rejects promise for non-401 errors
- Purpose: Validates that non-authentication errors are passed through
- Scenario: HTTP response has error status other than 401
- Expected Result: Promise is rejected with the original rejection object

Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, header initialization, missing token handling, 401 redirect, non-401 error handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('authInterceptor', function() {
    var authInterceptor;
    var authFactory;
    var $location;
    var $q;
    var $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_authInterceptor_, _authFactory_, _$location_, _$q_, _$rootScope_) {
      authInterceptor = _authInterceptor_;
      authFactory = _authFactory_;
      $location = _$location_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('request', function() {
      it('should add Authorization header when token exists', function() {
        spyOn(authFactory, 'getToken').and.returnValue('test-token-xyz');
        var config = { url: '/api/test' };
        var result = authInterceptor.request(config);
        expect(authFactory.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBe('Bearer test-token-xyz');
      });

      it('should initialize headers object if not present', function() {
        spyOn(authFactory, 'getToken').and.returnValue('test-token-abc');
        var config = { url: '/api/test' };
        var result = authInterceptor.request(config);
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-token-abc');
      });

      it('should not add Authorization header when no token exists', function() {
        spyOn(authFactory, 'getToken').and.returnValue(null);
        var config = { url: '/api/test', headers: {} };
        var result = authInterceptor.request(config);
        expect(authFactory.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should preserve existing headers', function() {
        spyOn(authFactory, 'getToken').and.returnValue('token-123');
        var config = { url: '/api/test', headers: { 'Content-Type': 'application/json' } };
        var result = authInterceptor.request(config);
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers.Authorization).toBe('Bearer token-123');
      });
    });

    describe('responseError', function() {
      it('should redirect to login on 401 status', function() {
        spyOn($location, 'path');
        var rejection = { status: 401, data: 'Unauthorized' };
        var result;
        authInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });
        $rootScope.$apply();
        expect($location.path).toHaveBeenCalledWith('/login');
        expect(result).toEqual(rejection);
      });

      it('should reject promise for non-401 errors without redirect', function() {
        spyOn($location, 'path');
        var rejection = { status: 500, data: 'Internal Server Error' };
        var result;
        authInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });
        $rootScope.$apply();
        expect($location.path).not.toHaveBeenCalled();
        expect(result).toEqual(rejection);
      });

      it('should reject promise for 403 errors without redirect', function() {
        spyOn($location, 'path');
        var rejection = { status: 403, data: 'Forbidden' };
        var result;
        authInterceptor.responseError(rejection).catch(function(error) {
          result = error;
        });
        $rootScope.$apply();
        expect($location.path).not.toHaveBeenCalled();
        expect(result).toEqual(rejection);
      });
    });
  });
})();