import { render, screen } from '@testing-library/react';
import { ManagerBookingForm } from '../ManagerBookingForm';
import { describe, it, expect, vi } from 'vitest';

// Mock hooks
vi.mock('@/lib/hooks/useSchoolData', () => ({
  useInstructors: () => ({ data: [{ id: 'inst-1', full_name: 'Alice' }], isLoading: false }),
  useCustomers: () => ({ data: [{ id: 'cust-1', full_name: 'Bob' }], isLoading: false }),
  useLessons: () => ({ data: [{ id: 1, name: 'Kite', duration_minutes: 60 }], isLoading: false }),
}));

describe('ManagerBookingForm', () => {
  it('renders form fields correctly', () => {
    render(<ManagerBookingForm onSubmit={() => {}} />);
    expect(screen.getByText('Customer')).toBeDefined();
    expect(screen.getByText('Lesson Type')).toBeDefined();
    expect(screen.getByText('Date')).toBeDefined();
    expect(screen.getByText('Start')).toBeDefined();
    expect(screen.getByText('End')).toBeDefined();
  });
});
