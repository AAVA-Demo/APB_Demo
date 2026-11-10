/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchCards
- Purpose: Verify credit card data retrieval
- Scenario: API returns card data successfully
- Expected Result: Returns array of credit card objects
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - fetchCards
- Purpose: Verify fallback to mock data
- Scenario: API returns no data
- Expected Result: Returns mock credit card array
*/
/*
Test Documentation:
- Test Name: CreditCardDataFactory - resource configuration
- Purpose: Verify resource endpoint configuration
- Scenario: Factory is instantiated
- Expected Result: Resource configured with correct URL pattern
*/
/*
Coverage Report:
- Functions tested: fetchCards, response interceptor
- Scenarios covered: successful API response, fallback mock data, resource configuration
- Uncovered scenarios: network errors (handled by $resource)
*/

(function(){
'use strict';

describe('CreditCardDataFactory', function(){
  var CreditCardDataFactory, $httpBackend, API_ENDPOINT;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataFactory_, _$httpBackend_, _API_ENDPOINT_){
    CreditCardDataFactory = _CreditCardDataFactory_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINT = _API_ENDPOINT_;
  }));

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('fetchCards', function(){
    it('should fetch credit cards for a given userId', function(){
      var userId = 'user123';
      var mockResponse = [
        {cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa', totalCreditLimit: 50000, outstandingAmount: 15000, monthlySpend: 8000},
        {cardId: 'CC002', cardNumber: '**** 5678', cardType: 'Mastercard', totalCreditLimit: 30000, outstandingAmount: 5000, monthlySpend: 3500}
      ];

      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, mockResponse);

      var result = CreditCardDataFactory.fetchCards({userId: userId});

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardType).toBe('Mastercard');
    });

    it('should return mock data when API response has no data', function(){
      var userId = 'user456';

      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, null);

      var result = CreditCardDataFactory.fetchCards({userId: userId});

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].cardId).toBe('CC001');
      expect(result[1].cardId).toBe('CC002');
      expect(result[2].cardId).toBe('CC003');
      expect(result[0].cardType).toBe('Visa');
      expect(result[1].cardType).toBe('Mastercard');
      expect(result[2].cardType).toBe('Amex');
    });

    it('should return mock data when API response is undefined', function(){
      var userId = 'user789';

      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, undefined);

      var result = CreditCardDataFactory.fetchCards({userId: userId});

      $httpBackend.flush();

      expect(result).toBeDefined();
      expect(result.length).toBe(3);
      expect(result[0].totalCreditLimit).toBe(50000);
      expect(result[1].outstandingAmount).toBe(5000);
      expect(result[2].monthlySpend).toBe(12000);
    });

    it('should handle empty response data gracefully', function(){
      var userId = 'user000';

      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, {});

      var result = CreditCardDataFactory.fetchCards({userId: userId});

      $httpBackend.flush();

      expect(result).toBeDefined();
    });

    it('should verify all mock card properties are present', function(){
      var userId = 'userABC';

      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, null);

      var result = CreditCardDataFactory.fetchCards({userId: userId});

      $httpBackend.flush();

      result.forEach(function(card){
        expect(card.cardId).toBeDefined();
        expect(card.cardNumber).toBeDefined();
        expect(card.cardType).toBeDefined();
        expect(card.totalCreditLimit).toBeDefined();
        expect(card.outstandingAmount).toBeDefined();
        expect(card.monthlySpend).toBeDefined();
      });
    });
  });

  describe('resource configuration', function(){
    it('should be defined as a factory', function(){
      expect(CreditCardDataFactory).toBeDefined();
      expect(typeof CreditCardDataFactory.fetchCards).toBe('function');
    });

    it('should construct correct URL with userId parameter', function(){
      var userId = 'testUser999';
      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(200, []);
      CreditCardDataFactory.fetchCards({userId: userId});
      $httpBackend.flush();
    });
  });

  describe('error scenarios', function(){
    it('should handle 404 error response', function(){
      var userId = 'user404';
      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(404, 'Not Found');

      var result = CreditCardDataFactory.fetchCards({userId: userId});
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });

    it('should handle 500 server error', function(){
      var userId = 'user500';
      $httpBackend.expectGET(API_ENDPOINT + '/cards/' + userId).respond(500, 'Internal Server Error');

      var result = CreditCardDataFactory.fetchCards({userId: userId});
      var errorOccurred = false;

      result.$promise.catch(function(error){
        errorOccurred = true;
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
      expect(errorOccurred).toBe(true);
    });
  });
});

})();