(function() {
'use strict';
angular.module('app.analytics')
.service('TransactionAnalyticsService', ['CategorizationService', '$q', function(CategorizationService, $q) {
var CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
this.getSpendingInsights = function() {
var deferred = $q.defer();
CategorizationService.getCategorizedTransactions().then(function(transactions) {
var currentMonthSpending = aggregateByCategory(transactions);
var monthlyTrends = aggregateByMonth(transactions);
var topCategory = findTopCategory(currentMonthSpending);
var analyticsData = {
currentMonthSpending: currentMonthSpending,
monthlyTrends: monthlyTrends,
topCategory: topCategory,
lastUpdated: new Date()
};
deferred.resolve(analyticsData);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
function aggregateByCategory(transactions) {
var categoryMap = {};
CATEGORIES.forEach(function(cat) {
categoryMap[cat] = {category: cat, amount: 0, transactionCount: 0};
});
var total = 0;
transactions.forEach(function(txn) {
var cat = txn.category || 'Miscellaneous';
if (categoryMap[cat]) {
categoryMap[cat].amount += txn.amount || 0;
categoryMap[cat].transactionCount++;
total += txn.amount || 0;
}
});
var result = [];
CATEGORIES.forEach(function(cat) {
var catData = categoryMap[cat];
catData.percentage = total > 0 ? Math.round((catData.amount / total) * 100) : 0;
result.push(catData);
});
return result;
}
function aggregateByMonth(transactions) {
var monthMap = {};
transactions.forEach(function(txn) {
var date = new Date(txn.date);
var monthKey = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
if (!monthMap[monthKey]) {
monthMap[monthKey] = {month: monthKey, totalSpend: 0, categoryBreakdown: []};
}
monthMap[monthKey].totalSpend += txn.amount || 0;
});
var result = [];
for (var key in monthMap) {
if (monthMap.hasOwnProperty(key)) {
result.push(monthMap[key]);
}
}
result.sort(function(a, b) {
return a.month.localeCompare(b.month);
});
return result;
}
function findTopCategory(categorySpending) {
var top = null;
var maxAmount = 0;
categorySpending.forEach(function(cat) {
if (cat.amount > maxAmount) {
maxAmount = cat.amount;
top = cat.category;
}
});
return top || 'N/A';
}
}]);
})();