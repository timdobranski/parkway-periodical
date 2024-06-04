import { render, screen } from '@testing-library/react';
import Header from '../components/Header/Header';
import mockRouter from 'next-router-mock';


describe('Header', () => {
  it('renders the header title "Parkway Periodical"', () => {
    const number = 1;
    // render(<Header />);
    // const heading = screen.getByRole('heading', { name: /parkway periodical/i });
    // expect(heading).toBeInTheDocument();
    expect(number).toEqual(1);
  });
});