(function() {
'use strict';
angular.module('spendingAnalytics.module')
.service('AnalyticsProcessingService', ['$q', 'TransactionDataFactory', 'CategoryClassificationService', function($q, TransactionDataFactory, CategoryClassificationService) {
var self = this;
self.getAnalytics = function(userId, dateRange) {
var deferred = $q.defer();
TransactionDataFactory.fetchTransactions(userId, 12).then(function(transactions) {
var categorizedTransactions = CategoryClassificationService.classifyTransactions(transactions);
var monthlyTrends = self.aggregateMonthlyTrends(categorizedTransactions);
var categoryBreakdown = self.aggregateCategoryBreakdown(categorizedTransactions);
var summary = {
userId: userId,
monthlyTrends: monthlyTrends,
categoryBreakdown: categoryBreakdown,
totalTransactions: transactions.length,
dateRange: dateRange
};
deferred.resolve(summary);
}).catch(function(error) {
deferred.reject(error);
});
return deferred.promise;
};
self.aggregateMonthlyTrends = function(transactions) {
var monthMap = {};
transactions.forEach(function(txn) {
var monthKey = txn.date.getFullYear() + '-' + (txn.date.getMonth() + 1);
if (!monthMap[monthKey]) {
monthMap[monthKey] = 0;
}
monthMap[monthKey] += txn.amount;
});
var trends = [];
for (var key in monthMap) {
trends.push({month: key, totalSpend: monthMap[key]});
}
return trends.sort(function(a, b) {
return a.month.localeCompare(b.month);
});
};
self.aggregateCategoryBreakdown = function(transactions) {
var categoryMap = {};
var total = 0;
transactions.forEach(function(txn) {
if (!categoryMap[txn.category]) {
categoryMap[txn.category] = 0;
}
categoryMap[txn.category] += txn.amount;
total += txn.amount;
});
var breakdown = [];
for (var cat in categoryMap) {
breakdown.push({
category: cat,
amount: categoryMap[cat],
percentage: ((categoryMap[cat] / total) * 100).toFixed(1)
});
}
return breakdown.sort(function(a, b) {
return b.amount - a.amount;
});
};
}]);
})();