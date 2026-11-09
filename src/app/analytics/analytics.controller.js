(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',['$scope','AnalyticsService',function($scope,AnalyticsService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.analyticsData=null;
vm.dateRange={startDate:null,endDate:null};
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingAnalytics(vm.dateRange).then(function(data){
vm.analyticsData=data||AnalyticsService.getMockAnalytics();
vm.loading=false;
$scope.$broadcast('analyticsDataLoaded',vm.analyticsData);
},function(error){
vm.error='Failed to load analytics. Displaying sample data.';
vm.analyticsData=AnalyticsService.getMockAnalytics();
vm.loading=false;
$scope.$broadcast('analyticsDataLoaded',vm.analyticsData);
});
};
vm.onCategoryClick=function(category){
AnalyticsService.getTransactionsByCategory(category).then(function(transactions){
vm.drillDownData={category:category,transactions:transactions};
},function(error){
console.error('Failed to load category transactions',error);
});
};
vm.loadAnalytics();
}]);
})();