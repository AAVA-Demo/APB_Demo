/*
Test Documentation:
- Test Name: cardMetadataService - getCardMetadata
- Purpose: Validates card metadata retrieval with caching
- Scenario: Service fetches metadata for multiple cards and caches results
- Expected Result: Returns metadata for all cards with caching for subsequent calls
*/
/*
Test Documentation:
- Test Name: cardMetadataService - caching mechanism
- Purpose: Validates metadata caching functionality
- Scenario: Service returns cached data on subsequent calls
- Expected Result: No additional HTTP calls for cached card metadata
*/
/*
Coverage Report:
- Functions tested: getCardMetadata
- Scenarios covered: successful API call, API failure with mock fallback, caching, multiple card IDs
- Uncovered scenarios: none
*/

describe('cardMetadataService', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var cardMetadataService, $httpBackend, $rootScope, apiConfig;
  
  beforeEach(inject(function(_cardMetadataService_, _$httpBackend_, _$rootScope_, _apiConfig_) {
    cardMetadataService = _cardMetadataService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    apiConfig = _apiConfig_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getCardMetadata', function() {
    it('should fetch metadata for single card', function() {
      var cardIds = ['card1'];
      var mockMetadata = {cardId: 'card1', rewardsProgram: 'Premium', annualFee: 95};
      
      $httpBackend.expectGET(apiConfig.baseUrl + '/cards/card1/metadata').respond(200, mockMetadata);
      
      var result;
      cardMetadataService.getCardMetadata(cardIds).then(function(metadata) {
        result = metadata;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].rewardsProgram).toBe('Premium');
    });
    
    it('should fetch metadata for multiple cards', function() {
      var cardIds = ['card1', 'card2'];
      
      $httpBackend.expectGET(apiConfig.baseUrl + '/cards/card1/metadata').respond(200, {cardId: 'card1', rewardsProgram: 'Premium', annualFee: 95});
      $httpBackend.expectGET(apiConfig.baseUrl + '/cards/card2/metadata').respond(200, {cardId: 'card2', rewardsProgram: 'Standard', annualFee: 0});
      
      var result;
      cardMetadataService.getCardMetadata(cardIds).then(function(metadata) {
        result = metadata;
      });
      
      $httpBackend.flush();
      
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[1].cardId).toBe('card2');
    });
    
    it('should return mock data on API failure', function() {
      var cardIds = ['card1'];
      
      $httpBackend.expectGET(apiConfig.baseUrl + '/cards/card1/metadata').respond(500, 'Server Error');
      
      var result;
      cardMetadataService.getCardMetadata(cardIds).then(function(metadata) {
        result = metadata;
      });
      
      $httpBackend.flush();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].rewardsProgram).toBe('Standard');
      expect(result[0].annualFee).toBe(0);
    });
    
    it('should cache metadata after first fetch', function() {
      var cardIds = ['card1'];
      var mockMetadata = {cardId: 'card1', rewardsProgram: 'Premium', annualFee: 95};
      
      $httpBackend.expectGET(apiConfig.baseUrl + '/cards/card1/metadata').respond(200, mockMetadata);
      
      cardMetadataService.getCardMetadata(cardIds);
      $httpBackend.flush();
      
      var result;
      cardMetadataService.getCardMetadata(cardIds).then(function(metadata) {
        result = metadata;
      });
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result[0].cardId).toBe('card1');
    });
    
    it('should handle empty card ID array', function() {
      var cardIds = [];
      
      var result;
      cardMetadataService.getCardMetadata(cardIds).then(function(metadata) {
        result = metadata;
      });
      $rootScope.$apply();
      
      expect(result).toBeDefined();
      expect(result.length).toBe(0);
    });
  });
});