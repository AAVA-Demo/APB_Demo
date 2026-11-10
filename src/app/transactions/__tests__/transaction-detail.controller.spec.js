/*
Test Documentation:
- Test Name: TransactionDetailController - initialization
- Purpose: Validates controller initialization with transaction data
- Scenario: Controller is instantiated with transaction
- Expected Result: Transaction is set
*/
/*
Test Documentation:
- Test Name: TransactionDetailController - close modal
- Purpose: Validates modal dismissal
- Scenario: Close method is called
- Expected Result: Modal is dismissed
*/
/*
Coverage Report:
- Functions tested: initialization, close
- Scenarios covered: initialization, modal dismissal
- Uncovered scenarios: none
*/

describe('TransactionDetailController', function() {
  'use strict';
  
  beforeEach(module('transactionModule'));
  
  var $controller, $scope;
  var mockTransaction = {
    transactionId: '1',
    cardId: '1',
    cardName: 'Visa Platinum',
    merchant: 'Amazon',
    amount: 2500,
    date: new Date('2024-01-15'),
    category: 'Shopping',
    status: 'Posted'
  };
  var mockModalInstance = {
    dismiss: jasmine.createSpy('dismiss')
  };
  
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $scope = _$rootScope_.$new();
  }));
  
  describe('initialization', function() {
    it('should initialize with transaction data', function() {
      var vm = $controller('TransactionDetailController', { $uibModalInstance: mockModalInstance, transaction: mockTransaction });
      
      expect(vm.transaction).toEqual(mockTransaction);
    });
  });
  
  describe('close', function() {
    it('should dismiss modal when close is called', function() {
      var vm = $controller('TransactionDetailController', { $uibModalInstance: mockModalInstance, transaction: mockTransaction });
      
      vm.close();
      
      expect(mockModalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });
  });
});