angular.module('analyticsModule').controller('AnalyticsController',['$scope','$filter','analyticsDashboardService',function($scope,$filter,analyticsDashboardService){
var vm=this;
vm.dashboardData={};
vm.loading=true;
vm.error=null;
vm.filters={dateRange:{startDate:new Date(new Date().setMonth(new Date().getMonth()-12)),endDate:new Date()}};
function loadAnalytics(){
vm.loading=true;
analyticsDashboardService.getAnalytics(vm.filters).then(function(data){
vm.dashboardData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
loadAnalytics();
vm.applyFilters=function(){
loadAnalytics();
};
}]);