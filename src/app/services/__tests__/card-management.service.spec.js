/*
Test Documentation:
- Test Name: CardManagementService Unit Tests
- Purpose: Validate user card retrieval and enrichment with analytics data
- Scenario: Test getUserCards and getCardDetail methods with mocked dependencies
- Expected Result: Enriched card data with analytics for all user cards
*/

describe('CardManagementService', function() {
  'use strict';
  
  var CardManagementService, UserProfileFactory, CardDataFactory, CardAnalyticsService, $q, $rootScope;
  
  beforeEach(module('cardManagementModule'));
  
  beforeEach(inject(function(_CardManagementService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    
    UserProfileFactory = {
      getCardMapping: jasmine.createSpy('getCardMapping').and.returnValue($q.resolve({cardIds: []}))
    };
    
    CardDataFactory = {
      getCardDetails: jasmine.createSpy('getCardDetails').and.returnValue($q.resolve([]))
    };
    
    CardAnalyticsService = {
      analyzeCard: jasmine.createSpy('analyzeCard').and.callFake(function(card) {
        return angular.extend({}, card, {availableCredit: 3500, utilizationRate: 30});
      })
    };
    
    CardManagementService.__set__('UserProfileFactory', UserProfileFactory);
    CardManagementService.__set__('CardDataFactory', CardDataFactory);
    CardManagementService.__set__('CardAnalyticsService', CardAnalyticsService);
  }));
  
  describe('getUserCards', function() {
    it('should retrieve and enrich user cards', function() {
      var mockCards = [
        {cardId: 'card1', creditLimit: 5000, outstandingBalance: 1500},
        {cardId: 'card2', creditLimit: 10000, outstandingBalance: 3000}
      ];
      
      UserProfileFactory.getCardMapping.and.returnValue($q.resolve({cardIds: ['card1', 'card2']}));
      CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
      
      var result;
      CardManagementService.getUserCards().then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBe(2);
      expect(CardAnalyticsService.analyzeCard).toHaveBeenCalledTimes(2);
    });
    
    it('should handle empty card list', function() {
      UserProfileFactory.getCardMapping.and.returnValue($q.resolve({cardIds: []}));
      CardDataFactory.getCardDetails.and.returnValue($q.resolve([]));
      
      var result;
      CardManagementService.getUserCards().then(function(cards) {
        result = cards;
      });
      
      $rootScope.$digest();
      
      expect(result.length).toBe(0);
    });
    
    it('should reject on UserProfileFactory error', function() {
      UserProfileFactory.getCardMapping.and.returnValue($q.reject('Profile Error'));
      
      var error;
      CardManagementService.getUserCards().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Profile Error');
    });
    
    it('should reject on CardDataFactory error', function() {
      UserProfileFactory.getCardMapping.and.returnValue($q.resolve({cardIds: ['card1']}));
      CardDataFactory.getCardDetails.and.returnValue($q.reject('Card Data Error'));
      
      var error;
      CardManagementService.getUserCards().catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card Data Error');
    });
  });
  
  describe('getCardDetail', function() {
    it('should retrieve and enrich single card', function() {
      var mockCard = {cardId: 'card1', creditLimit: 5000, outstandingBalance: 1500};
      CardDataFactory.getCardDetails.and.returnValue($q.resolve([mockCard]));
      
      var result;
      CardManagementService.getCardDetail('card1').then(function(card) {
        result = card;
      });
      
      $rootScope.$digest();
      
      expect(result.cardId).toBe('card1');
      expect(CardAnalyticsService.analyzeCard).toHaveBeenCalled();
    });
    
    it('should reject when card not found', function() {
      CardDataFactory.getCardDetails.and.returnValue($q.resolve([]));
      
      var error;
      CardManagementService.getCardDetail('nonexistent').catch(function(err) {
        error = err;
      });
      
      $rootScope.$digest();
      
      expect(error).toBe('Card not found');
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserCards, getCardDetail
- Scenarios covered:
  * Card retrieval and enrichment
  * Empty card list handling
  * Error handling from dependencies
  * Single card retrieval
  * Card not found scenario
- Uncovered scenarios: None
*/