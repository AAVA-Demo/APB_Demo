/*
Test Documentation:
- Test Name: AuthService Test Suite
- Purpose: Validate authentication operations including login, logout, session management
- Scenario: Tests login flow, token storage, logout, user ID retrieval, and authentication status
- Expected Result: Service correctly manages authentication state and localStorage interactions
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, $q;
    var mockCredentials = { username: 'testuser', password: 'password123' };
    var mockAuthResponse = { token: 'mock-jwt-token', userId: 'user123' };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _$q_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $q = _$q_;
      
      spyOn($window.localStorage, 'setItem');
      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      spyOn($window.localStorage, 'removeItem');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Verify service is properly instantiated
    - Scenario: Service injection
    - Expected Result: Service object exists with all required methods
    */
    it('should be defined', function() {
      expect(AuthService).toBeDefined();
      expect(AuthService.login).toBeDefined();
      expect(AuthService.logout).toBeDefined();
      expect(AuthService.getUserId).toBeDefined();
      expect(AuthService.isAuthenticated).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should successfully login and store token and userId
    - Purpose: Validate successful login flow and token storage
    - Scenario: Call login with valid credentials
    - Expected Result: HTTP POST to /api/auth/login, token and userId stored in localStorage
    */
    it('should successfully login and store token and userId', function() {
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(200, mockAuthResponse);

      var result;
      AuthService.login(mockCredentials).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(mockAuthResponse);
      expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', mockAuthResponse.token);
      expect($window.localStorage.setItem).toHaveBeenCalledWith('userId', mockAuthResponse.userId);
    });

    /*
    Test Documentation:
    - Test Name: should handle login failure
    - Purpose: Validate error handling on failed login
    - Scenario: API returns 401 Unauthorized
    - Expected Result: Promise rejected, no token stored
    */
    it('should handle login failure', function() {
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(401, { error: 'Invalid credentials' });

      var errorResult;
      AuthService.login(mockCredentials).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect($window.localStorage.setItem).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should logout and clear localStorage
    - Purpose: Validate logout flow and session cleanup
    - Scenario: Call logout method
    - Expected Result: authToken and userId removed from localStorage, redirect to login
    */
    it('should logout and clear localStorage', function() {
      AuthService.logout();

      expect($window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
      expect($window.localStorage.removeItem).toHaveBeenCalledWith('userId');
      expect($window.location.href).toBe('#/login');
    });

    /*
    Test Documentation:
    - Test Name: should return userId from localStorage
    - Purpose: Validate getUserId retrieval from storage
    - Scenario: Call getUserId when userId exists in localStorage
    - Expected Result: Returns stored userId
    */
    it('should return userId from localStorage', function() {
      $window.localStorage.getItem.and.callFake(function(key) {
        if (key === 'userId') return 'user123';
        return null;
      });

      var userId = AuthService.getUserId();

      expect(userId).toBe('user123');
      expect($window.localStorage.getItem).toHaveBeenCalledWith('userId');
    });

    /*
    Test Documentation:
    - Test Name: should return default userId when not in localStorage
    - Purpose: Validate fallback userId when none stored
    - Scenario: Call getUserId when localStorage is empty
    - Expected Result: Returns default 'user123'
    */
    it('should return default userId when not in localStorage', function() {
      $window.localStorage.getItem.and.returnValue(null);

      var userId = AuthService.getUserId();

      expect(userId).toBe('user123');
    });

    /*
    Test Documentation:
    - Test Name: should return true when user is authenticated
    - Purpose: Validate authentication status check
    - Scenario: Call isAuthenticated when authToken exists
    - Expected Result: Returns true
    */
    it('should return true when user is authenticated', function() {
      $window.localStorage.getItem.and.callFake(function(key) {
        if (key === 'authToken') return 'mock-token';
        return null;
      });

      var isAuth = AuthService.isAuthenticated();

      expect(isAuth).toBe(true);
      expect($window.localStorage.getItem).toHaveBeenCalledWith('authToken');
    });

    /*
    Test Documentation:
    - Test Name: should return false when user is not authenticated
    - Purpose: Validate authentication status for unauthenticated user
    - Scenario: Call isAuthenticated when no authToken exists
    - Expected Result: Returns false
    */
    it('should return false when user is not authenticated', function() {
      $window.localStorage.getItem.and.returnValue(null);

      var isAuth = AuthService.isAuthenticated();

      expect(isAuth).toBe(false);
    });

    /*
    Test Documentation:
    - Test Name: should handle empty credentials on login
    - Purpose: Validate handling of empty login credentials
    - Scenario: Call login with empty object
    - Expected Result: HTTP POST made, server handles validation
    */
    it('should handle empty credentials on login', function() {
      var emptyCredentials = {};
      $httpBackend.expectPOST('/api/auth/login', emptyCredentials)
        .respond(400, { error: 'Missing credentials' });

      var errorResult;
      AuthService.login(emptyCredentials).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle network error during login
    - Purpose: Validate error handling on network failure
    - Scenario: Network request fails
    - Expected Result: Promise rejected with network error
    */
    it('should handle network error during login', function() {
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(0, '');

      var errorResult;
      AuthService.login(mockCredentials).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should handle malformed response from login API
    - Purpose: Validate handling of unexpected response format
    - Scenario: API returns response without token or userId
    - Expected Result: Service attempts to store undefined values
    */
    it('should handle malformed response from login API', function() {
      var malformedResponse = { data: 'invalid' };
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(200, malformedResponse);

      var result;
      AuthService.login(mockCredentials).then(function(data) {
        result = data;
      });

      $httpBackend.flush();

      expect(result).toEqual(malformedResponse);
      expect($window.localStorage.setItem).toHaveBeenCalledWith('authToken', undefined);
      expect($window.localStorage.setItem).toHaveBeenCalledWith('userId', undefined);
    });

    /*
    Test Documentation:
    - Test Name: should handle server error during login
    - Purpose: Validate handling of 500 server error
    - Scenario: API returns 500 Internal Server Error
    - Expected Result: Promise rejected, no token stored
    */
    it('should handle server error during login', function() {
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(500, { error: 'Internal Server Error' });

      var errorResult;
      AuthService.login(mockCredentials).catch(function(error) {
        errorResult = error;
      });

      $httpBackend.flush();

      expect(errorResult).toBeDefined();
      expect($window.localStorage.setItem).not.toHaveBeenCalled();
    });

    /*
    Test Documentation:
    - Test Name: should handle multiple login attempts
    - Purpose: Validate service handles consecutive login calls
    - Scenario: Call login multiple times
    - Expected Result: Each call makes separate HTTP request and updates localStorage
    */
    it('should handle multiple login attempts', function() {
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(200, mockAuthResponse);
      $httpBackend.expectPOST('/api/auth/login', mockCredentials)
        .respond(200, { token: 'new-token', userId: 'user456' });

      AuthService.login(mockCredentials);
      $httpBackend.flush(1);

      AuthService.login(mockCredentials);
      $httpBackend.flush(1);

      expect($window.localStorage.setItem).toHaveBeenCalledTimes(4);
    });
  });

})();

/*
Coverage Report:
- Functions tested: login, logout, getUserId, isAuthenticated
- Scenarios covered:
  * Successful login with token storage
  * Failed login (401, 400, 500, network error)
  * Logout with localStorage cleanup and redirect
  * getUserId with and without stored value
  * isAuthenticated for authenticated and unauthenticated states
  * Empty credentials handling
  * Malformed API response
  * Multiple login attempts
- Edge cases: Empty credentials, network errors, malformed responses, missing localStorage values
- Uncovered scenarios: Token expiration handling, refresh token flow
*/