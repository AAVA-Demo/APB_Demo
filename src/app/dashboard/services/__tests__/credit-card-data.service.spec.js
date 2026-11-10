/*
Test Documentation:
- Test Name: CreditCardDataService - getCardSummary success
- Purpose: Validates successful retrieval of card summary data
- Scenario: Normal scenario with successful API response
- Expected Result: Returns card summary data
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardSummary error
- Purpose: Validates error handling when API call fails
- Scenario: Error scenario with API failure
- Expected Result: Error is logged and promise is rejected
*/
/*
Coverage Report:
- Functions tested: getCardSummary
- Scenarios covered: successful API call, API error, network error
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('CreditCardDataService', function() {
    var CreditCardDataService, $httpBackend;

    beforeEach(module('app.dashboard'));

    beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_) {
      CreditCardDataService = _CreditCardDataService_;
      $httpBackend = _$httpBackend_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getCardSummary', function() {
      it('should fetch card summary successfully', function() {
        var mockResponse = {
          totalCreditLimit: 10000,
          totalAvailableCredit: 8500
        };

        $httpBackend.expectGET('/api/cards/summary').respond(200, mockResponse);

        var result;
        CreditCardDataService.getCardSummary().then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
      });

      it('should handle API error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards/summary').respond(500, 'Server Error');

        var error;
        CreditCardDataService.getCardSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should handle network error', function() {
        spyOn(console, 'error');
        $httpBackend.expectGET('/api/cards/summary').respond(0, '');

        var error;
        CreditCardDataService.getCardSummary().catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(console.error).toHaveBeenCalled();
      });

      it('should make GET request to correct endpoint', function() {
        $httpBackend.expectGET('/api/cards/summary').respond(200, {});
        CreditCardDataService.getCardSummary();
        $httpBackend.flush();
      });
    });
  });
})();