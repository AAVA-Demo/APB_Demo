(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('transactionService', ['$http', '$q', 'creditCardService', function($http, $q, creditCardService) {
      var mockTransactions = [
        {transactionId: 'T001', cardId: 'CC001', date: new Date('2026-11-01'), merchant: 'Starbucks', category: 'Food & Dining', amount: 450, currency: 'INR'},
        {transactionId: 'T002', cardId: 'CC001', date: new Date('2026-11-02'), merchant: 'Shell Fuel', category: 'Fuel', amount: 2500, currency: 'INR'},
        {transactionId: 'T003', cardId: 'CC002', date: new Date('2026-11-03'), merchant: 'Amazon', category: 'Shopping', amount: 3200, currency: 'INR'},
        {transactionId: 'T004', cardId: 'CC003', date: new Date('2026-11-04'), merchant: 'Uber', category: 'Travel', amount: 850, currency: 'INR'},
        {transactionId: 'T005', cardId: 'CC001', date: new Date('2026-11-05'), merchant: 'Netflix', category: 'Entertainment', amount: 799, currency: 'INR'},
        {transactionId: 'T006', cardId: 'CC002', date: new Date('2026-11-06'), merchant: 'Electricity Board', category: 'Utilities', amount: 1500, currency: 'INR'},
        {transactionId: 'T007', cardId: 'CC003', date: new Date('2026-11-07'), merchant: 'Apollo Pharmacy', category: 'Healthcare', amount: 650, currency: 'INR'},
        {transactionId: 'T008', cardId: 'CC001', date: new Date('2026-11-08'), merchant: 'Coursera', category: 'Education', amount: 2999, currency: 'INR'},
        {transactionId: 'T009', cardId: 'CC002', date: new Date('2026-11-09'), merchant: 'Misc Store', category: 'Miscellaneous', amount: 500, currency: 'INR'},
        {transactionId: 'T010', cardId: 'CC003', date: new Date('2026-11-10'), merchant: 'Pizza Hut', category: 'Food & Dining', amount: 1200, currency: 'INR'},
        {transactionId: 'T011', cardId: 'CC001', date: new Date('2026-10-15'), merchant: 'HP Fuel', category: 'Fuel', amount: 3000, currency: 'INR'},
        {transactionId: 'T012', cardId: 'CC002', date: new Date('2026-10-20'), merchant: 'Flipkart', category: 'Shopping', amount: 4500, currency: 'INR'},
        {transactionId: 'T013', cardId: 'CC003', date: new Date('2026-10-25'), merchant: 'Ola', category: 'Travel', amount: 600, currency: 'INR'},
        {transactionId: 'T014', cardId: 'CC001', date: new Date('2026-10-28'), merchant: 'Spotify', category: 'Entertainment', amount: 119, currency: 'INR'},
        {transactionId: 'T015', cardId: 'CC002', date: new Date('2026-09-10'), merchant: 'Water Bill', category: 'Utilities', amount: 800, currency: 'INR'},
        {transactionId: 'T016', cardId: 'CC003', date: new Date('2026-09-15'), merchant: 'Max Hospital', category: 'Healthcare', amount: 5000, currency: 'INR'},
        {transactionId: 'T017', cardId: 'CC001', date: new Date('2026-09-20'), merchant: 'Udemy', category: 'Education', amount: 1299, currency: 'INR'},
        {transactionId: 'T018', cardId: 'CC002', date: new Date('2026-09-25'), merchant: 'General Store', category: 'Miscellaneous', amount: 350, currency: 'INR'}
      ];
      return {
        getTransactions: function(page, pageSize, cardFilter) {
          return creditCardService.getAllCards().then(function(cards) {
            var enriched = mockTransactions.map(function(txn) {
              var card = cards.find(function(c) { return c.cardId === txn.cardId; });
              return angular.extend({}, txn, {cardName: card ? card.cardName : 'Unknown', lastFourDigits: card ? card.lastFourDigits : ''});
            });
            if (cardFilter) {
              enriched = enriched.filter(function(t) { return t.cardId === cardFilter; });
            }
            enriched.sort(function(a, b) { return b.date - a.date; });
            if (page && pageSize) {
              var start = (page - 1) * pageSize;
              return {data: enriched.slice(start, start + pageSize), total: enriched.length};
            }
            return {data: enriched, total: enriched.length};
          });
        }
      };
    }]);