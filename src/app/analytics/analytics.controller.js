(function(){
'use strict';
angular.module('creditCardApp').controller('AnalyticsController',['$scope','AnalyticsService','DataAggregationService','SPENDING_CATEGORIES',function($scope,AnalyticsService,DataAggregationService,SPENDING_CATEGORIES){
var vm=this;
vm.transactions=[];
vm.categorySpending=[];
vm.monthlyTrends=[];
vm.loading=true;
vm.categories=SPENDING_CATEGORIES;
vm.filters={startDate:null,endDate:null,cardIds:[],category:''};
vm.init=function(){
var today=new Date();
var threeMonthsAgo=new Date();
threeMonthsAgo.setMonth(today.getMonth()-3);
vm.filters.startDate=threeMonthsAgo.toISOString().split('T')[0];
vm.filters.endDate=today.toISOString().split('T')[0];
vm.loadAnalytics();
};
vm.loadAnalytics=function(){
vm.loading=true;
AnalyticsService.getTransactions(vm.filters).then(function(transactions){
vm.transactions=transactions;
vm.categorySpending=DataAggregationService.aggregateByCategory(transactions);
vm.monthlyTrends=DataAggregationService.aggregateByMonth(transactions);
vm.loading=false;
$scope.$apply();
}).catch(function(){
vm.loading=false;
$scope.$apply();
});
};
vm.applyFilter=function(){
vm.loadAnalytics();
};
vm.init();
}]);