(function(){
'use strict';
angular.module('dashboardModule').directive('kpiCard',[function(){
return{
restrict:'E',
scope:{label:'@',value:'=',icon:'@',trend:'@'},
template:'<div class="kpi-card panel panel-primary"><div class="panel-heading"><h4><i class="glyphicon glyphicon-{{icon}}"></i> {{label}}</h4></div><div class="panel-body"><h2>{{value|currency:"₹":0}}</h2><span ng-if="trend" class="trend-indicator">{{trend}}</span></div></div>'
};
}]);
})();