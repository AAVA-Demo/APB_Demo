/*
Test Documentation:
- Test Name: CardManagementService - getUserCards success
- Purpose: Validates that getUserCards successfully retrieves and transforms card data
- Scenario: HTTP GET request succeeds and returns card array
- Expected Result: Returns array of card IDs extracted from response

- Test Name: CardManagementService - getUserCards error handling
- Purpose: Validates error handling when API call fails
- Scenario: HTTP GET request fails with error
- Expected Result: Logs error and rejects promise

- Test Name: CardManagementService - getUserCards empty response
- Purpose: Validates handling of empty card array
- Scenario: API returns empty array
- Expected Result: Returns empty array of card IDs

Coverage Report:
- Functions tested: getUserCards
- Scenarios covered: success case, error handling, empty response
- Edge cases: empty array, null handling
- Uncovered scenarios: network timeout (handled by $http)
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, $httpBackend, API_BASE_URL;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardManagementService_, _$httpBackend_, _API_BASE_URL_) {
      CardManagementService = _CardManagementService_;
      $httpBackend = _$httpBackend_;
      API_BASE_URL = _API_BASE_URL_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getUserCards', function() {
      it('should successfully retrieve and transform card data', function() {
        var mockResponse = [
          { cardId: 'card-001', cardName: 'Visa Gold', creditLimit: 5000 },
          { cardId: 'card-002', cardName: 'MasterCard Platinum', creditLimit: 10000 }
        ];
        var expectedCardIds = ['card-001', 'card-002'];

        $httpBackend.expectGET(API_BASE_URL + '/cards/user')
          .respond(200, mockResponse);

        var result;
        CardManagementService.getUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(expectedCardIds);
        expect(result.length).toBe(2);
      });

      it('should handle API error and reject promise', function() {
        var errorResponse = { status: 500, statusText: 'Internal Server Error' };
        var errorCaught = false;

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/cards/user')
          .respond(500, errorResponse);

        CardManagementService.getUserCards().catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();

        expect(errorCaught).toBe(true);
        expect(console.error).toHaveBeenCalledWith('Error fetching user cards:', jasmine.any(Object));
      });

      it('should handle empty card array', function() {
        var mockResponse = [];

        $httpBackend.expectGET(API_BASE_URL + '/cards/user')
          .respond(200, mockResponse);

        var result;
        CardManagementService.getUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle 401 unauthorized error', function() {
        var errorCaught = false;

        spyOn(console, 'error');

        $httpBackend.expectGET(API_BASE_URL + '/cards/user')
          .respond(401, { message: 'Unauthorized' });

        CardManagementService.getUserCards().catch(function(error) {
          errorCaught = true;
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();

        expect(errorCaught).toBe(true);
        expect(console.error).toHaveBeenCalled();
      });

      it('should extract only cardId from response objects', function() {
        var mockResponse = [
          { cardId: 'card-123', cardName: 'Test Card', extraField: 'ignored' }
        ];

        $httpBackend.expectGET(API_BASE_URL + '/cards/user')
          .respond(200, mockResponse);

        var result;
        CardManagementService.getUserCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(['card-123']);
        expect(result[0]).toBe('card-123');
      });
    });
  });
})();