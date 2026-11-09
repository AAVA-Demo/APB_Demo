(function(){
'use strict';
angular.module('creditCardApp').controller('CardListController',['$scope','$location','CardManagementService','UserProfileFactory',function($scope,$location,CardManagementService,UserProfileFactory){
var vm=this;
vm.cards=[];
vm.loading=true;
vm.selectedCardId=null;
vm.init=function(){
UserProfileFactory.getUserProfile().then(function(profile){
var cardIds=profile.cardIds||[];
return CardManagementService.getCards(cardIds);
}).then(function(cards){
vm.cards=cards;
vm.loading=false;
$scope.$apply();
}).catch(function(){
vm.loading=false;
$scope.$apply();
});
};
vm.selectCard=function(cardId){
$location.path('/cards/'+cardId);
};
vm.init();
}]);