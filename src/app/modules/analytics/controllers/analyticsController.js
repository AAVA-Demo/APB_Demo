(function(){
'use strict';
angular.module('analytics').controller('analyticsController',['$scope','analyticsEngineService',function($scope,analyticsEngineService){
var vm=this;
vm.analyticsData=null;
vm.loading=true;
vm.error=null;
vm.dateRange={months:12};
vm.categoryLabels=[];
vm.categoryData=[];
vm.monthLabels=[];
vm.monthData=[];
vm.chartOptions={responsive:true,maintainAspectRatio:true,animation:{duration:750}};
function init(){
loadAnalytics();
}
function loadAnalytics(){
vm.loading=true;
vm.error=null;
analyticsEngineService.getAnalytics(vm.dateRange).then(function(data){
vm.analyticsData=data;
vm.categoryLabels=[];
vm.categoryData=[];
angular.forEach(data.categoryBreakdown,function(item){
vm.categoryLabels.push(item.category);
vm.categoryData.push(item.amount);
});
vm.monthLabels=[];
vm.monthData=[];
angular.forEach(data.monthlyTrends,function(item){
vm.monthLabels.push(item.month);
vm.monthData.push(item.totalSpend);
});
vm.loading=false;
},function(error){
vm.error='Failed to load analytics. Please try again.';
vm.loading=false;
});
}
init();
}]);
})();