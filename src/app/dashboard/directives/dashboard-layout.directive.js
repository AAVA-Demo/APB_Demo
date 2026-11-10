(function(){
'use strict';
angular.module('dashboardModule').directive('dashboardLayout',[function(){
return{
restrict:'A',link:function(scope,element){
element.addClass('dashboard-layout');
}
};
}]);
})();