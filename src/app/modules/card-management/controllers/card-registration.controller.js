(function() {
  'use strict';
  angular.module('cardManagement')
    .controller('CardRegistrationController', ['$scope', '$location', 'CardService', 'UserProfileService', 'CardEncryptionService', 'NotificationService', function($scope, $location, CardService, UserProfileService, CardEncryptionService, NotificationService) {
      var vm = this;
      vm.card = {
        cardNumber: '',
        cardIssuer: '',
        cardType: 'VISA',
        creditLimit: 0
      };
      vm.submitting = false;
      vm.error = null;
      vm.cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'];
      vm.submitCard = function() {
        if (!vm.card.cardNumber || !vm.card.cardIssuer || !vm.card.creditLimit) {
          vm.error = 'Please fill in all required fields.';
          NotificationService.error(vm.error);
          return;
        }
        vm.submitting = true;
        vm.error = null;
        var encryptedCardNumber = CardEncryptionService.encrypt(vm.card.cardNumber);
        var cardData = {
          cardNumber: encryptedCardNumber,
          cardIssuer: vm.card.cardIssuer,
          cardType: vm.card.cardType,
          creditLimit: vm.card.creditLimit,
          availableCredit: vm.card.creditLimit,
          outstandingBalance: 0,
          isActive: true
        };
        CardService.createCard(cardData)
          .then(function(response) {
            NotificationService.success('Credit card registered successfully!');
            $location.path('/cards');
          })
          .catch(function(error) {
            vm.error = 'Failed to register card. Please try again.';
            vm.submitting = false;
            NotificationService.error(vm.error);
          });
      };
      vm.cancel = function() {
        $location.path('/cards');
      };
    }]);
})();