(function() {
'use strict';
angular.module('creditCardApp')
.service('CreditCardService', ['$http', '$q', function($http, $q) {
var API_BASE = '/api/creditcards';
this.getAllCards = function() {
var deferred = $q.defer();
$http.get(API_BASE).then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
this.getCardById = function(cardId) {
var deferred = $q.defer();
$http.get(API_BASE + '/' + cardId).then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();