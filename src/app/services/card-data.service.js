(function() {
  'use strict';
  angular.module('creditCardApp').service('CardDataService', ['$http', '$q', function($http, $q) {
    const API_BASE = '/api';
    const mockCards = [
      { cardId: 1, cardNumber: '****1234', cardType: 'Visa', issuer: 'Chase', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, status: 'Active', expiryDate: new Date('2026-12-31') },
      { cardId: 2, cardNumber: '****5678', cardType: 'MasterCard', issuer: 'Citi', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, status: 'Active', expiryDate: new Date('2027-06-30') },
      { cardId: 3, cardNumber: '****9012', cardType: 'Amex', issuer: 'American Express', creditLimit: 20000, currentBalance: 8000, availableCredit: 12000, status: 'Active', expiryDate: new Date('2028-03-31') },
      { cardId: 4, cardNumber: '****3456', cardType: 'Visa', issuer: 'Bank of America', creditLimit: 12000, currentBalance: 3000, availableCredit: 9000, status: 'Active', expiryDate: new Date('2026-09-30') },
      { cardId: 5, cardNumber: '****7890', cardType: 'Discover', issuer: 'Discover', creditLimit: 8000, currentBalance: 1500, availableCredit: 6500, status: 'Active', expiryDate: new Date('2027-12-31') }
    ];
    this.getAllCards = function() {
      return $http.get(`${API_BASE}/cards`).then(response => response.data).catch(err => {
        console.warn('API unavailable, using mock data');
        return $q.resolve(mockCards);
      });
    };
    this.getCardById = function(cardId) {
      return $http.get(`${API_BASE}/cards/${cardId}`).then(response => response.data).catch(err => {
        console.warn('API unavailable, using mock data');
        const card = mockCards.find(c => c.cardId == cardId);
        return card ? $q.resolve(card) : $q.reject('Card not found');
      });
    };
  }]);
})();