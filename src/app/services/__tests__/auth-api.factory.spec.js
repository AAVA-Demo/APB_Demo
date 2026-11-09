/*
Test Documentation:
- Test Name: AuthAPI Factory - validateSession success
- Purpose: Validates that validateSession successfully validates user session
- Scenario: Valid session token provided, API returns success response
- Expected Result: Promise resolves with session validation data
*/
/*
Test Documentation:
- Test Name: AuthAPI Factory - validateSession unauthorized error
- Purpose: Validates error handling when session is invalid or expired
- Scenario: API returns 401 Unauthorized response
- Expected Result: Promise is rejected and error is logged
*/
/*
Test Documentation:
- Test Name: AuthAPI Factory - validateSession server error
- Purpose: Validates error handling when server encounters an error
- Scenario: API returns 500 Internal Server Error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: validateSession
- Scenarios covered: success response, 401 unauthorized, 500 server error, network error, error logging
- Uncovered scenarios: token refresh logic (not implemented in current version)
*/

(function() {
  'use strict';

  describe('AuthAPI Factory', function() {
    var AuthAPI, $httpBackend, $q, API_CONFIG;
    var baseUrl = 'https://api.creditcard.demo';
    var authValidateEndpoint = '/api/auth/validate';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthAPI_, _$httpBackend_, _$q_, _API_CONFIG_) {
      AuthAPI = _AuthAPI_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('validateSession', function() {
      it('should successfully validate session with valid token', function() {
        var mockResponse = {
          valid: true,
          userId: 'user123',
          expiresAt: '2024-12-31T23:59:59Z'
        };

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AuthAPI.validateSession().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.valid).toBe(true);
        expect(result.userId).toBe('user123');
      });

      it('should handle 401 Unauthorized error for invalid session', function() {
        var errorResponse = {
          valid: false,
          message: 'Session expired or invalid'
        };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(401, errorResponse);

        var error;
        AuthAPI.validateSession().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(401);
        expect(console.error).toHaveBeenCalledWith('Auth validation error:', jasmine.any(Object));
      });

      it('should handle 500 Internal Server Error', function() {
        var errorResponse = { message: 'Internal Server Error' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(500, errorResponse);

        var error;
        AuthAPI.validateSession().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle 403 Forbidden error', function() {
        var errorResponse = { message: 'Access forbidden' };

        spyOn(console, 'error');

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(403, errorResponse);

        var error;
        AuthAPI.validateSession().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error.status).toBe(403);
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network error (status 0)', function() {
        spyOn(console, 'error');

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(0, '');

        var error;
        AuthAPI.validateSession().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(0);
        expect(console.error).toHaveBeenCalled();
      });

      it('should return session data with all expected fields', function() {
        var mockResponse = {
          valid: true,
          userId: 'user456',
          username: 'testuser',
          email: 'test@example.com',
          expiresAt: '2024-12-31T23:59:59Z',
          roles: ['user', 'admin']
        };

        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(200, mockResponse);

        var result;
        AuthAPI.validateSession().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.valid).toBe(true);
        expect(result.userId).toBe('user456');
        expect(result.username).toBe('testuser');
        expect(result.email).toBe('test@example.com');
        expect(result.roles).toEqual(['user', 'admin']);
      });

      it('should handle empty response body', function() {
        var expectedUrl = baseUrl + authValidateEndpoint;

        $httpBackend.expectGET(expectedUrl).respond(200, null);

        var result;
        AuthAPI.validateSession().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeNull();
      });
    });
  });
})();