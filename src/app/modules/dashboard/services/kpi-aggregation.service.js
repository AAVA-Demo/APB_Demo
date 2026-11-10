(function() {
'use strict';
angular.module('dashboard.module')
.service('KPIAggregationService', ['$q', 'CreditCardDataFactory', 'TransactionProcessingFactory', function($q, CreditCardDataFactory, TransactionProcessingFactory) {
var self = this;
self.getKPIs = function(userId) {
var deferred = $q.defer();
$q.all({
cards: CreditCardDataFactory.getAllCards(userId),
transactions: TransactionProcessingFactory.getMonthlySpend(userId)
}).then(function(results) {
var cards = results.cards;
var monthlySpend = results.transactions.monthlySpend;
var totalCreditLimit = 0;
var availableCredit = 0;
var outstandingAmount = 0;
cards.forEach(function(card) {
totalCreditLimit += card.creditLimit;
availableCredit += card.availableCredit;
outstandingAmount += card.outstandingBalance;
});
var kpiSummary = {
userId: userId,
monthlySpend: monthlySpend,
totalCreditLimit: totalCreditLimit,
availableCredit: availableCredit,
outstandingAmount: outstandingAmount,
lastUpdated: new Date(),
cardCount: cards.length
};
deferred.resolve(kpiSummary);
}).catch(function(error) {
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();