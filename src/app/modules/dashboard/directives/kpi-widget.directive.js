(function(){
'use strict';
angular.module('dashboardModule').directive('kpiWidget',[function(){
return{restrict:'E',scope:{label:'@',value:'=',icon:'@'},template:'<div class="kpi-widget"><div class="kpi-icon">{{icon}}</div><div class="kpi-value">{{value|currency}}</div><div class="kpi-label">{{label}}</div></div>'};
}]);
})();