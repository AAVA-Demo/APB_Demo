(function() {
  'use strict';
  angular.module('transactionModule')
    .controller('TransactionListController', ['$scope', 'TransactionService', 'CardDataFactory', 'DateUtilService', 'NotificationService', TransactionListController]);

  function TransactionListController($scope, TransactionService, CardDataFactory, DateUtilService, NotificationService) {
    var vm = this;
    vm.transactions = [];
    vm.cards = [];
    vm.categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    vm.loading = true;
    vm.error = null;
    vm.filterCriteria = {
      startDate: DateUtilService.getDateDaysAgo(30),
      endDate: new Date(),
      cardId: '',
      category: '',
      pageNumber: 1,
      pageSize: 50
    };
    vm.pagination = {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0
    };

    vm.init = function() {
      vm.loadCards();
      vm.loadTransactions();
    };

    vm.loadCards = function() {
      CardDataFactory.getCards()
        .then(function(cards) {
          vm.cards = cards;
        })
        .catch(function(error) {
          NotificationService.error('Failed to load credit cards');
        });
    };

    vm.loadTransactions = function() {
      vm.loading = true;
      TransactionService.getTransactions(vm.filterCriteria)
        .then(function(response) {
          vm.transactions = response.transactions;
          vm.pagination.totalCount = response.total;
          vm.pagination.totalPages = Math.ceil(response.total / vm.filterCriteria.pageSize);
          vm.pagination.currentPage = vm.filterCriteria.pageNumber;
          vm.loading = false;
          vm.error = null;
        })
        .catch(function(error) {
          vm.loading = false;
          vm.error = 'Failed to load transactions. Please try again.';
          NotificationService.error('Failed to load transactions');
        });
    };

    vm.applyFilter = function() {
      vm.filterCriteria.pageNumber = 1;
      vm.loadTransactions();
    };

    vm.resetFilter = function() {
      vm.filterCriteria = {
        startDate: DateUtilService.getDateDaysAgo(30),
        endDate: new Date(),
        cardId: '',
        category: '',
        pageNumber: 1,
        pageSize: 50
      };
      vm.loadTransactions();
    };

    vm.goToPage = function(page) {
      if (page >= 1 && page <= vm.pagination.totalPages) {
        vm.filterCriteria.pageNumber = page;
        vm.loadTransactions();
      }
    };

    vm.nextPage = function() {
      vm.goToPage(vm.pagination.currentPage + 1);
    };

    vm.previousPage = function() {
      vm.goToPage(vm.pagination.currentPage - 1);
    };

    vm.init();
  }
})();