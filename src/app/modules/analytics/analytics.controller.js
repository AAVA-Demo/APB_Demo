(function(){
'use strict';
angular.module('creditCard.analytics').controller('AnalyticsController',['$scope','AnalyticsService','CategoryFactory',function($scope,AnalyticsService,CategoryFactory){
var vm=this;
vm.categoryBreakdown=[];
vm.monthlyTrend=[];
vm.cardWiseSpend=[];
vm.loading=false;
vm.error=null;
vm.dateRange={startDate:null,endDate:null};
vm.loadAnalytics=function(){
vm.loading=true;
vm.error=null;
var params={userId:'user123',dateRange:vm.dateRange};
AnalyticsService.getSpendingData(params).then(function(data){
vm.categoryBreakdown=data.categoryBreakdown||[];
vm.monthlyTrend=data.monthlyTrend||[];
vm.cardWiseSpend=data.cardWiseSpend||[];
vm.loading=false;
},function(err){
vm.error='Failed to load analytics data. Please try again.';
vm.loading=false;
});
};
vm.applyDateFilter=function(){
vm.loadAnalytics();
};
vm.loadAnalytics();
}]);
})();