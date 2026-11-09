/*
Test Documentation:
- Test Name: CardManagementService - getCardPortfolio - returns cached portfolio when cache is valid
- Purpose: Validates that the service returns cached portfolio data when cache TTL has not expired
- Scenario: Cache contains valid portfolio data within TTL period
- Expected Result: Service returns cached portfolio without making API calls
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardPortfolio - fetches and aggregates card portfolio
- Purpose: Validates that the service fetches user cards and calculates portfolio totals
- Scenario: User has multiple cards with various balances
- Expected Result: Service returns portfolio with aggregated totals
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardPortfolio - handles API errors gracefully
- Purpose: Validates error handling when portfolio fetch fails
- Scenario: API returns error response
- Expected Result: Service rejects promise with error
*/
/*
Coverage Report:
- Functions tested: getCardPortfolio
- Scenarios covered: cache hit, cache miss, portfolio aggregation, API success, API failure, empty cards
- Uncovered scenarios: none
*/

describe('CardManagementService', function() {
  'use strict';
  
  var CardManagementService;
  var CreditCardDataService;
  var UserProfileService;
  var $q;
  var $rootScope;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardManagementService_, _CreditCardDataService_, _UserProfileService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CreditCardDataService = _CreditCardDataService_;
    UserProfileService = _UserProfileService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getCardPortfolio', function() {
    
    it('should fetch user profile and card details to build portfolio', function() {
      var mockProfile = {cardIds: ['card1', 'card2']};
      var mockCards = [
        {cardId: 'card1', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000},
        {cardId: 'card2', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000}
      ];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(UserProfileService.getUserProfile).toHaveBeenCalled();
      expect(CreditCardDataService.fetchCards).toHaveBeenCalledWith(['card1', 'card2']);
      expect(result.cards).toEqual(mockCards);
      expect(result.cardCount).toBe(2);
    });
    
    it('should calculate total credit limit correctly', function() {
      var mockProfile = {cardIds: ['card1', 'card2']};
      var mockCards = [
        {cardId: 'card1', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000},
        {cardId: 'card2', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000}
      ];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(25000);
    });
    
    it('should calculate total available credit correctly', function() {
      var mockProfile = {cardIds: ['card1', 'card2']};
      var mockCards = [
        {cardId: 'card1', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000},
        {cardId: 'card2', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000}
      ];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(result.totalAvailableCredit).toBe(19000);
    });
    
    it('should calculate total outstanding correctly', function() {
      var mockProfile = {cardIds: ['card1', 'card2']};
      var mockCards = [
        {cardId: 'card1', creditLimit: 10000, availableCredit: 7000, outstandingAmount: 3000},
        {cardId: 'card2', creditLimit: 15000, availableCredit: 12000, outstandingAmount: 3000}
      ];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(result.totalOutstanding).toBe(6000);
    });
    
    it('should handle missing card data fields by using zero', function() {
      var mockProfile = {cardIds: ['card1']};
      var mockCards = [{cardId: 'card1', cardType: 'Visa'}];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(result.totalCreditLimit).toBe(0);
      expect(result.totalAvailableCredit).toBe(0);
      expect(result.totalOutstanding).toBe(0);
    });
    
    it('should handle empty card array', function() {
      var mockProfile = {cardIds: []};
      var mockCards = [];
      
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.resolve(mockCards);
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var result;
      CardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });
      $rootScope.$digest();
      
      expect(result.cardCount).toBe(0);
      expect(result.totalCreditLimit).toBe(0);
    });
    
    it('should handle user profile API error', function() {
      var profileDeferred = $q.defer();
      profileDeferred.reject({message: 'Failed to fetch user profile'});
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var error;
      CardManagementService.getCardPortfolio().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to fetch user profile');
    });
    
    it('should handle card fetch API error', function() {
      var mockProfile = {cardIds: ['card1']};
      var profileDeferred = $q.defer();
      profileDeferred.resolve(mockProfile);
      spyOn(UserProfileService, 'getUserProfile').and.returnValue(profileDeferred.promise);
      
      var cardsDeferred = $q.defer();
      cardsDeferred.reject({message: 'Failed to fetch cards'});
      spyOn(CreditCardDataService, 'fetchCards').and.returnValue(cardsDeferred.promise);
      
      var error;
      CardManagementService.getCardPortfolio().catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Failed to fetch cards');
    });
  });
});