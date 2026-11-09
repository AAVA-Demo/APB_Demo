(function(){
'use strict';
angular.module('creditCardApp').controller('analyticsController',['$scope','analyticsService',function($scope,analyticsService){
const vm=this;
vm.loading=true;
vm.error=null;
vm.analyticsSummary=null;
vm.init=function(){
analyticsService.getSpendingInsights().then(function(summary){
vm.analyticsSummary=summary;
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load analytics data';
vm.loading=false;
});
};
vm.init();
}]);
})();