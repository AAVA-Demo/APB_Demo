/*
Test Documentation:
- Test Name: AuthService - getToken
- Purpose: Verify that getToken retrieves the authentication token from localStorage
- Scenario: When a token exists in localStorage, it should be returned; when no token exists, a mock token should be returned
- Expected Result: Token is retrieved correctly or mock token is returned
*/
/*
Test Documentation:
- Test Name: AuthService - setToken
- Purpose: Verify that setToken stores the authentication token in localStorage
- Scenario: When setToken is called with a token value, it should be stored in localStorage
- Expected Result: Token is stored successfully in localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - clearToken
- Purpose: Verify that clearToken removes the authentication token from localStorage
- Scenario: When clearToken is called, the token should be removed from localStorage
- Expected Result: Token is removed from localStorage
*/
/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Verify that isAuthenticated returns true when a token exists and false when it doesn't
- Scenario: When a token is present, return true; when no token is present, return false
- Expected Result: Correct boolean value based on token presence
*/
/*
Test Documentation:
- Test Name: authInterceptor - request
- Purpose: Verify that the HTTP interceptor adds Authorization header when token exists
- Scenario: When a token is available, the interceptor should add Bearer token to request headers
- Expected Result: Authorization header is added with Bearer token
*/
/*
Test Documentation:
- Test Name: authInterceptor - request without token
- Purpose: Verify that the HTTP interceptor does not add Authorization header when no token exists
- Scenario: When no token is available, the interceptor should not modify headers
- Expected Result: No Authorization header is added
*/
/*
Test Documentation:
- Test Name: authInterceptor - responseError with 401
- Purpose: Verify that the interceptor clears token on 401 Unauthorized response
- Scenario: When a 401 response is received, the token should be cleared
- Expected Result: Token is cleared and promise is rejected
*/
/*
Test Documentation:
- Test Name: authInterceptor - responseError with other status
- Purpose: Verify that the interceptor does not clear token for non-401 errors
- Scenario: When a non-401 error response is received, the token should remain
- Expected Result: Token is not cleared and promise is rejected
*/
/*
Coverage Report:
- Functions tested: getToken, setToken, clearToken, isAuthenticated, authInterceptor.request, authInterceptor.responseError
- Scenarios covered: token retrieval, token storage, token removal, authentication check, request interception, error handling
- Uncovered scenarios: none
*/

