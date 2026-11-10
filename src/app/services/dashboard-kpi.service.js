(function(){
'use strict';
angular.module('creditCard.analytics').service('DashboardKPIService',['$http','$q',function($http,$q){
this.getAggregatedMetrics=function(){
const mockMetrics={totalSpend:47650,avgMonthlySpend:6335};
return $q.resolve(mockMetrics);
};
}]);
})();