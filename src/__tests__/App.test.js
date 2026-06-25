/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import App from '../App';

describe('renders the app', () => {
  const jsonMock = jest.fn(() => Promise.resolve({}));
  const textMock = jest.fn(() => Promise.resolve(''));
  global.fetch = jest.fn(() => Promise.resolve({
    json: jsonMock,
    text: textMock,
  }));
  window.scrollTo = jest.fn();

  let container;
  let root;

  beforeEach(async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    await act(async () => {
      root = ReactDOM.createRoot(container);
      await root.render(<App />);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.removeChild(container);
    container = null;
    jest.clearAllMocks();
  });

  const navigateTo = async (path) => {
    await act(async () => {
      window.history.pushState({}, '', path);
      await root.render(<App />);
    });
  };

  it('should render the app', async () => {
    expect(document.body).toBeInTheDocument();
  });

  it('should render the title', async () => {
    expect(document.title).toBe('Elaine Leiyoung');
  });

  it('can navigate to /about', async () => {
    await navigateTo('/about');
    expect(window.location.pathname).toBe('/about');
    expect(document.title).toContain('The Wanderer |');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(textMock).toHaveBeenCalledTimes(1);
  });

  it('can navigate to /record', async () => {
    await navigateTo('/record');
    expect(window.location.pathname).toBe('/record');
    expect(document.title).toContain('The Record |');
  });

  it('can navigate to /craft', async () => {
    await navigateTo('/craft');
    expect(window.location.pathname).toBe('/craft');
    expect(document.title).toContain('The Craft |');
  });

  it('can navigate to /contact', async () => {
    await navigateTo('/contact');
    expect(window.location.pathname).toBe('/contact');
    expect(document.title).toContain('Send Word |');
  });
});
