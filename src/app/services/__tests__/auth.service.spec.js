/*
Test Documentation:
- Test Name: AuthService - validateSession with stored credentials
- Purpose: Verify that validateSession retrieves and validates stored authentication credentials from sessionStorage
- Scenario: User has valid stored authToken and userId in sessionStorage
- Expected Result: Promise resolves with userId and authToken from sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession without stored credentials
- Purpose: Verify that validateSession creates mock credentials when no stored credentials exist
- Scenario: User has no stored credentials in sessionStorage
- Expected Result: Promise resolves with mock userId and authToken, and stores them in sessionStorage
*/
/*
Test Documentation:
- Test Name: AuthService - validateSession with invalid stored credentials
- Purpose: Verify that validateSession handles invalid stored credentials correctly
- Scenario: User has stored credentials but server validation fails
- Expected Result: Promise rejects with 'Invalid session' error
*/
/*
Test Documentation:
- Test Name: AuthService - getAuthToken
- Purpose: Verify that getAuthToken returns the current authentication token
- Scenario: User has authenticated and authToken is set
- Expected Result: Returns the current authToken value
*/
/*
Test Documentation:
- Test Name: AuthService - getUserId
- Purpose: Verify that getUserId returns the current user identifier
- Scenario: User has authenticated and userId is set
- Expected Result: Returns the current userId value
*/
/*
Coverage Report:
- Functions tested: validateSession, getAuthToken, getUserId
- Scenarios covered: stored credentials validation, mock credentials generation, invalid session handling, token retrieval, userId retrieval
- Edge cases: missing sessionStorage items, HTTP validation failure, null token/userId
- Uncovered scenarios: network timeout, malformed stored data
*/

describe('AuthService', function() {
  var AuthService, $httpBackend, $window, API_CONFIG, $q, $rootScope;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _API_CONFIG_, _$q_, _$rootScope_) {
    AuthService = _AuthService_;
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    API_CONFIG = _API_CONFIG_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
    $window.sessionStorage.clear();
  });

  describe('validateSession', function() {
    it('should resolve with stored credentials when valid token and userId exist in sessionStorage', function() {
      var mockToken = 'stored-token-123';
      var mockUserId = 'user456';
      $window.sessionStorage.setItem('authToken', mockToken);
      $window.sessionStorage.setItem('userId', mockUserId);

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(200, { valid: true });

      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.userId).toBe(mockUserId);
      expect(result.authToken).toBe(mockToken);
    });

    it('should reject when stored credentials are invalid according to server', function() {
      var mockToken = 'invalid-token';
      var mockUserId = 'user789';
      $window.sessionStorage.setItem('authToken', mockToken);
      $window.sessionStorage.setItem('userId', mockUserId);

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(200, { valid: false });

      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBe('Invalid session');
    });

    it('should reject when HTTP validation request fails', function() {
      var mockToken = 'stored-token-123';
      var mockUserId = 'user456';
      $window.sessionStorage.setItem('authToken', mockToken);
      $window.sessionStorage.setItem('userId', mockUserId);

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(500, 'Server error');

      var error;
      AuthService.validateSession().catch(function(err) {
        error = err;
      });

      $httpBackend.flush();

      expect(error).toBeDefined();
    });

    it('should create mock credentials when no stored credentials exist', function() {
      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.authToken).toContain('mock-token-');
      expect($window.sessionStorage.getItem('authToken')).toContain('mock-token-');
      expect($window.sessionStorage.getItem('userId')).toBe('user123');
    });

    it('should create mock credentials when only authToken is missing', function() {
      $window.sessionStorage.setItem('userId', 'existingUser');

      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.authToken).toContain('mock-token-');
    });

    it('should create mock credentials when only userId is missing', function() {
      $window.sessionStorage.setItem('authToken', 'existingToken');

      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.authToken).toContain('mock-token-');
    });
  });

  describe('getAuthToken', function() {
    it('should return null when no session has been validated', function() {
      var token = AuthService.getAuthToken();
      expect(token).toBeNull();
    });

    it('should return authToken after successful session validation', function() {
      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      var token = AuthService.getAuthToken();
      expect(token).toBeDefined();
      expect(token).toContain('mock-token-');
    });

    it('should return stored authToken after validation with stored credentials', function() {
      var mockToken = 'stored-token-456';
      var mockUserId = 'user789';
      $window.sessionStorage.setItem('authToken', mockToken);
      $window.sessionStorage.setItem('userId', mockUserId);

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(200, { valid: true });

      AuthService.validateSession();
      $httpBackend.flush();

      var token = AuthService.getAuthToken();
      expect(token).toBe(mockToken);
    });
  });

  describe('getUserId', function() {
    it('should return null when no session has been validated', function() {
      var userId = AuthService.getUserId();
      expect(userId).toBeNull();
    });

    it('should return userId after successful session validation', function() {
      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      var userId = AuthService.getUserId();
      expect(userId).toBe('user123');
    });

    it('should return stored userId after validation with stored credentials', function() {
      var mockToken = 'stored-token-789';
      var mockUserId = 'user999';
      $window.sessionStorage.setItem('authToken', mockToken);
      $window.sessionStorage.setItem('userId', mockUserId);

      $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate')
        .respond(200, { valid: true });

      AuthService.validateSession();
      $httpBackend.flush();

      var userId = AuthService.getUserId();
      expect(userId).toBe(mockUserId);
    });
  });

  describe('Edge Cases', function() {
    it('should handle empty string authToken in sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', '');
      $window.sessionStorage.setItem('userId', 'user123');

      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
      expect(result.authToken).toContain('mock-token-');
    });

    it('should handle empty string userId in sessionStorage', function() {
      $window.sessionStorage.setItem('authToken', 'token123');
      $window.sessionStorage.setItem('userId', '');

      var result;
      AuthService.validateSession().then(function(session) {
        result = session;
      });

      $rootScope.$apply();

      expect(result).toBeDefined();
      expect(result.userId).toBe('user123');
    });

    it('should generate unique mock tokens on multiple calls', function() {
      var result1, result2;

      AuthService.validateSession().then(function(session) {
        result1 = session;
      });
      $rootScope.$apply();

      $window.sessionStorage.clear();

      AuthService.validateSession().then(function(session) {
        result2 = session;
      });
      $rootScope.$apply();

      expect(result1.authToken).not.toBe(result2.authToken);
    });
  });
});