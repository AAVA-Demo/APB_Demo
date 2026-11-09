(function(){
'use strict';
angular.module('creditCardApp').service('CardInfoService',['$http','API_ENDPOINTS',function($http,API_ENDPOINTS){var self=this;self.getAllCards=function(){return $http.get(API_ENDPOINTS.cards).then(function(response){return response.data;}).catch(function(error){console.error('Error fetching card info:',error);throw error;});};self.getCardById=function(cardId){return $http.get(API_ENDPOINTS.cards+'/'+cardId).then(function(response){return response.data;}).catch(function(error){console.error('Error fetching card:',error);throw error;});};}]);
})();