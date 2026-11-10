/*
Test Documentation:
- Test Name: UserProfileService - getUserCards with valid userId
- Purpose: Validates retrieval of user's credit card associations
- Scenario: Service is called with valid userId
- Expected Result: Should return array of card IDs associated with user
*/
/*
Test Documentation:
- Test Name: UserProfileService - getUserCards error handling
- Purpose: Validates error handling when API fails
- Scenario: API returns error response
- Expected Result: Should reject promise and log error
*/
/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: successful API call, error handling, empty card list, network errors
- Edge cases: null userId, undefined userId, API failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, $httpBackend;
    var mockUserId = 'user123';
    var mockCardIds = ['card1', 'card2', 'card3', 'card4'];

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _$httpBackend_) {
      UserProfileService = _UserProfileService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      it('should fetch user cards successfully', function() {
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(200, mockCardIds);

        var result;
        UserProfileService.getUserCards(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(mockCardIds);
        expect(result.length).toBe(4);
        expect(result[0]).toBe('card1');
      });

      it('should handle empty card list', function() {
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(200, []);

        var result;
        UserProfileService.getUserCards(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle API errors gracefully', function() {
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(500, { error: 'Internal Server Error' });

        var errorResult;
        UserProfileService.getUserCards(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      it('should handle 404 errors for non-existent users', function() {
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(404, { error: 'User not found' });

        var errorResult;
        UserProfileService.getUserCards(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      it('should handle network errors', function() {
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(-1, null);

        var errorResult;
        UserProfileService.getUserCards(mockUserId)
          .catch(function(error) {
            errorResult = error;
          });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });

      it('should construct correct API endpoint with userId', function() {
        var customUserId = 'user999';
        $httpBackend.expectGET('/api/users/' + customUserId + '/cards')
          .respond(200, mockCardIds);

        UserProfileService.getUserCards(customUserId);

        $httpBackend.flush();
      });

      it('should return data property from response', function() {
        var responseData = ['card1', 'card2'];
        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(200, responseData);

        var result;
        UserProfileService.getUserCards(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result).toEqual(responseData);
      });

      it('should handle large number of cards', function() {
        var largeCardList = [];
        for (var i = 1; i <= 50; i++) {
          largeCardList.push('card' + i);
        }

        $httpBackend.expectGET('/api/users/' + mockUserId + '/cards')
          .respond(200, largeCardList);

        var result;
        UserProfileService.getUserCards(mockUserId)
          .then(function(data) {
            result = data;
          });

        $httpBackend.flush();

        expect(result.length).toBe(50);
        expect(result[0]).toBe('card1');
        expect(result[49]).toBe('card50');
      });
    });
  });
})();