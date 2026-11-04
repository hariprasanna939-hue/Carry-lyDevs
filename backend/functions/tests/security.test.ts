import { AppError } from '../src/common/errors/AppError';

describe('Security & Error Handling', () => {
  it('should correctly format AppError to HttpsError', () => {
    const error = new AppError('permission-denied', 'Only admins are permitted');
    const httpsErr = error.toHttpsError();
    expect(httpsErr.code).toBe('permission-denied');
    expect(httpsErr.message).toBe('Only admins are permitted');
  });
});
