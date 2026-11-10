(function() {
'use strict';
angular.module('multiCardManagement.module')
.service('CardIssuerService', [function() {
var self = this;
var issuerMetadata = {
'HDFC Bank': {logo: 'hdfc-logo.png', color: '#004C8F'},
'ICICI Bank': {logo: 'icici-logo.png', color: '#F37021'},
'American Express': {logo: 'amex-logo.png', color: '#006FCF'},
'SBI Card': {logo: 'sbi-logo.png', color: '#22409A'},
'Axis Bank': {logo: 'axis-logo.png', color: '#800000'}
};
self.enrichWithIssuerData = function(cards) {
return cards.map(function(card) {
var metadata = issuerMetadata[card.issuerName] || {logo: 'default-logo.png', color: '#333'};
card.issuerLogo = metadata.logo;
card.issuerColor = metadata.color;
return card;
});
};
}]);
})();