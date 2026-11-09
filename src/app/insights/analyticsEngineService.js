angular.module('insightsModule').service('analyticsEngineService',['$q',function($q){
var service=this;
service.aggregateByCategory=function(transactions,categories){
var deferred=$q.defer();
setTimeout(function(){
var categoryMap={};
categories.forEach(function(cat){
categoryMap[cat]={category:cat,amount:0,percentage:0,transactionCount:0};
});
transactions.forEach(function(t){
if(categoryMap[t.category]){
categoryMap[t.category].amount+=t.amount;
categoryMap[t.category].transactionCount++;
}
});
var categorySpending=Object.keys(categoryMap).map(function(key){return categoryMap[key];});
deferred.resolve(categorySpending);
},100);
return deferred.promise;
};
service.calculateMonthlyTrends=function(transactions){
var deferred=$q.defer();
setTimeout(function(){
var monthMap={};
transactions.forEach(function(t){
var month=new Date(t.date).toISOString().substring(0,7);
if(!monthMap[month]){
monthMap[month]={month:month,totalSpend:0,categoryBreakdown:[]};
}
monthMap[month].totalSpend+=t.amount;
});
var monthlyTrends=Object.keys(monthMap).map(function(key){return monthMap[key];});
deferred.resolve(monthlyTrends);
},100);
return deferred.promise;
};
}]);