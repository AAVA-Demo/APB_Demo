(function() {
'use strict';
angular.module('multiCardManagement.module')
.service('CardComparisonService', [function() {
var self = this;
self.compareCards = function(cards) {
if (!cards || cards.length < 2) {
return null;
}
var highestLimit = cards.reduce(function(max, card) {
return card.creditLimit > max.creditLimit ? card : max;
}, cards[0]);
var lowestUtilization = cards.reduce(function(min, card) {
var util = card.outstandingBalance / card.creditLimit;
var minUtil = min.outstandingBalance / min.creditLimit;
return util < minUtil ? card : min;
}, cards[0]);
var highestSpend = cards.reduce(function(max, card) {
return (card.cardWiseSpend || 0) > (max.cardWiseSpend || 0) ? card : max;
}, cards[0]);
return {
cards: cards,
comparisonMetrics: {
highestLimit: {cardId: highestLimit.cardId, limit: highestLimit.creditLimit, cardNumber: highestLimit.cardNumber},
lowestUtilization: {cardId: lowestUtilization.cardId, utilization: ((lowestUtilization.outstandingBalance / lowestUtilization.creditLimit) * 100).toFixed(1), cardNumber: lowestUtilization.cardNumber},
highestSpend: {cardId: highestSpend.cardId, spend: highestSpend.cardWiseSpend || 0, cardNumber: highestSpend.cardNumber}
}
};
};
}]);
})();