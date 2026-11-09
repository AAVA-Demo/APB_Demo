(function() {
  'use strict';
  angular.module('cardManagementModule')
    .controller('CardDetailController', ['$scope', '$routeParams', '$location', 'CardService', 'TransactionService', function($scope, $routeParams, $location, CardService, TransactionService) {
      var vm = this;
      vm.card = null;
      vm.transactions = [];
      vm.spendAnalysis = null;
      vm.loading = true;
      vm.error = null;
      vm.cardId = $routeParams.cardId;
      vm.allCards = [];
      vm.loadCardDetails = function() {
        vm.loading = true;
        CardService.getCardById(vm.cardId).then(function(card) {
          vm.card = card;
          return TransactionService.getTransactionsByCard(vm.cardId);
        }).then(function(transactions) {
          vm.transactions = transactions;
          vm.spendAnalysis = vm.calculateSpendAnalysis(transactions);
          vm.loading = false;
        }).catch(function(err) {
          vm.error = 'Failed to load card details. Please try again.';
          vm.loading = false;
        });
      };
      vm.calculateSpendAnalysis = function(transactions) {
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        var lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        var lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        var currentMonthSpend = 0;
        var lastMonthSpend = 0;
        var yearToDateSpend = 0;
        var categoryCount = {};
        transactions.forEach(function(txn) {
          var txnDate = new Date(txn.date);
          var amount = txn.amount || 0;
          if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
            currentMonthSpend += amount;
          }
          if (txnDate.getMonth() === lastMonth && txnDate.getFullYear() === lastMonthYear) {
            lastMonthSpend += amount;
          }
          if (txnDate.getFullYear() === currentYear) {
            yearToDateSpend += amount;
          }
          var cat = txn.category || 'Miscellaneous';
          categoryCount[cat] = (categoryCount[cat] || 0) + amount;
        });
        var topCategory = Object.keys(categoryCount).reduce(function(a, b) {
          return categoryCount[a] > categoryCount[b] ? a : b;
        }, 'Miscellaneous');
        return {
          cardId: vm.cardId,
          currentMonthSpend: currentMonthSpend,
          lastMonthSpend: lastMonthSpend,
          yearToDateSpend: yearToDateSpend,
          topCategory: topCategory,
          transactionCount: transactions.length
        };
      };
      vm.switchCard = function(cardId) {
        $location.path('/cards/' + cardId);
      };
      vm.goBack = function() {
        $location.path('/cards');
      };
      CardService.getAllCards('user123').then(function(cards) {
        vm.allCards = cards;
      });
      vm.loadCardDetails();
    }]);
})();