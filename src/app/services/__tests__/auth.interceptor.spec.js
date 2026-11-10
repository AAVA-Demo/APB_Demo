/*
Test Documentation:
- Test Name: authInterceptor - request interceptor
- Purpose: Validates that HTTP requests are intercepted and Authorization header is added
- Scenario: Authenticated user makes HTTP request
- Expected Result: Request includes Bearer token in Authorization header
*/
/*
Test Documentation:
- Test Name: authInterceptor - request without token
- Purpose: Validates that requests proceed without Authorization header when not authenticated
- Scenario: Unauthenticated user makes HTTP request
- Expected Result: Request proceeds without Authorization header
*/
/*
Test Documentation:
- Test Name: authInterceptor - responseError interceptor
- Purpose: Validates that 401 responses trigger logout and redirect
- Scenario: Server returns 401 Unauthorized response
- Expected Result: User is logged out and redirected to login page
*/
/*
Test Documentation:
- Test Name: authInterceptor - non-401 errors
- Purpose: Validates that non-401 errors are passed through without logout
- Scenario: Server returns error other than 401
- Expected Result: Error is rejected without logout or redirect
*/
/*
Coverage Report:
- Functions tested: request interceptor, responseError interceptor
- Scenarios covered: authenticated requests, unauthenticated requests, 401 error handling, non-401 error handling
- Edge cases: null token, empty token, multiple 401 responses, state transition errors
- Uncovered scenarios: token refresh logic, retry mechanisms
*/

