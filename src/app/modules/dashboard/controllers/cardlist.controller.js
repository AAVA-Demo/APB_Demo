(function(){
'use strict';
angular.module('app.dashboard').controller('CardListController',['$scope','CreditCardService','$filter',function($scope,CreditCardService,$filter){
var vm=this;
vm.cards=[];
vm.filteredCards=[];
vm.searchText='';
var userId='user123';
vm.init=function(){
CreditCardService.getCardList(userId).then(function(data){
vm.cards=data;
vm.filteredCards=data;
},function(error){
console.error('Failed to load card list',error);
});
};
vm.filterCards=function(){
if(!vm.searchText){
vm.filteredCards=vm.cards;
}else{
vm.filteredCards=$filter('filter')(vm.cards,vm.searchText);
}
};
vm.init();
}]);
})();