(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardDataFactory',['$http','$q','AuthService',function($http,$q,AuthService){
const factory={};
const BASE_URL='/api';
factory.fetchCardSummary=function(){
const userId=AuthService.getUserId();
const mockData={
userId:userId,
cards:[
{cardId:'card-001',creditLimit:50000,availableCredit:35000,currentBalance:15000},
{cardId:'card-002',creditLimit:30000,availableCredit:28000,currentBalance:2000},
{cardId:'card-003',creditLimit:20000,availableCredit:15000,currentBalance:5000}
],
aggregatedSpend:{currentMonth:22000,lastMonth:18500}
};
return $q.resolve(mockData);
};
return factory;
}]);
})();