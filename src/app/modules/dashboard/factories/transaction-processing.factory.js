(function() {
'use strict';
angular.module('dashboard.module')
.factory('TransactionProcessingFactory', ['$http', '$q', function($http, $q) {
var factory = {};
factory.getMonthlySpend = function(userId) {
var deferred = $q.defer();
var mockData = {
monthlySpend: 45000
};
setTimeout(function() {
deferred.resolve(mockData);
}, 400);
return deferred.promise;
};
return factory;
}]);
})();