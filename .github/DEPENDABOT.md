# Dependabot Configuration for VestFlow

This document explains the automated dependency management setup for the VestFlow project using GitHub Dependabot.

## Overview

VestFlow uses Dependabot to automatically keep dependencies up-to-date across multiple package ecosystems:

- **npm packages** (main Next.js application)
- **npm packages** (indexer service)
- **Rust crates** (smart contracts)
- **GitHub Actions** (CI/CD workflows)

## Configuration Details

### Update Schedule

| Ecosystem | Directory | Schedule | Day | Time (UTC) |
|-----------|-----------|----------|-----|------------|
| npm (main) | `/` | Weekly | Monday | 09:00 |
| npm (indexer) | `/indexer` | Weekly | Monday | 09:30 |
| Cargo (contracts) | `/contracts` | Weekly | Tuesday | 09:00 |
| GitHub Actions | `/` | Weekly | Wednesday | 09:00 |

### Dependency Grouping

Dependabot groups related dependencies together to reduce PR noise:

#### Main Application (`/`)
- **Stellar Ecosystem**: `@stellar/*` packages
- **React Ecosystem**: `react*`, `@types/react*`
- **Next.js Ecosystem**: `next*`, `@next/*`
- **Tailwind Ecosystem**: `tailwindcss*`, `@tailwindcss/*`
- **TypeScript Ecosystem**: `typescript*`, `@types/*`

#### Indexer Service (`/indexer`)
- **Stellar Ecosystem**: `@stellar/*` packages
- **Node.js Ecosystem**: `@types/node*`, `ts-node*`
- **Database Ecosystem**: `*sqlite*`, `@types/*sqlite*`

#### Smart Contracts (`/contracts`)
- **Soroban Ecosystem**: `soroban-*` crates

#### GitHub Actions (`/`)
- **Actions Ecosystem**: `actions/*`
- **Setup Actions**: `*/setup-*`

### Version Update Policies

#### Automatic Updates (Patch & Minor)
- ✅ **Patch updates** (e.g., 1.0.0 → 1.0.1): Auto-merged after CI passes
- ✅ **Minor updates** (e.g., 1.0.0 → 1.1.0): Auto-merged after CI passes

#### Manual Review Required (Major)
- ⚠️ **Major updates** (e.g., 1.0.0 → 2.0.0): Requires manual review
- Automatically labeled with `breaking-change` and `needs-review`
- Comment added explaining the breaking change risk

### Ignored Dependencies

Some critical dependencies are protected from major version updates:

#### Main Application
- `react` - Major updates require careful migration
- `react-dom` - Must stay in sync with React
- `next` - Major updates often include breaking changes

#### Indexer Service
- `better-sqlite3` - Database compatibility concerns

#### Smart Contracts
- `soroban-sdk` - Breaking changes affect contract compatibility

## Auto-Merge Workflow

The `dependabot-auto-merge.yml` workflow automatically handles Dependabot PRs:

### Automatic Actions
1. **Build Verification**: Runs full CI pipeline
2. **Test Execution**: Ensures all tests pass
3. **Auto-Merge**: Merges patch/minor updates automatically
4. **Labeling**: Adds appropriate labels based on update type

### Safety Checks
- Only runs for Dependabot-created PRs
- Requires all CI checks to pass
- Only auto-merges patch and minor updates
- Major updates require manual review

### Build Process
The workflow builds all project components:
- **Frontend**: Next.js application build
- **Indexer**: TypeScript compilation
- **Contracts**: Rust compilation and testing (when Soroban dependencies change)

## Manual Intervention

### When Manual Review is Required
- **Major version updates**: May contain breaking changes
- **Security vulnerabilities**: Flagged by security audit
- **Build failures**: CI pipeline fails
- **Test failures**: Automated tests fail

### How to Handle Major Updates
1. **Review Changelog**: Check the dependency's changelog for breaking changes
2. **Test Locally**: Run the full test suite locally
3. **Update Code**: Make necessary code changes for compatibility
4. **Merge Manually**: Approve and merge the PR after verification

## Monitoring and Maintenance

### PR Limits
- **Main npm**: Maximum 10 open PRs
- **Indexer npm**: Maximum 5 open PRs
- **Contracts Cargo**: Maximum 5 open PRs
- **GitHub Actions**: Maximum 3 open PRs

### Reviewers and Assignees
All Dependabot PRs are automatically:
- **Assigned to**: `anuoluwaponiorimi`
- **Reviewed by**: `anuoluwaponiorimi`

### Labels
Dependabot PRs are automatically labeled:
- `dependencies` - All dependency updates
- `npm` / `rust` / `github-actions` - Package ecosystem
- `frontend` / `indexer` / `contracts` / `ci/cd` - Component area
- `auto-mergeable` / `needs-review` - Review status
- `patch` / `enhancement` / `breaking-change` - Update type

## Security Considerations

### Automated Security Updates
- Dependabot automatically creates PRs for security vulnerabilities
- Security updates are prioritized over regular updates
- Security PRs bypass normal scheduling

### Audit Integration
- `npm audit` runs for all npm dependencies
- `cargo audit` runs for all Rust dependencies
- Security issues are reported in CI pipeline

### Safe Auto-Merge
- Only patch and minor updates are auto-merged
- Major updates always require manual review
- All updates must pass CI before merging

## Troubleshooting

### Common Issues

#### Build Failures
If Dependabot PRs fail CI:
1. Check the CI logs for specific errors
2. Test the update locally
3. Fix any compatibility issues
4. Push fixes to the Dependabot branch

#### Merge Conflicts
If Dependabot PRs have conflicts:
1. Dependabot will automatically rebase when possible
2. For complex conflicts, close the PR and Dependabot will recreate it
3. Manual intervention may be required for persistent conflicts

#### Ignored Updates
If important updates are being ignored:
1. Check the `ignore` configuration in `dependabot.yml`
2. Remove or modify ignore rules as needed
3. Dependabot will create new PRs for previously ignored updates

### Configuration Updates

To modify Dependabot behavior:
1. Edit `.github/dependabot.yml`
2. Changes take effect on the next scheduled run
3. Use `@dependabot recreate` comment to force PR recreation

## Best Practices

### Dependency Management
- **Regular Reviews**: Periodically review ignored dependencies
- **Security First**: Prioritize security updates over feature updates
- **Test Coverage**: Maintain good test coverage to catch breaking changes
- **Documentation**: Keep dependency documentation up-to-date

### Workflow Optimization
- **Group Related Updates**: Use grouping to reduce PR noise
- **Stagger Schedules**: Spread updates across different days
- **Monitor Limits**: Adjust PR limits based on team capacity
- **Label Strategy**: Use consistent labeling for easy filtering

## Resources

- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Configuration Options](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Auto-merge Setup](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/automating-dependabot-with-github-actions)
- [Security Advisories](https://docs.github.com/en/code-security/security-advisories)