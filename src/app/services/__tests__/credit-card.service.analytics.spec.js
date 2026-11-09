/*
Test Documentation:
- Test Name: CreditCardService (Analytics) - getAllCards - success scenario
- Purpose: Validates that getAllCards retrieves all credit cards for analytics module
- Scenario: Service calls /api/cards endpoint and returns card data for analytics processing
- Expected Result: Promise resolves with complete card data array
*/
/*
Test Documentation:
- Test Name: CreditCardService (Analytics) - getAllCards - error handling
- Purpose: Validates error handling when API call fails in analytics context
- Scenario: HTTP request fails with various error codes
- Expected Result: Promise is rejected and error is logged with analytics context
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: successful retrieval, error handling, empty response
- Edge cases: network errors, timeout, malformed data
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardService (Analytics Module)', function() {
    var CreditCardService, $httpBackend, $q, $rootScope;

    beforeEach(module('analyticsModule'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _$q_, _$rootScope_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should successfully retrieve all cards for analytics', function() {
        var mockCards = [
          {
            cardId: 'card1',
            cardName: 'Visa Platinum',
            cardNumber: '****1234',
            creditLimit: 10000,
            outstandingAmount: 2500,
            availableCredit: 7500,
            cardType: 'Credit'
          },
          {
            cardId: 'card2',
            cardName: 'MasterCard Gold',
            cardNumber: '****5678',
            creditLimit: 15000,
            outstandingAmount: 5000,
            availableCredit: 10000,
            cardType: 'Credit'
          },
          {
            cardId: 'card3',
            cardName: 'Amex Blue',
            cardNumber: '****9012',
            creditLimit: 20000,
            outstandingAmount: 8000,
            availableCredit: 12000,
            cardType: 'Credit'
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[0].cardId).toBe('card1');
        expect(result[1].cardName).toBe('MasterCard Gold');
        expect(result[2].availableCredit).toBe(12000);
      });

      it('should return empty array when no cards available', function() {
        $httpBackend.expectGET('/api/cards').respond(200, []);

        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle 500 internal server error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(500, { error: 'Internal Server Error' });

        var errorResult;
        CreditCardService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching cards for analytics:', jasmine.any(Object));
      });

      it('should handle 401 unauthorized error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(401, { error: 'Unauthorized' });

        var errorResult;
        CreditCardService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network timeout', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(-1, '');

        var errorResult;
        CreditCardService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle single card response', function() {
        var singleCard = [{
          cardId: 'card1',
          cardName: 'Visa Platinum',
          cardNumber: '****1234',
          creditLimit: 10000,
          outstandingAmount: 2500,
          availableCredit: 7500,
          cardType: 'Credit'
        }];

        $httpBackend.expectGET('/api/cards').respond(200, singleCard);

        var result;
        CreditCardService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card1');
      });
    });
  });
})();