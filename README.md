# 🔒 Pipeline Security Templates

**Production-ready security scan templates for GitHub Actions, GitLab CI, and Bitbucket Pipelines.**  
Plug-and-play CI snippets to add Trivy, Semgrep, and Checkov to your DevSecOps pipeline in minutes.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-supported-blue?logo=github-actions)]()
[![GitLab CI](https://img.shields.io/badge/GitLab_CI-supported-orange?logo=gitlab)]()
[![Bitbucket Pipelines](https://img.shields.io/badge/Bitbucket-supported-blue?logo=bitbucket)]()

---

## What's included

| Tool | Purpose | Speed |
|---|---|---|
| **Trivy** | Container & dependency vulnerability scanning | <30s |
| **Semgrep** | SAST — finds code vulnerabilities (SQLi, XSS, secrets) | <2min |
| **Checkov** | IaC scanning — Terraform, Kubernetes, CloudFormation | <1min |

All templates run in parallel by default. No external services required.

---

## Quick start

### GitHub Actions

Copy `github-actions/full-stack.yml` to `.github/workflows/security.yml` in your repo:

\`\`\`yaml
name: Security Scans
on: [push, pull_request]

jobs:
  trivy:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/trivy-container-scan.yml@main
  semgrep:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/semgrep-sast.yml@main
  checkov:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/checkov-iac.yml@main
\`\`\`

That's it. Push and watch your pipeline.

### GitLab CI / Bitbucket

See [`gitlab-ci/`](./gitlab-ci/) and [`bitbucket-pipelines/`](./bitbucket-pipelines/) for ready-to-use templates.

---

## Bonus: Add deployment risk scoring

Want a single risk score (0–100) before every deployment? Try [Deployment Guard](https://www.bluecodeit.com/deployment-guard) — analyzes diff complexity, K8s changes, dependency risk, and incident history. Free tier: 30 analyses/month.

\`\`\`yaml
- uses: BlueCodeIT/deployment-guard-action@v1
  with:
    api-key: ${{ secrets.GUARD_API_KEY }}
\`\`\`

See [`github-actions/full-stack-with-guard.yml`](./github-actions/full-stack-with-guard.yml) for the complete pipeline.

---

## Why these templates exist

Most DevSecOps tools require:
- Separate dashboards
- Paid SaaS subscriptions
- Hours of YAML wrangling

These templates skip all that. Open-source tools, copy-paste config, no signup.

Built by [BlueCode IT](https://www.bluecodeit.com) — a focus on DevOps tooling for teams of 5–50.

---

## Examples

Real example repos with these templates configured:

- [Node.js app](./examples/nodejs-app/) — Express API with Trivy + Semgrep
- [Python FastAPI](./examples/python-fastapi/) — Python service with full stack
- [Go service](./examples/golang-service/) — Go microservice
- [Terraform AWS](./examples/terraform-aws/) — IaC with Checkov

---

## Tools documentation

- [Trivy → Container & filesystem scanning](./docs/trivy.md)
- [Semgrep → Static analysis](./docs/semgrep.md)
- [Checkov → Infrastructure as Code](./docs/checkov.md)
- [Comparison: which tool when?](./docs/comparison.md)
- [Deployment Guard → Risk scoring](./docs/deployment-guard.md)

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

Issues, questions, suggestions: [open an issue](../../issues) or email [info@bluecodeit.com](mailto:info@bluecodeit.com).

---

## License

MIT — use freely, attribution appreciated.

---

*Built with ❤️ in Monheim am Rhein*