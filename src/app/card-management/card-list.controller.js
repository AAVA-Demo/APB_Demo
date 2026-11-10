(function(){
'use strict';
angular.module('cardManagementModule').controller('CardListController',['CardManagementService','$scope','$filter',function(CardManagementService,$scope,$filter){
var vm=this;
vm.portfolio={};
vm.filteredCards=[];
vm.loading=true;
vm.error=null;
vm.filterText='';
vm.sortBy='cardHolderName';
function loadPortfolio(){
vm.loading=true;
CardManagementService.getUserCardPortfolio().then(function(portfolio){
vm.portfolio=portfolio;
vm.filteredCards=portfolio.cards;
vm.loading=false;},function(error){
vm.error='Failed to load credit cards. Please try again.';
vm.loading=false;});}
loadPortfolio();
vm.applyFilter=function(){
var filtered=$filter('filter')(vm.portfolio.cards,vm.filterText);
vm.filteredCards=$filter('orderBy')(filtered,vm.sortBy);};
$scope.$watch('vm.filterText',function(){
vm.applyFilter();});
$scope.$watch('vm.sortBy',function(){
vm.applyFilter();});
}]);
})();