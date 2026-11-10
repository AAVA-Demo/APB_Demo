(function() {
  'use strict';
  angular.module('transactionModule').service('PaginationService', PaginationService);
  PaginationService.$inject = [];
  function PaginationService() {
    var vm = this;
    vm.createState = function(currentPage, pageSize, totalRecords) {
      return {
        currentPage: currentPage || 1,
        pageSize: pageSize || 50,
        totalRecords: totalRecords || 0,
        totalPages: Math.ceil((totalRecords || 0) / (pageSize || 50))
      };
    };
    vm.updateState = function(state, totalRecords) {
      state.totalRecords = totalRecords;
      state.totalPages = Math.ceil(totalRecords / state.pageSize);
      return state;
    };
    vm.nextPage = function(state) {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
      }
      return state;
    };
    vm.prevPage = function(state) {
      if (state.currentPage > 1) {
        state.currentPage--;
      }
      return state;
    };
    vm.goToPage = function(state, page) {
      if (page >= 1 && page <= state.totalPages) {
        state.currentPage = page;
      }
      return state;
    };
  }
})();