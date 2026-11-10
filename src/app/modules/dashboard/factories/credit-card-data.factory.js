(function() {
'use strict';
angular.module('dashboard.module')
.factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
var factory = {};
factory.getAllCards = function(userId) {
var deferred = $q.defer();
var mockCards = [
{cardId: 'c1', cardNumber: '****1234', cardType: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000, issuerName: 'HDFC Bank', status: 'Active'},
{cardId: 'c2', cardNumber: '****5678', cardType: 'Mastercard', creditLimit: 100000, availableCredit: 80000, outstandingBalance: 20000, issuerName: 'ICICI Bank', status: 'Active'},
{cardId: 'c3', cardNumber: '****9012', cardType: 'Amex', creditLimit: 200000, availableCredit: 150000, outstandingBalance: 50000, issuerName: 'American Express', status: 'Active'},
{cardId: 'c4', cardNumber: '****3456', cardType: 'Visa', creditLimit: 75000, availableCredit: 60000, outstandingBalance: 15000, issuerName: 'SBI Card', status: 'Active'},
{cardId: 'c5', cardNumber: '****7890', cardType: 'Mastercard', creditLimit: 150000, availableCredit: 120000, outstandingBalance: 30000, issuerName: 'Axis Bank', status: 'Active'}
];
setTimeout(function() {
deferred.resolve(mockCards);
}, 500);
return deferred.promise;
};
return factory;
}]);
})();