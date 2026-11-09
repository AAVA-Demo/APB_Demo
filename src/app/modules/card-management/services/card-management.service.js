(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('cardManagementService', CardManagementService);
  CardManagementService.$inject = ['$http', '$q', '$cacheFactory', 'cardInfoService', 'cardAggregationService'];
  function CardManagementService($http, $q, $cacheFactory, cardInfoService, cardAggregationService) {
    var service = this;
    var cache = $cacheFactory('cardCache');
    service.loadCardPortfolio = function(cardIds) {
      var deferred = $q.defer();
      var promises = [];
      angular.forEach(cardIds, function(item) {
        var cardId = item.cardId || item;
        promises.push(cardInfoService.getCardDetails(cardId));
      });
      $q.all(promises).then(function(cards) {
        var portfolio = {
          userId: 'user123',
          cards: cards,
          totalCreditLimit: 0,
          totalAvailableCredit: 0,
          totalOutstanding: 0
        };
        angular.forEach(cards, function(card) {
          portfolio.totalCreditLimit += card.creditLimit || 0;
          portfolio.totalAvailableCredit += card.availableCredit || 0;
          portfolio.totalOutstanding += card.outstandingBalance || 0;
        });
        deferred.resolve(portfolio);
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
    service.getCardAnalysis = function(cardId) {
      var cached = cache.get(cardId);
      if (cached) {
        return $q.resolve(cached);
      }
      return cardAggregationService.getCardSpendAnalysis(cardId).then(function(analysis) {
        cache.put(cardId, analysis);
        return analysis;
      });
    };
  }
})();