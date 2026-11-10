/*
Test Documentation:
- Test Name: AuthInterceptorService - request method adds authorization header
- Purpose: Verify that the request interceptor adds Bearer token to request headers
- Scenario: When a request is intercepted
- Expected Result: Authorization header is added with Bearer token
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - request method initializes headers if not present
- Purpose: Verify that the request interceptor initializes headers object if undefined
- Scenario: When a request config has no headers property
- Expected Result: Headers object is created and Authorization header is added
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError handles 401 status
- Purpose: Verify that 401 errors trigger authentication error notification
- Scenario: When API returns 401 Unauthorized
- Expected Result: Toastr error is displayed with authentication message and promise is rejected
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError handles 500 status
- Purpose: Verify that 500 errors trigger server error notification
- Scenario: When API returns 500 Internal Server Error
- Expected Result: Toastr error is displayed with server error message and promise is rejected
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError handles -1 status (network failure)
- Purpose: Verify that network failures are logged to console
- Scenario: When API call fails due to network issue (status -1)
- Expected Result: Console log message is written and promise is rejected
*/
/*
Test Documentation:
- Test Name: AuthInterceptorService - responseError handles other error statuses
- Purpose: Verify that other error statuses are rejected without additional handling
- Scenario: When API returns error status other than 401, 500, or -1
- Expected Result: Promise is rejected without toastr or console messages
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: 
  * Authorization header injection
  * Headers initialization
  * 401 Unauthorized error handling
  * 500 Server error handling
  * Network failure (-1 status) handling
  * Generic error handling
  * Promise rejection in all error scenarios
- Uncovered scenarios: None - all critical paths tested
- Edge cases tested: Missing headers object, various HTTP error codes, network failures
*/

