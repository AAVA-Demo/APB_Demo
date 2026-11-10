(function(){
'use strict';
angular.module('creditCard.transactions').service('DashboardKPIIntegrationService',['$http',function($http){
this.sendTransactionData=function(transactions){
return $http.post('/api/kpi/update',{transactions:transactions});
};
}]);
})();