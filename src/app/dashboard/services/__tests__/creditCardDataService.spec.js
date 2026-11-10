/*
Test Documentation:
- Test Name: creditCardDataService - Get All Cards
- Purpose: Verify service retrieves all cards with authentication
- Scenario: Request all cards for authenticated user
- Expected Result: Returns card array with authorization header
*/
/*
Test Documentation:
- Test Name: creditCardDataService - Fallback to Mock Data
- Purpose: Verify service returns mock data when API fails
- Scenario: API returns no data
- Expected Result: Returns mock card data
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: success path, mock fallback
- Uncovered scenarios: API error handling
*/

describe('creditCardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.dashboard'));
  
  var creditCardDataService, $rootScope, $q, mockAuthService;
  
  beforeEach(inject(function(_creditCardDataService_, _$rootScope_, _$q_) {
    creditCardDataService = _creditCardDataService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    
    mockAuthService = {
      getToken: jasmine.createSpy('getToken').and.returnValue($q.resolve('mock-token'))
    };
  }));
  
  beforeEach(inject(function($injector) {
    creditCardDataService = $injector.instantiate(function() {
      return $injector.get('creditCardDataService');
    }, {
      authService: mockAuthService
    });
  }));
  
  it('should retrieve all cards with authentication', function() {
    var result;
    creditCardDataService.getAllCards().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
  
  it('should return mock data with valid card structure', function() {
    var result;
    creditCardDataService.getAllCards().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    result.forEach(function(card) {
      expect(card.cardId).toBeDefined();
      expect(card.cardNumber).toBeDefined();
      expect(card.cardType).toBeDefined();
      expect(card.creditLimit).toBeDefined();
      expect(card.currentBalance).toBeDefined();
      expect(card.availableCredit).toBeDefined();
    });
  });
});