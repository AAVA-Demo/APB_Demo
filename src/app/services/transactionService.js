(function(){
'use strict';
angular.module('creditCardApp').factory('transactionService',['$http','$q',function($http,$q){
function getTransactions(){
return $http.get('/api/transactions',{cache:true}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
function getTransactionById(transactionId){
return $http.get('/api/transactions/'+transactionId).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
}
return{getTransactions:getTransactions,getTransactionById:getTransactionById};
}]);
})();