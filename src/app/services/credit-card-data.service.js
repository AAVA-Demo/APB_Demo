(function(){
'use strict';
angular.module('creditCard.dashboard').service('CreditCardDataService',['$http','$q','CreditCardModelFactory',function($http,$q,CreditCardModelFactory){
const API_BASE='/api/creditcards';
this.fetchAllCards=function(){
const mockData=[{cardId:'CC001',cardName:'Visa Platinum',cardType:'Visa',creditLimit:50000,currentBalance:15000,monthlySpend:8500,outstandingAmount:15000},{cardId:'CC002',cardName:'MasterCard Gold',cardType:'MasterCard',creditLimit:30000,currentBalance:8000,monthlySpend:4200,outstandingAmount:8000},{cardId:'CC003',cardName:'Amex Blue',cardType:'Amex',creditLimit:40000,currentBalance:12000,monthlySpend:6300,outstandingAmount:12000}];
return $q.resolve(mockData.map(function(card){return CreditCardModelFactory.create(card);}));
};
}]);
})();