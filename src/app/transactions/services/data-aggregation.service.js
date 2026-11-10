(function(){
'use strict';
angular.module('transactionManagement').service('DataAggregationService',DataAggregationService);
DataAggregationService.$inject=['TransactionProcessingFactory'];
function DataAggregationService(TransactionProcessingFactory){
var vm=this;
var cache={};
var cacheTTL=300000;
vm.computeMonthlyTrends=computeMonthlyTrends;
function computeMonthlyTrends(userId){
var cacheKey='trends_'+userId;
if(cache[cacheKey]&&(Date.now()-cache[cacheKey].timestamp<cacheTTL)){
return cache[cacheKey].data;
}
var trends=[];
TransactionProcessingFactory.fetchTrends({months:12}).$promise.then(function(data){
trends=data;
cache[cacheKey]={data:trends,timestamp:Date.now()};
});
return trends;
}
}
})();