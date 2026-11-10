/*
Test Documentation:
- Test Name: CardMetadataService Test Suite
- Purpose: Validate card metadata retrieval functionality
- Scenario: Tests metadata fetching via API with fallback to mock data on errors
- Expected Result: Service should retrieve card metadata or return mock data on failure
*/

(function() {
  'use strict';

  describe('CardMetadataService', function() {
    var CardMetadataService, ApiGatewayService, $rootScope, $q;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CardMetadataService_, _ApiGatewayService_, _$rootScope_, _$q_) {
      CardMetadataService = _CardMetadataService_;
      ApiGatewayService = _ApiGatewayService_;
      $rootScope = _$rootScope_;
      $q = _$q_;
    }));

    describe('getCardMetadata', function() {
      it('should call ApiGatewayService.get with correct endpoint', function() {
        var cardId = 'card-123';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        CardMetadataService.getCardMetadata(cardId);

        expect(ApiGatewayService.get).toHaveBeenCalledWith('/cards/' + cardId + '/metadata');
      });

      it('should return API data when request succeeds', function() {
        var cardId = 'card-456';
        var apiResponse = {
          cardId: cardId,
          cardType: 'Platinum Credit Card',
          issuer: 'Chase Bank',
          brandingUrl: 'https://example.com/logo.png',
          rewardsProgram: 'Ultimate Rewards',
          annualFee: 95
        };

        spyOn(ApiGatewayService, 'get').and.returnValue($q.resolve(apiResponse));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toEqual(apiResponse);
      });

      it('should return mock data when API request fails', function() {
        var cardId = 'card-789';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 404 }));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
        expect(result.cardType).toBe('Credit Card');
        expect(result.issuer).toBe('Bank');
      });

      it('should include all required fields in mock data', function() {
        var cardId = 'card-mock';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.cardId).toBeDefined();
        expect(result.cardType).toBeDefined();
        expect(result.issuer).toBeDefined();
        expect(result.brandingUrl).toBeDefined();
        expect(result.rewardsProgram).toBeDefined();
        expect(result.annualFee).toBeDefined();
      });

      it('should set correct mock values', function() {
        var cardId = 'card-values';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.cardType).toBe('Credit Card');
        expect(result.issuer).toBe('Bank');
        expect(result.brandingUrl).toBe('');
        expect(result.rewardsProgram).toBe('Cash Back');
        expect(result.annualFee).toBe(0);
      });

      it('should return promise', function() {
        var cardId = 'card-promise';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var promise = CardMetadataService.getCardMetadata(cardId);
        expect(promise.then).toBeDefined();
        expect(typeof promise.then).toBe('function');
      });

      it('should handle network errors gracefully', function() {
        var cardId = 'card-network-error';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: 500, message: 'Server Error' }));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
      });

      it('should handle timeout errors', function() {
        var cardId = 'card-timeout';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject({ status: -1, message: 'Timeout' }));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result).toBeDefined();
        expect(result.cardId).toBe(cardId);
      });
    });

    describe('integration scenarios', function() {
      it('should work with different card IDs', function() {
        var cardIds = ['card-1', 'card-2', 'card-3'];
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        cardIds.forEach(function(cardId) {
          var result;
          CardMetadataService.getCardMetadata(cardId).then(function(data) {
            result = data;
          });
          $rootScope.$digest();

          expect(result.cardId).toBe(cardId);
        });
      });

      it('should handle empty cardId', function() {
        var cardId = '';
        spyOn(ApiGatewayService, 'get').and.returnValue($q.reject('error'));

        var result;
        CardMetadataService.getCardMetadata(cardId).then(function(data) {
          result = data;
        });
        $rootScope.$digest();

        expect(result.cardId).toBe('');
      });
    });
  });

})();

/*
Coverage Report:
- Functions tested: getCardMetadata()
- Scenarios covered:
  * API Gateway service invocation
  * Successful API response handling
  * API failure with mock data fallback
  * All required fields in mock data
  * Correct mock values
  * Promise return validation
  * Network error handling
  * Timeout error handling
  * Multiple card IDs
  * Empty card ID handling
- Uncovered scenarios: Caching mechanism, rate limiting, batch metadata retrieval
*/