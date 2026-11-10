(function() {
'use strict';
angular.module('spendingAnalytics.module')
.factory('TransactionDataFactory', ['$http', '$q', function($http, $q) {
var factory = {};
factory.fetchTransactions = function(userId, months) {
var deferred = $q.defer();
var mockTransactions = [];
var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
var merchants = ['Restaurant A', 'Gas Station B', 'Store C', 'Airline D', 'Cinema E', 'Electric Co', 'Hospital F', 'School G', 'Misc H'];
for (var i = 0; i < 1200; i++) {
var randomMonth = Math.floor(Math.random() * 12);
var txnDate = new Date();
txnDate.setMonth(txnDate.getMonth() - randomMonth);
txnDate.setDate(Math.floor(Math.random() * 28) + 1);
var randomCategory = categories[Math.floor(Math.random() * categories.length)];
var randomAmount = Math.floor(Math.random() * 5000) + 100;
mockTransactions.push({
id: 'txn' + i,
cardId: 'c' + (Math.floor(Math.random() * 5) + 1),
amount: randomAmount,
category: randomCategory,
date: txnDate,
description: 'Transaction ' + i,
merchantName: merchants[categories.indexOf(randomCategory)]
});
}
setTimeout(function() {
deferred.resolve(mockTransactions);
}, 800);
return deferred.promise;
};
return factory;
}]);
})();