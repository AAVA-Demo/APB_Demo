(function() {
'use strict';
angular.module('app.dashboard')
.factory('KPICalculator', [function() {
return {
calculateKPIs: function(cards, transactions) {
var totalCreditLimit = 0;
var totalOutstanding = 0;
var totalAvailable = 0;
var monthlySpend = 0;
if (cards && cards.length > 0) {
cards.forEach(function(card) {
totalCreditLimit += card.creditLimit || 0;
totalOutstanding += card.outstandingAmount || 0;
totalAvailable += card.availableCredit || 0;
});
}
if (transactions && transactions.length > 0) {
transactions.forEach(function(txn) {
monthlySpend += txn.amount || 0;
});
}
var creditUtilization = totalCreditLimit > 0 ? Math.round((totalOutstanding / totalCreditLimit) * 100) : 0;
return {
monthlySpend: monthlySpend,
totalCreditLimit: totalCreditLimit,
availableCredit: totalAvailable,
outstandingAmount: totalOutstanding,
creditUtilization: creditUtilization,
lastUpdated: new Date()
};
}
};
}]);
})();