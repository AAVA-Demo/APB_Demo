(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardService', ['$http', '$q', '$interval', CreditCardService]);
  function CreditCardService($http, $q, $interval) {
    var vm = this;
    var cache = null;
    var refreshInterval = null;
    vm.getCreditCards = function() {
      if (cache) return $q.resolve(cache);
      return $http.get('/api/creditcards').then(function(response) {
        cache = response.data.map(function(card) {
          return {
            cardId: card.cardId,
            cardNumber: card.cardNumber,
            issuer: card.issuer,
            creditLimit: card.creditLimit,
            outstandingBalance: card.outstandingBalance,
            availableCredit: card.creditLimit - card.outstandingBalance,
            monthlySpend: card.monthlySpend || 0
          };
        });
        return cache;
      }).catch(function(error) {
        console.error('Error fetching credit cards:', error);
        return cache || [];
      });
    };
    vm.startAutoRefresh = function(callback) {
      refreshInterval = $interval(function() {
        cache = null;
        vm.getCreditCards().then(callback);
      }, 600000);
    };
    vm.stopAutoRefresh = function() {
      if (refreshInterval) {
        $interval.cancel(refreshInterval);
        refreshInterval = null;
      }
    };
  }
})();