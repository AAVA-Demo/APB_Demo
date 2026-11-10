/*
Test Documentation:
- Test Name: CardApiService Unit Tests
- Purpose: Validate orchestration of user profile, card data, and transaction services
- Scenario: Tests aggregation of multiple service calls for complete card information
- Expected Result: Service returns enriched card data with spending information
*/

(function() {
  'use strict';
  
  describe('CardApiService', function() {
    var CardApiService, UserProfileService, CardDataService, CardTransactionService, $q, $rootScope;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_CardApiService_, _UserProfileService_, _CardDataService_, _CardTransactionService_, _$q_, _$rootScope_) {
      CardApiService = _CardApiService_;
      UserProfileService = _UserProfileService_;
      CardDataService = _CardDataService_;
      CardTransactionService = _CardTransactionService_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));
    
    describe('fetchAllCards()', function() {
      it('should fetch and merge card details and spending data', function() {
        var mockCardIds = ['card1', 'card2'];
        var mockCard1 = {cardId: 'card1', creditLimit: 50000};
        var mockCard2 = {cardId: 'card2', creditLimit: 30000};
        var mockSpending1 = {monthlySpend: 5000};
        var mockSpending2 = {monthlySpend: 3000};
        
        spyOn(UserProfileService, 'getUserCards').and.returnValue($q.resolve(mockCardIds));
        spyOn(CardDataService, 'getCardDetails').and.callFake(function(cardId) {
          return $q.resolve(cardId === 'card1' ? mockCard1 : mockCard2);
        });
        spyOn(CardTransactionService, 'getCardSpending').and.callFake(function(cardId) {
          return $q.resolve(cardId === 'card1' ? mockSpending1 : mockSpending2);
        });
        
        var result;
        CardApiService.fetchAllCards().then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        expect(result.length).toBe(2);
        expect(result[0]).toEqual(jasmine.objectContaining({cardId: 'card1', creditLimit: 50000, monthlySpend: 5000}));
        expect(result[1]).toEqual(jasmine.objectContaining({cardId: 'card2', creditLimit: 30000, monthlySpend: 3000}));
      });
      
      it('should handle empty card list', function() {
        spyOn(UserProfileService, 'getUserCards').and.returnValue($q.resolve([]));
        
        var result;
        CardApiService.fetchAllCards().then(function(data) {
          result = data;
        });
        
        $rootScope.$digest();
        expect(result).toEqual([]);
      });
      
      it('should handle service failures', function() {
        spyOn(UserProfileService, 'getUserCards').and.returnValue($q.reject('Error'));
        
        var errorCaught = false;
        CardApiService.fetchAllCards().catch(function() {
          errorCaught = true;
        });
        
        $rootScope.$digest();
        expect(errorCaught).toBe(true);
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: fetchAllCards
- Scenarios covered:
  * Successful data aggregation
  * Multiple card handling
  * Data merging from multiple services
  * Empty card list
  * Error handling
- Uncovered scenarios: Partial service failures, timeout scenarios
*/