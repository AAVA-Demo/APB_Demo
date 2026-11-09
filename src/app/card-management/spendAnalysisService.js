angular.module('cardManagementModule').service('spendAnalysisService',['$http','$q',function($http,$q){
var service=this;
var mockMetrics={
card1:{monthlySpend:350.50,yearlySpend:4200.00,transactionCount:15},
card2:{monthlySpend:700.00,yearlySpend:8400.00,transactionCount:22},
card3:{monthlySpend:330.00,yearlySpend:3960.00,transactionCount:12}
};
service.getCardMetrics=function(cardId){
var deferred=$q.defer();
setTimeout(function(){
var metrics=mockMetrics[cardId]||{monthlySpend:0,yearlySpend:0,transactionCount:0};
deferred.resolve(metrics);
},200);
return deferred.promise;
};
}]);