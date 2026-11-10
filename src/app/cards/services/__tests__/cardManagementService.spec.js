/*
Test Documentation:
- Test Name: cardManagementService - Get All Cards
- Purpose: Verify service retrieves all cards with metadata
- Scenario: User has multiple cards
- Expected Result: Returns cards with enriched metadata and last 4 digits
*/
/*
Test Documentation:
- Test Name: cardManagementService - Get Card Details
- Purpose: Verify service retrieves single card details with metadata
- Scenario: Request specific card by ID
- Expected Result: Returns card with metadata
*/
/*
Test Documentation:
- Test Name: cardManagementService - Register Card
- Purpose: Verify card registration with user association
- Scenario: User submits new card data
- Expected Result: Card is created with userId
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, registerCard
- Scenarios covered: success paths, metadata enrichment
- Uncovered scenarios: error handling
*/

describe('cardManagementService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp.cards'));
  
  var cardManagementService, $rootScope, $q, mockCardDataService, mockCardIssuerService, mockAuthService;
  
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    mockCardDataService = {
      getCardsByUserId: jasmine.createSpy('getCardsByUserId'),
      getCardById: jasmine.createSpy('getCardById'),
      createCard: jasmine.createSpy('createCard')
    };
    
    mockCardIssuerService = {
      getCardMetadata: jasmine.createSpy('getCardMetadata')
    };
    
    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser')
    };
  }));
  
  beforeEach(inject(function($injector) {
    cardManagementService = $injector.instantiate(function(cardDataService, cardIssuerService, authService) {
      return $injector.get('cardManagementService');
    }, {
      cardDataService: mockCardDataService,
      cardIssuerService: mockCardIssuerService,
      authService: mockAuthService
    });
  }));
  
  it('should get all cards with metadata and last 4 digits', function() {
    var mockUser = {userId: 'user123'};
    var mockCards = [
      {cardId: 'c1', cardNumber: '4111111111111234', cardType: 'Visa'},
      {cardId: 'c2', cardNumber: '5500000000005678', cardType: 'MasterCard'}
    ];
    var mockMetadata = {benefits: 'Cashback 2%', rewardsProgram: 'Chase Rewards'};
    
    mockAuthService.getCurrentUser.and.returnValue($q.resolve(mockUser));
    mockCardDataService.getCardsByUserId.and.returnValue($q.resolve(mockCards));
    mockCardIssuerService.getCardMetadata.and.returnValue($q.resolve(mockMetadata));
    
    var result;
    cardManagementService.getAllCards().then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.length).toBe(2);
    expect(result[0].lastFourDigits).toBe('1234');
    expect(result[1].lastFourDigits).toBe('5678');
    expect(result[0].benefits).toBe('Cashback 2%');
  });
  
  it('should get card details with metadata', function() {
    var mockCard = {cardId: 'c1', cardNumber: '4111111111111234', cardType: 'Visa'};
    var mockMetadata = {benefits: 'Cashback 2%', rewardsProgram: 'Chase Rewards'};
    
    mockCardDataService.getCardById.and.returnValue($q.resolve(mockCard));
    mockCardIssuerService.getCardMetadata.and.returnValue($q.resolve(mockMetadata));
    
    var result;
    cardManagementService.getCardDetails('c1').then(function(data) {
      result = data;
    });
    $rootScope.$digest();
    
    expect(result.cardId).toBe('c1');
    expect(result.benefits).toBe('Cashback 2%');
  });
  
  it('should register card with user ID', function() {
    var mockUser = {userId: 'user123'};
    var cardData = {cardNumber: '4111111111111234', cardType: 'Visa'};
    
    mockAuthService.getCurrentUser.and.returnValue($q.resolve(mockUser));
    mockCardDataService.createCard.and.returnValue($q.resolve(cardData));
    
    cardManagementService.registerCard(cardData);
    $rootScope.$digest();
    
    expect(cardData.userId).toBe('user123');
    expect(mockCardDataService.createCard).toHaveBeenCalledWith(cardData);
  });
});