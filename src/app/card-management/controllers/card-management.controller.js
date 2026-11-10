(function(){
'use strict';
angular.module('app.cardManagement').controller('CardManagementController',['CardManagementService','$scope','$filter',function(CardManagementService,$scope,$filter){
var vm=this;
vm.portfolio={};
vm.filteredCards=[];
vm.selectedCard=null;
vm.cardDetails=null;
vm.loading=true;
vm.error=null;
vm.statusFilter='All';
function loadPortfolio(){
CardManagementService.getCardPortfolio().then(function(data){
vm.portfolio=data;
vm.filteredCards=data.cards;
vm.loading=false;
},function(err){
vm.error='Failed to load card portfolio';
vm.loading=false;
});
}
vm.filterByStatus=function(status){
vm.statusFilter=status;
if(status==='All'){
vm.filteredCards=vm.portfolio.cards;
}else{
vm.filteredCards=$filter('filter')(vm.portfolio.cards,{status:status});
}
};
vm.selectCard=function(card){
vm.selectedCard=card;
vm.cardDetails=null;
CardManagementService.getCardDetails(card.cardId).then(function(details){
vm.cardDetails=details;
});
};
vm.clearSelection=function(){
vm.selectedCard=null;
vm.cardDetails=null;
};
loadPortfolio();
}]);
})();