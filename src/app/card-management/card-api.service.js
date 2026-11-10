(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('CardApiService', ['$q', 'UserProfileService', 'CardDataService', 'CardTransactionService', function($q, UserProfileService, CardDataService, CardTransactionService) {
      this.fetchAllCards = function() {
        return UserProfileService.getUserCards().then(function(cardIds) {
          const promises = cardIds.map(function(cardId) {
            return $q.all({
              details: CardDataService.getCardDetails(cardId),
              spending: CardTransactionService.getCardSpending(cardId)
            }).then(function(result) {
              return angular.extend({}, result.details, result.spending);
            });
          });
          return $q.all(promises);
        });
      };
    }]);
})();