(function(){
'use strict';
angular.module('spendingAnalyticsModule').service('TransactionDataService',['ApiService','$q',function(ApiService,$q){
this.getCategoryTransactions=function(){
return ApiService.getTransactions({tagged:true});
};
}]);
})();