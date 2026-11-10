/*
Test Documentation:
- Test Name: cardListItem directive - rendering
- Purpose: Validates directive renders card item with correct data
- Scenario: Normal scenario with valid card data
- Expected Result: Card item displays card number, issuer, available credit, and status
*/
/*
Test Documentation:
- Test Name: cardListItem directive - selection
- Purpose: Validates directive handles card selection
- Scenario: Normal scenario clicking on card item
- Expected Result: onSelect callback is invoked with card ID
*/
/*
Test Documentation:
- Test Name: cardListItem directive - selected state
- Purpose: Validates directive applies selected class when card is selected
- Scenario: Normal scenario with selected card
- Expected Result: Selected class is applied
*/
/*
Coverage Report:
- Functions tested: directive rendering, click handling, class binding
- Scenarios covered: initial render, selection, active status, inactive status
- Uncovered scenarios: none
*/

(function() {
  'use strict';

  describe('cardListItem directive', function() {
    var $compile, $rootScope, element;

    beforeEach(module('app.cardManagement'));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    it('should render card item with card data', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 8500,
        status: 'Active'
      };
      $rootScope.onSelectSpy = jasmine.createSpy('onSelect');

      element = $compile('<card-list-item card="testCard" selected="false" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      expect(element.find('.card-number').text()).toBe('****1234');
      expect(element.find('.card-issuer').text()).toBe('Visa');
      expect(element.text()).toContain('8,500');
    });

    it('should apply selected class when card is selected', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 8500,
        status: 'Active'
      };

      element = $compile('<card-list-item card="testCard" selected="true" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      expect(element.find('.card-item').hasClass('selected')).toBe(true);
    });

    it('should not apply selected class when card is not selected', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 8500,
        status: 'Active'
      };

      element = $compile('<card-list-item card="testCard" selected="false" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      expect(element.find('.card-item').hasClass('selected')).toBe(false);
    });

    it('should show active status with success label', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 8500,
        status: 'Active'
      };

      element = $compile('<card-list-item card="testCard" selected="false" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      var statusLabel = element.find('.label');
      expect(statusLabel.hasClass('label-success')).toBe(true);
      expect(statusLabel.text()).toBe('Active');
    });

    it('should show inactive status with danger label', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 0,
        status: 'Blocked'
      };

      element = $compile('<card-list-item card="testCard" selected="false" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      var statusLabel = element.find('.label');
      expect(statusLabel.hasClass('label-danger')).toBe(true);
      expect(statusLabel.text()).toBe('Blocked');
    });

    it('should invoke onSelect callback when clicked', function() {
      $rootScope.testCard = {
        cardId: 'card-123',
        cardNumber: '****1234',
        issuer: 'Visa',
        availableCredit: 8500,
        status: 'Active'
      };
      $rootScope.onSelectSpy = jasmine.createSpy('onSelect');

      element = $compile('<card-list-item card="testCard" selected="false" on-select="onSelectSpy(cardId)"></card-list-item>')($rootScope);
      $rootScope.$digest();

      element.find('.card-item').click();
      $rootScope.$digest();

      expect($rootScope.onSelectSpy).toHaveBeenCalledWith('card-123');
    });
  });
})();