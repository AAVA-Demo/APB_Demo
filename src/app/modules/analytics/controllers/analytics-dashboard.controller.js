(function(){
'use strict';
angular.module('creditCard.analytics').controller('AnalyticsDashboardController',['AnalyticsService','$scope',function(AnalyticsService,$scope){
const vm=this;
vm.analyticsData={};
vm.loading=true;
vm.error=null;
vm.selectedCard=null;
vm.cards=[{id:'CC001',name:'Visa Platinum'},{id:'CC002',name:'MasterCard Gold'},{id:'CC003',name:'Amex Blue'}];
vm.loadAnalytics=function(){
vm.loading=true;
AnalyticsService.getAnalyticsData(null,vm.selectedCard).then(function(data){
vm.analyticsData=data;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load analytics data';
vm.loading=false;
});
};
vm.filterByCard=function(){
vm.loadAnalytics();
};
vm.loadAnalytics();
}]);
})();