# Contributing

Thanks for thinking about contributing! These templates are open-source and benefit from community input.

## How to contribute

### Report bugs or suggest improvements

[Open an issue](../../issues) describing what you'd change or what's broken. Include:

- Which template/file is affected
- What you expected vs. what happened
- Any error messages or links to failing pipeline runs

### Submit pull requests

For small changes (typo fix, doc improvement, parameter tweak): open a PR directly.

For larger changes (new template, new tool integration, architecture change): open an issue first to discuss the approach.

## Pull request guidelines

- **One change per PR.** Don't bundle unrelated changes.
- **Test your template change** in a real repo before submitting.
- **Update relevant docs** in `docs/` if the change affects user-facing behavior.
- **Update the README** if the change introduces a new template or significantly changes existing behavior.
- **Keep commits clean** — squash trivial fixes before merging.

## What we're looking for

- New tool integrations (Hadolint, Gitleaks, OWASP ZAP, etc.)
- New CI platform support (Jenkins, CircleCI, Drone, etc.)
- More example repos in different languages (Python, Go, Java, Ruby, Rust)
- Improvements to existing templates (better defaults, more parameters, edge case handling)
- Documentation improvements

## What we're not looking for

- Templates for proprietary/paid tools — keep this repo focused on free, open-source security scanners
- Marketing or "alternative to X" content — we keep it factual
- Forks of templates with no meaningful changes

## Style

- **YAML:** 2-space indentation, no tabs
- **Bash:** prefer `bash` over POSIX `sh` for clarity, use `set -e` where appropriate
- **Markdown:** headlines in sentence case, code blocks with language hints

## Releases

Maintainers tag releases. We follow [SemVer](https://semver.org/):

- **MAJOR** — breaking changes (e.g., renamed inputs, removed templates)
- **MINOR** — new templates, new features, backwards-compatible
- **PATCH** — bug fixes, doc updates

## License

By contributing, you agree your work is licensed under MIT (same as this repo).