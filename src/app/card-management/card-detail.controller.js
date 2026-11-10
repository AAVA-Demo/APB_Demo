(function(){
'use strict';
angular.module('cardManagementModule').controller('CardDetailController',['CardManagementService','$routeParams','$scope',function(CardManagementService,$routeParams,$scope){
var vm=this;
vm.card={};
vm.loading=true;
vm.error=null;
function loadCardDetails(){
vm.loading=true;
var cardId=$routeParams.cardId;
CardManagementService.getCardDetails(cardId).then(function(card){
vm.card=card;
vm.loading=false;},function(error){
vm.error='Failed to load card details. Please try again.';
vm.loading=false;});}
loadCardDetails();
}]);
})();