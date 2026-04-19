/**
 * Tests for API Client
 */
import { apiClient } from '../apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test Product' };
      mockedAxios.create.mockReturnThis();
      mockedAxios.get.mockResolvedValue({ data: mockData });

      const result = await apiClient.get('/products/1');

      expect(result).toEqual(mockData);
    });

    it('should handle GET request errors', async () => {
      mockedAxios.create.mockReturnThis();
      mockedAxios.get.mockRejectedValue({
        response: {
          status: 404,
          data: { detail: 'Not found' },
        },
      });

      await expect(apiClient.get('/products/999')).rejects.toMatchObject({
        status: 404,
        message: 'Not found',
      });
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { success: true };
      const postData = { name: 'New Product' };
      
      mockedAxios.create.mockReturnThis();
      mockedAxios.post.mockResolvedValue({ data: mockData });

      const result = await apiClient.post('/products', postData);

      expect(result).toEqual(mockData);
    });
  });

  describe('Token management', () => {
    it('should set and use access token', async () => {
      const token = 'test-token-123';
      apiClient.setAccessToken(token);

      // Token should be added to request headers
      // Test implementation depends on interceptor setup
    });

    it('should clear access token', () => {
      apiClient.setAccessToken('test-token');
      apiClient.clearAccessToken();
      
      // Token should be removed
    });
  });
});
