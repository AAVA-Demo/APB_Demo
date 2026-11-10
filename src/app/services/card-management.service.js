(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardManagementService', ['$http', '$q', 'CreditCardService', 'TransactionService', function($http, $q, CreditCardService, TransactionService) {
    return {
      getAllCards: function(userId) {
        return CreditCardService.getAllCards(userId);
      },
      getCardDetails: function(cardId) {
        const deferred = $q.defer();
        $q.all({
          card: CreditCardService.getCardById(cardId),
          transactions: TransactionService.getTransactionsByCard(cardId)
        }).then(function(results) {
          const cardDetail = angular.extend({}, results.card, {
            transactions: results.transactions,
            monthlySpend: results.transactions
              .filter(t => {
                const tDate = new Date(t.date);
                const now = new Date();
                return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
              })
              .reduce((sum, t) => sum + t.amount, 0),
            dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            minimumPayment: results.card.currentBalance * 0.05
          });
          deferred.resolve(cardDetail);
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
    };
  }]);
})();