(function(){
'use strict';
angular.module('app.cardManagement')
.controller('CardDetailController',['$scope','$routeParams','$location','CardManagementService',function($scope,$routeParams,$location,CardManagementService){
var vm=this;
vm.card=null;
vm.loading=true;
vm.error=null;
vm.cardId=$routeParams.cardId;
function init(){
if(!vm.cardId){
$location.path('/cards');
return;
}
loadCardDetails();
}
function loadCardDetails(){
vm.loading=true;
vm.error=null;
CardManagementService.getCardDetails(vm.cardId)
.then(function(card){
vm.card=card;
vm.loading=false;
})
.catch(function(err){
vm.error='Failed to load card details';
vm.loading=false;
});
}
vm.goBack=function(){
$location.path('/cards');
};
vm.getCreditUtilization=function(){
if(!vm.card||vm.card.creditLimit===0)return 0;
return((vm.card.currentBalance/vm.card.creditLimit)*100).toFixed(2);
};
vm.getUtilizationClass=function(){
var util=vm.getCreditUtilization();
if(util>=70)return 'danger';
if(util>=30)return 'warning';
return 'success';
};
init();
}]);
})();