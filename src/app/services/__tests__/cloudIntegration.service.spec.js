/*
Test Documentation:
- Test Name: cloudIntegrationService - fetchAWSData
- Purpose: Validate AWS data fetch with correct endpoint, headers, and params
- Scenario: Successful response, HTTP error
- Expected Result: Returns response.data on success; throws on error

- Test Name: cloudIntegrationService - fetchAzureData
- Purpose: Validate Azure data fetch with correct endpoint
- Scenario: Successful response, HTTP error
- Expected Result: Returns response.data on success; throws on error

- Test Name: cloudIntegrationService - fetchGCPData
- Purpose: Validate GCP data fetch with correct endpoint
- Scenario: Successful response, HTTP error
- Expected Result: Returns response.data on success; throws on error
*/

describe('cloudIntegrationService', function() {
  'use strict';

  var cloudIntegrationService;
  var $httpBackend;
  var $rootScope;
  var mockAuthService;

  beforeEach(module('dashboardModule'));

  beforeEach(function() {
    mockAuthService = { getToken: jasmine.createSpy('getToken').and.returnValue('test-token') };
    module(function($provide) {
      $provide.value('authService', mockAuthService);
    });
  });

  beforeEach(inject(function(_cloudIntegrationService_, _$httpBackend_, _$rootScope_) {
    cloudIntegrationService = _cloudIntegrationService_;
    $httpBackend            = _$httpBackend_;
    $rootScope              = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // ─── fetchAWSData ────────────────────────────────────────────────────────────

  describe('fetchAWSData', function() {

    it('should call the correct AWS endpoint and return data', function() {
      var mockData = { companies: [{ companyId: 'c1', spend: 500 }] };
      $httpBackend.expectGET('/api/cloud/aws/ai-usage?companyId=c1').respond(200, mockData);

      var result;
      cloudIntegrationService.fetchAWSData('c1').then(function(data) { result = data; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual(mockData);
    });

    it('should include Authorization header with Bearer token', function() {
      $httpBackend.expectGET('/api/cloud/aws/ai-usage?companyId=c1', function(headers) {
        return headers['Authorization'] === 'Bearer test-token';
      }).respond(200, {});

      cloudIntegrationService.fetchAWSData('c1');
      $httpBackend.flush();
    });

    it('should propagate error on AWS HTTP failure', function() {
      $httpBackend.expectGET('/api/cloud/aws/ai-usage?companyId=c1').respond(500, { error: 'Server Error' });

      var rejected;
      cloudIntegrationService.fetchAWSData('c1').catch(function(err) { rejected = err; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBeDefined();
    });

    it('should call getToken to build authorization header', function() {
      $httpBackend.whenGET(/\/api\/cloud\/aws\/ai-usage/).respond(200, {});
      cloudIntegrationService.fetchAWSData('c1');
      $httpBackend.flush();
      expect(mockAuthService.getToken).toHaveBeenCalled();
    });
  });

  // ─── fetchAzureData ──────────────────────────────────────────────────────────

  describe('fetchAzureData', function() {

    it('should call the correct Azure endpoint and return data', function() {
      var mockData = { companies: [{ companyId: 'c2', spend: 800 }] };
      $httpBackend.expectGET('/api/cloud/azure/ai-usage?companyId=c2').respond(200, mockData);

      var result;
      cloudIntegrationService.fetchAzureData('c2').then(function(data) { result = data; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual(mockData);
    });

    it('should propagate error on Azure HTTP failure', function() {
      $httpBackend.expectGET('/api/cloud/azure/ai-usage?companyId=c2').respond(403, {});

      var rejected;
      cloudIntegrationService.fetchAzureData('c2').catch(function(err) { rejected = err; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBeDefined();
    });
  });

  // ─── fetchGCPData ────────────────────────────────────────────────────────────

  describe('fetchGCPData', function() {

    it('should call the correct GCP endpoint and return data', function() {
      var mockData = { companies: [{ companyId: 'c3', spend: 1200 }] };
      $httpBackend.expectGET('/api/cloud/gcp/ai-usage?companyId=c3').respond(200, mockData);

      var result;
      cloudIntegrationService.fetchGCPData('c3').then(function(data) { result = data; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(result).toEqual(mockData);
    });

    it('should propagate error on GCP HTTP failure', function() {
      $httpBackend.expectGET('/api/cloud/gcp/ai-usage?companyId=c3').respond(404, {});

      var rejected;
      cloudIntegrationService.fetchGCPData('c3').catch(function(err) { rejected = err; });
      $httpBackend.flush();
      $rootScope.$digest();

      expect(rejected).toBeDefined();
    });
  });
});

/*
Coverage Report:
- Functions tested: fetchAWSData, fetchAzureData, fetchGCPData
- Scenarios covered: successful responses, HTTP errors, authorization headers, endpoint validation
- Uncovered scenarios: none
*/