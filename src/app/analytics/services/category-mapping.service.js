(function() {
  'use strict';
  angular.module('app.analytics')
    .service('CategoryMappingService', [function() {
      const categories = [
        { name: 'Food & Dining', color: '#e74c3c' },
        { name: 'Fuel', color: '#f39c12' },
        { name: 'Shopping', color: '#9b59b6' },
        { name: 'Travel', color: '#3498db' },
        { name: 'Entertainment', color: '#1abc9c' },
        { name: 'Utilities', color: '#34495e' },
        { name: 'Healthcare', color: '#e67e22' },
        { name: 'Education', color: '#2ecc71' },
        { name: 'Miscellaneous', color: '#95a5a6' }
      ];
      this.getCategoryMetadata = function() {
        return categories;
      };
      this.getCategoryColor = function(categoryName) {
        const cat = categories.find(c => c.name === categoryName);
        return cat ? cat.color : '#95a5a6';
      };
    }]);
})();