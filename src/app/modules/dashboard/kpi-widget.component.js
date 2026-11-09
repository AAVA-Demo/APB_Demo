(function(){
'use strict';
angular.module('app.dashboard').component('kpiWidget',{bindings:{title:'@',value:'<',icon:'@',color:'@'},template:'<div class="kpi-widget panel" ng-class="$ctrl.color"><div class="panel-body"><div class="row"><div class="col-xs-3"><i class="glyphicon" ng-class="$ctrl.icon"></i></div><div class="col-xs-9 text-right"><div class="kpi-value">{{$ctrl.value|currency}}</div><div class="kpi-title">{{$ctrl.title}}</div></div></div></div></div>',controller:function(){var ctrl=this;}});
})();