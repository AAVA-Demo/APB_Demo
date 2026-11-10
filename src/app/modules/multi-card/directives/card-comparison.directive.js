(function() {
'use strict';
angular.module('multiCardManagement.module')
.directive('cardComparison', [function() {
return {
restrict: 'E',
scope: {
comparisonData: '=',
onClose: '&'
},
template: '<div class="panel panel-info" ng-if="comparisonData"><div class="panel-heading"><h3 class="panel-title">Card Comparison <button class="btn btn-xs btn-default pull-right" ng-click="onClose()">Close</button></h3></div><div class="panel-body"><div class="row"><div class="col-md-4"><div class="alert alert-success"><strong>Highest Credit Limit</strong><br>Card: {{comparisonData.comparisonMetrics.highestLimit.cardNumber}}<br>Limit: ₹{{comparisonData.comparisonMetrics.highestLimit.limit | number:0}}</div></div><div class="col-md-4"><div class="alert alert-info"><strong>Lowest Utilization</strong><br>Card: {{comparisonData.comparisonMetrics.lowestUtilization.cardNumber}}<br>Utilization: {{comparisonData.comparisonMetrics.lowestUtilization.utilization}}%</div></div><div class="col-md-4"><div class="alert alert-warning"><strong>Highest Spend</strong><br>Card: {{comparisonData.comparisonMetrics.highestSpend.cardNumber}}<br>Spend: ₹{{comparisonData.comparisonMetrics.highestSpend.spend | number:0}}</div></div></div><hr><h4>Selected Cards</h4><table class="table table-bordered"><thead><tr><th>Card</th><th>Issuer</th><th>Credit Limit</th><th>Available</th><th>Outstanding</th><th>Utilization</th></tr></thead><tbody><tr ng-repeat="card in comparisonData.cards"><td>{{card.cardNumber}}</td><td>{{card.issuerName}}</td><td>₹{{card.creditLimit | number:0}}</td><td>₹{{card.availableCredit | number:0}}</td><td>₹{{card.outstandingBalance | number:0}}</td><td>{{((card.outstandingBalance / card.creditLimit) * 100).toFixed(1)}}%</td></tr></tbody></table></div></div>'
};
}]);
})();