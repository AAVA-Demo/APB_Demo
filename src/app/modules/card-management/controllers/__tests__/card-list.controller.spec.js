/*
Test Documentation:
- Test Name: CardListController - Card List Display and Filtering
- Purpose: Validate card list loading, filtering, and navigation
- Scenario: Test loadCards, viewCardDetails, filterCards
- Expected Result: Cards loaded, filtered correctly, navigation works
*/

describe('CardListController', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  beforeEach(module('app.cardManagement'));
  
  var $controller, $q, $rootScope, $location, CardService;
  var mockCards = [
    {cardId: '1', cardNumber: '**** 1234', issuer: 'Visa', cardHolderName: 'John Doe', status: 'active'},
    {cardId: '2', cardNumber: '**** 5678', issuer: 'MasterCard', cardHolderName: 'Jane Smith', status: 'inactive'},
    {cardId: '3', cardNumber: '**** 9012', issuer: 'Amex', cardHolderName: 'Bob Johnson', status: 'blocked'}
  ];
  
  beforeEach(inject(function(_$controller_, _$q_, _$rootScope_, _$location_, _CardService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $location = _$location_;
    CardService = _CardService_;
  }));
  
  describe('initialization', function() {
    it('should load cards on initialization', function() {
      spyOn(CardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardListController', {
        $scope: $scope,
        CardService: CardService,
        $location: $location
      });
      
      expect(controller.loading).toBe(true);
      $rootScope.$apply();
      
      expect(controller.cards).toEqual(mockCards);
      expect(controller.loading).toBe(false);
    });
    
    it('should handle error during card loading', function() {
      spyOn(CardService, 'getAllCards').and.returnValue($q.reject({error: 'Failed'}));
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardListController', {
        $scope: $scope,
        CardService: CardService,
        $location: $location
      });
      
      $rootScope.$apply();
      
      expect(controller.error).toBe('Failed to load cards. Please try again.');
      expect(controller.loading).toBe(false);
    });
  });
  
  describe('viewCardDetails', function() {
    it('should navigate to card details page', function() {
      spyOn(CardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      spyOn($location, 'path');
      
      var $scope = $rootScope.$new();
      var controller = $controller('CardListController', {
        $scope: $scope,
        CardService: CardService,
        $location: $location
      });
      
      controller.viewCardDetails('1');
      expect($location.path).toHaveBeenCalledWith('/cards/1');
    });
  });
  
  describe('filterCards', function() {
    var controller, $scope;
    
    beforeEach(function() {
      spyOn(CardService, 'getAllCards').and.returnValue($q.resolve(mockCards));
      $scope = $rootScope.$new();
      controller = $controller('CardListController', {
        $scope: $scope,
        CardService: CardService,
        $location: $location
      });
      $rootScope.$apply();
    });
    
    it('should return all cards when no filters applied', function() {
      controller.selectedStatus = 'all';
      controller.filterText = '';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(3);
    });
    
    it('should filter by status', function() {
      controller.selectedStatus = 'active';
      controller.filterText = '';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('active');
    });
    
    it('should filter by card number', function() {
      controller.selectedStatus = 'all';
      controller.filterText = '1234';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(1);
      expect(filtered[0].cardNumber).toContain('1234');
    });
    
    it('should filter by issuer', function() {
      controller.selectedStatus = 'all';
      controller.filterText = 'visa';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(1);
      expect(filtered[0].issuer).toBe('Visa');
    });
    
    it('should filter by card holder name', function() {
      controller.selectedStatus = 'all';
      controller.filterText = 'jane';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(1);
      expect(filtered[0].cardHolderName).toBe('Jane Smith');
    });
    
    it('should combine status and text filters', function() {
      controller.selectedStatus = 'active';
      controller.filterText = 'visa';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('active');
      expect(filtered[0].issuer).toBe('Visa');
    });
    
    it('should return empty array when no matches', function() {
      controller.selectedStatus = 'active';
      controller.filterText = 'nonexistent';
      
      var filtered = mockCards.filter(controller.filterCards);
      expect(filtered.length).toBe(0);
    });
  });
});

/*
Coverage Report:
- Functions tested: initialization, loadCards, viewCardDetails, filterCards
- Scenarios covered: successful card load, error handling, navigation, filtering by status/text/combined
- Edge cases: empty results, case-insensitive filtering, multiple filter criteria
- Uncovered scenarios: none
*/