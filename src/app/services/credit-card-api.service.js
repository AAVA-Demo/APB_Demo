(function(){
'use strict';
angular.module('creditCardApp')
.service('CreditCardApiService',['$http','$q','AuthService',function($http,$q,AuthService){
var self=this;
var BASE_URL='/api';
function getHeaders(){
return{Authorization:'Bearer '+AuthService.getToken()};
}
self.getCards=function(userId){
var deferred=$q.defer();
var mockCards=[
{cardId:'card1',userId:userId,cardType:'Visa Platinum',cardNumber:'1234',creditLimit:100000,currentBalance:25000,availableBalance:75000,outstandingAmount:25000,monthlySpend:15000,issueDate:new Date('2022-01-15'),expiryDate:new Date('2027-01-31')},
{cardId:'card2',userId:userId,cardType:'Mastercard Gold',cardNumber:'5678',creditLimit:75000,currentBalance:30000,availableBalance:45000,outstandingAmount:30000,monthlySpend:12000,issueDate:new Date('2021-06-10'),expiryDate:new Date('2026-06-30')},
{cardId:'card3',userId:userId,cardType:'Amex Blue',cardNumber:'9012',creditLimit:50000,currentBalance:10000,availableBalance:40000,outstandingAmount:10000,monthlySpend:8000,issueDate:new Date('2023-03-20'),expiryDate:new Date('2028-03-31')},
{cardId:'card4',userId:userId,cardType:'Visa Signature',cardNumber:'3456',creditLimit:150000,currentBalance:45000,availableBalance:105000,outstandingAmount:45000,monthlySpend:20000,issueDate:new Date('2020-11-05'),expiryDate:new Date('2025-11-30')},
{cardId:'card5',userId:userId,cardType:'Mastercard Titanium',cardNumber:'7890',creditLimit:200000,currentBalance:80000,availableBalance:120000,outstandingAmount:80000,monthlySpend:35000,issueDate:new Date('2022-08-12'),expiryDate:new Date('2027-08-31')}
];
deferred.resolve(mockCards);
return deferred.promise;
};
self.getCardById=function(cardId){
var deferred=$q.defer();
var user=AuthService.getUser();
self.getCards(user.userId).then(function(cards){
var card=cards.find(function(c){return c.cardId===cardId;});
if(card){
deferred.resolve(card);
}else{
deferred.reject('Card not found');
}
});
return deferred.promise;
};
}]);
})();