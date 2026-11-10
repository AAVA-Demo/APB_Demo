(function() {
'use strict';
angular.module('multiCardManagement.module')
.directive('cardFilter', [function() {
return {
restrict: 'E',
scope: {
filterCriteria: '=',
onApply: '&',
onClear: '&'
},
template: '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">Filter Cards</h4></div><div class="panel-body"><form class="form-inline"><div class="form-group"><label>Card Type:</label><select class="form-control" ng-model="filterCriteria.cardType"><option value="">All</option><option value="Visa">Visa</option><option value="Mastercard">Mastercard</option><option value="Amex">Amex</option></select></div><div class="form-group" style="margin-left:10px;"><label>Issuer:</label><select class="form-control" ng-model="filterCriteria.issuer"><option value="">All</option><option value="HDFC Bank">HDFC Bank</option><option value="ICICI Bank">ICICI Bank</option><option value="American Express">American Express</option><option value="SBI Card">SBI Card</option><option value="Axis Bank">Axis Bank</option></select></div><div class="form-group" style="margin-left:10px;"><label>Status:</label><select class="form-control" ng-model="filterCriteria.status"><option value="">All</option><option value="Active">Active</option><option value="Blocked">Blocked</option><option value="Expired">Expired</option></select></div><button type="button" class="btn btn-primary" style="margin-left:10px;" ng-click="onApply()">Apply</button><button type="button" class="btn btn-default" style="margin-left:5px;" ng-click="onClear()">Clear</button></form></div></div>'
};
}]);
})();