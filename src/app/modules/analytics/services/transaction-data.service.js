(function(){
'use strict';
angular.module('analyticsModule').service('TransactionDataService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
this.getTransactions=function(userId,months){
var deferred=$q.defer();
$http.get(API_CONFIG.baseUrl+'/transactions/categorized',{params:{userId:userId,months:months},timeout:API_CONFIG.timeout}).then(function(response){
deferred.resolve(response.data);
},function(error){
if(error.status===-1){
var mockData=[{transactionId:'txn-001',cardId:'card-001',date:new Date('2024-01-15'),merchant:'Grocery Store',amount:85.50,category:'Food & Dining'},{transactionId:'txn-002',cardId:'card-001',date:new Date('2024-01-18'),merchant:'Gas Station',amount:45.00,category:'Fuel'},{transactionId:'txn-003',cardId:'card-002',date:new Date('2024-01-20'),merchant:'Online Shopping',amount:120.00,category:'Shopping'},{transactionId:'txn-004',cardId:'card-002',date:new Date('2024-01-22'),merchant:'Restaurant',amount:65.00,category:'Food & Dining'},{transactionId:'txn-005',cardId:'card-001',date:new Date('2024-01-25'),merchant:'Movie Theater',amount:30.00,category:'Entertainment'},{transactionId:'txn-006',cardId:'card-001',date:new Date('2024-02-10'),merchant:'Pharmacy',amount:50.00,category:'Healthcare'},{transactionId:'txn-007',cardId:'card-002',date:new Date('2024-02-15'),merchant:'Electric Company',amount:120.00,category:'Utilities'},{transactionId:'txn-008',cardId:'card-001',date:new Date('2024-03-05'),merchant:'Airline',amount:350.00,category:'Travel'},{transactionId:'txn-009',cardId:'card-002',date:new Date('2024-03-12'),merchant:'Bookstore',amount:75.00,category:'Education'}];
deferred.resolve(mockData);
}else{
deferred.reject(error);}
});
return deferred.promise;
};
}]);
})();