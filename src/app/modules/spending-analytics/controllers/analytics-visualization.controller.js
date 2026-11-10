(function() {
'use strict';
angular.module('spendingAnalytics.module')
.controller('AnalyticsVisualizationController', ['$scope', 'AnalyticsProcessingService', 'CategoryClassificationService', function($scope, AnalyticsProcessingService, CategoryClassificationService) {
var vm = this;
vm.chartData = null;
vm.categories = CategoryClassificationService.getCategories();
}]);
})();