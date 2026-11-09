(function() {
  'use strict';
  angular.module('creditCard.transactions')
    .controller('TransactionController', ['$scope', 'TransactionDataService', 'CreditCardService', 'DateTimeService', function($scope, TransactionDataService, CreditCardService, DateTimeService) {
      var vm = this;
      vm.transactions = [];
      vm.cards = [];
      vm.selectedCard = null;
      vm.selectedTransaction = null;
      vm.pagination = {
        currentPage: 1,
        pageSize: 25,
        totalRecords: 0,
        totalPages: 0
      };
      vm.loading = true;
      vm.error = null;
      vm.loadCards = function() {
        CreditCardService.getCards().then(function(cards) {
          vm.cards = cards;
          $scope.$apply();
        }).catch(function(error) {
          console.error('Error loading cards:', error);
        });
      };
      vm.loadTransactions = function() {
        vm.loading = true;
        vm.error = null;
        var params = {
          page: vm.pagination.currentPage,
          size: vm.pagination.pageSize
        };
        if (vm.selectedCard) {
          params.cardId = vm.selectedCard;
        }
        TransactionDataService.getTransactions(params).then(function(data) {
          vm.transactions = data.transactions || [];
          vm.transactions.forEach(function(txn) {
            txn.formattedTimestamp = DateTimeService.formatTimestamp(txn.timestamp);
          });
          vm.pagination.totalRecords = data.totalRecords || 0;
          vm.pagination.totalPages = Math.ceil(vm.pagination.totalRecords / vm.pagination.pageSize);
          vm.loading = false;
          $scope.$apply();
        }).catch(function(error) {
          vm.error = 'Failed to load transactions. Please try again.';
          vm.loading = false;
          $scope.$apply();
        });
      };
      vm.applyFilter = function() {
        vm.pagination.currentPage = 1;
        vm.loadTransactions();
      };
      vm.goToPage = function(page) {
        if (page >= 1 && page <= vm.pagination.totalPages) {
          vm.pagination.currentPage = page;
          vm.loadTransactions();
        }
      };
      vm.viewDetails = function(transaction) {
        vm.selectedTransaction = transaction;
      };
      vm.closeDetails = function() {
        vm.selectedTransaction = null;
      };
      vm.loadCards();
      vm.loadTransactions();
    }]);
})();