(function(){
'use strict';
angular.module('analyticsModule').factory('TransactionDataFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.transactions+'/:userId',{userId:'@userId',startDate:'@startDate',endDate:'@endDate'},{getTransactions:{method:'GET',isArray:true}});
}]);
})();