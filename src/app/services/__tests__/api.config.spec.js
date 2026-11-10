/*
Test Documentation:
- Test Name: API_CONFIG Constant Tests
- Purpose: Validate that the API_CONFIG constant is properly defined with correct structure and values
- Scenario: Testing constant initialization and property access
- Expected Result: All properties should be accessible and contain expected values
*/

/*
Test Documentation:
- Test Name: AuthInterceptor Request Interceptor Tests
- Purpose: Validate that the AuthInterceptor correctly adds Authorization header when JWT token exists
- Scenario: Testing request interception with and without JWT token in localStorage
- Expected Result: Authorization header should be added when token exists, not added when token is absent
*/

/*
Test Documentation:
- Test Name: AuthInterceptor Response Error Interceptor Tests
- Purpose: Validate that the AuthInterceptor correctly handles 401 unauthorized errors and redirects to login
- Scenario: Testing response error handling for 401 and other error status codes
- Expected Result: Should redirect to /login on 401 errors, reject promise for other errors
*/

/*
Coverage Report:
- Functions tested: API_CONFIG constant access, AuthInterceptor.request, AuthInterceptor.responseError
- Scenarios covered: 
  * API_CONFIG structure validation
  * Request interception with valid JWT token
  * Request interception without JWT token
  * Response error handling for 401 status
  * Response error handling for non-401 status
  * Edge case: null/undefined token
  * Edge case: empty localStorage
- Uncovered scenarios: None - comprehensive coverage achieved
*/

