/*
Test Documentation:
- Test Name: AuthService - Token Management
- Purpose: Validate token retrieval, storage, and authentication header generation
- Scenario: User authentication token operations
- Expected Result: Tokens are correctly stored, retrieved, and formatted in headers
*/

/*
Coverage Report:
- Functions tested: getToken, setToken, getAuthHeaders, getUserId
- Scenarios covered: token retrieval (with/without stored token), token storage, header generation, user ID retrieval, HTTP interceptor request enhancement, HTTP interceptor error handling
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $window, $httpBackend, $http;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$window_, _$httpBackend_, _$http_) {
      AuthService = _AuthService_;
      $window = _$window_;
      $httpBackend = _$httpBackend_;
      $http = _$http_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('getToken', function() {
      it('should return mock token when no token is stored', function() {
        var token = AuthService.getToken();
        expect(token).toBe('mock-jwt-token-12345');
      });

      it('should return stored token when token exists in localStorage', function() {
        $window.localStorage.setItem('authToken', 'real-jwt-token-67890');
        var token = AuthService.getToken();
        expect(token).toBe('real-jwt-token-67890');
      });

      it('should handle empty string token', function() {
        $window.localStorage.setItem('authToken', '');
        var token = AuthService.getToken();
        expect(token).toBe('mock-jwt-token-12345');
      });

      it('should handle null token in localStorage', function() {
        $window.localStorage.setItem('authToken', null);
        var token = AuthService.getToken();
        expect(token).toBeTruthy();
      });
    });

    describe('setToken', function() {
      it('should store token in localStorage', function() {
        AuthService.setToken('new-token-12345');
        expect($window.localStorage.getItem('authToken')).toBe('new-token-12345');
      });

      it('should overwrite existing token', function() {
        $window.localStorage.setItem('authToken', 'old-token');
        AuthService.setToken('new-token');
        expect($window.localStorage.getItem('authToken')).toBe('new-token');
      });

      it('should handle empty string token', function() {
        AuthService.setToken('');
        expect($window.localStorage.getItem('authToken')).toBe('');
      });

      it('should handle null token', function() {
        AuthService.setToken(null);
        expect($window.localStorage.getItem('authToken')).toBe('null');
      });
    });

    describe('getAuthHeaders', function() {
      it('should return headers with Authorization and Content-Type', function() {
        var headers = AuthService.getAuthHeaders();
        expect(headers).toBeDefined();
        expect(headers['Authorization']).toBeDefined();
        expect(headers['Content-Type']).toBe('application/json');
      });

      it('should include Bearer token in Authorization header', function() {
        $window.localStorage.setItem('authToken', 'test-token-abc');
        var headers = AuthService.getAuthHeaders();
        expect(headers['Authorization']).toBe('Bearer test-token-abc');
      });

      it('should use mock token when no token is stored', function() {
        var headers = AuthService.getAuthHeaders();
        expect(headers['Authorization']).toBe('Bearer mock-jwt-token-12345');
      });

      it('should always include Content-Type as application/json', function() {
        var headers = AuthService.getAuthHeaders();
        expect(headers['Content-Type']).toBe('application/json');
      });
    });

    describe('getUserId', function() {
      it('should return default user ID when no user ID is stored', function() {
        var userId = AuthService.getUserId();
        expect(userId).toBe('user-001');
      });

      it('should return stored user ID when it exists', function() {
        $window.localStorage.setItem('userId', 'user-999');
        var userId = AuthService.getUserId();
        expect(userId).toBe('user-999');
      });

      it('should handle empty string user ID', function() {
        $window.localStorage.setItem('userId', '');
        var userId = AuthService.getUserId();
        expect(userId).toBe('user-001');
      });

      it('should handle null user ID', function() {
        $window.localStorage.setItem('userId', null);
        var userId = AuthService.getUserId();
        expect(userId).toBeTruthy();
      });
    });

    describe('HTTP Interceptor', function() {
      it('should add Authorization header to API requests', function() {
        $window.localStorage.setItem('authToken', 'interceptor-token');
        $httpBackend.expectGET('/api/test', function(headers) {
          return headers['Authorization'] === 'Bearer interceptor-token';
        }).respond(200, {data: 'success'});
        $http.get('/api/test');
        $httpBackend.flush();
      });

      it('should not add Authorization header to non-API requests', function() {
        $httpBackend.expectGET('/public/data', function(headers) {
          return !headers['Authorization'];
        }).respond(200, {data: 'public'});
        $http.get('/public/data');
        $httpBackend.flush();
      });

      it('should add Content-Type header to API requests', function() {
        $httpBackend.expectGET('/api/users', function(headers) {
          return headers['Content-Type'] === 'application/json';
        }).respond(200, {users: []});
        $http.get('/api/users');
        $httpBackend.flush();
      });

      it('should handle 401 unauthorized errors', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/secure').respond(401, 'Unauthorized');
        $http.get('/api/secure').catch(function(rejection) {
          expect(rejection.status).toBe(401);
        });
        $httpBackend.flush();
        expect(console.error).toHaveBeenCalledWith('Unauthorized access');
      });

      it('should reject promise on 401 error', function() {
        var errorCaught = false;
        $httpBackend.expectGET('/api/protected').respond(401);
        $http.get('/api/protected').catch(function() {
          errorCaught = true;
        });
        $httpBackend.flush();
        expect(errorCaught).toBe(true);
      });

      it('should handle other HTTP errors without special processing', function() {
        $httpBackend.expectGET('/api/data').respond(500, 'Server Error');
        $http.get('/api/data').catch(function(rejection) {
          expect(rejection.status).toBe(500);
        });
        $httpBackend.flush();
      });

      it('should preserve existing headers when adding auth headers', function() {
        $httpBackend.expectGET('/api/test', function(headers) {
          return headers['X-Custom-Header'] === 'custom-value' && headers['Authorization'];
        }).respond(200);
        $http.get('/api/test', {headers: {'X-Custom-Header': 'custom-value'}});
        $httpBackend.flush();
      });
    });

    describe('Edge Cases', function() {
      it('should handle multiple rapid token updates', function() {
        AuthService.setToken('token1');
        AuthService.setToken('token2');
        AuthService.setToken('token3');
        expect(AuthService.getToken()).toBe('token3');
      });

      it('should handle very long token strings', function() {
        var longToken = new Array(1000).join('a');
        AuthService.setToken(longToken);
        expect(AuthService.getToken()).toBe(longToken);
      });

      it('should handle special characters in tokens', function() {
        var specialToken = 'token-with-special!@#$%^&*()chars';
        AuthService.setToken(specialToken);
        expect(AuthService.getToken()).toBe(specialToken);
      });

      it('should handle concurrent header generation calls', function() {
        var headers1 = AuthService.getAuthHeaders();
        var headers2 = AuthService.getAuthHeaders();
        expect(headers1['Authorization']).toBe(headers2['Authorization']);
      });
    });
  });
})();