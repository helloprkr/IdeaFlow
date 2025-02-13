# Environment Variables Troubleshooting Guide

## 1. Required Environment Variables

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Application Configuration
```bash
NODE_ENV=development|staging|production
```

## 2. Identifying Missing Variables

### Automatic Check Script
Create a validation utility at `lib/utils/validate-env.ts`:

```typescript
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n` +
      missing.map(var => `  - ${var}`).join('\n')
    );
  }
}
```

## 3. Environment Setup

### Development (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NODE_ENV=development
```

### Staging (.env.staging)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
NODE_ENV=staging
```

### Production (.env.production)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NODE_ENV=production
```

## 4. Security Best Practices

1. **Never commit environment files**
   - Add `.env*` to `.gitignore`
   - Use `.env.example` for documentation

2. **Encryption at Rest**
   - Use secret management services in production
   - Encrypt sensitive values when stored

3. **Access Control**
   - Limit access to production environment variables
   - Use role-based access for secrets management

4. **Rotation Policy**
   - Regularly rotate sensitive keys
   - Implement automated key rotation where possible

## 5. Common Issues and Solutions

### Issue: Environment Variables Undefined in Production
```typescript
// Wrong ❌
const apiUrl = process.env.API_URL

// Correct ✅
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### Issue: Environment Variables Not Loading
1. Check file naming:
   - Development: `.env.local`
   - Production: `.env.production`
   
2. Verify file location:
   - Must be in project root
   - Case-sensitive naming

### Issue: Type Safety
```typescript
// Add type safety with zod
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
```

## 6. Deployment Checklist

- [ ] All required variables defined
- [ ] Variables properly encrypted
- [ ] Access controls configured
- [ ] Monitoring in place
- [ ] Backup procedures documented
- [ ] Emergency rotation process ready

## 7. Testing Environment Variables

```typescript
describe('Environment Variables', () => {
  it('should have required variables', () => {
    expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined()
    expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined()
  })

  it('should have valid URL format', () => {
    expect(() => new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!))
      .not.toThrow()
  })
})
```

## 8. Monitoring and Alerts

1. Set up monitoring for:
   - Missing variables
   - Invalid values
   - Expiring secrets

2. Configure alerts for:
   - Configuration changes
   - Access attempts
   - Rotation events

## 9. Emergency Procedures

1. If credentials are compromised:
   - Rotate affected keys immediately
   - Review access logs
   - Update all affected services
   - Document incident

2. If variables are missing:
   - Check deployment logs
   - Verify environment configuration
   - Restore from backup if necessary

## 10. Additional Resources

- [Next.js Environment Variables Documentation](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Variables Guide](https://supabase.com/docs/guides/hosting/environment-variables)
- [Environment Variables Best Practices](https://12factor.net/config)