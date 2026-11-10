(function() {
'use strict';
angular.module('app.cardManagement')
.controller('CardListController', ['CardManagementService', '$scope', '$location', function(CardManagementService, $scope, $location) {
var vm = this;
vm.cards = [];
vm.loading = true;
vm.error = null;
vm.filterText = '';
vm.filterCriteria = {};
function loadCards() {
vm.loading = true;
CardManagementService.getAllCards().then(function(cards) {
vm.cards = cards;
vm.loading = false;
}).catch(function(err) {
vm.error = 'Failed to load credit cards';
vm.loading = false;
console.error('Card Load Error:', err);
});
}
vm.selectCard = function(cardId) {
$location.path('/cards/' + cardId);
};
loadCards();
}]);
})();