angular.module('cardManagementModule').controller('CardManagementController',['$scope','cardManagementService',function($scope,cardManagementService){
var vm=this;
vm.cards=[];
vm.loading=true;
vm.error=null;
cardManagementService.getAllCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
},function(error){
vm.error='Failed to load card data';
vm.loading=false;
});
}]);