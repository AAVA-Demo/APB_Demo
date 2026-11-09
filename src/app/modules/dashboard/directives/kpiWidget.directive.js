(function(){
'use strict';
angular.module('dashboard').directive('kpiWidget',[function(){
return{
restrict:'E',
scope:{label:'@',value:'=',icon:'@'},
templateUrl:'src/app/modules/dashboard/views/kpiWidget.html'
};
}]);
})();