(function(){
'use strict';
angular.module('creditCardDashboard').directive('creditCardWidget',creditCardWidget);
function creditCardWidget(){
return{restrict:'E',scope:{card:'='},templateUrl:'src/app/dashboard/views/credit-card-widget.html'};
}
})();