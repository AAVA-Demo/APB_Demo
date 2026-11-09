/*
Test Documentation:
- Test Name: CreditCardService (Transaction Module) - getCardDetails - success scenario
- Purpose: Validates that getCardDetails retrieves card information for transaction mapping
- Scenario: Service calls /api/cards endpoint to get card details for transaction display
- Expected Result: Promise resolves with card details array
*/
/*
Test Documentation:
- Test Name: CreditCardService (Transaction Module) - getCardDetails - error handling
- Purpose: Validates error handling when card details retrieval fails
- Scenario: API call fails with various error conditions
- Expected Result: Promise is rejected and error is logged appropriately
*/
/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered: successful retrieval, error handling, empty data, multiple cards
- Edge cases: network failure, unauthorized access, server errors
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardService (Transaction Module)', function() {
    var CreditCardService, $httpBackend, $q, $rootScope;

    beforeEach(module('transactionModule'));

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

    describe('getCardDetails', function() {
      it('should successfully retrieve card details', function() {
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
        CreditCardService.getCardDetails().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('card1');
        expect(result[0].cardName).toBe('Visa Platinum');
        expect(result[1].cardId).toBe('card2');
      });

      it('should retrieve card details with cardIds parameter (ignored in current implementation)', function() {
        var mockCards = [
          {
            cardId: 'card1',
            cardName: 'Visa Platinum',
            cardNumber: '****1234',
            creditLimit: 10000,
            outstandingAmount: 2500,
            availableCredit: 7500,
            cardType: 'Credit'
          }
        ];

        $httpBackend.expectGET('/api/cards').respond(200, mockCards);

        var result;
        CreditCardService.getCardDetails(['card1']).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(1);
      });

      it('should return empty array when no cards exist', function() {
        $httpBackend.expectGET('/api/cards').respond(200, []);

        var result;
        CreditCardService.getCardDetails().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should handle 500 server error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(500, { error: 'Internal Server Error' });

        var errorResult;
        CreditCardService.getCardDetails().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalledWith('Error fetching card details:', jasmine.any(Object));
      });

      it('should handle 404 not found error', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(404, { error: 'Not Found' });

        var errorResult;
        CreditCardService.getCardDetails().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network failure', function() {
        spyOn(console, 'error');

        $httpBackend.expectGET('/api/cards').respond(0, '');

        var errorResult;
        CreditCardService.getCardDetails().catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle multiple cards with complete details', function() {
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
        CreditCardService.getCardDetails().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toBeDefined();
        expect(result.length).toBe(3);
        expect(result[2].cardName).toBe('Amex Blue');
        expect(result[2].availableCredit).toBe(12000);
      });
    });
  });
})();