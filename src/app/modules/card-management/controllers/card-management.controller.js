(function(){
'use strict';
angular.module('creditCard.management').controller('CardManagementController',['$scope','$routeParams','$location','CardManagementService',function($scope,$routeParams,$location,CardManagementService){
const vm=this;
vm.cards=[];
vm.selectedCard=null;
vm.loading=true;
vm.error=null;
vm.filterText='';
vm.loadCards=function(){
vm.loading=true;
vm.error=null;
CardManagementService.getAllCards().then(function(data){
vm.cards=data;
if($routeParams.cardId){
vm.selectedCard=vm.cards.find(function(c){return c.cardId===$routeParams.cardId;});
}
vm.loading=false;
},function(err){
vm.error='Failed to load card data. Please try again.';
vm.loading=false;
});
};
vm.selectCard=function(card){
$location.path('/cards/'+card.cardId);
};
vm.backToList=function(){
$location.path('/cards');
};
vm.loadCards();
}]);
})();