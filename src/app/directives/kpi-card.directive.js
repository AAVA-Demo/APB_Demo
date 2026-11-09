(function(){
'use strict';
angular.module('creditCardApp').directive('kpiCard',[function(){
return{
restrict:'E',
scope:{
label:'=',
value:'=',
format:'='
},
template:'<div class="kpi-card"><h3>{{formattedValue}}</h3><p>{{label}}</p></div>',
link:function(scope){
scope.$watch('value',function(newVal){
if(scope.format==='currency'){
scope.formattedValue='$'+(newVal||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
}else{
scope.formattedValue=newVal||0;
}
});
}
};
}]);
})();