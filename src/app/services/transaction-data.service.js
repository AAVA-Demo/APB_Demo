(function(){
'use strict';
angular.module('creditCardApp').service('TransactionDataService',['$http','API_ENDPOINTS',function($http,API_ENDPOINTS){var self=this;self.getTransactions=function(cardId,page,pageSize){var params={page:page||1,size:pageSize||20};return $http.get(API_ENDPOINTS.cards+'/'+cardId+'/transactions',{params:params}).then(function(response){return response.data;}).catch(function(error){console.error('Error fetching transactions:',error);throw error;});};}]);
})();