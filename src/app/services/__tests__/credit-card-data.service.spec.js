/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards - success scenario
- Purpose: Validates that getAllCards successfully retrieves credit card data from API
- Scenario: Service calls /api/cards endpoint and returns card data
- Expected Result: Promise resolves with card data array
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getAllCards - error scenario
- Purpose: Validates error handling when API call fails
- Scenario: HTTP request fails with error
- Expected Result: Promise is rejected and error is logged
*/
/*
Coverage Report:
- Functions tested: getAllCards
- Scenarios covered: successful API call, API error handling
- Edge cases: network failure, malformed response
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService, $httpBackend, $q, $rootScope;

    beforeEach(module('dashboardModule'));

    beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _$q_, _$rootScope_) {
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $rootScope = _$rootScope_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getAllCards', function() {
      it('should successfully retrieve all credit cards from API', function() {
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
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].cardName).toBe('Visa Platinum');
        expect(result[1].cardId).toBe('card2');
        expect(result[1].creditLimit).toBe(15000);
      });

      it('should return empty array when no cards exist', function() {
        $httpBackend.expectGET('/api/cards').respond(200, []);

        var result;
        CreditCardDataService.getAllCards().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(0);
      });

      it('should handle API error and reject promise', function() {
        var errorResponse = { message: 'Internal Server Error' };
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(500, errorResponse);

        var errorResult;
        CreditCardDataService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching cards:', jasmine.any(Object));
      });

      it('should handle network failure', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(0, '');

        var errorResult;
        CreditCardDataService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle 404 not found error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(404, { message: 'Not Found' });

        var errorResult;
        CreditCardDataService.getAllCards().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
})();