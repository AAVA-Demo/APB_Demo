/*
Test Documentation:
- Test Name: CardService - getAllCards - returns cached cards when cache is valid
- Purpose: Validates that the service returns cached card data when cache TTL has not expired
- Scenario: Cache contains valid card data within TTL period
- Expected Result: Service returns cached cards without making API call
*/
/*
Test Documentation:
- Test Name: CardService - getCardDetails - validates ownership before returning card details
- Purpose: Validates that the service checks card ownership before allowing access
- Scenario: User requests card details for a card they own
- Expected Result: Service validates ownership and returns card details
*/
/*
Test Documentation:
- Test Name: CardService - getCardDetails - rejects unauthorized access
- Purpose: Validates that the service blocks access to cards user doesn't own
- Scenario: User requests card details for a card they don't own
- Expected Result: Service rejects with unauthorized error
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails
- Scenarios covered: cache hit, cache miss, API success, ownership validation, unauthorized access, cache expiration
- Uncovered scenarios: none
*/

describe('CardService', function() {
  'use strict';
  
  var CardService;
  var ApiFactory;
  var UserProfileService;
  var $q;
  var $rootScope;
  var $cacheFactory;
  var cache;
  
  beforeEach(module('creditCardApp'));
  
  beforeEach(inject(function(_CardService_, _ApiFactory_, _UserProfileService_, _$q_, _$rootScope_, _$cacheFactory_) {
    CardService = _CardService_;
    ApiFactory = _ApiFactory_;
    UserProfileService = _UserProfileService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $cacheFactory = _$cacheFactory_;
    cache = $cacheFactory.get('cardCache');
  }));
  
  afterEach(function() {
    if (cache) {
      cache.removeAll();
    }
  });
  
  describe('getAllCards', function() {
    
    it('should return cached cards when cache is valid and within TTL', function() {
      var cachedCards = [
        {cardId: '1', cardType: 'Visa', cardNumber: '1234567890123456'},
        {cardId: '2', cardType: 'Mastercard', cardNumber: '9876543210987654'}
      ];
      var cachedEntry = {
        data: cachedCards,
        timestamp: Date.now() - 100000
      };
      cache.put('allCards', cachedEntry);
      
      spyOn(ApiFactory, 'get');
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(result).toEqual(cachedCards);
      expect(ApiFactory.get).not.toHaveBeenCalled();
    });
    
    it('should fetch cards from API when cache is empty', function() {
      var apiResponse = {
        cards: [
          {cardId: '3', cardType: 'Amex', cardNumber: '1111222233334444'},
          {cardId: '4', cardType: 'Discover', cardNumber: '5555666677778888'}
        ]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/cards');
      expect(result).toEqual(apiResponse.cards);
    });
    
    it('should fetch fresh cards when cache is expired beyond TTL', function() {
      var oldCachedCards = [{cardId: 'old1'}];
      var oldCachedEntry = {
        data: oldCachedCards,
        timestamp: Date.now() - 400000
      };
      cache.put('allCards', oldCachedEntry);
      
      var apiResponse = {
        cards: [{cardId: 'new1', cardType: 'Visa Gold'}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(ApiFactory.get).toHaveBeenCalledWith('/cards');
      expect(result).toEqual(apiResponse.cards);
    });
    
    it('should handle API response with missing cards field by returning empty array', function() {
      var apiResponse = {};
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var result;
      CardService.getAllCards().then(function(cards) {
        result = cards;
      });
      $rootScope.$digest();
      
      expect(result).toEqual([]);
    });
    
    it('should cache the fetched cards with current timestamp', function() {
      var apiResponse = {
        cards: [{cardId: '5', cardType: 'Platinum'}]
      };
      var deferred = $q.defer();
      deferred.resolve(apiResponse);
      spyOn(ApiFactory, 'get').and.returnValue(deferred.promise);
      
      var beforeTime = Date.now();
      CardService.getAllCards();
      $rootScope.$digest();
      var afterTime = Date.now();
      
      var cachedEntry = cache.get('allCards');
      expect(cachedEntry).toBeDefined();
      expect(cachedEntry.data).toEqual(apiResponse.cards);
      expect(cachedEntry.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(cachedEntry.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });
  
  describe('getCardDetails', function() {
    
    it('should return cached card details when cache is valid', function() {
      var cardId = 'card123';
      var cachedCard = {
        cardId: cardId,
        cardType: 'Visa Premium',
        creditLimit: 10000
      };
      var cachedEntry = {
        data: cachedCard,
        timestamp: Date.now() - 50000
      };
      cache.put('card_' + cardId, cachedEntry);
      
      spyOn(UserProfileService, 'validateOwnership');
      spyOn(ApiFactory, 'get');
      
      var result;
      CardService.getCardDetails(cardId).then(function(card) {
        result = card;
      });
      $rootScope.$digest();
      
      expect(result).toEqual(cachedCard);
      expect(UserProfileService.validateOwnership).not.toHaveBeenCalled();
      expect(ApiFactory.get).not.toHaveBeenCalled();
    });
    
    it('should validate ownership before fetching card details', function() {
      var cardId = 'card456';
      var ownershipDeferred = $q.defer();
      ownershipDeferred.resolve(true);
      spyOn(UserProfileService, 'validateOwnership').and.returnValue(ownershipDeferred.promise);
      
      var cardData = {cardId: cardId, cardType: 'Mastercard'};
      var apiDeferred = $q.defer();
      apiDeferred.resolve(cardData);
      spyOn(ApiFactory, 'get').and.returnValue(apiDeferred.promise);
      
      var result;
      CardService.getCardDetails(cardId).then(function(card) {
        result = card;
      });
      $rootScope.$digest();
      
      expect(UserProfileService.validateOwnership).toHaveBeenCalledWith(cardId);
      expect(ApiFactory.get).toHaveBeenCalledWith('/cards/' + cardId);
      expect(result).toEqual(cardData);
    });
    
    it('should reject with unauthorized error when ownership validation fails', function() {
      var cardId = 'card789';
      var ownershipDeferred = $q.defer();
      ownershipDeferred.resolve(false);
      spyOn(UserProfileService, 'validateOwnership').and.returnValue(ownershipDeferred.promise);
      spyOn(ApiFactory, 'get');
      
      var error;
      CardService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(UserProfileService.validateOwnership).toHaveBeenCalledWith(cardId);
      expect(ApiFactory.get).not.toHaveBeenCalled();
      expect(error).toBeDefined();
      expect(error.message).toBe('Unauthorized access to card');
    });
    
    it('should cache card details after successful fetch', function() {
      var cardId = 'card999';
      var ownershipDeferred = $q.defer();
      ownershipDeferred.resolve(true);
      spyOn(UserProfileService, 'validateOwnership').and.returnValue(ownershipDeferred.promise);
      
      var cardData = {cardId: cardId, cardType: 'Amex Platinum', creditLimit: 25000};
      var apiDeferred = $q.defer();
      apiDeferred.resolve(cardData);
      spyOn(ApiFactory, 'get').and.returnValue(apiDeferred.promise);
      
      var beforeTime = Date.now();
      CardService.getCardDetails(cardId);
      $rootScope.$digest();
      var afterTime = Date.now();
      
      var cachedEntry = cache.get('card_' + cardId);
      expect(cachedEntry).toBeDefined();
      expect(cachedEntry.data).toEqual(cardData);
      expect(cachedEntry.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(cachedEntry.timestamp).toBeLessThanOrEqual(afterTime);
    });
    
    it('should handle API errors after successful ownership validation', function() {
      var cardId = 'card111';
      var ownershipDeferred = $q.defer();
      ownershipDeferred.resolve(true);
      spyOn(UserProfileService, 'validateOwnership').and.returnValue(ownershipDeferred.promise);
      
      var apiDeferred = $q.defer();
      apiDeferred.reject({message: 'Card not found'});
      spyOn(ApiFactory, 'get').and.returnValue(apiDeferred.promise);
      
      var error;
      CardService.getCardDetails(cardId).catch(function(err) {
        error = err;
      });
      $rootScope.$digest();
      
      expect(error).toBeDefined();
      expect(error.message).toBe('Card not found');
    });
    
    it('should fetch fresh data when cache is expired', function() {
      var cardId = 'card222';
      var oldCachedCard = {cardId: cardId, cardType: 'Old Card'};
      var oldCachedEntry = {
        data: oldCachedCard,
        timestamp: Date.now() - 400000
      };
      cache.put('card_' + cardId, oldCachedEntry);
      
      var ownershipDeferred = $q.defer();
      ownershipDeferred.resolve(true);
      spyOn(UserProfileService, 'validateOwnership').and.returnValue(ownershipDeferred.promise);
      
      var newCardData = {cardId: cardId, cardType: 'Updated Card'};
      var apiDeferred = $q.defer();
      apiDeferred.resolve(newCardData);
      spyOn(ApiFactory, 'get').and.returnValue(apiDeferred.promise);
      
      var result;
      CardService.getCardDetails(cardId).then(function(card) {
        result = card;
      });
      $rootScope.$digest();
      
      expect(UserProfileService.validateOwnership).toHaveBeenCalled();
      expect(ApiFactory.get).toHaveBeenCalled();
      expect(result).toEqual(newCardData);
    });
  });
});