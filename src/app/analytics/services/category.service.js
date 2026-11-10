(function() {
  'use strict';
  angular.module('analyticsModule').service('CategoryService', CategoryService);
  CategoryService.$inject = [];
  function CategoryService() {
    var vm = this;
    vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.getCategories = function() {
      return vm.categories;
    };
    vm.validateCategory = function(category) {
      return vm.categories.indexOf(category) !== -1;
    };
  }
})();