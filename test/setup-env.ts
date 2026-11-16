// Testlar uchun minimal muhit (config/env.ts JWT_SECRET'siz ishga tushmaydi)
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ||= 'test-secret-test-secret-test-secret-123';
