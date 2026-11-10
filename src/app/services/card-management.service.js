(function() {
  'use strict';
  angular.module('creditCardApp').service('CardManagementService', ['$http', '$q', 'UserProfileFactory', function($http, $q, UserProfileFactory) {
    const CACHE_DURATION = 60000;
    let cachedCards = null;
    let cacheTimestamp = null;
    
    this.getAllCards = function(userId) {
      const now = Date.now();
      if (cachedCards && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        return $q.resolve(cachedCards);
      }
      
      const deferred = $q.defer();
      
      const mockCards = [
        {
          cardId: 'card001',
          userId: userId,
          cardNumber: '**** **** **** 1234',
          cardType: 'Visa Platinum',
          creditLimit: 15000,
          currentBalance: 3200,
          availableCredit: 11800,
          utilizationRate: 21.3,
          monthlySpend: 1250.50,
          lastUpdated: new Date()
        },
        {
          cardId: 'card002',
          userId: userId,
          cardNumber: '**** **** **** 5678',
          cardType: 'Mastercard Gold',
          creditLimit: 10000,
          currentBalance: 2100,
          availableCredit: 7900,
          utilizationRate: 21.0,
          monthlySpend: 850.25,
          lastUpdated: new Date()
        },
        {
          cardId: 'card003',
          userId: userId,
          cardNumber: '**** **** **** 9012',
          cardType: 'Amex Blue',
          creditLimit: 12000,
          currentBalance: 4500,
          availableCredit: 7500,
          utilizationRate: 37.5,
          monthlySpend: 1650.00,
          lastUpdated: new Date()
        },
        {
          cardId: 'card004',
          userId: userId,
          cardNumber: '**** **** **** 3456',
          cardType: 'Visa Signature',
          creditLimit: 8000,
          currentBalance: 1200,
          availableCredit: 6800,
          utilizationRate: 15.0,
          monthlySpend: 400.00,
          lastUpdated: new Date()
        },
        {
          cardId: 'card005',
          userId: userId,
          cardNumber: '**** **** **** 7890',
          cardType: 'Discover It',
          creditLimit: 5000,
          currentBalance: 500,
          availableCredit: 4500,
          utilizationRate: 10.0,
          monthlySpend: 100.00,
          lastUpdated: new Date()
        }
      ];
      
      cachedCards = mockCards;
      cacheTimestamp = now;
      deferred.resolve(mockCards);
      
      return deferred.promise;
    };
    
    this.getCardById = function(cardId) {
      const deferred = $q.defer();
      this.getAllCards().then(function(cards) {
        const card = cards.find(c => c.cardId === cardId);
        deferred.resolve(card);
      });
      return deferred.promise;
    };
    
    this.clearCache = function() {
      cachedCards = null;
      cacheTimestamp = null;
    };
  }]);
})();