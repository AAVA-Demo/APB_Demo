(function() {
'use strict';
angular.module('app.analytics')
.service('CategorizationService', ['$http', '$q', function($http, $q) {
var API_BASE = '/api/transactions/categorized';
this.getCategorizedTransactions = function() {
var deferred = $q.defer();
$http.get(API_BASE).then(function(response) {
deferred.resolve(response.data);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();