import { render, screen } from '@testing-library/react';
import Layout from '../Layout';

describe('Layout', () => {
  it('renders without crashing', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});