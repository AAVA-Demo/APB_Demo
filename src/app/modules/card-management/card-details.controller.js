(function(){
'use strict';
angular.module('app.cardManagement').controller('CardDetailsController',CardDetailsController);
CardDetailsController.$inject=['CardService','$routeParams','$scope'];
function CardDetailsController(CardService,$routeParams,$scope){
var vm=this;
vm.card=null;
vm.spend=null;
vm.loading=true;
vm.error=null;
function init(){
var cardId=$routeParams.cardId;
CardService.getCardDetails(cardId).then(function(data){
vm.card=data.card;
vm.spend=data.spend;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load card details. Please try again.';
vm.loading=false;
});
}
init();
}
})();