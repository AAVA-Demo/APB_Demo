(function() {
  'use strict';
  angular.module('creditCard.analyticsModule')
    .factory('CategoryModel', [function() {
      function CategoryModel(data) {
        this.categoryName = data.categoryName;
        this.totalSpend = data.totalSpend || 0;
        this.transactionCount = data.transactionCount || 0;
        this.percentageOfTotal = data.percentageOfTotal || 0;
        this.monthlyTrend = data.monthlyTrend || [];
      }
      CategoryModel.prototype.getAverageTransaction = function() {
        return this.transactionCount > 0 ? (this.totalSpend / this.transactionCount).toFixed(2) : 0;
      };
      CategoryModel.prototype.getTrendDirection = function() {
        if (this.monthlyTrend.length < 2) return 'stable';
        var recent = this.monthlyTrend[this.monthlyTrend.length - 1].amount;
        var previous = this.monthlyTrend[this.monthlyTrend.length - 2].amount;
        if (recent > previous) return 'up';
        if (recent < previous) return 'down';
        return 'stable';
      };
      return CategoryModel;
    }]);
})();