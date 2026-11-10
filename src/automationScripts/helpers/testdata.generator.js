exports.TestDataGenerator = class TestDataGenerator {
  static generateUserId(prefix = 'user') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateCardId(prefix = 'card') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateTransactionAmount(min = 10, max = 1000) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  static generateCategoryData() {
    const categories = [
      'Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment',
      'Utilities', 'Healthcare', 'Education', 'Miscellaneous'
    ];
    return categories.map(category => ({
      category,
      totalAmount: this.generateTransactionAmount(100, 5000),
      transactionCount: Math.floor(Math.random() * 50) + 1,
      percentage: 0
    }));
  }
};
