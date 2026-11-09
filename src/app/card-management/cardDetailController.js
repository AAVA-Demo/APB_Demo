(function(){
'use strict';
angular.module('cardManagementModule').controller('cardDetailController',['cardDataService','$routeParams',function(cardDataService,$routeParams){
var vm=this;
vm.card=null;
vm.loading=true;
vm.error=null;
function init(){
var cardId=$routeParams.cardId;
cardDataService.getCardById(cardId).then(function(card){
vm.card=card;
vm.loading=false;
},function(error){
vm.error='Failed to load card details';
vm.loading=false;
});
}
init();
}]);
})();