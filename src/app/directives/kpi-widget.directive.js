(function(){
'use strict';
angular.module('creditCardApp').directive('kpiWidgetDirective',[function(){
return{
restrict:'E',
scope:{label:'@',value:'@',icon:'@'},
template:'<div class="kpi-card"><div><i class="glyphicon {{icon}}" style="font-size:36px;color:#007bff;"></i></div><div class="kpi-value">{{value}}</div><div class="kpi-label">{{label}}</div></div>'
};
}]);
})();