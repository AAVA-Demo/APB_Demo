(function(){
'use strict';
angular.module('app.dashboard').directive('kpiCard',[function(){
return{
restrict:'E',
scope:{label:'@',value:'=',format:'@'},
template:'<div class="kpi-card"><h3>{{formattedValue}}</h3><p>{{label}}</p></div>',
link:function(scope,element,attrs){
scope.$watch('value',function(newVal){
if(scope.format==='currency'){
scope.formattedValue='$'+(newVal||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}else{
scope.formattedValue=(newVal||0).toLocaleString('en-US');
}
});
}
};
}]);
})();