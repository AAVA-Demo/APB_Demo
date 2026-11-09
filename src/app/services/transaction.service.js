(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',TransactionService);
TransactionService.$inject=['$http','$q','API_BASE_URL'];
function TransactionService($http,$q,API_BASE_URL){
var service=this;
service.getMonthlySpend=getMonthlySpend;
function getMonthlySpend(){
return $http.get(API_BASE_URL+'/transactions/monthly').then(function(response){
return response.data||mockMonthlySpend();
}).catch(function(err){
return mockMonthlySpend();
});
}
function mockMonthlySpend(){
var currentMonth=new Date().toISOString().substring(0,7);
return{currentMonth:currentMonth,totalSpend:42000,transactionCount:87};
}
}
})();