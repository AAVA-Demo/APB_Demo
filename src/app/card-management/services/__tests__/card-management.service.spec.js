/*
Test Documentation:
- Test Name: CardManagementService - getAllCards success
- Purpose: Validates successful retrieval of all credit cards
- Scenario: Normal scenario with successful API response
- Expected Result: Returns list of cards
*/
/*
Test Documentation:
- Test Name: CardManagementService - getAllCards with cache
- Purpose: Validates cache usage for card list
- Scenario: Normal scenario with cached data
- Expected Result: Returns cached data without API call
*/
/*
Test Documentation:
- Test Name: CardManagementService - getCardDetails success
- Purpose: Validates successful retrieval of card details
- Scenario: Normal scenario with successful API response
- Expected Result: Returns card details
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails
- Scenarios covered: successful API calls, cache hits, API errors, cache misses
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardManagementService', function() {
    var CardManagementService, $httpBackend, CardCacheFactory;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_CardManagementService_, _$httpBackend_, _CardCacheFactory_) {
      CardManagementService = _CardManagementService_;
      $httpBackend = _$httpBackend_;
      CardCacheFactory = _CardCacheFactory_;
      spyOn(CardCacheFactory, 'get').and.returnValue(null);
      spyOn(CardCacheFactory, 'set');
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should fetch all cards successfully', function() {
        var mockResponse = {
          cards: [
            { cardId: '1', cardNumber: '****1234' },
            { cardId: '2', cardNumber: '****5678' }
          ]
        };

        $httpBackend.expectGET('/api/cards').respond(200, mockResponse);

        var result;
        CardManagementService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(CardCacheFactory.set).toHaveBeenCalledWith('cardList', mockResponse);
      });

      it('should return cached data if available', function() {
        var cachedData = { cards: [{ cardId: '1' }] };
        CardCacheFactory.get.and.returnValue(cachedData);

        var result;
        CardManagementService.getAllCards().then(function(data) {
          result = data;
        });

        expect(result).toEqual(cachedData);
      });

      it('should handle API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards').respond(500, 'Server Error');

        var error;
        CardManagementService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getCardDetails', function() {
      it('should fetch card details successfully', function() {
        var mockCard = {
          cardId: 'card-123',
          cardNumber: '****1234',
          issuer: 'Visa'
        };

        $httpBackend.expectGET('/api/cards/card-123').respond(200, mockCard);

        var result;
        CardManagementService.getCardDetails('card-123').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockCard);
        expect(CardCacheFactory.set).toHaveBeenCalledWith('card_card-123', mockCard);
      });

      it('should return cached card details if available', function() {
        var cachedCard = { cardId: 'card-123', cardNumber: '****1234' };
        CardCacheFactory.get.and.returnValue(cachedCard);

        var result;
        CardManagementService.getCardDetails('card-123').then(function(data) {
          result = data;
        });

        expect(result).toEqual(cachedCard);
      });

      it('should handle API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards/card-123').respond(404, 'Not Found');

        var error;
        CardManagementService.getCardDetails('card-123').catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle null card ID', function() {
        $httpBackend.expectGET('/api/cards/null').respond(400, 'Bad Request');

        var error;
        CardManagementService.getCardDetails(null).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });
    });
  });
})();