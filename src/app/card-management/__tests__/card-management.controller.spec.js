/*
Test Documentation:
- Test Name: CardManagementController Unit Tests
- Purpose: Validate card management controller functionality including filtering and selection
- Scenario: Tests initialization, status filtering, card selection, and error handling
- Expected Result: Controller manages card list state correctly with proper filtering
*/

(function() {
  'use strict';
  
  describe('CardManagementController', function() {
    var $controller, $scope, CardApiService, $q, $rootScope;
    var controller;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $q = _$q_;
      
      CardApiService = {
        fetchAllCards: jasmine.createSpy('fetchAllCards')
      };
    }));
    
    describe('initialization', function() {
      it('should load cards on init', function() {
        var mockCards = [
          {cardId: 'card1', status: 'active'},
          {cardId: 'card2', status: 'inactive'}
        ];
        CardApiService.fetchAllCards.and.returnValue($q.resolve(mockCards));
        
        controller = $controller('CardManagementController', {
          $scope: $scope,
          CardApiService: CardApiService
        });
        
        $rootScope.$digest();
        expect(controller.cards).toEqual(mockCards);
        expect(controller.filteredCards).toEqual(mockCards);
        expect(controller.loading).toBe(false);
      });
      
      it('should handle load error', function() {
        CardApiService.fetchAllCards.and.returnValue($q.reject('Error'));
        
        controller = $controller('CardManagementController', {
          $scope: $scope,
          CardApiService: CardApiService
        });
        
        $rootScope.$digest();
        expect(controller.error).toBe('Failed to load credit cards');
        expect(controller.loading).toBe(false);
      });
    });
    
    describe('filterByStatus()', function() {
      beforeEach(function() {
        var mockCards = [
          {cardId: 'card1', status: 'active'},
          {cardId: 'card2', status: 'inactive'},
          {cardId: 'card3', status: 'active'}
        ];
        CardApiService.fetchAllCards.and.returnValue($q.resolve(mockCards));
        
        controller = $controller('CardManagementController', {
          $scope: $scope,
          CardApiService: CardApiService
        });
        $rootScope.$digest();
      });
      
      it('should show all cards when filter is "all"', function() {
        controller.filterByStatus('all');
        expect(controller.filteredCards.length).toBe(3);
        expect(controller.statusFilter).toBe('all');
      });
      
      it('should filter active cards', function() {
        controller.filterByStatus('active');
        expect(controller.filteredCards.length).toBe(2);
        expect(controller.filteredCards[0].status).toBe('active');
      });
      
      it('should filter inactive cards', function() {
        controller.filterByStatus('inactive');
        expect(controller.filteredCards.length).toBe(1);
        expect(controller.filteredCards[0].status).toBe('inactive');
      });
    });
    
    describe('showCardDetails() and closeDetails()', function() {
      beforeEach(function() {
        CardApiService.fetchAllCards.and.returnValue($q.resolve([]));
        controller = $controller('CardManagementController', {
          $scope: $scope,
          CardApiService: CardApiService
        });
        $rootScope.$digest();
      });
      
      it('should set selected card', function() {
        var mockCard = {cardId: 'card1'};
        controller.showCardDetails(mockCard);
        expect(controller.selectedCard).toEqual(mockCard);
      });
      
      it('should clear selected card on close', function() {
        controller.selectedCard = {cardId: 'card1'};
        controller.closeDetails();
        expect(controller.selectedCard).toBeNull();
      });
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: init, filterByStatus, showCardDetails, closeDetails
- Scenarios covered:
  * Successful card loading
  * Error handling
  * Status filtering (all, active, inactive)
  * Card selection and deselection
- Uncovered scenarios: Blocked card filtering, multiple rapid filter changes
*/