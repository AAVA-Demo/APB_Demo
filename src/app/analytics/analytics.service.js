(function(){
'use strict';
angular.module('analyticsModule').service('AnalyticsService',['TransactionDataService','CategoryClassificationService','$q',function(TransactionDataService,CategoryClassificationService,$q){
this.getSpendingInsights=function(startDate,endDate){
var deferred=$q.defer();
TransactionDataService.getTransactions(startDate,endDate).then(function(transactions){
var categorized=CategoryClassificationService.categorizeTransactions(transactions);
var monthlyTrend={};
var categorySpend={};
categorized.forEach(function(txn){
var month=new Date(txn.date).toLocaleString('default',{month:'short',year:'numeric'});
if(!monthlyTrend[month]){monthlyTrend[month]=0;}
monthlyTrend[month]+=txn.amount||0;
if(!categorySpend[txn.category]){categorySpend[txn.category]=0;}
categorySpend[txn.category]+=txn.amount||0;});
var monthlyTrendArray=Object.keys(monthlyTrend).map(function(month){
return{month:month,totalSpend:monthlyTrend[month]};});
var categorySpendArray=Object.keys(categorySpend).map(function(category){
return{category:category,amount:categorySpend[category]};});
deferred.resolve({monthlyTrend:monthlyTrendArray,categorySpend:categorySpendArray});},function(error){
console.error('Error fetching spending insights:',error);
deferred.reject(error);});
return deferred.promise;};
}]);
})();