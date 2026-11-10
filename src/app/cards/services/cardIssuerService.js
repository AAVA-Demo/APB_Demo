(function() {
  'use strict';
  angular.module('creditCardApp.cards')
    .service('cardIssuerService', ['$http', '$q', 'ISSUER_API_CONFIG', function($http, $q, ISSUER_API_CONFIG) {
      var self = this;
      var mockMetadata = {
        c1: {benefits: 'Cashback 2%', rewardsProgram: 'Chase Rewards'},
        c2: {benefits: 'Travel Miles', rewardsProgram: 'Citi ThankYou'},
        c3: {benefits: 'Membership Rewards', rewardsProgram: 'Amex Points'}
      };
      self.getCardMetadata = function(cardId) {
        return $q.resolve(mockMetadata[cardId] || {});
      };
    }]);
})();