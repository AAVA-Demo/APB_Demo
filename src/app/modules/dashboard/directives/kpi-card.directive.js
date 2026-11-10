(function() {
'use strict';
angular.module('dashboard.module')
.directive('kpiCard', [function() {
return {
restrict: 'E',
scope: {
title: '@',
value: '@',
icon: '@'
},
template: '<div class="panel panel-primary kpi-card"><div class="panel-body"><div class="kpi-icon"><i class="glyphicon" ng-class="icon"></i></div><div class="kpi-content"><h4>{{title}}</h4><h2>{{value}}</h2></div></div></div>'
};
}]);
})();