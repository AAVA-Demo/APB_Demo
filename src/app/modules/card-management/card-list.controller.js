(function(){
'use strict';
angular.module('app.cardManagement')
.controller('CardListController',['$scope','$location','CardManagementService','UserProfileService',function($scope,$location,CardManagementService,UserProfileService){
var vm=this;
vm.cards=[];
vm.loading=true;
vm.error=null;
vm.totalCards=0;
function init(){
UserProfileService.getCurrentUser()
.then(function(user){
return CardManagementService.getAllCards(user.userId);
})
.then(function(response){
vm.cards=response.cards;
vm.totalCards=response.totalCards;
vm.loading=false;
})
.catch(function(err){
vm.error='Failed to load credit cards';
vm.loading=false;
});
}
vm.viewCardDetail=function(cardId){
$location.path('/cards/'+cardId);
};
vm.getCardStatusClass=function(card){
var utilization=(card.currentBalance/card.creditLimit)*100;
if(utilization>=70)return 'panel-danger';
if(utilization>=30)return 'panel-warning';
return 'panel-success';
};
init();
}]);
})();