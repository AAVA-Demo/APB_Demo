(function() {
'use strict';
angular.module('multiCardManagement.module')
.directive('cardListItem', [function() {
return {
restrict: 'E',
scope: {
card: '=',
onSelect: '&',
isSelected: '&'
},
template: '<div class="card-item panel" ng-class="{\"panel-primary\": isSelected({card: card}), \"panel-default\": !isSelected({card: card})}"><div class="panel-body"><div class="row"><div class="col-xs-8"><h4>{{card.issuerName}}</h4><p><strong>{{card.cardType}}</strong> ending in {{card.cardNumber}}</p><p><span class="label" ng-class="{\"label-success\": card.status === \"Active\", \"label-danger\": card.status !== \"Active\"}">{{card.status}}</span></p></div><div class="col-xs-4 text-right"><button class="btn btn-sm" ng-class="{\"btn-primary\": isSelected({card: card}), \"btn-default\": !isSelected({card: card})}" ng-click="onSelect({card: card})">{{isSelected({card: card}) ? \"Deselect\" : \"Select\"}}</button></div></div><hr><div class="row"><div class="col-xs-6"><small><strong>Credit Limit:</strong><br>₹{{card.creditLimit | number:0}}</small></div><div class="col-xs-6"><small><strong>Available:</strong><br>₹{{card.availableCredit | number:0}}</small></div></div><div class="row" style="margin-top:10px;"><div class="col-xs-6"><small><strong>Outstanding:</strong><br>₹{{card.outstandingBalance | number:0}}</small></div><div class="col-xs-6"><small><strong>Utilization:</strong><br>{{((card.outstandingBalance / card.creditLimit) * 100).toFixed(1)}}%</small></div></div></div></div>'
};
}]);
})();