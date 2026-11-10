(function(){
'use strict';
angular.module('creditCardApp').directive('kpiCard',function(){
return {restrict:'E',scope:{label:'=',value:'=',format:'='},template:'<div class="kpi-card panel panel-info"><div class="panel-heading"><h4>{{label}}</h4></div><div class="panel-body"><h2 ng-if="format===\'currency\'">{{value | currency}}</h2><h2 ng-if="format!==\'currency\'">{{value}}</h2></div></div>'};
});
})();