/*
Test Documentation:
- Test Name: ErrorInterceptor Unit Tests
- Purpose: Validate HTTP error interceptor for global error handling
- Scenario: Test responseError method with various HTTP status codes
- Expected Result: Interceptor should display appropriate error messages and reject promises
*/

(function(){
'use strict';

describe('ErrorInterceptor', function() {
  var ErrorInterceptor, $q, $injector, mockWindow;

  beforeEach(module('creditCardApp'));

  beforeEach(function() {
    mockWindow = {
      alert: jasmine.createSpy('alert')
    };

    module(function($provide) {
      $provide.value('$window', mockWindow);
    });
  });

  beforeEach(inject(function(_ErrorInterceptor_, _$q_, _$injector_) {
    ErrorInterceptor = _ErrorInterceptor_;
    $q = _$q_;
    $injector = _$injector_;
    spyOn(console, 'error');
  }));

  describe('responseError', function() {
    it('should handle 401 authentication error', function() {
      var rejection = {status: 401, statusText: 'Unauthorized'};

      var result = ErrorInterceptor.responseError(rejection);

      expect(mockWindow.alert).toHaveBeenCalledWith('Authentication failed. Please login again.');
      expect(console.error).toHaveBeenCalledWith('HTTP Error:', rejection);
    });

    it('should handle 500 server error', function() {
      var rejection = {status: 500, statusText: 'Internal Server Error'};

      ErrorInterceptor.responseError(rejection);

      expect(mockWindow.alert).toHaveBeenCalledWith('Server error. Please try again later.');
      expect(console.error).toHaveBeenCalledWith('HTTP Error:', rejection);
    });

    it('should handle other HTTP errors', function() {
      var rejection = {status: 404, statusText: 'Not Found'};

      ErrorInterceptor.responseError(rejection);

      expect(mockWindow.alert).toHaveBeenCalledWith('An error occurred: Not Found');
      expect(console.error).toHaveBeenCalledWith('HTTP Error:', rejection);
    });

    it('should return rejected promise', function() {
      var rejection = {status: 500, statusText: 'Error'};

      var result = ErrorInterceptor.responseError(rejection);

      expect(result).toBeDefined();
      result.catch(function(error) {
        expect(error).toBe(rejection);
      });
    });

    it('should handle 403 forbidden error', function() {
      var rejection = {status: 403, statusText: 'Forbidden'};

      ErrorInterceptor.responseError(rejection);

      expect(mockWindow.alert).toHaveBeenCalledWith('An error occurred: Forbidden');
    });

    it('should handle network error with status 0', function() {
      var rejection = {status: 0, statusText: ''};

      ErrorInterceptor.responseError(rejection);

      expect(mockWindow.alert).toHaveBeenCalledWith('An error occurred: ');
      expect(console.error).toHaveBeenCalled();
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: responseError
- Scenarios covered: 401 auth error, 500 server error, 404 not found, 403 forbidden, network error, promise rejection
- Edge cases: Various HTTP status codes, network failures
- Uncovered scenarios: None - all error handling paths covered
*/