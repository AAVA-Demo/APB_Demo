angular.module('creditCardApp').service('cardRepositoryService',['$http','$q',function($http,$q){
var service=this;
var mockCards=[
{cardId:'card1',cardNumber:'****1234',cardType:'Visa',creditLimit:5000,availableCredit:3500,outstandingAmount:1500,lastUpdated:new Date()},
{cardId:'card2',cardNumber:'****5678',cardType:'Mastercard',creditLimit:10000,availableCredit:7000,outstandingAmount:3000,lastUpdated:new Date()},
{cardId:'card3',cardNumber:'****9012',cardType:'Amex',creditLimit:15000,availableCredit:12000,outstandingAmount:3000,lastUpdated:new Date()}
];
service.getUserCards=function(userId){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({cardIds:mockCards.map(function(c){return c.cardId;})});
},300);
return deferred.promise;
};
service.getCardDetails=function(cardId){
var deferred=$q.defer();
setTimeout(function(){
var card=mockCards.find(function(c){return c.cardId===cardId;});
if(card){
deferred.resolve(card);
}else{
deferred.reject('Card not found');
}
},200);
return deferred.promise;
};
}]);