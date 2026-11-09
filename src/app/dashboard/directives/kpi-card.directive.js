(function(){'use strict';angular.module('dashboardModule').directive('kpiCard',function(){return{restrict:'E',scope:{kpiValue:'=',kpiLabel:'@',kpiCurrency:'@'},template:'<div class="kpi-card">'+
'<h3>{{kpiLabel}}</h3>'+
'<div class="kpi-value">{{kpiCurrency}} {{kpiValue | number:2}}</div>'+
'</div>'};});})();