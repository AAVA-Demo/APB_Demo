(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['AnalyticsEngineService','$scope','$filter',function(AnalyticsEngineService,$scope,$filter){
var vm=this;
vm.analyticsData={};
vm.loading=true;
vm.error=null;
vm.timeRange='Last 12 months';
vm.selectedCategory=null;
function loadAnalytics(){
vm.loading=true;
AnalyticsEngineService.getAnalytics(vm.timeRange).then(function(data){
vm.analyticsData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load analytics data';
vm.loading=false;
});
}
loadAnalytics();
vm.changeTimeRange=function(range){
vm.timeRange=range;
loadAnalytics();
};
vm.selectCategory=function(category){
vm.selectedCategory=category;
};
}]);
})();