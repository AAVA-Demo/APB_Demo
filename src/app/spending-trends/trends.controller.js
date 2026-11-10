(function(){
'use strict';
angular.module('creditCardApp')
.controller('TrendsController',['AnalyticsService','$scope',function(AnalyticsService,$scope){
var vm=this;
vm.trendData={};
vm.loading=true;
vm.error=null;
vm.filters={startDate:null,endDate:null,cardId:null};
vm.applyFilters=function(){
vm.loading=true;
AnalyticsService.getTrends(vm.filters).then(function(data){
vm.trendData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load trend data';
vm.loading=false;
});
};
vm.applyFilters();
}]);
})();