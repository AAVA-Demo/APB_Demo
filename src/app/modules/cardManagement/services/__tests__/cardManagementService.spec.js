/*
Test Documentation:
- Test Name: cardManagementService - getCardPortfolio success
- Purpose: Verify that getCardPortfolio successfully retrieves and aggregates card portfolio data
- Scenario: User card associations, card details, and spending data are retrieved successfully
- Expected Result: Promise resolves with complete portfolio including utilization rates
*/
/*
Test Documentation:
- Test Name: cardManagementService - getCardPortfolio caching
- Purpose: Verify that getCardPortfolio uses cached data when available
- Scenario: Second call to getCardPortfolio without forceRefresh
- Expected Result: Cached data is returned without making additional API calls
*/
/*
Test Documentation:
- Test Name: cardManagementService - getCardById success
- Purpose: Verify that getCardById retrieves individual card details with spending data
- Scenario: Valid card ID is provided
- Expected Result: Promise resolves with card details and calculated utilization rate
*/
/*
Coverage Report:
- Functions tested: getCardPortfolio, getCardById
- Scenarios covered: successful retrieval, caching, error handling, utilization calculation, cache refresh
- Uncovered scenarios: none
*/

describe('cardManagementService', function() {
  'use strict';

  var cardManagementService;
  var creditCardRepoFactory;
  var cardTransactionFactory;
  var userProfileFactory;
  var $q;
  var $rootScope;

  beforeEach(module('cardManagementModule'));
  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_cardManagementService_, _creditCardRepoFactory_, _cardTransactionFactory_, _userProfileFactory_, _$q_, _$rootScope_) {
    cardManagementService = _cardManagementService_;
    creditCardRepoFactory = _creditCardRepoFactory_;
    cardTransactionFactory = _cardTransactionFactory_;
    userProfileFactory = _userProfileFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getCardPortfolio', function() {
    it('should successfully retrieve card portfolio with all details', function() {
      var mockAssociations = { cardIds: ['card1', 'card2'] };
      var mockCardDetails1 = {
        cardId: 'card1',
        cardNumber: '**** 1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockCardDetails2 = {
        cardId: 'card2',
        cardNumber: '**** 5678',
        cardType: 'MasterCard',
        creditLimit: 10000,
        outstandingBalance: 2000,
        availableBalance: 8000,
        status: 'Active'
      };
      var mockSpending1 = { monthlySpend: 500, totalSpend: 5000 };
      var mockSpending2 = { monthlySpend: 800, totalSpend: 8000 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.callFake(function(cardId) {
        if (cardId === 'card1') return $q.resolve(mockCardDetails1);
        if (cardId === 'card2') return $q.resolve(mockCardDetails2);
      });
      spyOn(cardTransactionFactory, 'getCardSpending').and.callFake(function(cardId) {
        if (cardId === 'card1') return $q.resolve(mockSpending1);
        if (cardId === 'card2') return $q.resolve(mockSpending2);
      });

      var result;
      cardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.length).toBe(2);
      expect(result[0].cardId).toBe('card1');
      expect(result[0].utilizationRate).toBe(30);
      expect(result[1].utilizationRate).toBe(20);
    });

    it('should cache portfolio data and return cached data on subsequent calls', function() {
      var mockAssociations = { cardIds: ['card1'] };
      var mockCardDetails = {
        cardId: 'card1',
        cardNumber: '**** 1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 500, totalSpend: 5000 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      cardManagementService.getCardPortfolio();
      $rootScope.$digest();

      cardManagementService.getCardPortfolio();
      $rootScope.$digest();

      expect(userProfileFactory.getUserCardAssociations).toHaveBeenCalledTimes(1);
    });

    it('should refresh cache when forceRefresh is true', function() {
      var mockAssociations = { cardIds: ['card1'] };
      var mockCardDetails = {
        cardId: 'card1',
        cardNumber: '**** 1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 500, totalSpend: 5000 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      cardManagementService.getCardPortfolio();
      $rootScope.$digest();

      cardManagementService.getCardPortfolio(true);
      $rootScope.$digest();

      expect(userProfileFactory.getUserCardAssociations).toHaveBeenCalledTimes(2);
    });

    it('should handle empty card associations', function() {
      var emptyAssociations = { cardIds: [] };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(emptyAssociations));

      var result;
      cardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result).toEqual([]);
    });

    it('should calculate utilization rate correctly', function() {
      var mockAssociations = { cardIds: ['card1'] };
      var mockCardDetails = {
        cardId: 'card1',
        creditLimit: 10000,
        outstandingBalance: 2500,
        availableBalance: 7500,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 500 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      var result;
      cardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result[0].utilizationRate).toBe(25);
    });

    it('should handle zero credit limit for utilization calculation', function() {
      var mockAssociations = { cardIds: ['card1'] };
      var mockCardDetails = {
        cardId: 'card1',
        creditLimit: 0,
        outstandingBalance: 0,
        availableBalance: 0,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 0 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      var result;
      cardManagementService.getCardPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result[0].utilizationRate).toBe(0);
    });

    it('should handle errors from userProfileFactory', function() {
      var error = { message: 'Failed to fetch associations' };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.reject(error));
      spyOn(console, 'error');

      var rejected = false;
      cardManagementService.getCardPortfolio().catch(function(err) {
        rejected = true;
      });

      $rootScope.$digest();

      expect(rejected).toBe(true);
      expect(console.error).toHaveBeenCalledWith('Error fetching card portfolio:', error);
    });
  });

  describe('getCardById', function() {
    it('should successfully retrieve card by ID with spending data', function() {
      var cardId = 'card123';
      var mockCardDetails = {
        cardId: 'card123',
        cardNumber: '**** 1234',
        cardType: 'Visa',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 500, totalSpend: 5000 };

      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      var result;
      cardManagementService.getCardById(cardId).then(function(card) {
        result = card;
      });

      $rootScope.$digest();

      expect(result.cardId).toBe('card123');
      expect(result.monthlySpend).toBe(500);
      expect(result.totalSpend).toBe(5000);
      expect(result.utilizationRate).toBe(30);
    });

    it('should return cached card if available in portfolio cache', function() {
      var mockAssociations = { cardIds: ['card1'] };
      var mockCardDetails = {
        cardId: 'card1',
        cardNumber: '**** 1234',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 500, totalSpend: 5000 };

      spyOn(userProfileFactory, 'getUserCardAssociations').and.returnValue($q.resolve(mockAssociations));
      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      cardManagementService.getCardPortfolio();
      $rootScope.$digest();

      var result;
      cardManagementService.getCardById('card1').then(function(card) {
        result = card;
      });

      $rootScope.$digest();

      expect(result.cardId).toBe('card1');
      expect(creditCardRepoFactory.getCardDetails).toHaveBeenCalledTimes(1);
    });

    it('should fetch card details if not in cache', function() {
      var cardId = 'card999';
      var mockCardDetails = {
        cardId: 'card999',
        creditLimit: 8000,
        outstandingBalance: 2000,
        availableBalance: 6000,
        status: 'Active'
      };
      var mockSpending = { monthlySpend: 300, totalSpend: 3000 };

      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      var result;
      cardManagementService.getCardById(cardId).then(function(card) {
        result = card;
      });

      $rootScope.$digest();

      expect(result.cardId).toBe('card999');
      expect(creditCardRepoFactory.getCardDetails).toHaveBeenCalledWith(cardId);
    });

    it('should handle missing spending data gracefully', function() {
      var cardId = 'card123';
      var mockCardDetails = {
        cardId: 'card123',
        creditLimit: 5000,
        outstandingBalance: 1500,
        availableBalance: 3500,
        status: 'Active'
      };
      var mockSpending = {};

      spyOn(creditCardRepoFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(cardTransactionFactory, 'getCardSpending').and.returnValue($q.resolve(mockSpending));

      var result;
      cardManagementService.getCardById(cardId).then(function(card) {
        result = card;
      });

      $rootScope.$digest();

      expect(result.monthlySpend).toBe(0);
      expect(result.totalSpend).toBe(0);
    });
  });
});