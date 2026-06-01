# Dependency Management Guide

This document provides guidelines for managing dependencies in the VestFlow project.

## Overview

VestFlow uses multiple package ecosystems and has automated dependency management configured via Dependabot:

- **Frontend**: Next.js with npm packages
- **Indexer**: Node.js service with npm packages  
- **Contracts**: Rust smart contracts with Cargo crates
- **CI/CD**: GitHub Actions workflows

## Automated Dependency Updates

### Dependabot Configuration

Dependabot is configured to automatically update dependencies on a weekly schedule:

- **Monday 09:00 UTC**: Main npm packages
- **Monday 09:30 UTC**: Indexer npm packages
- **Tuesday 09:00 UTC**: Rust crates
- **Wednesday 09:00 UTC**: GitHub Actions

### Auto-Merge Policy

- ✅ **Patch updates** (1.0.0 → 1.0.1): Automatically merged after CI passes
- ✅ **Minor updates** (1.0.0 → 1.1.0): Automatically merged after CI passes
- ⚠️ **Major updates** (1.0.0 → 2.0.0): Require manual review

### Protected Dependencies

Some critical dependencies are protected from automatic major updates:

#### Frontend
- `react` & `react-dom`: Major updates require migration planning
- `next`: Major updates often include breaking changes

#### Indexer
- `better-sqlite3`: Database compatibility concerns

#### Contracts
- `soroban-sdk`: Breaking changes affect contract compatibility

## Manual Dependency Management

### Adding New Dependencies

#### Frontend Dependencies
```bash
# Production dependency
npm install package-name

# Development dependency
npm install --save-dev package-name
```

#### Indexer Dependencies
```bash
cd indexer
npm install package-name
```

#### Contract Dependencies
```toml
# Add to contracts/vestflow/Cargo.toml
[dependencies]
new-crate = "1.0.0"
```

### Updating Dependencies

#### Check for Updates
```bash
# Check npm packages
npm outdated

# Check Rust crates
cd contracts
cargo outdated  # Requires: cargo install cargo-outdated
```

#### Manual Updates
```bash
# Update specific npm package
npm update package-name

# Update specific Rust crate
cd contracts
cargo update -p crate-name
```

### Security Audits

#### npm Security Audit
```bash
# Main application
npm audit
npm audit fix

# Indexer
cd indexer
npm audit
npm audit fix
```

#### Rust Security Audit
```bash
cd contracts
cargo install cargo-audit  # One-time install
cargo audit
```

## Dependency Guidelines

### Choosing Dependencies

#### Evaluation Criteria
- **Maintenance**: Active development and regular updates
- **Security**: Good security track record
- **Popularity**: Wide adoption and community support
- **License**: Compatible with project license
- **Size**: Reasonable bundle size impact
- **Quality**: Good documentation and test coverage

#### Stellar Ecosystem
- Prefer official `@stellar/*` packages
- Keep Stellar SDK versions consistent across components
- Monitor Soroban SDK updates for breaking changes

#### Frontend Dependencies
- Prefer TypeScript-compatible packages
- Consider bundle size impact
- Ensure Next.js compatibility
- Maintain React ecosystem consistency

#### Backend Dependencies
- Prefer well-maintained Node.js packages
- Consider performance implications
- Ensure database compatibility
- Maintain TypeScript support

#### Contract Dependencies
- Use stable Soroban SDK versions
- Minimize external dependencies
- Prefer audited crates for security-critical code
- Consider WASM compatibility

### Version Pinning Strategy

#### Exact Versions (package.json)
```json
{
  "dependencies": {
    "critical-package": "1.2.3"  // Exact version for stability
  }
}
```

#### Semver Ranges (package.json)
```json
{
  "dependencies": {
    "stable-package": "^1.2.3",  // Compatible minor/patch updates
    "dev-tool": "~1.2.3"         // Compatible patch updates only
  }
}
```

#### Cargo Versions (Cargo.toml)
```toml
[dependencies]
soroban-sdk = "22.0.11"        # Exact version for contracts
serde = "1.0"                  # Major version for utilities
```

## Troubleshooting

### Common Issues

#### Dependency Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Cargo
cd contracts
cargo clean
cargo build
```

#### Version Mismatches
```bash
# Check installed versions
npm list package-name
cargo tree -p crate-name

# Force specific version
npm install package-name@1.2.3
```

#### Security Vulnerabilities
```bash
# Fix automatically (if possible)
npm audit fix

# Force fix (may cause breaking changes)
npm audit fix --force

# Manual fix
npm install package-name@safe-version
```

### Dependabot Issues

#### Failed Auto-Merge
1. Check CI logs for build failures
2. Test the update locally
3. Fix compatibility issues
4. Push fixes to the Dependabot branch

#### Ignored Updates
1. Review `.github/dependabot.yml` ignore rules
2. Remove outdated ignore entries
3. Use `@dependabot recreate` to force new PR

#### Merge Conflicts
1. Dependabot will auto-rebase when possible
2. For persistent conflicts, close PR (Dependabot will recreate)
3. Manual intervention may be required

## Best Practices

### Development Workflow

1. **Regular Updates**: Review and update dependencies monthly
2. **Security First**: Prioritize security updates
3. **Test Thoroughly**: Run full test suite after updates
4. **Document Changes**: Note breaking changes in commit messages
5. **Monitor Impact**: Watch for performance or functionality regressions

### Code Quality

1. **Lock Files**: Always commit lock files (`package-lock.json`, `Cargo.lock`)
2. **Consistent Versions**: Keep related packages in sync
3. **Minimal Dependencies**: Avoid unnecessary dependencies
4. **Regular Audits**: Run security audits regularly

### Team Coordination

1. **Communication**: Notify team of major dependency changes
2. **Documentation**: Update docs when dependencies change APIs
3. **Testing**: Ensure all team members can build after updates
4. **Rollback Plan**: Be prepared to rollback problematic updates

## Resources

### Tools
- [npm-check-updates](https://www.npmjs.com/package/npm-check-updates): Check for npm updates
- [cargo-outdated](https://crates.io/crates/cargo-outdated): Check for Cargo updates
- [cargo-audit](https://crates.io/crates/cargo-audit): Security audit for Rust
- [Dependabot](https://github.com/dependabot): Automated dependency updates

### Documentation
- [npm Documentation](https://docs.npmjs.com/)
- [Cargo Book](https://doc.rust-lang.org/cargo/)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [Stellar SDK Documentation](https://stellar.github.io/js-stellar-sdk/)
- [Soroban Documentation](https://soroban.stellar.org/docs)

### Security Resources
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [RustSec Advisory Database](https://rustsec.org/)
- [GitHub Security Advisories](https://github.com/advisories)
- [Stellar Security Guidelines](https://developers.stellar.org/docs/security)