/*
Test Documentation:
- Test Name: UserProfileService Unit Tests
- Purpose: Validate user card associations retrieval
- Scenario: Tests API calls for user profile and fallback to mock data
- Expected Result: Service returns user's card IDs from API or mock data
*/

(function() {
  'use strict';
  
  describe('UserProfileService', function() {
    var UserProfileService, $httpBackend;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_UserProfileService_, _$httpBackend_) {
      UserProfileService = _UserProfileService_;
      $httpBackend = _$httpBackend_;
    }));
    
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    
    describe('getUserCards()', function() {
      it('should return card IDs from API on success', function() {
        var mockProfile = {cardIds: ['card1', 'card2', 'card3']};
        $httpBackend.expectGET('/api/user/profile').respond(200, mockProfile);
        
        var result;
        UserProfileService.getUserCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(['card1', 'card2', 'card3']);
      });
      
      it('should return mock card IDs on API failure', function() {
        $httpBackend.expectGET('/api/user/profile').respond(500);
        
        var result;
        UserProfileService.getUserCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(result).toEqual(['card1', 'card2', 'card3', 'card4']);
      });
      
      it('should return array of strings', function() {
        $httpBackend.expectGET('/api/user/profile').respond(404);
        
        var result;
        UserProfileService.getUserCards().then(function(data) {
          result = data;
        });
        
        $httpBackend.flush();
        expect(Array.isArray(result)).toBe(true);
        expect(typeof result[0]).toBe('string');
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered:
  * Successful API response
  * API failure scenarios
  * Data type validation
- Uncovered scenarios: Empty card list, unauthorized access
*/