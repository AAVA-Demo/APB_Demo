(function(){
'use strict';
angular.module('analyticsModule').controller('AnalyticsController',['AnalyticsService','AuthService','$scope','$filter','NotificationService',function(AnalyticsService,AuthService,$scope,$filter,NotificationService){
var vm=this;
vm.analyticsData=null;
vm.loading=true;
vm.selectedView='category';
var userContext=AuthService.getUserContext();
function loadAnalytics(){
vm.loading=true;
AnalyticsService.loadAnalytics(userContext.userId,12).then(function(data){
vm.analyticsData=data;
$scope.$apply();
vm.loading=false;
},function(error){
NotificationService.error('Failed to load analytics data');
vm.loading=false;
});
}
vm.switchView=function(view){
vm.selectedView=view;
};
loadAnalytics();
}]);
})();