angular.module('creditCardApp').service('creditCardDataService',['$http','$q',function($http,$q){
var service=this;
var mockCards=[
{cardId:'card1',cardNumber:'****1234',cardType:'Visa',creditLimit:5000,outstandingBalance:1500,availableCredit:3500,expiryDate:'12/25'},
{cardId:'card2',cardNumber:'****5678',cardType:'Mastercard',creditLimit:10000,outstandingBalance:3000,availableCredit:7000,expiryDate:'06/26'},
{cardId:'card3',cardNumber:'****9012',cardType:'Amex',creditLimit:15000,outstandingBalance:3000,availableCredit:12000,expiryDate:'09/27'}
];
service.getCardDetails=function(cardId){
var deferred=$q.defer();
setTimeout(function(){
var card=mockCards.find(function(c){return c.cardId===cardId;});
if(card){
deferred.resolve({cardDetails:card});
}else{
deferred.reject('Card not found');
}
},200);
return deferred.promise;
};
}]);