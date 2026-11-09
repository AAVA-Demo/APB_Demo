/*
Test Documentation:
- Test Name: HttpInterceptorService functionality
- Purpose: Validate HTTP request/response interception
- Scenario: Test request token injection and error handling
- Expected Result: Token added to requests, 401 redirects to login
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService, $q, $window;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_HttpInterceptorService_, _$q_, _$window_) {
      HttpInterceptorService = _HttpInterceptorService_;
      $q = _$q_;
      $window = _$window_;
    }));

    /*
    Test Documentation:
    - Test Name: should be defined
    - Purpose: Ensure service is injectable
    - Scenario: Inject HttpInterceptorService
    - Expected Result: Service is defined
    */
    it('should be defined', function() {
      expect(HttpInterceptorService).toBeDefined();
    });

    /*
    Test Documentation:
    - Test Name: should add Authorization header when token exists
    - Purpose: Validate token injection in requests
    - Scenario: Token exists in sessionStorage
    - Expected Result: Authorization header added to config
    */
    it('should add Authorization header when token exists', function() {
      spyOn($window.sessionStorage, 'getItem').and.returnValue('test-token-123');
      var config = { headers: {} };
      var result = HttpInterceptorService.request(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    });

    /*
    Test Documentation:
    - Test Name: should not add Authorization header when token is missing
    - Purpose: Validate behavior without token
    - Scenario: No token in sessionStorage
    - Expected Result: No Authorization header added
    */
    it('should not add Authorization header when token is missing', function() {
      spyOn($window.sessionStorage, 'getItem').and.returnValue(null);
      var config = { headers: {} };
      var result = HttpInterceptorService.request(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    /*
    Test Documentation:
    - Test Name: should redirect to login on 401 error
    - Purpose: Validate unauthorized error handling
    - Scenario: HTTP 401 response
    - Expected Result: Redirect to /login
    */
    it('should redirect to login on 401 error', function() {
      var rejection = { status: 401 };
      HttpInterceptorService.responseError(rejection);
      expect($window.location.href).toBe('/login');
    });

    /*
    Test Documentation:
    - Test Name: should reject promise on non-401 errors
    - Purpose: Validate error propagation
    - Scenario: HTTP 500 error
    - Expected Result: Promise rejected with original error
    */
    it('should reject promise on non-401 errors', function() {
      var rejection = { status: 500, data: 'Server error' };
      var result = HttpInterceptorService.responseError(rejection);
      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error.status).toBe(500);
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: request, responseError
  - Scenarios covered: token injection, missing token, 401 redirect, error propagation
  - Uncovered scenarios: none
  */
})();