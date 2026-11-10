(function(){
'use strict';
angular.module('dashboardModule').directive('kpiCard',[function(){
return{
restrict:'E',scope:{label:'@',value:'@',icon:'@'},template:'<div class="kpi-card"><div class="kpi-icon {{icon}}"></div><div class="kpi-content"><div class="kpi-label">{{label}}</div><div class="kpi-value">{{value}}</div></div></div>'
};
}]);
})();