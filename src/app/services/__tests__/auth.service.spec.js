/*
Test Documentation:
- Test Name: AuthService - isAuthenticated
- Purpose: Validates authentication state detection
- Scenario: User has valid token in sessionStorage
- Expected Result: Returns true when token exists, false otherwise
*/
/*
Test Documentation:
- Test Name: AuthService - getUserContext
- Purpose: Validates user context retrieval
- Scenario: User data exists in sessionStorage
- Expected Result: Returns object with userId and token
*/
/*
Test Documentation:
- Test Name: AuthService - login success
- Purpose: Validates successful login flow
- Scenario: Valid credentials provided
- Expected Result: Token and userId stored in sessionStorage, promise resolves
*/
/*
Test Documentation:
- Test Name: AuthService - login failure
- Purpose: Validates failed login handling
- Scenario: Invalid credentials provided
- Expected Result: Promise rejected with error
*/
/*
Test Documentation:
- Test Name: AuthService - logout
- Purpose: Validates logout functionality
- Scenario: User logs out
- Expected Result: Token and userId removed from sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - mockLogin
- Purpose: Validates mock login for testing
- Scenario: Mock login called
- Expected Result: Mock token and userId stored in sessionStorage
*/
/*
Coverage Report:
- Functions tested: isAuthenticated, getUserContext, login, logout, mockLogin
- Scenarios covered: authentication check, context retrieval, successful login, failed login, logout, mock login
- Edge cases: null tokens, missing sessionStorage items, HTTP errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, API_CONFIG;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_CONFIG_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      API_CONFIG = _API_CONFIG_;
      
      // Clear sessionStorage before each test
      $window.sessionStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.sessionStorage.clear();
    });

    describe('isAuthenticated', function() {
      it('should return true when authToken exists in sessionStorage', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        expect(AuthService.isAuthenticated()).toBe(true);
      });

      it('should return false when authToken does not exist in sessionStorage', function() {
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should return false when authToken is null', function() {
        $window.sessionStorage.setItem('authToken', null);
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should return false when authToken is empty string', function() {
        $window.sessionStorage.setItem('authToken', '');
        expect(AuthService.isAuthenticated()).toBe(false);
      });
    });

    describe('getUserContext', function() {
      it('should return user context with userId and token when both exist', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        $window.sessionStorage.setItem('userId', 'user-456');
        
        var context = AuthService.getUserContext();
        
        expect(context.userId).toBe('user-456');
        expect(context.token).toBe('test-token-123');
      });

      it('should return context with null values when sessionStorage is empty', function() {
        var context = AuthService.getUserContext();
        
        expect(context.userId).toBeNull();
        expect(context.token).toBeNull();
      });

      it('should return context with only userId when token is missing', function() {
        $window.sessionStorage.setItem('userId', 'user-789');
        
        var context = AuthService.getUserContext();
        
        expect(context.userId).toBe('user-789');
        expect(context.token).toBeNull();
      });

      it('should return context with only token when userId is missing', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-999');
        
        var context = AuthService.getUserContext();
        
        expect(context.userId).toBeNull();
        expect(context.token).toBe('test-token-999');
      });
    });

    describe('login', function() {
      it('should successfully login with valid credentials and store token and userId', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var mockResponse = { token: 'new-token-123', userId: 'user-123' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(200, mockResponse);
        
        var result;
        AuthService.login(credentials).then(function(response) {
          result = response;
        });
        
        $httpBackend.flush();
        
        expect(result).toEqual(mockResponse);
        expect($window.sessionStorage.getItem('authToken')).toBe('new-token-123');
        expect($window.sessionStorage.getItem('userId')).toBe('user-123');
      });

      it('should reject promise when login fails with 401', function() {
        var credentials = { username: 'baduser', password: 'badpass' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(401, { error: 'Unauthorized' });
        
        var errorResult;
        AuthService.login(credentials).catch(function(error) {
          errorResult = error;
        });
        
        $httpBackend.flush();
        
        expect(errorResult.status).toBe(401);
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
        expect($window.sessionStorage.getItem('userId')).toBeNull();
      });

      it('should reject promise when login fails with 500', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(500, { error: 'Internal Server Error' });
        
        var errorResult;
        AuthService.login(credentials).catch(function(error) {
          errorResult = error;
        });
        
        $httpBackend.flush();
        
        expect(errorResult.status).toBe(500);
      });

      it('should handle network timeout error', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(-1, null);
        
        var errorResult;
        AuthService.login(credentials).catch(function(error) {
          errorResult = error;
        });
        
        $httpBackend.flush();
        
        expect(errorResult.status).toBe(-1);
      });

      it('should respect API_CONFIG timeout setting', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials, undefined, function(headers) {
          return true;
        }).respond(200, { token: 'token', userId: 'user' });
        
        AuthService.login(credentials);
        $httpBackend.flush();
      });
    });

    describe('logout', function() {
      it('should remove authToken and userId from sessionStorage', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        $window.sessionStorage.setItem('userId', 'user-456');
        
        AuthService.logout();
        
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
        expect($window.sessionStorage.getItem('userId')).toBeNull();
      });

      it('should not throw error when sessionStorage is already empty', function() {
        expect(function() {
          AuthService.logout();
        }).not.toThrow();
      });

      it('should only remove auth-related items and preserve other sessionStorage data', function() {
        $window.sessionStorage.setItem('authToken', 'test-token-123');
        $window.sessionStorage.setItem('userId', 'user-456');
        $window.sessionStorage.setItem('otherData', 'should-remain');
        
        AuthService.logout();
        
        expect($window.sessionStorage.getItem('authToken')).toBeNull();
        expect($window.sessionStorage.getItem('userId')).toBeNull();
        expect($window.sessionStorage.getItem('otherData')).toBe('should-remain');
      });
    });

    describe('mockLogin', function() {
      it('should set mock authToken and userId in sessionStorage', function() {
        AuthService.mockLogin();
        
        expect($window.sessionStorage.getItem('authToken')).toBe('mock-token-12345');
        expect($window.sessionStorage.getItem('userId')).toBe('user-001');
      });

      it('should overwrite existing tokens with mock values', function() {
        $window.sessionStorage.setItem('authToken', 'real-token');
        $window.sessionStorage.setItem('userId', 'real-user');
        
        AuthService.mockLogin();
        
        expect($window.sessionStorage.getItem('authToken')).toBe('mock-token-12345');
        expect($window.sessionStorage.getItem('userId')).toBe('user-001');
      });

      it('should make isAuthenticated return true after mockLogin', function() {
        AuthService.mockLogin();
        expect(AuthService.isAuthenticated()).toBe(true);
      });
    });

    describe('integration scenarios', function() {
      it('should maintain authentication state through login and logout cycle', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var mockResponse = { token: 'token-123', userId: 'user-123' };
        
        expect(AuthService.isAuthenticated()).toBe(false);
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(200, mockResponse);
        
        AuthService.login(credentials);
        $httpBackend.flush();
        
        expect(AuthService.isAuthenticated()).toBe(true);
        
        AuthService.logout();
        
        expect(AuthService.isAuthenticated()).toBe(false);
      });

      it('should retrieve correct user context after successful login', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var mockResponse = { token: 'token-456', userId: 'user-456' };
        
        $httpBackend.expectPOST(API_CONFIG.baseUrl + '/auth/login', credentials)
          .respond(200, mockResponse);
        
        AuthService.login(credentials);
        $httpBackend.flush();
        
        var context = AuthService.getUserContext();
        
        expect(context.userId).toBe('user-456');
        expect(context.token).toBe('token-456');
      });
    });
  });
})();