(function() {
'use strict';
angular.module('app.cardManagement')
.controller('CardDetailController', ['CardManagementService', '$scope', '$routeParams', '$location', function(CardManagementService, $scope, $routeParams, $location) {
var vm = this;
vm.cardDetails = null;
vm.loading = true;
vm.error = null;
var cardId = $routeParams.cardId;
function loadCardDetails() {
vm.loading = true;
CardManagementService.getCardDetails(cardId).then(function(details) {
vm.cardDetails = details;
vm.loading = false;
}).catch(function(err) {
vm.error = 'Failed to load card details';
vm.loading = false;
console.error('Card Detail Load Error:', err);
});
}
vm.goBack = function() {
$location.path('/cards');
};
loadCardDetails();
}]);
})();