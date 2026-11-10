(function() {
  'use strict';
  angular.module('transaction')
    .service('TransactionService', ['$q', 'CreditCardService', 'SearchFilterFactory', function($q, CreditCardService, SearchFilterFactory) {
      const mockTransactions = [
        { transactionId: 'TXN001', cardId: 'CC001', cardNumber: '**** 1234', amount: 125.50, currency: 'USD', merchantName: 'Starbucks', category: 'Food & Dining', transactionDate: new Date('2024-01-15'), transactionType: 'Debit', status: 'Completed', description: 'Coffee and snacks', location: 'New York, NY' },
        { transactionId: 'TXN002', cardId: 'CC002', cardNumber: '**** 5678', amount: 89.99, currency: 'USD', merchantName: 'Amazon', category: 'Shopping', transactionDate: new Date('2024-01-14'), transactionType: 'Debit', status: 'Completed', description: 'Electronics purchase', location: 'Online' },
        { transactionId: 'TXN003', cardId: 'CC001', cardNumber: '**** 1234', amount: 45.00, currency: 'USD', merchantName: 'Shell Gas Station', category: 'Fuel', transactionDate: new Date('2024-01-13'), transactionType: 'Debit', status: 'Completed', description: 'Fuel refill', location: 'Los Angeles, CA' },
        { transactionId: 'TXN004', cardId: 'CC003', cardNumber: '**** 9012', amount: 250.00, currency: 'USD', merchantName: 'Delta Airlines', category: 'Travel', transactionDate: new Date('2024-01-12'), transactionType: 'Debit', status: 'Completed', description: 'Flight booking', location: 'Online' },
        { transactionId: 'TXN005', cardId: 'CC002', cardNumber: '**** 5678', amount: 75.25, currency: 'USD', merchantName: 'Whole Foods', category: 'Food & Dining', transactionDate: new Date('2024-01-11'), transactionType: 'Debit', status: 'Completed', description: 'Grocery shopping', location: 'San Francisco, CA' },
        { transactionId: 'TXN006', cardId: 'CC001', cardNumber: '**** 1234', amount: 150.00, currency: 'USD', merchantName: 'AMC Theaters', category: 'Entertainment', transactionDate: new Date('2024-01-10'), transactionType: 'Debit', status: 'Completed', description: 'Movie tickets', location: 'Chicago, IL' },
        { transactionId: 'TXN007', cardId: 'CC003', cardNumber: '**** 9012', amount: 200.00, currency: 'USD', merchantName: 'Electric Company', category: 'Utilities', transactionDate: new Date('2024-01-09'), transactionType: 'Debit', status: 'Completed', description: 'Monthly electricity bill', location: 'Online' },
        { transactionId: 'TXN008', cardId: 'CC002', cardNumber: '**** 5678', amount: 120.00, currency: 'USD', merchantName: 'CVS Pharmacy', category: 'Healthcare', transactionDate: new Date('2024-01-08'), transactionType: 'Debit', status: 'Completed', description: 'Prescription refill', location: 'Boston, MA' },
        { transactionId: 'TXN009', cardId: 'CC001', cardNumber: '**** 1234', amount: 500.00, currency: 'USD', merchantName: 'University Bookstore', category: 'Education', transactionDate: new Date('2024-01-07'), transactionType: 'Debit', status: 'Completed', description: 'Textbooks purchase', location: 'Seattle, WA' },
        { transactionId: 'TXN010', cardId: 'CC003', cardNumber: '**** 9012', amount: 35.00, currency: 'USD', merchantName: 'Local Store', category: 'Miscellaneous', transactionDate: new Date('2024-01-06'), transactionType: 'Debit', status: 'Completed', description: 'Miscellaneous items', location: 'Portland, OR' },
        { transactionId: 'TXN011', cardId: 'CC002', cardNumber: '**** 5678', amount: 180.00, currency: 'USD', merchantName: 'Best Buy', category: 'Shopping', transactionDate: new Date('2023-12-28'), transactionType: 'Debit', status: 'Completed', description: 'Electronics', location: 'Miami, FL' },
        { transactionId: 'TXN012', cardId: 'CC001', cardNumber: '**** 1234', amount: 60.00, currency: 'USD', merchantName: 'Chevron', category: 'Fuel', transactionDate: new Date('2023-12-25'), transactionType: 'Debit', status: 'Completed', description: 'Gas', location: 'Austin, TX' },
        { transactionId: 'TXN013', cardId: 'CC003', cardNumber: '**** 9012', amount: 320.00, currency: 'USD', merchantName: 'Marriott Hotel', category: 'Travel', transactionDate: new Date('2023-12-20'), transactionType: 'Debit', status: 'Completed', description: 'Hotel stay', location: 'Las Vegas, NV' },
        { transactionId: 'TXN014', cardId: 'CC002', cardNumber: '**** 5678', amount: 95.50, currency: 'USD', merchantName: 'Olive Garden', category: 'Food & Dining', transactionDate: new Date('2023-12-15'), transactionType: 'Debit', status: 'Completed', description: 'Dinner', location: 'Denver, CO' },
        { transactionId: 'TXN015', cardId: 'CC001', cardNumber: '**** 1234', amount: 45.00, currency: 'USD', merchantName: 'Spotify', category: 'Entertainment', transactionDate: new Date('2023-12-10'), transactionType: 'Debit', status: 'Completed', description: 'Subscription', location: 'Online' },
        { transactionId: 'TXN016', cardId: 'CC003', cardNumber: '**** 9012', amount: 110.00, currency: 'USD', merchantName: 'Water Company', category: 'Utilities', transactionDate: new Date('2023-12-05'), transactionType: 'Debit', status: 'Completed', description: 'Water bill', location: 'Online' },
        { transactionId: 'TXN017', cardId: 'CC002', cardNumber: '**** 5678', amount: 85.00, currency: 'USD', merchantName: 'Dental Clinic', category: 'Healthcare', transactionDate: new Date('2023-11-28'), transactionType: 'Debit', status: 'Completed', description: 'Dental checkup', location: 'Phoenix, AZ' },
        { transactionId: 'TXN018', cardId: 'CC001', cardNumber: '**** 1234', amount: 300.00, currency: 'USD', merchantName: 'Online Course', category: 'Education', transactionDate: new Date('2023-11-20'), transactionType: 'Debit', status: 'Completed', description: 'Course enrollment', location: 'Online' },
        { transactionId: 'TXN019', cardId: 'CC003', cardNumber: '**** 9012', amount: 55.00, currency: 'USD', merchantName: 'Hardware Store', category: 'Miscellaneous', transactionDate: new Date('2023-11-15'), transactionType: 'Debit', status: 'Completed', description: 'Tools', location: 'Philadelphia, PA' },
        { transactionId: 'TXN020', cardId: 'CC002', cardNumber: '**** 5678', amount: 220.00, currency: 'USD', merchantName: 'Target', category: 'Shopping', transactionDate: new Date('2023-11-10'), transactionType: 'Debit', status: 'Completed', description: 'Household items', location: 'San Diego, CA' }
      ];
      this.getTransactions = function(pageNumber, pageSize, filters) {
        return $q(function(resolve, reject) {
          setTimeout(function() {
            let filtered = mockTransactions.slice();
            if (filters.startDate) {
              filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(filters.startDate));
            }
            if (filters.endDate) {
              filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(filters.endDate));
            }
            if (filters.merchantName) {
              filtered = filtered.filter(t => t.merchantName.toLowerCase().includes(filters.merchantName.toLowerCase()));
            }
            if (filters.category) {
              filtered = filtered.filter(t => t.category === filters.category);
            }
            if (filters.cardId) {
              filtered = filtered.filter(t => t.cardId === filters.cardId);
            }
            const start = (pageNumber - 1) * pageSize;
            const end = start + pageSize;
            const paginated = filtered.slice(start, end);
            resolve({
              transactions: paginated,
              totalCount: filtered.length,
              pageNumber: pageNumber,
              pageSize: pageSize,
              hasMore: end < filtered.length
            });
          }, 200);
        });
      };
      this.getTransactionDetail = function(transactionId) {
        return $q(function(resolve, reject) {
          setTimeout(function() {
            const transaction = mockTransactions.find(t => t.transactionId === transactionId);
            if (transaction) {
              resolve(transaction);
            } else {
              reject('Transaction not found');
            }
          }, 100);
        });
      };
    }]);
})();