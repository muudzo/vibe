import { formatTimestamp, formatDateFull } from '../format';

describe('format utilities', () => {
  const testDate = new Date('2024-05-20T14:30:00');

  test('formatTimestamp formats time correctly', () => {
    // Note: Localized strings can vary by environment, 
    // but we check if it contains the basic components
    const result = formatTimestamp(testDate);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  test('formatDateFull formats full date correctly', () => {
    const result = formatDateFull(testDate);
    expect(result).toContain('2024');
    expect(result).toContain('May');
  });

  test('handles string inputs correctly', () => {
    const result = formatTimestamp('2024-05-20T14:30:00');
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
