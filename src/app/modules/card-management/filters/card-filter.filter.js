(function() {
'use strict';
angular.module('app.cardManagement')
.filter('cardFilter', [function() {
return function(cards, filterText) {
if (!filterText) return cards;
var filtered = [];
var lowerFilter = filterText.toLowerCase();
cards.forEach(function(card) {
if ((card.cardType && card.cardType.toLowerCase().indexOf(lowerFilter) !== -1) ||
(card.cardNumber && card.cardNumber.toLowerCase().indexOf(lowerFilter) !== -1) ||
(card.cardHolderName && card.cardHolderName.toLowerCase().indexOf(lowerFilter) !== -1)) {
filtered.push(card);
}
});
return filtered;
};
}]);
})();