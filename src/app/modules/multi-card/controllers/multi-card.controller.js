(function() {
'use strict';
angular.module('multiCardManagement.module')
.controller('MultiCardController', ['$scope', 'CardManagementService', 'CardComparisonService', function($scope, CardManagementService, CardComparisonService) {
var vm = this;
vm.cards = [];
vm.filteredCards = [];
vm.selectedCards = [];
vm.comparisonData = null;
vm.loading = true;
vm.error = null;
vm.filterCriteria = {
cardType: '',
issuer: '',
status: ''
};
function loadCards() {
vm.loading = true;
CardManagementService.getUserCards('user123').then(function(cards) {
vm.cards = cards;
vm.filteredCards = cards;
vm.loading = false;
}).catch(function(error) {
vm.error = 'Failed to load cards: ' + (error.message || error);
vm.loading = false;
});
}
vm.toggleCardSelection = function(card) {
var idx = vm.selectedCards.indexOf(card);
if (idx > -1) {
vm.selectedCards.splice(idx, 1);
} else {
vm.selectedCards.push(card);
}
};
vm.isCardSelected = function(card) {
return vm.selectedCards.indexOf(card) > -1;
};
vm.compareCards = function() {
if (vm.selectedCards.length < 2) {
alert('Please select at least 2 cards to compare');
return;
}
vm.comparisonData = CardComparisonService.compareCards(vm.selectedCards);
};
vm.clearComparison = function() {
vm.comparisonData = null;
vm.selectedCards = [];
};
vm.applyFilter = function() {
vm.filteredCards = vm.cards.filter(function(card) {
var matchType = !vm.filterCriteria.cardType || card.cardType === vm.filterCriteria.cardType;
var matchIssuer = !vm.filterCriteria.issuer || card.issuerName === vm.filterCriteria.issuer;
var matchStatus = !vm.filterCriteria.status || card.status === vm.filterCriteria.status;
return matchType && matchIssuer && matchStatus;
});
};
vm.clearFilter = function() {
vm.filterCriteria = {cardType: '', issuer: '', status: ''};
vm.filteredCards = vm.cards;
};
loadCards();
}]);
})();