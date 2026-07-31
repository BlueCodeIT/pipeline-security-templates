# Security Policy

## Supported versions

Only the latest stable release is actively maintained. We recommend pinning to specific version tags rather than `@main`.

## Reporting a vulnerability

If you discover a security issue in these templates — for example, a configuration that could leak secrets, a template that fails-open when it should fail-closed, or a dependency with a known CVE — please report it privately.

**Do not open a public GitHub issue for security vulnerabilities.**

### How to report

Email: **info@pantevosystems.com**

Include:
- Description of the issue
- Steps to reproduce (if applicable)
- Suggested fix (if you have one)
- Your name/handle for credit (optional)

### What to expect

- **Acknowledgement** within 48 hours
- **Initial assessment** within 7 days
- **Fix or mitigation** within 30 days for critical issues, 90 days for non-critical
- **Public disclosure** after fix is released, with credit to reporter (unless anonymity preferred)

## Out of scope

This policy covers issues in:
- Templates published in this repo
- Documentation that could mislead users into insecure configurations

It does **not** cover:
- Vulnerabilities in upstream tools (Trivy, Semgrep, Checkov) — report those to their maintainers
- Issues in your own repository where you've used these templates
- Bugs that are not security-relevant — use regular issues for those

## Acknowledgements

We're grateful to the security research community. Past reporters will be credited here.

_(No reports yet.)_