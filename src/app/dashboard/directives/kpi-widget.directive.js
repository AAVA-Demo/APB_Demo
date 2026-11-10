(function(){
'use strict';
angular.module('app.creditCard.dashboard').directive('kpiWidget',kpiWidget);
function kpiWidget(){
return{
restrict:'E',
scope:{title:'=',value:'=',icon:'='},
template:'<div class="panel panel-info kpi-widget"><div class="panel-heading"><span class="glyphicon" ng-class="icon"></span> {{title}}</div><div class="panel-body"><h3>${{value | number:2}}</h3></div></div>'
};
}
})();