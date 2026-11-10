(function() {
'use strict';
angular.module('app.dashboard')
.directive('dashboardWidget', [function() {
return {
restrict: 'E',
scope: {
title: '=',
value: '=',
type: '='
},
template: '<div class="panel panel-primary"><div class="panel-heading"><h4>{{title}}</h4></div><div class="panel-body"><h3 ng-if="type === \'currency\'">{{value | currency}}</h3><h3 ng-if="type !== \'currency\'">{{value}}</h3></div></div>'
};
}]);
})();