(function() {
'use strict';
angular.module('app.dashboard')
.service('KPIService', ['CreditCardService', 'TransactionService', 'KPICalculator', '$q', function(CreditCardService, TransactionService, KPICalculator, $q) {
this.getKPIs = function() {
var deferred = $q.defer();
$q.all([
CreditCardService.getAllCards(),
TransactionService.getMonthlySpend()
]).then(function(results) {
var cards = results[0];
var transactions = results[1];
var kpiData = KPICalculator.calculateKPIs(cards, transactions);
deferred.resolve(kpiData);
}).catch(function(err) {
deferred.reject(err);
});
return deferred.promise;
};
}]);
})();