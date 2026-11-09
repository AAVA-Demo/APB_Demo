(function(){
'use strict';
angular.module('cardManagement').controller('cardListController',['$scope','cardManagementService','cardFilterFilter',function($scope,cardManagementService,cardFilterFilter){
var vm=this;
vm.cards=[];
vm.filteredCards=[];
vm.loading=true;
vm.error=null;
vm.searchTerm='';
vm.filterCards=filterCards;
function init(){
loadCards();
}
function loadCards(){
vm.loading=true;
vm.error=null;
cardManagementService.getAllCards().then(function(data){
vm.cards=data;
vm.filteredCards=data;
vm.loading=false;
},function(error){
vm.error='Failed to load credit cards. Please try again.';
vm.loading=false;
});
}
function filterCards(){
vm.filteredCards=cardFilterFilter(vm.cards,vm.searchTerm);
}
$scope.$watch('vm.searchTerm',function(){
vm.filterCards();
});
init();
}]);
})();