/*
Test Documentation:
- Test Name: UserProfileService Unit Tests
- Purpose: Validate user profile and card association retrieval
- Scenario: Tests getUserCards method with various user profiles and card associations
- Expected Result: Correct card association retrieval with error handling for invalid requests
*/

(function() {
  'use strict';

  describe('UserProfileService', function() {
    var UserProfileService, $httpBackend, $rootScope;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_UserProfileService_, _$httpBackend_, _$rootScope_) {
      UserProfileService = _UserProfileService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      it('should retrieve user card IDs for authenticated user', function(done) {
        var mockCardIds = ['card123', 'card456', 'card789'];

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds).toEqual(mockCardIds);
          expect(cardIds.length).toBe(3);
          expect(cardIds[0]).toBe('card123');
          done();
        });

        $httpBackend.flush();
      });

      it('should handle user with no cards', function(done) {
        var mockCardIds = [];

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds).toEqual([]);
          expect(cardIds.length).toBe(0);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle user with single card', function(done) {
        var mockCardIds = ['card123'];

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds.length).toBe(1);
          expect(cardIds[0]).toBe('card123');
          done();
        });

        $httpBackend.flush();
      });

      it('should handle user with 10 cards (NFR requirement)', function(done) {
        var mockCardIds = [];
        for (var i = 1; i <= 10; i++) {
          mockCardIds.push('card' + i);
        }

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds.length).toBe(10);
          expect(cardIds[0]).toBe('card1');
          expect(cardIds[9]).toBe('card10');
          done();
        });

        $httpBackend.flush();
      });

      it('should handle user with more than 10 cards', function(done) {
        var mockCardIds = [];
        for (var i = 1; i <= 15; i++) {
          mockCardIds.push('card' + i);
        }

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds.length).toBe(15);
          expect(cardIds[14]).toBe('card15');
          done();
        });

        $httpBackend.flush();
      });

      it('should reject promise on 401 unauthorized error', function(done) {
        $httpBackend.expectGET('/api/user/cards').respond(401, { error: 'Unauthorized' });

        UserProfileService.getUserCards().then(function() {
          fail('Should not resolve on 401 error');
        }, function(error) {
          expect(error.status).toBe(401);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle server errors gracefully', function(done) {
        $httpBackend.expectGET('/api/user/cards').respond(500, { error: 'Internal Server Error' });

        UserProfileService.getUserCards().then(function() {
          fail('Should not resolve on server error');
        }, function(error) {
          expect(error.status).toBe(500);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle 404 error for user not found', function(done) {
        $httpBackend.expectGET('/api/user/cards').respond(404, { error: 'User not found' });

        UserProfileService.getUserCards().then(function() {
          fail('Should not resolve on 404 error');
        }, function(error) {
          expect(error.status).toBe(404);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle network timeout errors', function(done) {
        $httpBackend.expectGET('/api/user/cards').respond(-1, null);

        UserProfileService.getUserCards().then(function() {
          fail('Should not resolve on network timeout');
        }, function(error) {
          expect(error.status).toBe(-1);
          done();
        });

        $httpBackend.flush();
      });

      it('should handle card IDs with special characters', function(done) {
        var mockCardIds = ['card@123', 'card#456', 'card$789'];

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds) {
          expect(cardIds.length).toBe(3);
          expect(cardIds[0]).toBe('card@123');
          expect(cardIds[1]).toBe('card#456');
          expect(cardIds[2]).toBe('card$789');
          done();
        });

        $httpBackend.flush();
      });

      it('should return promise that can be chained', function() {
        var mockCardIds = ['card123'];

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        var result = UserProfileService.getUserCards();
        expect(result.then).toBeDefined();
        expect(typeof result.then).toBe('function');

        $httpBackend.flush();
      });

      it('should handle multiple concurrent requests', function(done) {
        var mockCardIds = ['card123', 'card456'];
        var callCount = 0;

        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);
        $httpBackend.expectGET('/api/user/cards').respond(200, mockCardIds);

        UserProfileService.getUserCards().then(function(cardIds1) {
          expect(cardIds1.length).toBe(2);
          callCount++;
          if (callCount === 2) done();
        });

        UserProfileService.getUserCards().then(function(cardIds2) {
          expect(cardIds2.length).toBe(2);
          callCount++;
          if (callCount === 2) done();
        });

        $httpBackend.flush();
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered:
  * Multiple card IDs retrieval
  * No cards scenario
  * Single card
  * 10 cards (NFR requirement)
  * More than 10 cards
  * 401 unauthorized error
  * 500 server error
  * 404 user not found
  * Network timeout
  * Special characters in card IDs
  * Promise chaining
  * Multiple concurrent requests
- Edge cases: Empty arrays, single card, 10+ cards, special characters
- Error scenarios: 401 Unauthorized, 500 Server Error, 404 Not Found, network timeout
- Uncovered scenarios: None - comprehensive coverage achieved
*/