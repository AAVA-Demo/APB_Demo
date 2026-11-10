(function() {
'use strict';
angular.module('spendingAnalytics.module')
.service('CategoryClassificationService', [function() {
var self = this;
var CATEGORIES = [
'Food & Dining', 'Fuel', 'Shopping', 'Travel',
'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
];
self.getCategories = function() {
return CATEGORIES;
};
self.classifyTransactions = function(transactions) {
return transactions.map(function(txn) {
if (!txn.category || CATEGORIES.indexOf(txn.category) === -1) {
txn.category = 'Miscellaneous';
}
return txn;
});
};
}]);
})();