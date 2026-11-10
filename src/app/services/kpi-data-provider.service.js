(function(){
'use strict';
angular.module('creditCardApp').service('KPIDataProviderService',['$q',function($q){
var transactionData=null;
this.setTransactionData=function(data){
transactionData=data;
};
this.getTransactionData=function(){
var deferred=$q.defer();
if(transactionData){
deferred.resolve(transactionData);
}else{
deferred.reject('No transaction data available');
}
return deferred.promise;
};
}]);
})();