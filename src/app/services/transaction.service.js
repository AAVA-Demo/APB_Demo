(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['$http','API_ENDPOINTS',function($http,API_ENDPOINTS){var self=this;self.fetchTransactions=function(startDate,endDate){var params={start:startDate,end:endDate};return $http.get(API_ENDPOINTS.transactions,{params:params}).then(function(response){return response.data;}).catch(function(error){console.error('Error fetching transactions:',error);throw error;});};}]);
})();