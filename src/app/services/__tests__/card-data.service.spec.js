/*
Test Documentation:
- Test Name: CardDataService - getAllCards with cache miss
- Purpose: Validates that getAllCards retrieves cards from API when cache is empty
- Scenario: Service called when no cached data exists
- Expected Result: HTTP request made, cards retrieved, masked, and cached
*/
/*
Test Documentation:
- Test Name: CardDataService - getAllCards with cache hit
- Purpose: Validates that getAllCards returns cached data without API call
- Scenario: Service called when valid cached data exists
- Expected Result: Cached cards returned immediately without HTTP request
*/
/*
Test Documentation:
- Test Name: CardDataService - getCardDetails with valid cardId
- Purpose: Validates that getCardDetails retrieves specific card details
- Scenario: Service called with valid card identifier
- Expected Result: Card details retrieved and card number masked
*/
/*
Test Documentation:
- Test Name: CardDataService - card number masking
- Purpose: Validates that card numbers are properly masked for security
- Scenario: Card data contains full card number
- Expected Result: Card number masked to show only last 4 digits
*/
/*
Coverage Report:
- Functions tested: getAllCards, getCardDetails, maskCardNumber (internal)
- Scenarios covered: cache hit, cache miss, card masking, error handling, cache expiration
- Edge cases: empty card list, invalid cardId, malformed card numbers, API failures
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CardDataService', function() {
    var CardDataService, $httpBackend, $rootScope, $q, $cacheFactory, $timeout;
    var apiBaseUrl = 'https://api.creditcard.demo';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardDataService_, _$httpBackend_, _$rootScope_, _$q_, _$cacheFactory_, _$timeout_) {
      CardDataService = _CardDataService_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $q = _$q_;
      $cacheFactory = _$cacheFactory_;
      $timeout = _$timeout_;
      $rootScope.apiBaseUrl = apiBaseUrl;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should retrieve all cards from API when cache is empty', function() {
        var mockCards = [
          {
            cardId: 'card-001',
            cardNumber: '1234567890123456',
            cardHolderName: 'John Doe',
            cardType: 'Visa',
            expiryDate: '12/25',
            creditLimit: 10000,
            availableCredit: 7500,
            outstandingAmount: 2500
          },
          {
            cardId: 'card-002',
            cardNumber: '9876543210987654',
            cardHolderName: 'Jane Smith',
            cardType: 'Mastercard',
            expiryDate: '06/26',
            creditLimit: 15000,
            availableCredit: 12000,
            outstandingAmount: 3000
          }
        ];

        $httpBackend.expectGET(apiBaseUrl + '/api/cards')
          .respond(200, mockCards);

        var result;
        CardDataService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].cardNumber).toBe('**** **** **** 3456');
        expect(result[1].cardNumber).toBe('**** **** **** 7654');
        expect(result[0].cardHolderName).toBe('John Doe');
        expect(result[1].cardHolderName).toBe('Jane Smith');
      });

      it('should return cached cards without making API call', function() {
        var cachedCards = [
          {
            cardId: 'card-001',
            cardNumber: '**** **** **** 3456',
            cardHolderName: 'John Doe'
          }
        ];

        var cache = $cacheFactory.get('cardCache');
        cache.put('allCards', cachedCards);

        var result;
        CardDataService.getAllCards().then(function(cards) {
          result = cards;
        });

        $rootScope.$apply();

        expect(result).toEqual(cachedCards);
      });

      it('should cache retrieved cards for 5 minutes', function() {
        var mockCards = [
          {
            cardId: 'card-001',
            cardNumber: '1234567890123456',
            cardHolderName: 'John Doe'
          }
        ];

        $httpBackend.expectGET(apiBaseUrl + '/api/cards')
          .respond(200, mockCards);

        CardDataService.getAllCards();
        $httpBackend.flush();

        var cache = $cacheFactory.get('cardCache');
        var cachedData = cache.get('allCards');
        expect(cachedData).toBeDefined();
        expect(cachedData.length).toBe(1);

        $timeout.flush(300000);

        cachedData = cache.get('allCards');
        expect(cachedData).toBeUndefined();
      });

      it('should handle API error and reject promise', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards')
          .respond(500, { message: 'Internal Server Error' });

        var error;
        CardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
      });

      it('should handle empty card list', function() {
        $httpBackend.expectGET(apiBaseUrl + '/api/cards')
          .respond(200, []);

        var result;
        CardDataService.getAllCards().then(function(cards) {
          result = cards;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      it('should handle network error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards')
          .respond(-1, null);

        var error;
        CardDataService.getAllCards().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('getCardDetails', function() {
      it('should retrieve card details for valid cardId', function() {
        var cardId = 'card-123';
        var mockCard = {
          cardId: cardId,
          cardNumber: '4532123456789012',
          cardHolderName: 'Alice Johnson',
          cardType: 'Visa',
          expiryDate: '09/27',
          creditLimit: 20000,
          availableCredit: 15000,
          outstandingAmount: 5000,
          monthlySpend: 2500,
          isActive: true
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/' + cardId)
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails(cardId).then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.cardNumber).toBe('**** **** **** 9012');
        expect(result.cardHolderName).toBe('Alice Johnson');
        expect(result.creditLimit).toBe(20000);
      });

      it('should handle invalid cardId error', function() {
        var cardId = 'invalid-card';
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/' + cardId)
          .respond(404, { message: 'Card not found' });

        var error;
        CardDataService.getCardDetails(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
        expect(console.error).toHaveBeenCalledWith('Error fetching card details:', jasmine.any(Object));
      });

      it('should mask card number in retrieved card details', function() {
        var cardId = 'card-456';
        var mockCard = {
          cardId: cardId,
          cardNumber: '5555444433332222',
          cardHolderName: 'Bob Williams'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/' + cardId)
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails(cardId).then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBe('**** **** **** 2222');
        expect(result.cardNumber).not.toContain('5555');
      });

      it('should handle server error when fetching card details', function() {
        var cardId = 'card-789';
        spyOn(console, 'error');

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/' + cardId)
          .respond(500, { message: 'Internal Server Error' });

        var error;
        CardDataService.getCardDetails(cardId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('card number masking', function() {
      it('should mask card number with 16 digits', function() {
        var mockCard = {
          cardId: 'test',
          cardNumber: '1234567890123456'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/test')
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails('test').then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBe('**** **** **** 3456');
      });

      it('should mask card number with 15 digits (Amex)', function() {
        var mockCard = {
          cardId: 'test',
          cardNumber: '378282246310005'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/test')
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails('test').then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBe('**** **** **** 0005');
      });

      it('should handle card with no cardNumber field', function() {
        var mockCard = {
          cardId: 'test',
          cardHolderName: 'Test User'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/test')
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails('test').then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBeUndefined();
      });

      it('should handle card with short cardNumber (less than 4 digits)', function() {
        var mockCard = {
          cardId: 'test',
          cardNumber: '123'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/test')
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails('test').then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBe('123');
      });

      it('should handle card with exactly 4 digits', function() {
        var mockCard = {
          cardId: 'test',
          cardNumber: '1234'
        };

        $httpBackend.expectGET(apiBaseUrl + '/api/cards/test')
          .respond(200, mockCard);

        var result;
        CardDataService.getCardDetails('test').then(function(card) {
          result = card;
        });

        $httpBackend.flush();

        expect(result.cardNumber).toBe('**** **** **** 1234');
      });
    });

    describe('service initialization', function() {
      it('should be defined', function() {
        expect(CardDataService).toBeDefined();
      });

      it('should have getAllCards method', function() {
        expect(CardDataService.getAllCards).toBeDefined();
        expect(typeof CardDataService.getAllCards).toBe('function');
      });

      it('should have getCardDetails method', function() {
        expect(CardDataService.getCardDetails).toBeDefined();
        expect(typeof CardDataService.getCardDetails).toBe('function');
      });
    });
  });
})();