/*
Test Documentation:
- Test Name: cardDataService - Get Cards By User ID
- Purpose: Verify service retrieves cards for specific user
- Scenario: Request cards for userId
- Expected Result: Returns only cards belonging to user
*/
/*
Test Documentation:
- Test Name: cardDataService - Get Card By ID
- Purpose: Verify service retrieves single card by ID
- Scenario: Request specific card
- Expected Result: Returns card if found, rejects if not found
*/
/*
Test Documentation:
- Test Name: cardDataService - Create Card
- Purpose: Verify service creates new card
- Scenario: Submit new card data
- Expected Result: Card is created with generated ID and registered date
*/
/*
Coverage Report:
- Functions tested: getCardsByUserId, getCardById, createCard
- Scenarios covered: success paths, not found scenario
- Uncovered scenarios: API error handling
*/

describe('cardDataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var cardDataService, $rootScope;
  
  beforeEach(inject(function(_cardDataService_, _$rootScope_) {
    cardDataService = _cardDataService_;
    $rootScope = _$rootScope_;
  }));
  
  it('should return cards for specific user', function() {
    var result;
    cardDataService.getCardsByUserId('user123').then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    result.forEach(function(card) {
      expect(card.userId).toBe('user123');
    });
  });
  
  it('should return specific card by ID', function() {
    var result;
    cardDataService.getCardById('c1').then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result).toBeDefined();
    expect(result.cardId).toBe('c1');
  });
  
  it('should reject when card not found', function() {
    var error;
    cardDataService.getCardById('invalid').catch(function(err) {
      error = err;
    });
    $rootScope.$digest();
    
    expect(error).toBe('Card not found');
  });
  
  it('should create new card with generated ID', function() {
    var newCard = {
      userId: 'user123',
      cardNumber: '4111111111111234',
      cardType: 'Visa',
      creditLimit: 10000
    };
    
    var result;
    cardDataService.createCard(newCard).then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.cardId).toBeDefined();
    expect(result.registeredDate).toBeDefined();
    expect(result.userId).toBe('user123');
  });
});