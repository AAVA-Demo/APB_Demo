(function() {
'use strict';
angular.module('multiCardManagement.module')
.factory('CardDataFactory', ['$http', '$q', function($http, $q) {
var factory = {};
factory.getCardsByIds = function(cardIds) {
var deferred = $q.defer();
var mockCards = [
{cardId: 'c1', userId: 'user123', cardNumber: '****1234', cardType: 'Visa', issuerName: 'HDFC Bank', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000, status: 'Active', expiryDate: new Date('2026-12-31'), cardWiseSpend: 15000, lastTransactionDate: new Date('2024-01-15')},
{cardId: 'c2', userId: 'user123', cardNumber: '****5678', cardType: 'Mastercard', issuerName: 'ICICI Bank', creditLimit: 100000, availableCredit: 80000, outstandingBalance: 20000, status: 'Active', expiryDate: new Date('2027-06-30'), cardWiseSpend: 20000, lastTransactionDate: new Date('2024-01-14')},
{cardId: 'c3', userId: 'user123', cardNumber: '****9012', cardType: 'Amex', issuerName: 'American Express', creditLimit: 200000, availableCredit: 150000, outstandingBalance: 50000, status: 'Active', expiryDate: new Date('2025-09-30'), cardWiseSpend: 50000, lastTransactionDate: new Date('2024-01-13')},
{cardId: 'c4', userId: 'user123', cardNumber: '****3456', cardType: 'Visa', issuerName: 'SBI Card', creditLimit: 75000, availableCredit: 60000, outstandingBalance: 15000, status: 'Active', expiryDate: new Date('2026-03-31'), cardWiseSpend: 15000, lastTransactionDate: new Date('2024-01-12')},
{cardId: 'c5', userId: 'user123', cardNumber: '****7890', cardType: 'Mastercard', issuerName: 'Axis Bank', creditLimit: 150000, availableCredit: 120000, outstandingBalance: 30000, status: 'Active', expiryDate: new Date('2027-11-30'), cardWiseSpend: 30000, lastTransactionDate: new Date('2024-01-11')}
];
var filteredCards = mockCards.filter(function(card) {
return cardIds.indexOf(card.cardId) > -1;
});
setTimeout(function() {
deferred.resolve(filteredCards);
}, 600);
return deferred.promise;
};
return factory;
}]);
})();