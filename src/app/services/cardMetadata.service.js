(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardMetadataService', ['ApiGatewayService', function(ApiGatewayService) {
      this.getCardMetadata = function(cardId) {
        return ApiGatewayService.get('/cards/' + cardId + '/metadata')
          .catch(function(error) {
            return {
              cardId: cardId,
              cardType: 'Credit Card',
              issuer: 'Bank',
              brandingUrl: '',
              rewardsProgram: 'Cash Back',
              annualFee: 0
            };
          });
      };
    }]);
})();