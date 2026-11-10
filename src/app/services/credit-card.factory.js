(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardFactory',['$http','$q',function($http,$q){
var API_BASE='/api';
var mockCards=[{cardId:'C001',userId:'U001',cardNumber:'**** **** **** 1234',cardType:'Visa',creditLimit:50000,availableCredit:35000,outstandingAmount:15000,status:'Active',expiryDate:'12/25'},{cardId:'C002',userId:'U001',cardNumber:'**** **** **** 5678',cardType:'MasterCard',creditLimit:30000,availableCredit:20000,outstandingAmount:10000,status:'Active',expiryDate:'06/26'},{cardId:'C003',userId:'U001',cardNumber:'**** **** **** 9012',cardType:'Amex',creditLimit:75000,availableCredit:60000,outstandingAmount:15000,status:'Active',expiryDate:'09/27'}];
return{
getAllCards:function(){
var deferred=$q.defer();
setTimeout(function(){deferred.resolve({data:mockCards});},300);
return deferred.promise;
},
getUserCards:function(userId){
var deferred=$q.defer();
var userCards=mockCards.filter(function(c){return c.userId===userId;});
setTimeout(function(){deferred.resolve({data:userCards});},300);
return deferred.promise;
}
};
}]);
})();