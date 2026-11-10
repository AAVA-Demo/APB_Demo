(function() {
'use strict';
angular.module('app.cardManagement')
.service('CardManagementService', ['CardRepositoryService', 'CardSpendingService', '$q', function(CardRepositoryService, CardSpendingService, $q) {
this.getAllCards = function() {
var deferred = $q.defer();
CardRepositoryService.fetchAllCards().then(function(cards) {
var enrichPromises = cards.map(function(card) {
return CardSpendingService.getCardSpending(card.cardId).then(function(spending) {
card.spending = spending;
return card;
}).catch(function() {
card.spending = null;
return card;
});
});
$q.all(enrichPromises).then(function(enrichedCards) {
deferred.resolve(enrichedCards);
});
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
this.getCardDetails = function(cardId) {
var deferred = $q.defer();
$q.all([
CardRepositoryService.getCardById(cardId),
CardSpendingService.getCardSpending(cardId),
CardSpendingService.getRecentTransactions(cardId)
]).then(function(results) {
var cardDetails = {
card: results[0],
spending: results[1],
recentTransactions: results[2]
};
deferred.resolve(cardDetails);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();