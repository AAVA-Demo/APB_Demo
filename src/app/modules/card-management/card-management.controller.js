(function(){
'use strict';
angular.module('app.cardManagement').controller('CardManagementController',['$scope','$location','CardService',function($scope,$location,CardService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.cards=[];
vm.viewCardDetail=viewCardDetail;
function init(){
vm.loading=true;
vm.error=null;
CardService.getAllCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
}).catch(function(error){
vm.error=error.message||'Failed to load cards';
vm.loading=false;
});
}
function viewCardDetail(cardId){
$location.path('/cards/'+cardId);
}
init();
}]);
})();