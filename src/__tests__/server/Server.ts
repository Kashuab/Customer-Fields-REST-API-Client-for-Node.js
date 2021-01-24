import { setupServer } from 'msw/node';
import CustomerHandlers from './CustomerHandlers';

export const server = setupServer(...CustomerHandlers);
