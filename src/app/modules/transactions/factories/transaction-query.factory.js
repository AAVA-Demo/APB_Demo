(function(){
'use strict';
angular.module('transactionModule').factory('TransactionQueryFactory',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
return{fetchTransactions:function(userId,filters){
var deferred=$q.defer();
var params={userId:userId,months:12};
if(filters.cardIds){params.cardIds=filters.cardIds.join(',');}
if(filters.startDate){params.startDate=filters.startDate;}
if(filters.endDate){params.endDate=filters.endDate;}
$http.get(API_CONFIG.baseUrl+'/transactions',{params:params,timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);
},function(error){
if(error.status===-1){
var mockTransactions=[{transactionId:'txn-001',cardId:'card-001',cardLast4:'1111',date:new Date('2024-01-15'),merchant:'Grocery Store',amount:85.50,currency:'USD',category:'Food & Dining',status:'Posted',description:'Weekly groceries'},{transactionId:'txn-002',cardId:'card-001',cardLast4:'1111',date:new Date('2024-01-18'),merchant:'Gas Station',amount:45.00,currency:'USD',category:'Fuel',status:'Posted',description:'Fuel refill'},{transactionId:'txn-003',cardId:'card-002',cardLast4:'0004',date:new Date('2024-01-20'),merchant:'Online Shopping',amount:120.00,currency:'USD',category:'Shopping',status:'Posted',description:'Electronics purchase'},{transactionId:'txn-004',cardId:'card-002',cardLast4:'0004',date:new Date('2024-01-22'),merchant:'Restaurant',amount:65.00,currency:'USD',category:'Food & Dining',status:'Posted',description:'Dinner with friends'},{transactionId:'txn-005',cardId:'card-001',cardLast4:'1111',date:new Date('2024-01-25'),merchant:'Movie Theater',amount:30.00,currency:'USD',category:'Entertainment',status:'Posted',description:'Movie tickets'}];
deferred.resolve(mockTransactions);
}else{
deferred.reject(error);}
});
return deferred.promise;
}};
}]);
})();