(function(){
'use strict';
angular.module('creditCard.dashboard').directive('kpiCard',[function(){
return{restrict:'E',scope:{title:'@',value:'=',icon:'@',format:'@'},template:'<div class="kpi-card"><h3>{{title}}</h3><div class="value">{{formattedValue}}</div><div class="icon" ng-if="icon"><span class="glyphicon" ng-class="icon"></span></div></div>',link:function(scope){
scope.$watch('value',function(newVal){
if(scope.format==='currency'){
scope.formattedValue='$'+(newVal||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}else if(scope.format==='percentage'){
scope.formattedValue=(newVal||0)+'%';
}else{
scope.formattedValue=(newVal||0).toLocaleString('en-US');
}
});
}};
}]);
})();