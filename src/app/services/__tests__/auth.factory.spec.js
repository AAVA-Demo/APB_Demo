/*
Test Documentation:
- Test Name: AuthFactory - isAuthenticated method
- Purpose: Validates authentication status based on token and expiry
- Scenario: Token exists and is not expired
- Expected Result: Returns true
*/
/*
Test Documentation:
- Test Name: AuthFactory - isAuthenticated method
- Purpose: Validates authentication status when token is missing
- Scenario: No token in localStorage
- Expected Result: Returns false
*/
/*
Test Documentation:
- Test Name: AuthFactory - isAuthenticated method
- Purpose: Validates authentication status when token is expired
- Scenario: Token exists but expiry time has passed
- Expected Result: Returns false
*/
/*
Test Documentation:
- Test Name: AuthFactory - getToken method
- Purpose: Retrieves authentication token from storage
- Scenario: Token exists in localStorage
- Expected Result: Returns the stored token
*/
/*
Test Documentation:
- Test Name: AuthFactory - validateSession method
- Purpose: Validates active user session
- Scenario: User has valid authenticated session
- Expected Result: Promise resolves with token object
*/
/*
Test Documentation:
- Test Name: AuthFactory - validateSession method
- Purpose: Validates session when authentication has expired
- Scenario: User session is expired
- Expected Result: Promise rejects with 'Session expired' message
*/
/*
Test Documentation:
- Test Name: AuthFactory - mockLogin method
- Purpose: Simulates user login for testing
- Scenario: User performs mock login
- Expected Result: Token, expiry, and userId are stored in localStorage
*/
/*
Test Documentation:
- Test Name: AuthFactory - logout method
- Purpose: Clears user authentication data
- Scenario: User logs out
- Expected Result: All auth tokens and user data removed from localStorage
*/
/*
Coverage Report:
- Functions tested: isAuthenticated, getToken, validateSession, mockLogin, logout
- Scenarios covered: valid authentication, missing token, expired token, session validation success/failure, login, logout
- Uncovered scenarios: network errors during token validation, concurrent logout operations
*/

(function() {
  'use strict';

  describe('AuthFactory', function() {
    var AuthFactory, LocalStorageService, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthFactory_, _LocalStorageService_, _$q_, _$rootScope_) {
      AuthFactory = _AuthFactory_;
      LocalStorageService = _LocalStorageService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    describe('isAuthenticated', function() {
      it('should return true when token exists and is not expired', function() {
        spyOn(LocalStorageService, 'get').and.callFake(function(key) {
          if (key === 'authToken') return 'valid-token';
          if (key === 'tokenExpiry') return (new Date().getTime() + 10000).toString();
        });
        expect(AuthFactory.isAuthenticated()).toBe(true);
      });

      it('should return false when token does not exist', function() {
        spyOn(LocalStorageService, 'get').and.returnValue(null);
        expect(AuthFactory.isAuthenticated()).toBe(false);
      });

      it('should return false when token is expired', function() {
        spyOn(LocalStorageService, 'get').and.callFake(function(key) {
          if (key === 'authToken') return 'expired-token';
          if (key === 'tokenExpiry') return (new Date().getTime() - 10000).toString();
        });
        expect(AuthFactory.isAuthenticated()).toBe(false);
      });

      it('should return false when expiry is missing', function() {
        spyOn(LocalStorageService, 'get').and.callFake(function(key) {
          if (key === 'authToken') return 'valid-token';
          if (key === 'tokenExpiry') return null;
        });
        expect(AuthFactory.isAuthenticated()).toBe(false);
      });
    });

    describe('getToken', function() {
      it('should return token from localStorage', function() {
        spyOn(LocalStorageService, 'get').and.returnValue('test-token-123');
        expect(AuthFactory.getToken()).toBe('test-token-123');
        expect(LocalStorageService.get).toHaveBeenCalledWith('authToken');
      });

      it('should return null when no token exists', function() {
        spyOn(LocalStorageService, 'get').and.returnValue(null);
        expect(AuthFactory.getToken()).toBeNull();
      });
    });

    describe('validateSession', function() {
      it('should resolve promise when user is authenticated', function() {
        spyOn(AuthFactory, 'isAuthenticated').and.returnValue(true);
        spyOn(AuthFactory, 'getToken').and.returnValue('valid-token');
        var result;
        AuthFactory.validateSession().then(function(data) {
          result = data;
        });
        $rootScope.$digest();
        expect(result).toEqual({ token: 'valid-token' });
      });

      it('should reject promise when user is not authenticated', function() {
        spyOn(AuthFactory, 'isAuthenticated').and.returnValue(false);
        var error;
        AuthFactory.validateSession().catch(function(err) {
          error = err;
        });
        $rootScope.$digest();
        expect(error).toBe('Session expired');
      });
    });

    describe('mockLogin', function() {
      it('should set authToken, tokenExpiry, and userId in localStorage', function() {
        spyOn(LocalStorageService, 'set');
        AuthFactory.mockLogin();
        expect(LocalStorageService.set).toHaveBeenCalledWith('authToken', jasmine.any(String));
        expect(LocalStorageService.set).toHaveBeenCalledWith('tokenExpiry', jasmine.any(String));
        expect(LocalStorageService.set).toHaveBeenCalledWith('userId', 'user123');
      });

      it('should set token expiry to 15 minutes from now', function() {
        var setCallArgs = [];
        spyOn(LocalStorageService, 'set').and.callFake(function(key, value) {
          setCallArgs.push({ key: key, value: value });
        });
        var beforeTime = new Date().getTime();
        AuthFactory.mockLogin();
        var afterTime = new Date().getTime();
        var expiryCall = setCallArgs.find(function(call) { return call.key === 'tokenExpiry'; });
        var expiryValue = parseInt(expiryCall.value);
        expect(expiryValue).toBeGreaterThan(beforeTime + 14 * 60 * 1000);
        expect(expiryValue).toBeLessThan(afterTime + 16 * 60 * 1000);
      });
    });

    describe('logout', function() {
      it('should remove authToken, tokenExpiry, and userId from localStorage', function() {
        spyOn(LocalStorageService, 'remove');
        AuthFactory.logout();
        expect(LocalStorageService.remove).toHaveBeenCalledWith('authToken');
        expect(LocalStorageService.remove).toHaveBeenCalledWith('tokenExpiry');
        expect(LocalStorageService.remove).toHaveBeenCalledWith('userId');
      });
    });
  });
})();