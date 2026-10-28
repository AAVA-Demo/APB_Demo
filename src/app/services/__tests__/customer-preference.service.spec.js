/*
Test Documentation:
- Test Name: customerPreferenceService - getPreferences / updatePreferences
- Purpose: Validate that the service correctly fetches and updates customer notification preferences via HTTP, handles success and error responses, and constructs correct URLs.
- Scenario 1 (getPreferences - Success): GET request resolves; response.data is returned.
- Scenario 2 (getPreferences - Error): GET request fails; error is logged and promise is rejected.
- Scenario 3 (getPreferences - URL): Correct URL with customerId is constructed.
- Scenario 4 (updatePreferences - Success): PUT request resolves; response.data is returned.
- Scenario 5 (updatePreferences - Error): PUT request fails; error is logged and promise is rejected.
- Scenario 6 (updatePreferences - Payload): Preferences object is sent as PUT body.
- Expected Result: Resolves with response.data on success; rejects with error on failure.
*/

describe('customerPreferenceService', function () {
  var customerPreferenceService, $httpBackend, $rootScope, API_CONFIG;

  beforeEach(module('fraudAlertApp'));

  beforeEach(function () {
    API_CONFIG = {
      baseUrl: 'https://api.fraudalert.test',
      endpoints: {
        preferences: '/preferences'
      },
      timeout: 5000
    };

    module(function ($provide) {
      $provide.constant('API_CONFIG', API_CONFIG);
    });
  });

  beforeEach(inject(function (_customerPreferenceService_, _$httpBackend_, _$rootScope_) {
    customerPreferenceService = _customerPreferenceService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getPreferences()', function () {

    it('should GET preferences for a given customerId and return response.data', function () {
      var customerId = 'C001';
      var mockPrefs = { pushEnabled: true, smsEnabled: false, emailEnabled: true };

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId
      ).respond(200, mockPrefs);

      var result;
      customerPreferenceService.getPreferences(customerId).then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockPrefs);
    });

    it('should construct the correct URL using customerId', function () {
      var customerId = 'C999';
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId;

      $httpBackend.expectGET(expectedUrl).respond(200, {});
      customerPreferenceService.getPreferences(customerId);
      $httpBackend.flush();
    });

    it('should reject the promise and log an error when GET fails', function () {
      spyOn(console, 'error');
      var customerId = 'C002';
      var errorResult;

      $httpBackend.expectGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId
      ).respond(404, { message: 'Not Found' });

      customerPreferenceService.getPreferences(customerId).catch(function (err) {
        errorResult = err;
      });

      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Failed to fetch preferences:'),
        jasmine.anything()
      );
      expect(errorResult).toBeDefined();
    });

    it('should return a promise', function () {
      $httpBackend.whenGET(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/C003'
      ).respond(200, {});

      var result = customerPreferenceService.getPreferences('C003');
      expect(typeof result.then).toBe('function');
      $httpBackend.flush();
    });

  });

  describe('updatePreferences()', function () {

    it('should PUT updated preferences for a given customerId and return response.data', function () {
      var customerId = 'C010';
      var preferences = { pushEnabled: true, smsEnabled: true, emailEnabled: false };
      var mockResponse = { updated: true };

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId,
        preferences
      ).respond(200, mockResponse);

      var result;
      customerPreferenceService.updatePreferences(customerId, preferences).then(function (data) {
        result = data;
      });

      $httpBackend.flush();
      expect(result).toEqual(mockResponse);
    });

    it('should construct the correct PUT URL using customerId', function () {
      var customerId = 'C011';
      var expectedUrl = API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId;

      $httpBackend.expectPUT(expectedUrl).respond(200, {});
      customerPreferenceService.updatePreferences(customerId, {});
      $httpBackend.flush();
    });

    it('should send the preferences object as the PUT request body', function () {
      var customerId = 'C012';
      var preferences = { preferredChannel: 'sms', inAppEnabled: true };

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId,
        preferences
      ).respond(200, {});

      customerPreferenceService.updatePreferences(customerId, preferences);
      $httpBackend.flush();
    });

    it('should reject the promise and log an error when PUT fails', function () {
      spyOn(console, 'error');
      var customerId = 'C013';
      var errorResult;

      $httpBackend.expectPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/' + customerId
      ).respond(500, { message: 'Server Error' });

      customerPreferenceService.updatePreferences(customerId, {}).catch(function (err) {
        errorResult = err;
      });

      $httpBackend.flush();

      expect(console.error).toHaveBeenCalledWith(
        jasmine.stringMatching('Failed to update preferences:'),
        jasmine.anything()
      );
      expect(errorResult).toBeDefined();
    });

    it('should return a promise', function () {
      $httpBackend.whenPUT(
        API_CONFIG.baseUrl + API_CONFIG.endpoints.preferences + '/C014'
      ).respond(200, {});

      var result = customerPreferenceService.updatePreferences('C014', {});
      expect(typeof result.then).toBe('function');
      $httpBackend.flush();
    });

  });
});

/*
Coverage Report:
- Functions Tested: getPreferences, updatePreferences
- Scenarios Covered:
    1. Successful GET with correct URL and response.data return
    2. URL construction validation for GET
    3. HTTP 404 error handling for GET with console.error and rejection
    4. Return type is a promise (GET)
    5. Successful PUT with correct URL and response.data return
    6. URL construction validation for PUT
    7. Preferences object sent as PUT body
    8. HTTP 500 error handling for PUT with console.error and rejection
    9. Return type is a promise (PUT)
- Uncovered Scenarios: Partial preference updates, concurrent requests
*/