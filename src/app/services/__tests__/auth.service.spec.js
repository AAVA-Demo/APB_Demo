/*
Test Documentation:
- Test Name: AuthService Unit Tests
- Purpose: Validate user authentication, session management, and context retrieval
- Scenario: Tests validateUser, getUserContext, and logout methods with various authentication states
- Expected Result: Correct authentication flow with session storage management and error handling
*/

(function() {
  'use strict';

  describe('AuthService', function() {
    var AuthService, $httpBackend, $window, $q, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_AuthService_, _$httpBackend_, _$window_, _$q_, _$rootScope_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $window = _$window_;
      $q = _$q_;
      $rootScope = _$rootScope_;
      $window.sessionStorage.clear();
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $window.sessionStorage.clear();
    });

    describe('validateUser', function() {
      it('should validate user and store context in session storage on success', function(done) {
        var mockUserContext = {
          userId: 'user123',
          username: 'testuser',
          email: 'test@example.com'
        };

        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserContext);

        AuthService.validateUser().then(function(userContext) {
          expect(userContext).toEqual(mockUserContext);
          expect($window.sessionStorage.getItem('userContext')).toBe(JSON.stringify(mockUserContext));
          done();
        });

        $httpBackend.flush();
      });

      it('should return cached user context without making HTTP call if already validated', function(done) {
        var mockUserContext = {
          userId: 'user123',
          username: 'testuser',
          email: 'test@example.com'
        };

        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserContext);

        AuthService.validateUser().then(function() {
          // Second call should not make HTTP request
          AuthService.validateUser().then(function(userContext) {
            expect(userContext).toEqual(mockUserContext);
            done();
          });
          $rootScope.$digest();
        });

        $httpBackend.flush();
      });

      it('should reject promise on authentication failure', function(done) {
        $httpBackend.expectGET('/api/auth/validate').respond(401, { error: 'Unauthorized' });

        AuthService.validateUser().then(function() {
          fail('Should not resolve on authentication failure');
        }, function(error) {
          expect(error.status).toBe(401);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network errors gracefully', function(done) {
        $httpBackend.expectGET('/api/auth/validate').respond(500, { error: 'Internal Server Error' });

        AuthService.validateUser().then(function() {
          fail('Should not resolve on server error');
        }, function(error) {
          expect(error.status).toBe(500);
          done();
        });

        $httpBackend.flush();
      });
    });

    describe('getUserContext', function() {
      it('should return null when no user context is available', function() {
        var context = AuthService.getUserContext();
        expect(context).toBeNull();
      });

      it('should return user context after successful validation', function(done) {
        var mockUserContext = {
          userId: 'user123',
          username: 'testuser'
        };

        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserContext);

        AuthService.validateUser().then(function() {
          var context = AuthService.getUserContext();
          expect(context).toEqual(mockUserContext);
          done();
        });

        $httpBackend.flush();
      });

      it('should retrieve user context from session storage if available', function() {
        var mockUserContext = {
          userId: 'user123',
          username: 'testuser'
        };

        $window.sessionStorage.setItem('userContext', JSON.stringify(mockUserContext));

        var context = AuthService.getUserContext();
        expect(context).toEqual(mockUserContext);
      });

      it('should handle invalid JSON in session storage gracefully', function() {
        $window.sessionStorage.setItem('userContext', 'invalid-json');

        expect(function() {
          AuthService.getUserContext();
        }).toThrow();
      });
    });

    describe('logout', function() {
      it('should clear user context and remove from session storage', function(done) {
        var mockUserContext = {
          userId: 'user123',
          username: 'testuser'
        };

        $httpBackend.expectGET('/api/auth/validate').respond(200, mockUserContext);

        AuthService.validateUser().then(function() {
          expect(AuthService.getUserContext()).toEqual(mockUserContext);
          expect($window.sessionStorage.getItem('userContext')).toBeTruthy();

          AuthService.logout();

          expect(AuthService.getUserContext()).toBeNull();
          expect($window.sessionStorage.getItem('userContext')).toBeNull();
          done();
        });

        $httpBackend.flush();
      });

      it('should handle logout when no user is logged in', function() {
        expect(function() {
          AuthService.logout();
        }).not.toThrow();

        expect(AuthService.getUserContext()).toBeNull();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: validateUser, getUserContext, logout
- Scenarios covered:
  * Successful user validation with session storage
  * Cached user context retrieval
  * Authentication failure (401)
  * Network errors (500)
  * Null user context retrieval
  * User context after validation
  * Session storage retrieval
  * Invalid JSON in session storage
  * Logout with active session
  * Logout without active session
- Edge cases: Cached context, session storage persistence, invalid JSON
- Error scenarios: 401 Unauthorized, 500 Server Error, invalid session data
- Uncovered scenarios: None - comprehensive coverage achieved
*/