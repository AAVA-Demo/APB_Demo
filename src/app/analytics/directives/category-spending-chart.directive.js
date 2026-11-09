(function(){
'use strict';
angular.module('creditCard.analytics').directive('categorySpendingChart',[function(){
return{restrict:'E',scope:{data:'='},template:'<div class="chart-container"><h3>Category-Wise Spending</h3><canvas id="categoryChart" width="400" height="400"></canvas></div>'};
}]);
})();