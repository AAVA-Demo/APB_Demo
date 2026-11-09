(function(){
'use strict';
angular.module('cardManagement').controller('cardDetailController',['$routeParams','cardManagementService',function($routeParams,cardManagementService){
var vm=this;
vm.card=null;
vm.spending=null;
vm.loading=true;
vm.error=null;
function init(){
loadCardDetail();
}
function loadCardDetail(){
vm.loading=true;
vm.error=null;
var cardId=$routeParams.cardId;
cardManagementService.getCardDetail(cardId).then(function(data){
vm.card=data.card;
vm.spending=data.spending;
vm.loading=false;
},function(error){
vm.error='Failed to load card details. Please try again.';
vm.loading=false;
});
}
init();
}]);
})();