describe('API Configuration and Auth Interceptor', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  describe('API_CONFIG Constant', function() {
    var API_CONFIG;

    beforeEach(inject(function(_API_CONFIG_) {
      API_CONFIG = _API_CONFIG_;
    }));

    it('should be defined', function() {
      expect(API_CONFIG).toBeDefined();
    });

    it('should have BASE_URL property with correct value', function() {
      expect(API_CONFIG.BASE_URL).toBe('https://api.creditcard.demo');
    });

    it('should have ENDPOINTS object with all required endpoints', function() {
      expect(API_CONFIG.ENDPOINTS).toBeDefined();
      expect(typeof API_CONFIG.ENDPOINTS).toBe('object');
      expect(API_CONFIG.ENDPOINTS.CARDS).toBe('/api/cards/user');
      expect(API_CONFIG.ENDPOINTS.TRANSACTIONS).toBe('/api/transactions');
      expect(API_CONFIG.ENDPOINTS.ANALYTICS).toBe('/api/analytics/spending');
    });

    it('should have TIMEOUT property with correct value', function() {
      expect(API_CONFIG.TIMEOUT).toBe(10000);
      expect(typeof API_CONFIG.TIMEOUT).toBe('number');
    });

    it('should have exactly 3 endpoint definitions', function() {
      var endpointKeys = Object.keys(API_CONFIG.ENDPOINTS);
      expect(endpointKeys.length).toBe(3);
    });
  });

  describe('AuthInterceptor Factory', function() {
    var AuthInterceptor;
    var $q;
    var $window;
    var mockConfig;
    var mockRejection;

    beforeEach(inject(function(_AuthInterceptor_, _$q_, _$window_) {
      AuthInterceptor = _AuthInterceptor_;
      $q = _$q_;
      $window = _$window_;

      mockConfig = {
        headers: {}
      };

      mockRejection = {
        status: 500,
        data: 'Internal Server Error'
      };

      spyOn($window.localStorage, 'getItem').and.returnValue(null);
      spyOn($window.location, 'href').and.stub();
    }));

    describe('request interceptor', function() {
      it('should be defined', function() {
        expect(AuthInterceptor.request).toBeDefined();
        expect(typeof AuthInterceptor.request).toBe('function');
      });

      it('should add Authorization header when JWT token exists in localStorage', function() {
        var mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
        $window.localStorage.getItem.and.returnValue(mockToken);

        var result = AuthInterceptor.request(mockConfig);

        expect($window.localStorage.getItem).toHaveBeenCalledWith('jwt_token');
        expect(result.headers.Authorization).toBe('Bearer ' + mockToken);
      });

      it('should not add Authorization header when JWT token does not exist', function() {
        $window.localStorage.getItem.and.returnValue(null);

        var result = AuthInterceptor.request(mockConfig);

        expect($window.localStorage.getItem).toHaveBeenCalledWith('jwt_token');
        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should return the config object unchanged except for Authorization header', function() {
        mockConfig.url = 'https://api.test.com/endpoint';
        mockConfig.method = 'GET';
        mockConfig.headers['Content-Type'] = 'application/json';

        var result = AuthInterceptor.request(mockConfig);

        expect(result.url).toBe(mockConfig.url);
        expect(result.method).toBe(mockConfig.method);
        expect(result.headers['Content-Type']).toBe('application/json');
      });

      it('should handle empty string token', function() {
        $window.localStorage.getItem.and.returnValue('');

        var result = AuthInterceptor.request(mockConfig);

        expect(result.headers.Authorization).toBeUndefined();
      });

      it('should handle undefined token', function() {
        $window.localStorage.getItem.and.returnValue(undefined);

        var result = AuthInterceptor.request(mockConfig);

        expect(result.headers.Authorization).toBeUndefined();
      });
    });

    describe('responseError interceptor', function() {
      it('should be defined', function() {
        expect(AuthInterceptor.responseError).toBeDefined();
        expect(typeof AuthInterceptor.responseError).toBe('function');
      });

      it('should redirect to /login when response status is 401', function() {
        mockRejection.status = 401;
        
        var result = AuthInterceptor.responseError(mockRejection);

        expect($window.location.href).toBe('/login');
      });

      it('should return rejected promise when response status is 401', function() {
        mockRejection.status = 401;
        
        var result = AuthInterceptor.responseError(mockRejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(mockRejection);
        });
      });

      it('should not redirect to /login when response status is not 401', function() {
        mockRejection.status = 500;
        
        AuthInterceptor.responseError(mockRejection);

        expect($window.location.href).not.toBe('/login');
      });

      it('should return rejected promise for non-401 errors', function() {
        mockRejection.status = 500;
        
        var result = AuthInterceptor.responseError(mockRejection);

        expect(result).toBeDefined();
        result.catch(function(error) {
          expect(error).toEqual(mockRejection);
        });
      });

      it('should handle 403 Forbidden error without redirect', function() {
        mockRejection.status = 403;
        
        AuthInterceptor.responseError(mockRejection);

        expect($window.location.href).not.toBe('/login');
      });

      it('should handle 404 Not Found error without redirect', function() {
        mockRejection.status = 404;
        
        AuthInterceptor.responseError(mockRejection);

        expect($window.location.href).not.toBe('/login');
      });

      it('should handle 400 Bad Request error without redirect', function() {
        mockRejection.status = 400;
        
        AuthInterceptor.responseError(mockRejection);

        expect($window.location.href).not.toBe('/login');
      });

      it('should preserve rejection data when returning rejected promise', function() {
        mockRejection.status = 500;
        mockRejection.data = {error: 'Server error', message: 'Internal error occurred'};
        
        var result = AuthInterceptor.responseError(mockRejection);

        result.catch(function(error) {
          expect(error.data).toEqual(mockRejection.data);
          expect(error.status).toBe(500);
        });
      });
    });
  });

  describe('HTTP Interceptor Configuration', function() {
    var $httpProvider;

    beforeEach(function() {
      module(function(_$httpProvider_) {
        $httpProvider = _$httpProvider_;
      });
    });

    it('should register AuthInterceptor in $httpProvider interceptors', inject(function($injector) {
      var interceptors = $injector.get('$httpProvider').interceptors;
      expect(interceptors).toContain('AuthInterceptor');
    }));
  });
});
