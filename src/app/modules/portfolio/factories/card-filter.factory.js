(function() {
  'use strict';
  angular.module('app.portfolio')
    .factory('CardFilterFactory', function() {
      return {
        filterCards: function(cards, filterType) {
          if (filterType === 'all') {
            return cards;
          } else if (filterType === 'highUtilization') {
            return cards.filter(card => parseFloat(card.utilizationPercentage) > 70);
          } else if (filterType === 'active') {
            return cards.filter(card => card.status === 'Active');
          } else if (filterType === 'inactive') {
            return cards.filter(card => card.status === 'Inactive');
          }
          return cards;
        }
      };
    });
})();