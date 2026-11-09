(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['AnalyticsService','DateUtilService','$scope','AuthService',function(AnalyticsService,DateUtilService,$scope,AuthService){
const vm=this;
vm.categorySpend=[];
vm.monthlyTrends=[];
vm.loading=true;
vm.error=null;
vm.dateRange={start:DateUtilService.getMonthsAgo(6),end:new Date()};
function loadAnalytics(){
const userId=AuthService.getUserId();
AnalyticsService.getSpendingAnalytics(userId,vm.dateRange).then(function(data){
vm.categorySpend=data.categorySpend;
vm.monthlyTrends=data.monthlyTrends;
vm.loading=false;
},function(err){
vm.error='Failed to load analytics data.';
vm.loading=false;
});
}
vm.updateDateRange=function(){
vm.loading=true;
loadAnalytics();
};
loadAnalytics();
}]);
})();