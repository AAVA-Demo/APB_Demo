(function() {
  'use strict';
  angular.module('transactions')
    .controller('transactionController', ['$scope', 'transactionService', 'creditCardService', function($scope, transactionService, creditCardService) {
      var vm = this;
      vm.transactions = [];
      vm.cards = [];
      vm.selectedCard = null;
      vm.currentPage = 1;
      vm.pageSize = 10;
      vm.totalRecords = 0;
      vm.totalPages = 0;
      vm.loading = true;
      vm.init = function() {
        creditCardService.getAllCards().then(function(cards) {
          vm.cards = cards;
          vm.loadTransactions();
        });
      };
      vm.loadTransactions = function() {
        vm.loading = true;
        transactionService.getTransactions(vm.currentPage, vm.pageSize, vm.selectedCard).then(function(result) {
          vm.transactions = result.data;
          vm.totalRecords = result.total;
          vm.totalPages = Math.ceil(vm.totalRecords / vm.pageSize);
          vm.loading = false;
        }).catch(function(err) {
          console.error('Error loading transactions:', err);
          vm.loading = false;
        });
      };
      vm.updatePage = function(page) {
        if (page < 1 || page > vm.totalPages) return;
        vm.currentPage = page;
        vm.loadTransactions();
      };
      vm.filterByCard = function() {
        vm.currentPage = 1;
        vm.loadTransactions();
      };
      vm.init();
    }]);