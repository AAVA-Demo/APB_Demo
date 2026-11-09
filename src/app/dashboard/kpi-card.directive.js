(function(){
'use strict';
angular.module('creditCardApp').directive('kpiCard',[function(){
return{restrict:'E',scope:{icon:'@',label:'@',value:'@',prefix:'@'},template:'<div class="kpi-card"><div class="kpi-icon"><i class="fa {{icon}}"></i></div><div class="kpi-value">{{prefix}}{{value}}</div><div class="kpi-label">{{label}}</div></div>'};
}]);