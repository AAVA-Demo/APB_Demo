(function() {
'use strict';
angular.module('app.cardManagement')
.service('CardSpendingService', ['$http', '$q', function($http, $q) {
var API_BASE = '/api/cards';
this.getCardSpending = function(cardId) {
var deferred = $q.defer();
$http.get(API_BASE + '/' + cardId + '/spending').then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
this.getRecentTransactions = function(cardId) {
var deferred = $q.defer();
$http.get(API_BASE + '/' + cardId + '/transactions').then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();