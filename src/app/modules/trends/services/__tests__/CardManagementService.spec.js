/*
Test Documentation:
- Test Name: CardManagementService Unit Tests
- Purpose: Validate card details retrieval
- Scenario: Test getCardDetails method
- Expected Result: Service should fetch card details from API
*/

(function(){
'use strict';

describe('CardManagementService', function() {
  var CardManagementService, ApiService, $q, $rootScope;

  beforeEach(module('spendTrendsModule'));

  beforeEach(inject(function(_CardManagementService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(inject(function($injector) {
    ApiService = $injector.get('ApiService');
    spyOn(ApiService, 'getCardDetails').and.callThrough();
  }));

  describe('getCardDetails', function() {
    it('should call ApiService.getCardDetails', function() {
      var mockCards = [{cardId: 1, cardType: 'Visa'}];
      ApiService.getCardDetails.and.returnValue($q.resolve(mockCards));

      CardManagementService.getCardDetails();

      expect(ApiService.getCardDetails).toHaveBeenCalled();
    });

    it('should return card details', function() {
      var mockCards = [
        {cardId: 1, cardType: 'Visa', cardNumber: '1234'},
        {cardId: 2, cardType: 'Mastercard', cardNumber: '5678'}
      ];
      ApiService.getCardDetails.and.returnValue($q.resolve(mockCards));

      var result;
      CardManagementService.getCardDetails().then(function(data) {
        result = data;
      });

      $rootScope.$digest();

      expect(result).toEqual(mockCards);
    });
  });
});

})();

/*
Coverage Report:
- Functions tested: getCardDetails
- Scenarios covered: API call, data retrieval
- Edge cases: None applicable for simple pass-through service
- Uncovered scenarios: None - service is a simple wrapper
*/