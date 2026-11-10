(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardDataService',['$http','$q','AuthService',function($http,$q,AuthService){
var vm=this;
vm.fetchUserCards=function(userId){
var mockCards=[{cardId:'card001',userId:userId,cardNumber:'**** **** **** 1234',cardType:'Visa',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,monthlySpend:8500,lastUpdated:new Date()},{cardId:'card002',userId:userId,cardNumber:'**** **** **** 5678',cardType:'MasterCard',creditLimit:30000,availableCredit:22000,outstandingAmount:8000,monthlySpend:4200,lastUpdated:new Date()},{cardId:'card003',userId:userId,cardNumber:'**** **** **** 9012',cardType:'Amex',creditLimit:70000,availableCredit:50000,outstandingAmount:20000,monthlySpend:12000,lastUpdated:new Date()}];
return $q.resolve(mockCards);
};
}]);
})();