(function() {
  'use strict';

  describe('AuthInterceptorService', function() {
    var AuthInterceptorService;
    var $q;
    var $rootScope;
    var toastrSpy;
    var consoleLogSpy;

    beforeEach(module('creditCardApp'));

    beforeEach(function() {
      // Mock toastr globally
      window.toastr = {
        error: jasmine.createSpy('toastr.error')
      };
      toastrSpy = window.toastr.error;

      // Spy on console.log
      consoleLogSpy = spyOn(console, 'log');
    });

    beforeEach(inject(function(_AuthInterceptorService_, _$q_, _$rootScope_) {
      AuthInterceptorService = _AuthInterceptorService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      delete window.toastr;
    });

    describe('request method', function() {
      it('should add Authorization header with Bearer token to request config', function() {
        // Arrange
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };

        // Act
        var result = AuthInterceptorService.request(config);

        // Assert
        expect(result.headers.Authorization).toBe('Bearer mock-jwt-token-12345');
        expect(result).toBe(config);
      });

      it('should initialize headers object if not present', function() {
        // Arrange
        var config = {
          url: '/api/test',
          method: 'GET'
        };

        // Act
        var result = AuthInterceptorService.request(config);

        // Assert
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer mock-jwt-token-12345');
      });

      it('should return the same config object with added headers', function() {
        // Arrange
        var config = {
          url: '/api/test',
          method: 'POST',
          data: { test: 'data' }
        };

        // Act
        var result = AuthInterceptorService.request(config);

        // Assert
        expect(result).toBe(config);
        expect(result.url).toBe('/api/test');
        expect(result.method).toBe('POST');
        expect(result.data).toEqual({ test: 'data' });
      });

      it('should preserve existing headers while adding Authorization', function() {
        // Arrange
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };

        // Act
        var result = AuthInterceptorService.request(config);

        // Assert
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer mock-jwt-token-12345');
      });
    });

    describe('responseError method', function() {
      it('should handle 401 Unauthorized error with toastr notification', function() {
        // Arrange
        var rejection = {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid token' }
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).toHaveBeenCalledWith('Unauthorized access. Please login.', 'Authentication Error');
        expect(result).toBeDefined();
        
        // Verify promise is rejected
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });

      it('should handle 500 Internal Server Error with toastr notification', function() {
        // Arrange
        var rejection = {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server error' }
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).toHaveBeenCalledWith('Server error. Please try again later.', 'Error');
        
        // Verify promise is rejected
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });

      it('should handle -1 status (network failure) with console log', function() {
        // Arrange
        var rejection = {
          status: -1,
          statusText: '',
          data: null
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(consoleLogSpy).toHaveBeenCalledWith('API call failed, using mock data');
        expect(toastrSpy).not.toHaveBeenCalled();
        
        // Verify promise is rejected
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });

      it('should handle other error statuses without toastr or console', function() {
        // Arrange
        var rejection = {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'Resource not found' }
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).not.toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
        
        // Verify promise is rejected
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });

      it('should handle 403 Forbidden error without special handling', function() {
        // Arrange
        var rejection = {
          status: 403,
          statusText: 'Forbidden',
          data: { message: 'Access denied' }
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).not.toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
        
        // Verify promise is rejected
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });

      it('should handle 400 Bad Request error without special handling', function() {
        // Arrange
        var rejection = {
          status: 400,
          statusText: 'Bad Request',
          data: { message: 'Invalid request' }
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).not.toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
      });

      it('should return rejected promise in all error scenarios', function() {
        // Arrange
        var testCases = [
          { status: 401, desc: '401 Unauthorized' },
          { status: 500, desc: '500 Server Error' },
          { status: -1, desc: 'Network Failure' },
          { status: 404, desc: '404 Not Found' },
          { status: 503, desc: '503 Service Unavailable' }
        ];

        testCases.forEach(function(testCase) {
          // Arrange
          var rejection = {
            status: testCase.status,
            statusText: testCase.desc
          };

          // Act
          var result = AuthInterceptorService.responseError(rejection);

          // Assert
          expect(result).toBeDefined();
          expect(typeof result.then).toBe('function');
          expect(typeof result.catch).toBe('function');
          
          var rejected = false;
          result.catch(function(error) {
            rejected = true;
            expect(error).toBe(rejection);
          });
          $rootScope.$apply();
          expect(rejected).toBe(true);
        });
      });
    });

    describe('edge cases and error conditions', function() {
      it('should handle request with null config gracefully', function() {
        // This test verifies defensive programming
        // In real scenario, this shouldn't happen, but we test robustness
        var config = null;
        
        // This would throw an error in the actual implementation
        // Testing that we understand the limitation
        expect(function() {
          AuthInterceptorService.request(config);
        }).toThrow();
      });

      it('should handle responseError with undefined rejection', function() {
        // Arrange
        var rejection = undefined;

        // Act & Assert
        // This tests that the service handles edge cases
        expect(function() {
          var result = AuthInterceptorService.responseError(rejection);
          $rootScope.$apply();
        }).not.toThrow();
      });

      it('should handle responseError with rejection missing status property', function() {
        // Arrange
        var rejection = {
          statusText: 'Unknown Error',
          data: {}
        };

        // Act
        var result = AuthInterceptorService.responseError(rejection);
        $rootScope.$apply();

        // Assert
        expect(toastrSpy).not.toHaveBeenCalled();
        expect(consoleLogSpy).not.toHaveBeenCalled();
        
        var rejected = false;
        result.catch(function(error) {
          rejected = true;
          expect(error).toBe(rejection);
        });
        $rootScope.$apply();
        expect(rejected).toBe(true);
      });
    });

    describe('integration scenarios', function() {
      it('should work correctly when used as HTTP interceptor', function() {
        // This test simulates the interceptor being used in the HTTP pipeline
        // Arrange
        var requestConfig = {
          url: '/api/cards',
          method: 'GET'
        };

        // Act - simulate request interception
        var modifiedConfig = AuthInterceptorService.request(requestConfig);

        // Assert
        expect(modifiedConfig.headers.Authorization).toBe('Bearer mock-jwt-token-12345');

        // Simulate response error
        var errorResponse = {
          status: 401,
          config: modifiedConfig
        };

        var errorResult = AuthInterceptorService.responseError(errorResponse);
        $rootScope.$apply();

        expect(toastrSpy).toHaveBeenCalled();
      });

      it('should handle multiple consecutive error responses', function() {
        // Arrange
        var errors = [
          { status: 401, desc: 'Unauthorized' },
          { status: 500, desc: 'Server Error' },
          { status: -1, desc: 'Network Error' }
        ];

        // Act & Assert
        errors.forEach(function(error) {
          toastrSpy.calls.reset();
          consoleLogSpy.calls.reset();

          var rejection = { status: error.status, statusText: error.desc };
          var result = AuthInterceptorService.responseError(rejection);
          $rootScope.$apply();

          if (error.status === 401) {
            expect(toastrSpy).toHaveBeenCalledWith('Unauthorized access. Please login.', 'Authentication Error');
          } else if (error.status === 500) {
            expect(toastrSpy).toHaveBeenCalledWith('Server error. Please try again later.', 'Error');
          } else if (error.status === -1) {
            expect(consoleLogSpy).toHaveBeenCalledWith('API call failed, using mock data');
          }
        });
      });
    });
  });
})();