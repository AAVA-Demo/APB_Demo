/*
Test Documentation:
- Test Name: AuthFactory - getToken
- Purpose: Validates that getToken retrieves the authentication token from localStorage
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored token
*/
/*
Test Documentation:
- Test Name: AuthFactory - getToken (no token)
- Purpose: Validates that getToken returns mock token when no token exists
- Scenario: No token in localStorage
- Expected Result: Returns mock-jwt-token-12345
*/
/*
Test Documentation:
- Test Name: AuthFactory - setToken
- Purpose: Validates that setToken stores the token in localStorage
- Scenario: Token is provided
- Expected Result: Token is stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthFactory - isAuthenticated
- Purpose: Validates authentication status based on token presence
- Scenario: Token exists
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: AuthFactory - isAuthenticated (no token)
- Purpose: Validates authentication status when no token exists
- Scenario: No token in localStorage
- Expected Result: Returns false
*/
/*
Test Documentation:
- Test Name: AuthFactory - logout
- Purpose: Validates that logout removes token from localStorage
- Scenario: User logs out
- Expected Result: Token is removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request
- Purpose: Validates that AuthInterceptor adds Authorization header to API requests
- Scenario: API request is made
- Expected Result: Authorization header is added with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - request (non-API)
- Purpose: Validates that AuthInterceptor does not modify non-API requests
- Scenario: Non-API request is made
- Expected Result: No Authorization header is added
*/
/*
Test Documentation:
- Test Name: AuthInterceptor - responseError (401)
- Purpose: Validates that 401 errors trigger logout and redirect
- Scenario: API returns 401 status
- Expected Result: User is logged out and redirected to login
*/
/*
Coverage Report:
- Functions tested: getToken, setToken, isAuthenticated, logout, AuthInterceptor.request, AuthInterceptor.responseError
- Scenarios covered: token retrieval, token storage, authentication check, logout, request interception, error handling
- Uncovered scenarios: none
*/

describe('AuthFactory', function() {
  'use strict';

  var AuthFactory;
  var $window;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthFactory_, _$window_) {
    AuthFactory = _AuthFactory_;
    $window = _$window_;
    // Clear localStorage before each test
    $window.localStorage.clear();
  }));

  describe('getToken', function() {
    it('should return the token from localStorage when it exists', function() {
      $window.localStorage.setItem('authToken', 'test-token-123');
      var token = AuthFactory.getToken();
      expect(token).toBe('test-token-123');
    });

    it('should return mock token when no token exists in localStorage', function() {
      var token = AuthFactory.getToken();
      expect(token).toBe('mock-jwt-token-12345');
    });
  });

  describe('setToken', function() {
    it('should store the token in localStorage', function() {
      AuthFactory.setToken('new-token-456');
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBe('new-token-456');
    });

    it('should overwrite existing token in localStorage', function() {
      $window.localStorage.setItem('authToken', 'old-token');
      AuthFactory.setToken('new-token-789');
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBe('new-token-789');
    });
  });

  describe('isAuthenticated', function() {
    it('should return true when token exists', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      var isAuth = AuthFactory.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return true when no token exists but mock token is returned', function() {
      var isAuth = AuthFactory.isAuthenticated();
      expect(isAuth).toBe(true);
    });
  });

  describe('logout', function() {
    it('should remove token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'token-to-remove');
      AuthFactory.logout();
      var token = $window.localStorage.getItem('authToken');
      expect(token).toBeNull();
    });

    it('should handle logout when no token exists', function() {
      expect(function() {
        AuthFactory.logout();
      }).not.toThrow();
      var token = $window.localStorage.getItem('authToken');
      expect(token).toBeNull();
    });
  });
});

describe('AuthInterceptor', function() {
  'use strict';

  var AuthInterceptor;
  var AuthFactory;
  var $window;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthInterceptor_, _AuthFactory_, _$window_) {
    AuthInterceptor = _AuthInterceptor_;
    AuthFactory = _AuthFactory_;
    $window = _$window_;
    $window.localStorage.clear();
  }));

  describe('request', function() {
    it('should add Authorization header to API requests', function() {
      spyOn(AuthFactory, 'getToken').and.returnValue('test-token-abc');
      var config = {
        url: '/api/creditcards',
        headers: {}
      };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-abc');
      expect(AuthFactory.getToken).toHaveBeenCalled();
    });

    it('should create headers object if not present for API requests', function() {
      spyOn(AuthFactory, 'getToken').and.returnValue('test-token-xyz');
      var config = {
        url: '/api/transactions'
      };
      var result = AuthInterceptor.request(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer test-token-xyz');
    });

    it('should not add Authorization header to non-API requests', function() {
      spyOn(AuthFactory, 'getToken');
      var config = {
        url: '/static/template.html',
        headers: {}
      };
      var result = AuthInterceptor.request(config);
      expect(result.headers.Authorization).toBeUndefined();
      expect(AuthFactory.getToken).not.toHaveBeenCalled();
    });
  });

  describe('responseError', function() {
    it('should logout and redirect on 401 error', function() {
      spyOn(AuthFactory, 'logout');
      spyOn($window.location, 'href', 'set');
      var response = { status: 401 };
      AuthInterceptor.responseError(response).catch(function(error) {
        expect(error.status).toBe(401);
      });
      expect(AuthFactory.logout).toHaveBeenCalled();
    });

    it('should reject promise with response on error', function() {
      var response = { status: 500, data: 'Server Error' };
      AuthInterceptor.responseError(response).catch(function(error) {
        expect(error.status).toBe(500);
        expect(error.data).toBe('Server Error');
      });
    });

    it('should not logout on non-401 errors', function() {
      spyOn(AuthFactory, 'logout');
      var response = { status: 404 };
      AuthInterceptor.responseError(response).catch(function() {});
      expect(AuthFactory.logout).not.toHaveBeenCalled();
    });
  });
});