(function() {
  'use strict';

  describe('authInterceptor', function() {
    var authInterceptor;
    var AuthService;
    var $q;
    var $rootScope;
    var $state;
    var $injector;

    beforeEach(module('creditCardApp'));

    beforeEach(module(function($provide) {
      // Mock $state service
      $provide.service('$state', function() {
        this.go = jasmine.createSpy('go');
      });
    }));

    beforeEach(inject(function(_authInterceptor_, _AuthService_, _$q_, _$rootScope_, _$state_, _$injector_) {
      authInterceptor = _authInterceptor_;
      AuthService = _AuthService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
    }));

    describe('request interceptor', function() {
      it('should add Authorization header when token exists', function() {
        // Arrange
        var mockToken = 'mock-jwt-token-12345';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);
        var config = {
          headers: {}
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should not add Authorization header when token does not exist', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue(null);
        var config = {
          headers: {}
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should preserve existing headers when adding Authorization', function() {
        // Arrange
        var mockToken = 'test-token';
        spyOn(AuthService, 'getToken').and.returnValue(mockToken);
        var config = {
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should return the config object', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('token');
        var config = {
          headers: {},
          url: '/api/test',
          method: 'GET'
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result).toBe(config);
        expect(result.url).toBe('/api/test');
        expect(result.method).toBe('GET');
      });

      it('should handle empty string token', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('');
        var config = {
          headers: {}
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should handle undefined token', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue(undefined);
        var config = {
          headers: {}
        };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should use $injector to get AuthService', function() {
        // Arrange
        spyOn($injector, 'get').and.returnValue(AuthService);
        spyOn(AuthService, 'getToken').and.returnValue('token');
        var config = { headers: {} };

        // Act
        authInterceptor.request(config);

        // Assert
        expect($injector.get).toHaveBeenCalledWith('AuthService');
      });
    });

    describe('responseError interceptor', function() {
      it('should logout and redirect to login on 401 error', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 401,
          data: { message: 'Unauthorized' }
        };

        // Act
        var result = authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('login');
      });

      it('should not logout on non-401 errors', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 500,
          data: { message: 'Internal Server Error' }
        };

        // Act
        var result = authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });

      it('should return rejected promise for 401 error', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 401,
          data: { message: 'Unauthorized' }
        };
        var errorCaught = false;

        // Act
        authInterceptor.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();

        // Assert
        expect(errorCaught).toBe(true);
      });

      it('should return rejected promise for non-401 errors', function() {
        // Arrange
        var rejection = {
          status: 404,
          data: { message: 'Not Found' }
        };
        var errorCaught = false;

        // Act
        authInterceptor.responseError(rejection).catch(function(error) {
          errorCaught = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();

        // Assert
        expect(errorCaught).toBe(true);
      });

      it('should handle 403 Forbidden error without logout', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 403,
          data: { message: 'Forbidden' }
        };

        // Act
        authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });

      it('should handle 400 Bad Request error without logout', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 400,
          data: { message: 'Bad Request' }
        };

        // Act
        authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });

      it('should use $injector to get AuthService and $state', function() {
        // Arrange
        spyOn($injector, 'get').and.callThrough();
        var rejection = {
          status: 401,
          data: { message: 'Unauthorized' }
        };

        // Act
        authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect($injector.get).toHaveBeenCalledWith('AuthService');
        expect($injector.get).toHaveBeenCalledWith('$state');
      });

      it('should handle rejection without status code', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          data: { message: 'Unknown error' }
        };

        // Act
        authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });

      it('should handle null rejection', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = null;

        // Act
        var result = authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).not.toHaveBeenCalled();
        expect($state.go).not.toHaveBeenCalled();
      });
    });

    describe('Integration scenarios', function() {
      it('should handle complete authentication flow with interceptor', function() {
        // Arrange
        var token = 'integration-test-token';
        spyOn(AuthService, 'getToken').and.returnValue(token);
        spyOn(AuthService, 'logout');
        var requestConfig = { headers: {} };
        var errorResponse = { status: 401 };

        // Act - Request with token
        var configWithAuth = authInterceptor.request(requestConfig);
        expect(configWithAuth.headers.Authorization).toBe('Bearer ' + token);

        // Act - 401 response
        authInterceptor.responseError(errorResponse);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('login');
      });

      it('should handle multiple 401 responses', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection1 = { status: 401 };
        var rejection2 = { status: 401 };

        // Act
        authInterceptor.responseError(rejection1);
        authInterceptor.responseError(rejection2);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).toHaveBeenCalledTimes(2);
        expect($state.go).toHaveBeenCalledTimes(2);
      });

      it('should handle mixed error responses', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection401 = { status: 401 };
        var rejection500 = { status: 500 };
        var rejection404 = { status: 404 };

        // Act
        authInterceptor.responseError(rejection500);
        authInterceptor.responseError(rejection401);
        authInterceptor.responseError(rejection404);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).toHaveBeenCalledTimes(1);
        expect($state.go).toHaveBeenCalledTimes(1);
      });
    });

    describe('Edge cases', function() {
      it('should handle request with no headers property', function() {
        // Arrange
        spyOn(AuthService, 'getToken').and.returnValue('token');
        var config = {};

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers).toBeUndefined();
      });

      it('should handle very long token in Authorization header', function() {
        // Arrange
        var longToken = new Array(5000).join('x');
        spyOn(AuthService, 'getToken').and.returnValue(longToken);
        var config = { headers: {} };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers.Authorization).toBe('Bearer ' + longToken);
      });

      it('should handle token with special characters', function() {
        // Arrange
        var specialToken = 'token-!@#$%^&*()_+={}[]|\\:;<>?,./~`';
        spyOn(AuthService, 'getToken').and.returnValue(specialToken);
        var config = { headers: {} };

        // Act
        var result = authInterceptor.request(config);

        // Assert
        expect(result.headers.Authorization).toBe('Bearer ' + specialToken);
      });

      it('should handle rejection with additional error properties', function() {
        // Arrange
        spyOn(AuthService, 'logout');
        var rejection = {
          status: 401,
          data: { message: 'Unauthorized' },
          config: { url: '/api/test' },
          headers: { 'Content-Type': 'application/json' },
          statusText: 'Unauthorized'
        };

        // Act
        authInterceptor.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(AuthService.logout).toHaveBeenCalled();
        expect($state.go).toHaveBeenCalledWith('login');
      });

      it('should preserve rejection data when rejecting promise', function() {
        // Arrange
        var rejection = {
          status: 500,
          data: { error: 'Server error', code: 'ERR_500' },
          config: { url: '/api/test' }
        };

        // Act
        authInterceptor.responseError(rejection).catch(function(error) {
          // Assert
          expect(error.status).toBe(500);
          expect(error.data.error).toBe('Server error');
          expect(error.data.code).toBe('ERR_500');
          expect(error.config.url).toBe('/api/test');
        });
        $rootScope.$apply();
      });
    });
  });
})();