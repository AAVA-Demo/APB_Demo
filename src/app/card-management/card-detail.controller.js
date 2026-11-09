(function(){
'use strict';
angular.module('creditCardApp').controller('CardDetailController',['$scope','$routeParams','$location','CardManagementService',function($scope,$routeParams,$location,CardManagementService){
var vm=this;
vm.card=null;
vm.loading=true;
vm.cardId=$routeParams.cardId;
vm.init=function(){
if(!vm.cardId){
$location.path('/cards');
return;
}
CardManagementService.getCardDetails(vm.cardId).then(function(card){
vm.card=card;
vm.loading=false;
$scope.$apply();
}).catch(function(){
vm.loading=false;
$scope.$apply();
});
};
vm.goBack=function(){
$location.path('/cards');
};
vm.init();
}]);