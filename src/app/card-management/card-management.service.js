(function(){
'use strict';
angular.module('cardManagementModule').service('CardManagementService',['UserProfileService','CreditCardRepositoryService','TransactionService','$q',function(UserProfileService,CreditCardRepositoryService,TransactionService,$q){
this.getUserCardPortfolio=function(){
var deferred=$q.defer();
UserProfileService.getUserCardIds().then(function(cardIds){
if(!cardIds||cardIds.length===0){
deferred.resolve({userId:null,cards:[],totalCreditLimit:0,totalOutstanding:0});
return;}
var cardPromises=cardIds.map(function(cardId){
return $q.all({details:CreditCardRepositoryService.getCardDetails(cardId),spend:TransactionService.getCardWiseSpend(cardId)}).then(function(result){
return angular.extend({},result.details,{cardWiseSpend:result.spend});});});
$q.all(cardPromises).then(function(cards){
var totalLimit=cards.reduce(function(sum,card){return sum+(card.creditLimit||0);},0);
var totalOutstanding=cards.reduce(function(sum,card){return sum+(card.currentBalance||0);},0);
deferred.resolve({userId:'current',cards:cards,totalCreditLimit:totalLimit,totalOutstanding:totalOutstanding});},function(error){
console.error('Error fetching card portfolio:',error);
deferred.reject(error);});},function(error){
console.error('Error fetching user card IDs:',error);
deferred.reject(error);});
return deferred.promise;};
this.getCardDetails=function(cardId){
var deferred=$q.defer();
$q.all({details:CreditCardRepositoryService.getCardDetails(cardId),spend:TransactionService.getCardWiseSpend(cardId)}).then(function(result){
deferred.resolve(angular.extend({},result.details,{cardWiseSpend:result.spend}));},function(error){
console.error('Error fetching card details:',error);
deferred.reject(error);});
return deferred.promise;};
}]);
})();