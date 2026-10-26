import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import FinancialCalculationService from '../src/services/financialCalculationService.js';

describe('Financial Calculation Service', () => {
  test('calculateSavingsRate calculates exact rate when income > expenses', () => {
    const rate = FinancialCalculationService.calculateSavingsRate(10000, 3500);
    // (6500 / 10000) * 100 = 65%
    assert.equal(rate, 65);
  });

  test('calculateSavingsRate returns 0 when income is 0 or negative without throwing', () => {
    assert.equal(FinancialCalculationService.calculateSavingsRate(0, 500), 0);
    assert.equal(FinancialCalculationService.calculateSavingsRate(-1000, 500), 0);
    assert.equal(FinancialCalculationService.calculateSavingsRate(null, 500), 0);
  });

  test('calculateSavingsRate returns 0 when expenses exceed income', () => {
    assert.equal(FinancialCalculationService.calculateSavingsRate(5000, 7000), 0);
  });

  test('computeNetWorth calculates assets minus liabilities accurately', () => {
    const accounts = [
      { type: 'bank', balance: 50000 },
      { type: 'savings', balance: 25000 },
      { type: 'credit', balance: -5000 }, // credit liability
    ];

    const result = FinancialCalculationService.computeNetWorth(accounts);
    assert.equal(result.assets, 75000);
    assert.equal(result.liabilities, 5000);
    assert.equal(result.netWorth, 70000);
  });

  test('computeExpenseBreakdown handles zero total expense gracefully', () => {
    const result = FinancialCalculationService.computeExpenseBreakdown([]);
    assert.equal(result.totalExpense, 0);
    assert.deepEqual(result.breakdown, []);
  });

  test('computeExpenseBreakdown percentages sum up correctly and categorize transactions', () => {
    const transactions = [
      { type: 'expense', amount: 500, category: 'Food & Dining' },
      { type: 'expense', amount: 500, category: 'Shopping' },
      { type: 'income', amount: 3000, category: 'Salary' }, // Should be ignored
    ];

    const result = FinancialCalculationService.computeExpenseBreakdown(transactions);
    assert.equal(result.totalExpense, 1000);
    assert.equal(result.breakdown.length, 2);
    assert.equal(result.breakdown[0].percentage, 50);
    assert.equal(result.breakdown[1].percentage, 50);
  });
});
