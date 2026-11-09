(function(){
'use strict';
angular.module('creditCardApp').controller('cardManagementController',['$scope','$routeParams','$location','cardManagementService',function($scope,$routeParams,$location,cardManagementService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.cardPortfolio=null;
vm.selectedCard=null;
vm.init=function(){
if($routeParams.cardId){
vm.loadCardDetails($routeParams.cardId);
}else{
vm.loadCardPortfolio();
}
};
vm.loadCardPortfolio=function(){
cardManagementService.getCardPortfolio().then(function(portfolio){
vm.cardPortfolio=portfolio;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load card portfolio';
vm.loading=false;
});
};
vm.loadCardDetails=function(cardId){
cardManagementService.getCardDetails(cardId).then(function(cardDetails){
vm.selectedCard=cardDetails;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load card details';
vm.loading=false;
});
};
vm.showCardDetails=function(cardId){
$location.path('/cards/'+cardId);
};
vm.backToPortfolio=function(){
$location.path('/cards');
};
vm.init();
}]);
})();