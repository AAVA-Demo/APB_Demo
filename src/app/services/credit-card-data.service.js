(function(){
'use strict';
angular.module('creditCardApp').service('CreditCardDataService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){var self=this;self.fetchCards=function(cardIds){var promises=cardIds.map(function(id){return $http.get(API_ENDPOINTS.cards+'/'+id).then(function(response){return response.data;}).catch(function(error){console.warn('Failed to fetch card:',id);return null;});});return $q.all(promises).then(function(results){return results.filter(function(card){return card!==null;});});};}]);
})();