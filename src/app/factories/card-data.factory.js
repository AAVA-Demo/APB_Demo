(function(){
'use strict';
angular.module('creditCardApp').factory('CardDataFactory',['$http','$q',function($http,$q){
var factory={};
factory.fetchCards=function(){
var deferred=$q.defer();
var mockCards=[
{cardId:'CARD1',cardNumber:'****1234',cardType:'Visa Gold',creditLimit:10000,availableCredit:7500,outstandingAmount:2500,monthlySpend:1200,lastUpdated:new Date()},
{cardId:'CARD2',cardNumber:'****5678',cardType:'Mastercard Platinum',creditLimit:15000,availableCredit:12000,outstandingAmount:3000,monthlySpend:1800,lastUpdated:new Date()},
{cardId:'CARD3',cardNumber:'****9012',cardType:'Amex Blue',creditLimit:8000,availableCredit:6000,outstandingAmount:2000,monthlySpend:900,lastUpdated:new Date()}
];
deferred.resolve(mockCards);
return deferred.promise;
};
return factory;
}]);
})();