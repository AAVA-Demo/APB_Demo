(function(){
'use strict';
angular.module('app.analytics').controller('TrendAnalysisController',['$scope','AnalyticsService','$filter',function($scope,AnalyticsService,$filter){
var vm=this;
vm.trendData=null;
vm.loading=true;
vm.error=null;
var userId='user123';
vm.init=function(){
AnalyticsService.getMonthlyTrends(userId,6).then(function(data){
vm.trendData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load trend data';
vm.loading=false;
});
};
vm.init();
}]);
})();