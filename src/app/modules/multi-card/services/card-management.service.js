(function() {
'use strict';
angular.module('multiCardManagement.module')
.service('CardManagementService', ['$q', 'CardDataFactory', 'UserProfileFactory', 'CardIssuerService', function($q, CardDataFactory, UserProfileFactory, CardIssuerService) {
var self = this;
self.getUserCards = function(userId) {
var deferred = $q.defer();
UserProfileFactory.getProfile(userId).then(function(profile) {
return CardDataFactory.getCardsByIds(profile.ownedCardIds);
}).then(function(cards) {
var enrichedCards = CardIssuerService.enrichWithIssuerData(cards);
deferred.resolve(enrichedCards);
}).catch(function(error) {
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();