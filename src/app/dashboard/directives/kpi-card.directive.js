(function(){
'use strict';
angular.module('dashboardModule').directive('kpiCard',[function(){
return{restrict:'E',scope:{title:'=',value:'=',icon:'=',format:'='},templateUrl:'src/app/dashboard/directives/kpi-card.template.html',link:function(scope){
scope.formattedValue=function(){
if(scope.format==='currency'){
return '$'+(scope.value||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');}
return scope.value||0;};
}};
}]);
})();