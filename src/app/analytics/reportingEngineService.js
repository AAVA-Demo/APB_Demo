angular.module('analyticsModule').service('reportingEngineService',['$q',function($q){
var service=this;
service.aggregateByCategory=function(transactions){
var deferred=$q.defer();
setTimeout(function(){
var categoryMap={};
transactions.forEach(function(t){
if(!categoryMap[t.category]){
categoryMap[t.category]={category:t.category,totalAmount:0,transactionCount:0,cardBreakdown:[]};
}
categoryMap[t.category].totalAmount+=t.amount;
categoryMap[t.category].transactionCount++;
});
var categoryAnalytics=Object.keys(categoryMap).map(function(key){
var cat=categoryMap[key];
cat.percentage=0;
return cat;
});
deferred.resolve(categoryAnalytics);
},100);
return deferred.promise;
};
service.aggregateByCard=function(transactions){
var deferred=$q.defer();
setTimeout(function(){
var cardMap={};
transactions.forEach(function(t){
if(!cardMap[t.cardId]){
cardMap[t.cardId]={cardId:t.cardId,cardName:t.cardId,totalSpend:0,categoryBreakdown:[]};
}
cardMap[t.cardId].totalSpend+=t.amount;
});
var cardSpends=Object.keys(cardMap).map(function(key){return cardMap[key];});
deferred.resolve(cardSpends);
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