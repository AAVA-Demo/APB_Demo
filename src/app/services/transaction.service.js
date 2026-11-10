(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['ApiService','$q',function(ApiService,$q){
var self=this;
self.getTransactions=function(filter,pagination){
var params=angular.extend({},filter,pagination);
return ApiService.get('/api/transactions',params).then(function(response){
return{transactions:response.transactions||[],totalCount:response.totalCount||0};
}).catch(function(error){
console.error('Failed to fetch transactions:',error);
return $q.reject(error);});
};
}]);
})();