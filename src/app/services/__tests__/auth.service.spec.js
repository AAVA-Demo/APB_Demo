/*
Test Documentation:
- Test Name: authService - login success
- Purpose: Validates successful user authentication
- Scenario: User provides valid credentials
- Expected Result: Token and userId stored in localStorage
*/
/*
Test Documentation:
- Test Name: authService - login failure
- Purpose: Validates error handling for failed login
- Scenario: Server returns error response
- Expected Result: Promise rejected with error
*/
/*
Test Documentation:
- Test Name: authService - logout
- Purpose: Validates user logout clears stored credentials
- Scenario: User logs out
- Expected Result: Token and userId removed from localStorage
*/
/*
Test Documentation:
- Test Name: authService - getToken
- Purpose: Validates token retrieval from localStorage
- Scenario: Token exists in localStorage
- Expected Result: Returns stored token
*/
/*
Test Documentation:
- Test Name: authService - getUserId with stored value
- Purpose: Validates userId retrieval from localStorage
- Scenario: UserId exists in localStorage
- Expected Result: Returns stored userId
*/
/*
Test Documentation:
- Test Name: authService - getUserId with default value
- Purpose: Validates default userId when none stored
- Scenario: No userId in localStorage
- Expected Result: Returns default 'user123'
*/
/*
Test Documentation:
- Test Name: authService - isAuthenticated true
- Purpose: Validates authentication status when token exists
- Scenario: Valid token in localStorage
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: authService - isAuthenticated false
- Purpose: Validates authentication status when no token
- Scenario: No token in localStorage
- Expected Result: Returns false
*/
/*
Coverage Report:
- Functions tested: login, logout, getToken, getUserId, isAuthenticated
- Scenarios covered: success login, failed login, logout, token retrieval, userId retrieval with/without stored value, authentication status check
- Edge cases: null token, default userId fallback
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('authService', function() {
    var authService, $httpBackend, $window;
    var TOKEN_KEY = 'cc_auth_token';
    var USER_KEY = 'cc_user_id';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_authService_, _$httpBackend_, _$window_) {
      authService = _authService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $window.localStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.localStorage.clear();
    });

    describe('login', function() {
      it('should successfully login and store token and userId', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var mockResponse = { token: 'test-token-123', userId: 'user-456' };

        $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, mockResponse);

        authService.login(credentials).then(function(response) {
          expect(response.token).toBe('test-token-123');
          expect(response.userId).toBe('user-456');
          expect($window.localStorage.getItem(TOKEN_KEY)).toBe('test-token-123');
          expect($window.localStorage.getItem(USER_KEY)).toBe('user-456');
        });

        $httpBackend.flush();
      });

      it('should handle login failure', function() {
        var credentials = { username: 'baduser', password: 'badpass' };

        $httpBackend.expectPOST('/api/auth/login', credentials).respond(401, { error: 'Unauthorized' });

        authService.login(credentials).catch(function(error) {
          expect(error.status).toBe(401);
          expect($window.localStorage.getItem(TOKEN_KEY)).toBeNull();
          expect($window.localStorage.getItem(USER_KEY)).toBeNull();
        });

        $httpBackend.flush();
      });

      it('should not store token if response does not contain token', function() {
        var credentials = { username: 'testuser', password: 'testpass' };
        var mockResponse = { message: 'success but no token' };

        $httpBackend.expectPOST('/api/auth/login', credentials).respond(200, mockResponse);

        authService.login(credentials).then(function(response) {
          expect($window.localStorage.getItem(TOKEN_KEY)).toBeNull();
          expect($window.localStorage.getItem(USER_KEY)).toBeNull();
        });

        $httpBackend.flush();
      });
    });

    describe('logout', function() {
      it('should remove token and userId from localStorage', function() {
        $window.localStorage.setItem(TOKEN_KEY, 'test-token');
        $window.localStorage.setItem(USER_KEY, 'test-user');

        authService.logout();

        expect($window.localStorage.getItem(TOKEN_KEY)).toBeNull();
        expect($window.localStorage.getItem(USER_KEY)).toBeNull();
      });

      it('should handle logout when no credentials stored', function() {
        expect(function() {
          authService.logout();
        }).not.toThrow();

        expect($window.localStorage.getItem(TOKEN_KEY)).toBeNull();
        expect($window.localStorage.getItem(USER_KEY)).toBeNull();
      });
    });

    describe('getToken', function() {
      it('should return stored token', function() {
        $window.localStorage.setItem(TOKEN_KEY, 'stored-token-789');

        var token = authService.getToken();

        expect(token).toBe('stored-token-789');
      });

      it('should return null when no token stored', function() {
        var token = authService.getToken();

        expect(token).toBeNull();
      });
    });

    describe('getUserId', function() {
      it('should return stored userId', function() {
        $window.localStorage.setItem(USER_KEY, 'stored-user-999');

        var userId = authService.getUserId();

        expect(userId).toBe('stored-user-999');
      });

      it('should return default userId when none stored', function() {
        var userId = authService.getUserId();

        expect(userId).toBe('user123');
      });
    });

    describe('isAuthenticated', function() {
      it('should return true when token exists', function() {
        $window.localStorage.setItem(TOKEN_KEY, 'valid-token');

        var isAuth = authService.isAuthenticated();

        expect(isAuth).toBe(true);
      });

      it('should return false when no token exists', function() {
        var isAuth = authService.isAuthenticated();

        expect(isAuth).toBe(false);
      });

      it('should return false when token is empty string', function() {
        $window.localStorage.setItem(TOKEN_KEY, '');

        var isAuth = authService.isAuthenticated();

        expect(isAuth).toBe(false);
      });
    });
  });
})();