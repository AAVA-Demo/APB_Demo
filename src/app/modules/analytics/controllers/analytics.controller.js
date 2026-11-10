(function(){
'use strict';
angular.module('app.analytics').controller('AnalyticsController',['$scope','AnalyticsService','CategoryFilterFactory',function($scope,AnalyticsService,CategoryFilterFactory){
var vm=this;
vm.analyticsData=null;
vm.loading=true;
vm.error=null;
vm.selectedCard='';
vm.dateRange='3M';
var userId='user123';
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
AnalyticsService.getSpendingAnalytics(userId,vm.dateRange).then(function(data){
vm.analyticsData=data;
vm.loading=false;
$scope.$broadcast('analyticsDataLoaded',data);
},function(error){
vm.error='Failed to load analytics data';
vm.loading=false;
});
};
vm.filterByCard=function(){
if(vm.analyticsData){
$scope.$broadcast('filterByCard',vm.selectedCard);
}
};
vm.init=function(){
vm.loadAnalytics();
};
$scope.$watch('vm.dateRange',function(newVal,oldVal){
if(newVal!==oldVal){
vm.loadAnalytics();
}
});
vm.init();
}]);
})();