(function() {
  'use strict';
  angular.module('analytics')
    .service('TransactionDataService', ['$q', function($q) {
      const mockTransactions = [
        { id: 'TXN001', cardId: 'CC001', amount: 125.50, category: 'Food & Dining', description: 'Starbucks', timestamp: new Date('2024-01-15'), merchantName: 'Starbucks' },
        { id: 'TXN002', cardId: 'CC002', amount: 89.99, category: 'Shopping', description: 'Amazon', timestamp: new Date('2024-01-14'), merchantName: 'Amazon' },
        { id: 'TXN003', cardId: 'CC001', amount: 45.00, category: 'Fuel', description: 'Shell', timestamp: new Date('2024-01-13'), merchantName: 'Shell' },
        { id: 'TXN004', cardId: 'CC003', amount: 250.00, category: 'Travel', description: 'Delta', timestamp: new Date('2024-01-12'), merchantName: 'Delta' },
        { id: 'TXN005', cardId: 'CC002', amount: 75.25, category: 'Food & Dining', description: 'Whole Foods', timestamp: new Date('2024-01-11'), merchantName: 'Whole Foods' },
        { id: 'TXN006', cardId: 'CC001', amount: 150.00, category: 'Entertainment', description: 'AMC', timestamp: new Date('2024-01-10'), merchantName: 'AMC' },
        { id: 'TXN007', cardId: 'CC003', amount: 200.00, category: 'Utilities', description: 'Electric', timestamp: new Date('2024-01-09'), merchantName: 'Electric Company' },
        { id: 'TXN008', cardId: 'CC002', amount: 120.00, category: 'Healthcare', description: 'CVS', timestamp: new Date('2024-01-08'), merchantName: 'CVS' },
        { id: 'TXN009', cardId: 'CC001', amount: 500.00, category: 'Education', description: 'Bookstore', timestamp: new Date('2024-01-07'), merchantName: 'Bookstore' },
        { id: 'TXN010', cardId: 'CC003', amount: 35.00, category: 'Miscellaneous', description: 'Local Store', timestamp: new Date('2024-01-06'), merchantName: 'Local Store' },
        { id: 'TXN011', cardId: 'CC002', amount: 180.00, category: 'Shopping', description: 'Best Buy', timestamp: new Date('2023-12-28'), merchantName: 'Best Buy' },
        { id: 'TXN012', cardId: 'CC001', amount: 60.00, category: 'Fuel', description: 'Chevron', timestamp: new Date('2023-12-25'), merchantName: 'Chevron' },
        { id: 'TXN013', cardId: 'CC003', amount: 320.00, category: 'Travel', description: 'Marriott', timestamp: new Date('2023-12-20'), merchantName: 'Marriott' },
        { id: 'TXN014', cardId: 'CC002', amount: 95.50, category: 'Food & Dining', description: 'Olive Garden', timestamp: new Date('2023-12-15'), merchantName: 'Olive Garden' },
        { id: 'TXN015', cardId: 'CC001', amount: 45.00, category: 'Entertainment', description: 'Spotify', timestamp: new Date('2023-12-10'), merchantName: 'Spotify' },
        { id: 'TXN016', cardId: 'CC003', amount: 110.00, category: 'Utilities', description: 'Water', timestamp: new Date('2023-12-05'), merchantName: 'Water Company' },
        { id: 'TXN017', cardId: 'CC002', amount: 85.00, category: 'Healthcare', description: 'Dental', timestamp: new Date('2023-11-28'), merchantName: 'Dental Clinic' },
        { id: 'TXN018', cardId: 'CC001', amount: 300.00, category: 'Education', description: 'Course', timestamp: new Date('2023-11-20'), merchantName: 'Online Course' },
        { id: 'TXN019', cardId: 'CC003', amount: 55.00, category: 'Miscellaneous', description: 'Hardware', timestamp: new Date('2023-11-15'), merchantName: 'Hardware Store' },
        { id: 'TXN020', cardId: 'CC002', amount: 220.00, category: 'Shopping', description: 'Target', timestamp: new Date('2023-11-10'), merchantName: 'Target' }
      ];
      this.fetchTransactions = function(dateRange) {
        return $q(function(resolve) {
          setTimeout(function() {
            let filtered = mockTransactions;
            if (dateRange && dateRange.startDate) {
              filtered = filtered.filter(t => t.timestamp >= dateRange.startDate);
            }
            if (dateRange && dateRange.endDate) {
              filtered = filtered.filter(t => t.timestamp <= dateRange.endDate);
            }
            resolve(filtered);
          }, 100);
        });
      };
    }]);
})();