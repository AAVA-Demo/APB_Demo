(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardDataService',['$http','$q','$cacheFactory',function($http,$q,$cacheFactory){
var cache=$cacheFactory('cardCache');
var API_BASE='/api/cards';
var service={
fetchAllCards:fetchAllCards,
getCardBalances:getCardBalances,
fetchCardSummaries:fetchCardSummaries,
getAllCards:getAllCards
};
return service;
function fetchAllCards(userId){
var cacheKey='cards_'+userId;
var cached=cache.get(cacheKey);
if(cached){return $q.resolve(cached);}
return $http.get(API_BASE+'?userId='+userId).then(function(response){
var cards=response.data||getMockCards(userId);
cache.put(cacheKey,cards);
return cards;
},function(error){
return getMockCards(userId);
});
}
function getCardBalances(userId){
return $http.get(API_BASE+'/balances?userId='+userId).then(function(response){
return response.data||getMockBalances();
},function(error){
return getMockBalances();
});
}
function fetchCardSummaries(userId){
return $http.get(API_BASE+'/summary?userId='+userId).then(function(response){
return response.data||getMockSummaries();
},function(error){
return getMockSummaries();
});
}
function getAllCards(userId){
return fetchAllCards(userId);
}
function getMockCards(userId){
return[
{cardId:'card1',userId:userId,maskedNumber:'**** **** **** 1234',cardType:'Visa',creditLimit:50000,availableCredit:35000,currentBalance:15000,outstandingAmount:15000,monthlySpend:12000,utilizationRate:30,lastFourDigits:'1234',expiryDate:'12/25',isActive:true},
{cardId:'card2',userId:userId,maskedNumber:'**** **** **** 5678',cardType:'MasterCard',creditLimit:30000,availableCredit:22000,currentBalance:8000,outstandingAmount:8000,monthlySpend:6500,utilizationRate:27,lastFourDigits:'5678',expiryDate:'06/26',isActive:true},
{cardId:'card3',userId:userId,maskedNumber:'**** **** **** 9012',cardType:'Amex',creditLimit:75000,availableCredit:60000,currentBalance:15000,outstandingAmount:15000,monthlySpend:10000,utilizationRate:20,lastFourDigits:'9012',expiryDate:'03/27',isActive:true}
];
}
function getMockBalances(){
return[
{cardId:'card1',creditLimit:50000,currentBalance:15000,availableCredit:35000},
{cardId:'card2',creditLimit:30000,currentBalance:8000,availableCredit:22000},
{cardId:'card3',creditLimit:75000,currentBalance:15000,availableCredit:60000}
];
}
function getMockSummaries(){
return[
{cardId:'card1',maskedNumber:'**** 1234',creditLimit:50000,availableCredit:35000,outstandingAmount:15000},
{cardId:'card2',maskedNumber:'**** 5678',creditLimit:30000,availableCredit:22000,outstandingAmount:8000},
{cardId:'card3',maskedNumber:'**** 9012',creditLimit:75000,availableCredit:60000,outstandingAmount:15000}
];
}
}]);
})();