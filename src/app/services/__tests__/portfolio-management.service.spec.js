/*
Test Documentation:
- Test Name: PortfolioManagementService Unit Tests
- Purpose: Validate getPortfolio method for retrieving and aggregating credit card portfolio data
- Scenario: Successful portfolio retrieval with card details and spend data, error handling from dependencies, card masking
- Expected Result: Resolved promise with portfolio containing cards array with masked card numbers, credit limits, balances, available credit, and monthly spend
*/

describe('PortfolioManagementService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var PortfolioManagementService, UserProfileFactory, CreditCardMasterFactory, TransactionFactory, $q, $rootScope;

  beforeEach(inject(function(_PortfolioManagementService_, _UserProfileFactory_, _CreditCardMasterFactory_, _TransactionFactory_, _$q_, _$rootScope_) {
    PortfolioManagementService = _PortfolioManagementService_;
    UserProfileFactory = _UserProfileFactory_;
    CreditCardMasterFactory = _CreditCardMasterFactory_;
    TransactionFactory = _TransactionFactory_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getPortfolio', function() {

    it('should retrieve portfolio successfully', function() {
      var mockProfile = { cardIds: [1, 2] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 },
        { cardId: 2, cardNumber: '9876543210987654', cardType: 'MasterCard', creditLimit: 10000, balance: 3500 }
      ];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 },
        { cardId: 2, monthlySpend: 1200.00 }
      ];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result).toBeDefined();
      expect(result.cards).toBeDefined();
      expect(result.cards.length).toBe(2);
    });

    it('should mask card numbers correctly', function() {
      var mockProfile = { cardIds: [1] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 }
      ];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.cards[0].maskedCardNumber).toBe('**** **** **** 3456');
    });

    it('should calculate available credit correctly', function() {
      var mockProfile = { cardIds: [1] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 }
      ];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.cards[0].availableCredit).toBe(3800);
    });

    it('should include monthly spend for each card', function() {
      var mockProfile = { cardIds: [1, 2] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 },
        { cardId: 2, cardNumber: '9876543210987654', cardType: 'MasterCard', creditLimit: 10000, balance: 3500 }
      ];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 },
        { cardId: 2, monthlySpend: 1200.00 }
      ];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.cards[0].monthlySpend).toBe(500.00);
      expect(result.cards[1].monthlySpend).toBe(1200.00);
    });

    it('should handle card with no spend data', function() {
      var mockProfile = { cardIds: [1] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockCardSpend = [];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.cards[0].monthlySpend).toBe(0);
    });

    it('should include all card properties', function() {
      var mockProfile = { cardIds: [1] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockCardSpend = [
        { cardId: 1, monthlySpend: 500.00 }
      ];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      var card = result.cards[0];
      expect(card.cardId).toBe(1);
      expect(card.cardNumber).toBe('1234567890123456');
      expect(card.maskedCardNumber).toBe('**** **** **** 3456');
      expect(card.cardType).toBe('Visa');
      expect(card.creditLimit).toBe(5000);
      expect(card.currentBalance).toBe(1200);
      expect(card.availableCredit).toBe(3800);
      expect(card.monthlySpend).toBe(500.00);
    });

    it('should handle error from UserProfileFactory', function() {
      var mockError = { status: 401, message: 'Unauthorized' };

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.reject(mockError));

      var error;
      PortfolioManagementService.getPortfolio().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should handle error from CreditCardMasterFactory', function() {
      var mockProfile = { cardIds: [1, 2] };
      var mockError = { status: 500, message: 'Server error' };

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.reject(mockError));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve([]));

      var error;
      PortfolioManagementService.getPortfolio().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should handle error from TransactionFactory', function() {
      var mockProfile = { cardIds: [1, 2] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockError = { status: 500, message: 'Transaction service error' };

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.reject(mockError));

      var error;
      PortfolioManagementService.getPortfolio().catch(function(err) {
        error = err;
      });

      $rootScope.$digest();

      expect(error).toEqual(mockError);
    });

    it('should call UserProfileFactory.getUserProfile', function() {
      var mockProfile = { cardIds: [1] };
      var mockCardDetails = [
        { cardId: 1, cardNumber: '1234567890123456', cardType: 'Visa', creditLimit: 5000, balance: 1200 }
      ];
      var mockCardSpend = [];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      PortfolioManagementService.getPortfolio();
      $rootScope.$digest();

      expect(UserProfileFactory.getUserProfile).toHaveBeenCalled();
    });

    it('should call CreditCardMasterFactory.getCardDetails with cardIds', function() {
      var mockProfile = { cardIds: [1, 2, 3] };
      var mockCardDetails = [];
      var mockCardSpend = [];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      PortfolioManagementService.getPortfolio();
      $rootScope.$digest();

      expect(CreditCardMasterFactory.getCardDetails).toHaveBeenCalledWith([1, 2, 3]);
    });

    it('should call TransactionFactory.getCardSpend with cardIds', function() {
      var mockProfile = { cardIds: [1, 2] };
      var mockCardDetails = [];
      var mockCardSpend = [];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      PortfolioManagementService.getPortfolio();
      $rootScope.$digest();

      expect(TransactionFactory.getCardSpend).toHaveBeenCalledWith([1, 2]);
    });

    it('should return promise', function() {
      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve({ cardIds: [] }));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve([]));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve([]));

      var promise = PortfolioManagementService.getPortfolio();

      expect(promise.then).toBeDefined();
      expect(typeof promise.then).toBe('function');

      $rootScope.$digest();
    });

    it('should handle empty cardIds', function() {
      var mockProfile = { cardIds: [] };
      var mockCardDetails = [];
      var mockCardSpend = [];

      spyOn(UserProfileFactory, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardMasterFactory, 'getCardDetails').and.returnValue($q.resolve(mockCardDetails));
      spyOn(TransactionFactory, 'getCardSpend').and.returnValue($q.resolve(mockCardSpend));

      var result;
      PortfolioManagementService.getPortfolio().then(function(portfolio) {
        result = portfolio;
      });

      $rootScope.$digest();

      expect(result.cards).toEqual([]);
    });

  });

});

/*
Coverage Report:
- Functions tested: getPortfolio
- Scenarios covered:
  * Successful portfolio retrieval
  * Card number masking (last 4 digits)
  * Available credit calculation
  * Monthly spend inclusion per card
  * Card with no spend data (default to 0)
  * All card properties validation
  * Error from UserProfileFactory
  * Error from CreditCardMasterFactory
  * Error from TransactionFactory
  * UserProfileFactory call validation
  * CreditCardMasterFactory call with cardIds
  * TransactionFactory call with cardIds
  * Promise return validation
  * Empty cardIds handling
- Uncovered scenarios: None - comprehensive coverage achieved
- Dependencies mocked: UserProfileFactory, CreditCardMasterFactory, TransactionFactory
*/