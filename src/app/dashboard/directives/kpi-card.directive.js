(function(){
'use strict';
angular.module('app.dashboard').directive('kpiCard',[function(){
return{restrict:'E',scope:{title:'=',value:'=',format:'='},templateUrl:'src/app/dashboard/directives/kpi-card.template.html',link:function(scope){
scope.getFormattedValue=function(){
if(!scope.value)return'$0';
if(scope.format==='currency'){
return'$'+scope.value.toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0});
}
return scope.value.toString();
};
}};
}]);
})();