(function(){
'use strict';
angular.module('creditCard.analytics').controller('AnalyticsController',['AnalyticsService','CategorizationService','$scope','$q',function(AnalyticsService,CategorizationService,$scope,$q){
var vm=this;
vm.categoryData=[];
vm.trendData=[];
vm.categories=[];
vm.filter={startDate:null,endDate:null,selectedCards:[],selectedCategories:[]};
vm.loading=true;
vm.error=null;
vm.init=function(){
var twelveMonthsAgo=new Date();
twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth()-12);
vm.filter.startDate=twelveMonthsAgo;
vm.filter.endDate=new Date();
CategorizationService.getCategories().then(function(categories){
vm.categories=categories;
vm.loadAnalytics();
}).catch(function(error){
vm.error='Failed to load categories.';
vm.loading=false;
});
};
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
$q.all([AnalyticsService.getCategorySpending(vm.filter),AnalyticsService.getMonthlyTrends(vm.filter)]).then(function(results){
vm.categoryData=results[0];
vm.trendData=results[1];
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;
});
};
vm.applyFilter=function(){
vm.loadAnalytics();
};
$scope.$watch('vm.filter',function(newVal,oldVal){
if(newVal!==oldVal){vm.applyFilter();}
},true);
vm.init();
}]);
})();