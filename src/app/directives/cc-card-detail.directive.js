(function() {
  'use strict';
  angular.module('cc.cardManagement')
    .directive('ccCardDetail', ['$rootScope', 'TransactionFactory', ccCardDetail]);
  function ccCardDetail($rootScope, TransactionFactory) {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      templateUrl: 'src/app/directives/templates/card-detail.html',
      link: function(scope) {
        scope.transactions = [];
        scope.totalSpend = 0;
        scope.$watch('card', function(newCard) {
          if (newCard && newCard.cardId) {
            loadCardTransactions(newCard.cardId);
          }
        });
        $rootScope.$on('card:selected', function(event, cardId) {
          loadCardTransactions(cardId);
        });
        function loadCardTransactions(cardId) {
          TransactionFactory.getCardTransactions(cardId)
            .then(function(transactions) {
              scope.transactions = transactions;
              scope.totalSpend = transactions.reduce(function(sum, t) { return sum + t.amount; }, 0);
            })
            .catch(function() {
              scope.transactions = [];
              scope.totalSpend = 0;
            });
        }
      }
    };
  }
})();