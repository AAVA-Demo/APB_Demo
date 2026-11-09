(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){var self=this;var cache={data:null,timestamp:null,ttl:60000};self.fetchAllCards=function(){var now=Date.now();if(cache.data&&cache.timestamp&&(now-cache.timestamp)<cache.ttl){return $q.resolve(cache.data);}return $http.get(API_ENDPOINTS.cards).then(function(response){cache.data=response.data;cache.timestamp=now;return response.data;}).catch(function(error){console.error('Error fetching cards:',error);return $q.reject(error);});};}]);
})();