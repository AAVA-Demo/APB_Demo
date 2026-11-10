(function(){
'use strict';
angular.module('creditCard.dashboard').directive('kpiCard',[function(){
return{restrict:'E',scope:{title:'@',value:'@',icon:'@'},template:'<div class="kpi-card"><h3><i class="glyphicon {{icon}}"></i> {{title}}</h3><div class="value">{{value}}</div></div>'};
}]);
})();