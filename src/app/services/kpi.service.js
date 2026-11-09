(function(){
'use strict';
angular.module('creditCardApp').service('KPIService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
var vm=this;
var cache={data:null,timestamp:null};
var CACHE_DURATION=30000;
vm.getKPIs=function(){
var now=Date.now();
if(cache.data&&cache.timestamp&&(now-cache.timestamp)<CACHE_DURATION){
return $q.resolve(cache.data);
}
var cardsPromise=$http.get(API_ENDPOINTS.cards);
var transactionsPromise=$http.get(API_ENDPOINTS.monthlyTransactions);
return $q.all([cardsPromise,transactionsPromise]).then(function(responses){
var cards=responses[0].data||[];
var monthlyData=responses[1].data||{monthlySpend:0};
var totalCreditLimit=0;
var totalOutstanding=0;
var totalAvailableCredit=0;
cards.forEach(function(card){
totalCreditLimit+=card.creditLimit||0;
totalOutstanding+=card.outstandingBalance||0;
totalAvailableCredit+=card.availableCredit||0;
});
var utilizationPercentage=totalCreditLimit>0?((totalOutstanding/totalCreditLimit)*100).toFixed(2):0;
var kpiData={totalCreditLimit:totalCreditLimit.toFixed(2),totalAvailableCredit:totalAvailableCredit.toFixed(2),totalOutstanding:totalOutstanding.toFixed(2),monthlySpend:(monthlyData.monthlySpend||0).toFixed(2),utilizationPercentage:parseFloat(utilizationPercentage),lastUpdated:new Date()};
cache.data=kpiData;
cache.timestamp=Date.now();
return kpiData;
}).catch(function(error){
if(cache.data){
toastr.warning('Using cached data due to network error');
return cache.data;
}
toastr.error('Failed to load KPI data');
return $q.reject(error);
});
};
}]);