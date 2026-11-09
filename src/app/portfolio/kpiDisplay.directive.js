(function(){'use strict';angular.module('portfolioModule').directive('kpiDisplay',[function(){return{restrict:'E',scope:{label:'@',value:'=',suffix:'@'},template:'<div class="kpi-card">'+
'<div class="kpi-label">{{label}}</div>'+
'<div class="kpi-value">{{value}}{{suffix}}</div>'+
'</div>'};}]);})();