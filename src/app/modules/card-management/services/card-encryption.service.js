(function() {
  'use strict';
  angular.module('cardManagement')
    .service('CardEncryptionService', [function() {
      var SECRET_KEY = 'credit-card-secret-key-2024';
      this.encrypt = function(data) {
        if (!data) return null;
        return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
      };
      this.decrypt = function(encryptedData) {
        if (!encryptedData) return null;
        var bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
      };
      this.maskCardNumber = function(cardNumber) {
        if (!cardNumber || cardNumber.length < 4) return '****';
        return '****' + cardNumber.slice(-4);
      };
    }]);
})();