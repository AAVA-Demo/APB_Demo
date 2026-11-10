(function() {
'use strict';
angular.module('creditCardApp')
.service('TransactionService', ['$http', '$q', function($http, $q) {
var API_BASE = '/api/transactions';
this.getMonthlySpend = function() {
var deferred = $q.defer();
$http.get(API_BASE + '/monthly').then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
this.getTransactionsByCard = function(cardId) {
var deferred = $q.defer();
$http.get(API_BASE + '/card/' + cardId).then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();