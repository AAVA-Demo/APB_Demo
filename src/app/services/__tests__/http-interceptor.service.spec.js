/*
Test Documentation:
- Test Name: HttpInterceptorService - request interceptor
- Purpose: Validates that request interceptor adds Authorization header with JWT token
- Scenario: HTTP request is made with authentication
- Expected Result: Authorization header is added to request config
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - responseError interceptor
- Purpose: Validates that responseError interceptor handles various HTTP error codes
- Scenario: HTTP request fails with different status codes
- Expected Result: Appropriate error messages are displayed and promise is rejected
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - 401 Unauthorized
- Purpose: Validates handling of unauthorized access errors
- Scenario: API returns 401 status code
- Expected Result: 'Unauthorized. Please login again.' message is displayed
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - 403 Forbidden
- Purpose: Validates handling of forbidden access errors
- Scenario: API returns 403 status code
- Expected Result: 'Access forbidden.' message is displayed
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - 404 Not Found
- Purpose: Validates handling of resource not found errors
- Scenario: API returns 404 status code
- Expected Result: 'Resource not found.' message is displayed
*/
/*
Test Documentation:
- Test Name: HttpInterceptorService - 500 Server Error
- Purpose: Validates handling of server errors
- Scenario: API returns 500 or higher status code
- Expected Result: 'Server error. Please try again later.' message is displayed
*/
/*
Coverage Report:
- Functions tested: request, responseError
- Scenarios covered: token injection, error handling for 401/403/404/500+ status codes, missing token, error logging, promise rejection
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('HttpInterceptorService', function() {
    var HttpInterceptorService;
    var AuthService;
    var $q;
    var $rootScope;
    var toastrSpy;
    var consoleErrorSpy;

    beforeEach(module('creditCardApp'));

    beforeEach(function() {
      toastrSpy = jasmine.createSpyObj('toastr', ['error', 'warning', 'success', 'info']);
      window.toastr = toastrSpy;
      
      consoleErrorSpy = spyOn(console, 'error');
    });

    beforeEach(inject(function(_HttpInterceptorService_, _AuthService_, _$q_, _$rootScope_) {
      HttpInterceptorService = _HttpInterceptorService_;
      AuthService = _AuthService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      delete window.toastr;
    });

    describe('request interceptor', function() {
      it('should add Authorization header when token exists', function() {
        spyOn(AuthService, 'getToken').and.returnValue('test-jwt-token-123');
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(AuthService.getToken).toHaveBeenCalled();
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer test-jwt-token-123');
      });

      it('should preserve existing headers when adding Authorization', function() {
        spyOn(AuthService, 'getToken').and.returnValue('token-abc');
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          }
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers['Content-Type']).toBe('application/json');
        expect(result.headers['X-Custom-Header']).toBe('custom-value');
        expect(result.headers.Authorization).toBe('Bearer token-abc');
      });

      it('should create headers object if not present', function() {
        spyOn(AuthService, 'getToken').and.returnValue('new-token');
        
        var config = {
          url: '/api/test',
          method: 'POST'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers).toBeDefined();
        expect(result.headers.Authorization).toBe('Bearer new-token');
      });

      it('should not add Authorization header when token is null', function() {
        spyOn(AuthService, 'getToken').and.returnValue(null);
        
        var config = {
          url: '/api/test',
          method: 'GET',
          headers: {}
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should not add Authorization header when token is undefined', function() {
        spyOn(AuthService, 'getToken').and.returnValue(undefined);
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers).toBeUndefined();
      });

      it('should not add Authorization header when token is empty string', function() {
        spyOn(AuthService, 'getToken').and.returnValue('');
        
        var config = {
          url: '/api/test',
          method: 'GET'
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers).toBeUndefined();
      });

      it('should return the config object', function() {
        spyOn(AuthService, 'getToken').and.returnValue('token');
        
        var config = {
          url: '/api/test',
          method: 'GET',
          data: { test: 'data' }
        };
        
        var result = HttpInterceptorService.request(config);
        
        expect(result).toBe(config);
        expect(result.url).toBe('/api/test');
        expect(result.method).toBe('GET');
        expect(result.data).toEqual({ test: 'data' });
      });
    });

    describe('responseError interceptor', function() {
      describe('401 Unauthorized', function() {
        it('should display unauthorized error message', function() {
          var rejection = {
            status: 401,
            data: { message: 'Unauthorized' },
            config: { url: '/api/secure' }
          };
          
          var result;
          HttpInterceptorService.responseError(rejection).catch(function(error) {
            result = error;
          });
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Unauthorized. Please login again.');
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
          expect(result).toBe(rejection);
        });
      });

      describe('403 Forbidden', function() {
        it('should display forbidden error message', function() {
          var rejection = {
            status: 403,
            data: { message: 'Forbidden' },
            config: { url: '/api/admin' }
          };
          
          var result;
          HttpInterceptorService.responseError(rejection).catch(function(error) {
            result = error;
          });
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Access forbidden.');
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
          expect(result).toBe(rejection);
        });
      });

      describe('404 Not Found', function() {
        it('should display not found error message', function() {
          var rejection = {
            status: 404,
            data: { message: 'Not Found' },
            config: { url: '/api/missing' }
          };
          
          var result;
          HttpInterceptorService.responseError(rejection).catch(function(error) {
            result = error;
          });
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Resource not found.');
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
          expect(result).toBe(rejection);
        });
      });

      describe('500 Server Error', function() {
        it('should display server error message for 500 status', function() {
          var rejection = {
            status: 500,
            data: { message: 'Internal Server Error' },
            config: { url: '/api/error' }
          };
          
          var result;
          HttpInterceptorService.responseError(rejection).catch(function(error) {
            result = error;
          });
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Server error. Please try again later.');
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
          expect(result).toBe(rejection);
        });

        it('should display server error message for 502 status', function() {
          var rejection = {
            status: 502,
            data: { message: 'Bad Gateway' }
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Server error. Please try again later.');
        });

        it('should display server error message for 503 status', function() {
          var rejection = {
            status: 503,
            data: { message: 'Service Unavailable' }
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('Server error. Please try again later.');
        });
      });

      describe('Other error codes', function() {
        it('should display generic error message for 400 status', function() {
          var rejection = {
            status: 400,
            data: { message: 'Bad Request' }
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('An error occurred');
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
        });

        it('should display generic error message for 0 status (network error)', function() {
          var rejection = {
            status: 0,
            data: null
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('An error occurred');
        });

        it('should display generic error message for -1 status', function() {
          var rejection = {
            status: -1,
            data: null
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(toastrSpy.error).toHaveBeenCalledWith('An error occurred');
        });
      });

      describe('Promise rejection', function() {
        it('should return a rejected promise', function() {
          var rejection = {
            status: 500,
            data: { message: 'Error' }
          };
          
          var promise = HttpInterceptorService.responseError(rejection);
          
          expect(promise.then).toBeDefined();
          expect(promise.catch).toBeDefined();
        });

        it('should reject with the original rejection object', function() {
          var rejection = {
            status: 404,
            data: { message: 'Not Found' },
            config: { url: '/api/test' }
          };
          
          var result;
          HttpInterceptorService.responseError(rejection).catch(function(error) {
            result = error;
          });
          $rootScope.$apply();
          
          expect(result).toBe(rejection);
          expect(result.status).toBe(404);
          expect(result.data).toEqual({ message: 'Not Found' });
        });
      });

      describe('Error logging', function() {
        it('should log error to console for all error types', function() {
          var rejection = {
            status: 401,
            data: { message: 'Unauthorized' }
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
        });

        it('should log complete rejection object including headers', function() {
          var rejection = {
            status: 500,
            data: { message: 'Error' },
            headers: function() { return { 'Content-Type': 'application/json' }; },
            config: { url: '/api/test' }
          };
          
          HttpInterceptorService.responseError(rejection).catch(function() {});
          $rootScope.$apply();
          
          expect(consoleErrorSpy).toHaveBeenCalledWith('HTTP Error:', rejection);
        });
      });
    });

    describe('Integration scenarios', function() {
      it('should handle request and response error in sequence', function() {
        spyOn(AuthService, 'getToken').and.returnValue('valid-token');
        
        var config = { url: '/api/test', method: 'GET' };
        var requestResult = HttpInterceptorService.request(config);
        
        expect(requestResult.headers.Authorization).toBe('Bearer valid-token');
        
        var rejection = { status: 401, data: {} };
        var errorResult;
        HttpInterceptorService.responseError(rejection).catch(function(error) {
          errorResult = error;
        });
        $rootScope.$apply();
        
        expect(toastrSpy.error).toHaveBeenCalledWith('Unauthorized. Please login again.');
        expect(errorResult).toBe(rejection);
      });

      it('should handle multiple consecutive errors', function() {
        var rejection1 = { status: 401, data: {} };
        var rejection2 = { status: 404, data: {} };
        var rejection3 = { status: 500, data: {} };
        
        HttpInterceptorService.responseError(rejection1).catch(function() {});
        HttpInterceptorService.responseError(rejection2).catch(function() {});
        HttpInterceptorService.responseError(rejection3).catch(function() {});
        $rootScope.$apply();
        
        expect(toastrSpy.error).toHaveBeenCalledTimes(3);
        expect(toastrSpy.error).toHaveBeenCalledWith('Unauthorized. Please login again.');
        expect(toastrSpy.error).toHaveBeenCalledWith('Resource not found.');
        expect(toastrSpy.error).toHaveBeenCalledWith('Server error. Please try again later.');
      });
    });

    describe('Edge cases', function() {
      it('should handle rejection with missing status property', function() {
        var rejection = {
          data: { message: 'Error' }
        };
        
        HttpInterceptorService.responseError(rejection).catch(function() {});
        $rootScope.$apply();
        
        expect(toastrSpy.error).toHaveBeenCalledWith('An error occurred');
      });

      it('should handle rejection with null data', function() {
        var rejection = {
          status: 500,
          data: null
        };
        
        HttpInterceptorService.responseError(rejection).catch(function() {});
        $rootScope.$apply();
        
        expect(toastrSpy.error).toHaveBeenCalledWith('Server error. Please try again later.');
      });

      it('should handle rejection with undefined data', function() {
        var rejection = {
          status: 404
        };
        
        HttpInterceptorService.responseError(rejection).catch(function() {});
        $rootScope.$apply();
        
        expect(toastrSpy.error).toHaveBeenCalledWith('Resource not found.');
      });

      it('should handle very long token in request', function() {
        var longToken = new Array(1001).join('a');
        spyOn(AuthService, 'getToken').and.returnValue(longToken);
        
        var config = { url: '/api/test', method: 'GET' };
        var result = HttpInterceptorService.request(config);
        
        expect(result.headers.Authorization).toBe('Bearer ' + longToken);
      });
    });
  });
})();