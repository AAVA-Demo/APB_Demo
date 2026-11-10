(function(){
'use strict';
angular.module('creditCardApp').service('TransactionDataService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
this.getHistoricalTransactions=function(userId,dateRange){
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.TRANSACTIONS;
var config={params:{userId:userId},timeout:API_CONFIG.TIMEOUT};
if(dateRange&&dateRange.startDate){
config.params.startDate=dateRange.startDate;
}
if(dateRange&&dateRange.endDate){
config.params.endDate=dateRange.endDate;
}
return $http.get(url,config).then(function(response){
return response.data.transactions||[];
},function(error){
return $q.reject(error);
});
};
}]);
})();