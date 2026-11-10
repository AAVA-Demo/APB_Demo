(function() {
  'use strict';
  angular.module('app.dashboard')
    .service('DashboardService', ['$q', 'AuthService', 'CreditCardDataFactory', 'TransactionProcessingFactory', 'KPIAggregationService', function($q, AuthService, CreditCardDataFactory, TransactionProcessingFactory, KPIAggregationService) {
      var self = this;
      self.loadKPIs = function() {
        var deferred = $q.defer();
        AuthService.validateSession().then(function(authData) {
          return $q.all({
            cards: CreditCardDataFactory.getCards('user-001'),
            transactions: TransactionProcessingFactory.getMonthlyTransactions()
          });
        }).then(function(data) {
          var kpis = KPIAggregationService.calculateKPIs(data.cards, data.transactions);
          deferred.resolve({ kpis: kpis, cards: data.cards });
        }).catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();