/*
Test Documentation:
- Test Name: cardIssuerService - Get Card Metadata
- Purpose: Verify service retrieves card metadata from issuer
- Scenario: Request metadata for card ID
- Expected Result: Returns metadata with benefits and rewards program
*/
/*
Test Documentation:
- Test Name: cardIssuerService - Get Metadata for Unknown Card
- Purpose: Verify service handles unknown card IDs
- Scenario: Request metadata for non-existent card
- Expected Result: Returns empty object
*/
/*
Coverage Report:
- Functions tested: getCardMetadata
- Scenarios covered: success path, unknown card
- Uncovered scenarios: API error handling
*/

describe('cardIssuerService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var cardIssuerService, $rootScope;
  
  beforeEach(inject(function(_cardIssuerService_, _$rootScope_) {
    cardIssuerService = _cardIssuerService_;
    $rootScope = _$rootScope_;
  }));
  
  it('should return metadata for known card', function() {
    var result;
    cardIssuerService.getCardMetadata('c1').then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toBeDefined();
    expect(result.benefits).toBe('Cashback 2%');
    expect(result.rewardsProgram).toBe('Chase Rewards');
  });
  
  it('should return empty object for unknown card', function() {
    var result;
    cardIssuerService.getCardMetadata('unknown').then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toEqual({});
  });
  
  it('should return different metadata for different cards', function() {
    var result1, result2;
    cardIssuerService.getCardMetadata('c1').then(function(data) {
      result1 = data;
    });
    cardIssuerService.getCardMetadata('c2').then(function(data) {
      result2 = data;
    });
    $rootScope.$digest();
    
    expect(result1.rewardsProgram).toBe('Chase Rewards');
    expect(result2.rewardsProgram).toBe('Citi ThankYou');
  });
});