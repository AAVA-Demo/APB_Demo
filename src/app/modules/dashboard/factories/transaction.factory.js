(function(){
'use strict';
angular.module('dashboardModule').factory('TransactionFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.transactions+'/monthly/:userId',{userId:'@userId'},{getMonthlySpend:{method:'GET'}});
}]);
})();