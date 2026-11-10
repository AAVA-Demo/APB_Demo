(function(){
'use strict';
angular.module('spendingAnalytics').directive('categoryFilter',categoryFilter);
function categoryFilter(){
return{restrict:'E',scope:{categories:'=',selectedCategory:'=',onFilterChange:'&'},templateUrl:'src/app/analytics/views/category-filter.html'};
}
})();