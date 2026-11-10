(function() {
'use strict';
angular.module('multiCardManagement.module')
.factory('UserProfileFactory', ['$http', '$q', function($http, $q) {
var factory = {};
factory.getProfile = function(userId) {
var deferred = $q.defer();
var mockProfile = {
userId: 'user123',
ownedCardIds: ['c1', 'c2', 'c3', 'c4', 'c5'],
preferences: {}
};
setTimeout(function() {
deferred.resolve(mockProfile);
}, 300);
return deferred.promise;
};
return factory;
}]);
})();