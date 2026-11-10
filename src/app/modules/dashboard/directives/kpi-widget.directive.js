(function(){
'use strict';
angular.module('creditCard.dashboard').directive('kpiWidget',[function(){
return{
restrict:'E',scope:{label:'@',value:'=',format:'@'},template:'<div class="kpi-card"><div class="kpi-label">{{label}}</div><div class="kpi-value">{{formattedValue}}</div></div>',link:function(scope){
scope.$watch('value',function(newVal){
if(scope.format==="currency"){
scope.formattedValue='$'+(newVal||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
}else if(scope.format==="percent"){
scope.formattedValue=(newVal||0)+'%';
}else{
scope.formattedValue=(newVal||0).toFixed(2);
}
});
}
};
}]);
})();