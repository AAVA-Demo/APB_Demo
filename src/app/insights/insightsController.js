angular.module('insightsModule').controller('InsightsController',['$scope','$filter','insightsService',function($scope,$filter,insightsService){
var vm=this;
vm.analyticsData={};
vm.loading=true;
vm.error=null;
vm.timeRange={startDate:new Date(new Date().setMonth(new Date().getMonth()-12)),endDate:new Date()};
function loadInsights(){
vm.loading=true;
insightsService.getAnalytics(vm.timeRange).then(function(data){
vm.analyticsData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load insights data';
vm.loading=false;
});
}
loadInsights();
vm.updateTimeRange=function(){
loadInsights();
};
}]);