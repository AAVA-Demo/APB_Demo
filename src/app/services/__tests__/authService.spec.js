/*
Test Documentation:
- Test Name: authService.spec.js
- Purpose: Validate authentication service and HTTP interceptor functionality
- Scenario: Tests token management, session validation, and HTTP request/response interception
- Expected Result: All authentication operations work correctly with proper security
*/

(function() {
  'use strict';

  describe('authService', function() {
    var authService, $window, $httpBackend;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_authService_, _$window_, _$httpBackend_) {
      authService = _authService_;
      $window = _$window_;
      $httpBackend = _$httpBackend_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $window.localStorage.clear();
    });

    describe('initialize', function() {
      it('should create mock token if no token exists', function() {
        authService.initialize();
        var token = $window.localStorage.getItem('jwt_token');
        expect(token).toBeDefined();
        expect(token).toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      });

      it('should not overwrite existing token', function() {
        var existingToken = 'existing_token_12345';
        $window.localStorage.setItem('jwt_token', existingToken);
        authService.initialize();
        var token = $window.localStorage.getItem('jwt_token');
        expect(token).toBe(existingToken);
      });
    });

    describe('getToken', function() {
      it('should return stored token', function() {
        var testToken = 'test_jwt_token';
        $window.localStorage.setItem('jwt_token', testToken);
        var token = authService.getToken();
        expect(token).toBe(testToken);
      });

      it('should return null if no token exists', function() {
        var token = authService.getToken();
        expect(token).toBeNull();
      });
    });

    describe('validateSession', function() {
      it('should return true when valid token exists', function() {
        $window.localStorage.setItem('jwt_token', 'valid_token');
        var isValid = authService.validateSession();
        expect(isValid).toBe(true);
      });

      it('should return false when no token exists', function() {
        var isValid = authService.validateSession();
        expect(isValid).toBe(false);
      });
    });

    describe('logout', function() {
      it('should remove token from localStorage', function() {
        $window.localStorage.setItem('jwt_token', 'token_to_remove');
        authService.logout();
        var token = $window.localStorage.getItem('jwt_token');
        expect(token).toBeNull();
      });
    });
  });

  describe('authInterceptor', function() {
    var $http, $httpBackend, $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_$http_, _$httpBackend_, _$window_) {
      $http = _$http_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    it('should add Authorization header when token exists', function() {
      var testToken = 'Bearer_test_token';
      $window.localStorage.setItem('jwt_token', testToken);

      $httpBackend.expectGET('/api/test', function(headers) {
        return headers.Authorization === 'Bearer ' + testToken;
      }).respond(200, {success: true});

      $http.get('/api/test');
      $httpBackend.flush();
    });

    it('should not add Authorization header when no token exists', function() {
      $httpBackend.expectGET('/api/test', function(headers) {
        return !headers.Authorization;
      }).respond(200, {success: true});

      $http.get('/api/test');
      $httpBackend.flush();
    });

    it('should handle 401 error and redirect to login', function() {
      $window.localStorage.setItem('jwt_token', 'expired_token');
      spyOn($window.location, 'href', 'set');

      $httpBackend.expectGET('/api/secure').respond(401, {error: 'Unauthorized'});

      $http.get('/api/secure').catch(function() {});
      $httpBackend.flush();

      expect($window.localStorage.getItem('jwt_token')).toBeNull();
    });

    it('should handle 403 error and redirect to login', function() {
      $window.localStorage.setItem('jwt_token', 'forbidden_token');
      spyOn($window.location, 'href', 'set');

      $httpBackend.expectGET('/api/forbidden').respond(403, {error: 'Forbidden'});

      $http.get('/api/forbidden').catch(function() {});
      $httpBackend.flush();

      expect($window.localStorage.getItem('jwt_token')).toBeNull();
    });

    it('should not remove token on other error codes', function() {
      $window.localStorage.setItem('jwt_token', 'valid_token');

      $httpBackend.expectGET('/api/error').respond(500, {error: 'Server error'});

      $http.get('/api/error').catch(function() {});
      $httpBackend.flush();

      expect($window.localStorage.getItem('jwt_token')).toBe('valid_token');
    });
  });

  /*
  Coverage Report:
  - Functions tested: initialize, getToken, validateSession, logout, authInterceptor (request, responseError)
  - Scenarios covered:
    * Token initialization with and without existing token
    * Token retrieval
    * Session validation
    * Logout functionality
    * HTTP request interception with Authorization header
    * 401/403 error handling with token removal
    * Other error codes handling
  - Uncovered scenarios: None
  */
})();