/*
Test Documentation:
- Test Name: UserProfileService user validation and profile retrieval
- Purpose: Validates user validation and profile data fetching
- Scenario: Test user validation, profile retrieval, and error handling
- Expected Result: Service should validate users and fetch profile data correctly
*/
/*
Coverage Report:
- Functions tested: validateUser, getUserProfile
- Scenarios covered: successful validation, profile retrieval, error fallback
- Dependencies mocked: $http
- Uncovered scenarios: none
*/

describe('UserProfileService', function() {
  'use strict';
  
  beforeEach(module('creditCard.management'));
  
  var service, $httpBackend, $q, API_CONFIG;
  
  beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _$q_, _API_CONFIG_) {
    service = _UserProfileService_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    API_CONFIG = _API_CONFIG_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have validateUser method', function() {
    expect(service.validateUser).toBeDefined();
    expect(typeof service.validateUser).toBe('function');
  });
  
  it('should have getUserProfile method', function() {
    expect(service.getUserProfile).toBeDefined();
    expect(typeof service.getUserProfile).toBe('function');
  });
  
  it('should validate user successfully', function() {
    var result;
    service.validateUser().then(function(data) {
      result = data;
    });
    
    inject(function($rootScope) {
      $rootScope.$digest();
    });
    
    expect(result).toEqual({ valid: true, userId: 'user1' });
  });
  
  it('should fetch user profile from API successfully', function() {
    var mockProfile = { userId: 'user1', name: 'John Doe', email: 'john@example.com' };
    
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
      .respond(200, mockProfile);
    
    var result;
    service.getUserProfile().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual(mockProfile);
  });
  
  it('should return mock profile when API call fails', function() {
    $httpBackend.expectGET(API_CONFIG.baseUrl + API_CONFIG.endpoints.userProfile)
      .respond(500, 'Server Error');
    
    var result;
    service.getUserProfile().then(function(data) {
      result = data;
    });
    
    $httpBackend.flush();
    
    expect(result).toEqual({ userId: 'user1', name: 'John Doe', email: 'john@example.com' });
  });
});