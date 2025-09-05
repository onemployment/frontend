# Frontend Build and Deployment Decisions

## Build Optimization Decisions

### 1. Manual Code Splitting (`manualChunks`)

**Decision**: Split bundles into `vendor` (React core) and `redux` (state management) chunks.

**Trade-offs**:

- ✅ **Benefits**:
  - Better caching strategy (vendor libs change less frequently than app code)
  - Parallel loading of chunks improves performance
  - Users get cached vendor bundle on return visits
- ❌ **Costs**:
  - Slightly more complex build configuration
  - May create sub-optimal splits for some scenarios (Vite's automatic splitting is highly optimized)
  - Additional network requests (though HTTP/2 mitigates this)

**Rationale**: For a production app, the caching benefits outweigh the complexity cost.

### 2. Source Maps Disabled (`sourcemap: false`)

**Decision**: Disable source maps in production builds.

**Trade-offs**:

- ✅ **Benefits**:
  - 30-50% smaller bundle size
  - Faster build times
  - No source code exposure in production
- ❌ **Costs**:
  - Harder debugging in production environments
  - Error stack traces show minified code instead of original source
  - Error monitoring tools get less useful stack traces

**Rationale**: For initial production deployment, bundle size is prioritized. Can be revisited with `sourcemap: 'hidden'` (generates maps but doesn't reference them) for debugging while maintaining security.

### 3. Terser Minification (`minify: 'terser'`)

**Decision**: Use Terser instead of Vite's default esbuild minifier.

**Trade-offs**:

- ✅ **Benefits**:
  - ~10-15% smaller bundles than esbuild
  - Better compression and dead code elimination
  - More aggressive optimization for production
- ❌ **Costs**:
  - 2-3x slower build times (seconds to minutes for large apps)
  - More complex minification process
  - Potential for rare minification bugs (though very uncommon)

**Rationale**: For production deployments, smaller bundle size improves user experience more than faster build times affect developer experience.

## Deployment Strategy Decisions

### 1. Cache-Control Headers Strategy

**Decision**:

- HTML files: `no-store, no-cache, must-revalidate`
- Assets (JS/CSS): `public, max-age=31536000, immutable`

**Trade-offs**:

- ✅ **Benefits**:
  - Optimal caching for fingerprinted assets (1 year cache)
  - Always fresh HTML ensures users get latest app version
  - Reduces CDN costs and improves performance
- ❌ **Costs**:
  - HTML requests always go to origin (though CloudFront optimizes this)
  - Requires proper asset fingerprinting to work correctly

**Rationale**: Modern best practice for SPAs with fingerprinted assets.

### 2. Minimal CloudFront Invalidation

**Decision**: Only invalidate `/index.html` instead of wildcard invalidations.

**Trade-offs**:

- ✅ **Benefits**:
  - Reduces invalidation costs (~$0.005 vs ~$0.50+ per deployment)
  - Faster invalidation propagation
  - Leverages proper caching strategy
- ❌ **Costs**:
  - Requires disciplined cache header management
  - Assets must have fingerprinted names for cache busting

**Rationale**: Cost optimization that aligns with modern caching best practices.

### 3. GitHub OIDC vs Access Keys

**Decision**: Use GitHub OIDC federation instead of long-lived IAM access keys.

**Trade-offs**:

- ✅ **Benefits**:
  - No long-lived credentials to manage or rotate
  - Automatic credential lifecycle management
  - Better security posture (time-limited, scoped tokens)
  - Follows AWS security best practices
- ❌ **Costs**:
  - More complex initial setup
  - Requires understanding of OIDC concepts
  - Potential debugging complexity if misconfigured

**Rationale**: Security and compliance best practice for modern CI/CD pipelines.

## Future Considerations

### Source Maps

- Consider `sourcemap: 'hidden'` for production debugging while maintaining security
- Evaluate error monitoring integration (Sentry, Rollbar) that can map minified errors

### Build Performance

- Monitor build times as app grows
- Consider switching back to esbuild if Terser becomes a bottleneck
- Evaluate build parallelization options

### Caching Strategy

- Monitor CloudFront costs and cache hit ratios
- Consider more granular cache behaviors based on usage patterns
- Evaluate service worker implementation for additional caching layer

## Revision History

- **2025-09-05**: Initial decisions for frontend CI/CD pipeline setup