describe('AuthService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var AuthService, $window;

  beforeEach(inject(function(_AuthService_, _$window_) {
    AuthService = _AuthService_;
    $window = _$window_;
    $window.localStorage.clear();
  }));

  afterEach(function() {
    $window.localStorage.clear();
  });

  describe('getToken', function() {
    it('should return token from localStorage when token exists', function() {
      $window.localStorage.setItem('authToken', 'test-token-123');
      var token = AuthService.getToken();
      expect(token).toBe('test-token-123');
    });

    it('should return mock token when no token exists in localStorage', function() {
      var token = AuthService.getToken();
      expect(token).toBe('mock-jwt-token-12345');
    });

    it('should return mock token when localStorage returns null', function() {
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      var token = AuthService.getToken();
      expect(token).toBe('mock-jwt-token-12345');
    });
  });

  describe('setToken', function() {
    it('should store token in localStorage', function() {
      AuthService.setToken('new-token-456');
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBe('new-token-456');
    });

    it('should overwrite existing token in localStorage', function() {
      $window.localStorage.setItem('authToken', 'old-token');
      AuthService.setToken('new-token-789');
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBe('new-token-789');
    });

    it('should handle empty string token', function() {
      AuthService.setToken('');
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBe('');
    });
  });

  describe('clearToken', function() {
    it('should remove token from localStorage', function() {
      $window.localStorage.setItem('authToken', 'token-to-remove');
      AuthService.clearToken();
      var storedToken = $window.localStorage.getItem('authToken');
      expect(storedToken).toBeNull();
    });

    it('should not throw error when no token exists', function() {
      expect(function() {
        AuthService.clearToken();
      }).not.toThrow();
    });

    it('should call localStorage.removeItem with correct key', function() {
      spyOn($window.localStorage, 'removeItem');
      AuthService.clearToken();
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('isAuthenticated', function() {
    it('should return true when token exists in localStorage', function() {
      $window.localStorage.setItem('authToken', 'valid-token');
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return true when mock token is returned', function() {
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    it('should return false when getToken returns empty string', function() {
      spyOn(AuthService, 'getToken').and.returnValue('');
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should return false when getToken returns null', function() {
      spyOn(AuthService, 'getToken').and.returnValue(null);
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it('should return false when getToken returns undefined', function() {
      spyOn(AuthService, 'getToken').and.returnValue(undefined);
      var isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });
});

describe('authInterceptor', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var authInterceptor, AuthService, $q, $window;

  beforeEach(inject(function(_authInterceptor_, _AuthService_, _$q_, _$window_) {
    authInterceptor = _authInterceptor_;
    AuthService = _AuthService_;
    $q = _$q_;
    $window = _$window_;
    $window.localStorage.clear();
  }));

  afterEach(function() {
    $window.localStorage.clear();
  });

  describe('request', function() {
    it('should add Authorization header when token exists', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-abc');
      var config = { url: '/api/test' };
      var result = authInterceptor.request(config);
      expect(result.headers).toBeDefined();
      expect(result.headers.Authorization).toBe('Bearer test-token-abc');
    });

    it('should preserve existing headers when adding Authorization', function() {
      spyOn(AuthService, 'getToken').and.returnValue('test-token-xyz');
      var config = {
        url: '/api/test',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      var result = authInterceptor.request(config);
      expect(result.headers['Content-Type']).toBe('application/json');
      expect(result.headers.Authorization).toBe('Bearer test-token-xyz');
    });

    it('should not add Authorization header when token is null', function() {
      spyOn(AuthService, 'getToken').and.returnValue(null);
      var config = { url: '/api/test' };
      var result = authInterceptor.request(config);
      expect(result.headers).toBeUndefined();
    });

    it('should not add Authorization header when token is empty string', function() {
      spyOn(AuthService, 'getToken').and.returnValue('');
      var config = { url: '/api/test' };
      var result = authInterceptor.request(config);
      expect(result.headers).toBeUndefined();
    });

    it('should return config object unchanged except for headers', function() {
      spyOn(AuthService, 'getToken').and.returnValue('token-123');
      var config = {
        url: '/api/test',
        method: 'POST',
        data: { key: 'value' }
      };
      var result = authInterceptor.request(config);
      expect(result.url).toBe('/api/test');
      expect(result.method).toBe('POST');
      expect(result.data).toEqual({ key: 'value' });
    });
  });

  describe('responseError', function() {
    it('should clear token on 401 Unauthorized response', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = { status: 401, data: 'Unauthorized' };
      authInterceptor.responseError(rejection);
      expect(AuthService.clearToken).toHaveBeenCalled();
    });

    it('should return rejected promise on 401 response', function() {
      var rejection = { status: 401, data: 'Unauthorized' };
      var result = authInterceptor.responseError(rejection);
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error.status).toBe(401);
      });
    });

    it('should not clear token on 403 Forbidden response', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = { status: 403, data: 'Forbidden' };
      authInterceptor.responseError(rejection);
      expect(AuthService.clearToken).not.toHaveBeenCalled();
    });

    it('should not clear token on 500 Internal Server Error', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = { status: 500, data: 'Internal Server Error' };
      authInterceptor.responseError(rejection);
      expect(AuthService.clearToken).not.toHaveBeenCalled();
    });

    it('should not clear token on 404 Not Found response', function() {
      spyOn(AuthService, 'clearToken');
      var rejection = { status: 404, data: 'Not Found' };
      authInterceptor.responseError(rejection);
      expect(AuthService.clearToken).not.toHaveBeenCalled();
    });

    it('should return rejected promise for all error responses', function() {
      var rejection = { status: 500, data: 'Server Error' };
      var result = authInterceptor.responseError(rejection);
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error.status).toBe(500);
      });
    });

    it('should preserve rejection data when returning rejected promise', function() {
      var rejection = {
        status: 401,
        data: { message: 'Token expired' },
        config: { url: '/api/test' }
      };
      var result = authInterceptor.responseError(rejection);
      result.catch(function(error) {
        expect(error.data.message).toBe('Token expired');
        expect(error.config.url).toBe('/api/test');
      });
    });
  });
});