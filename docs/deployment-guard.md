# Deployment Guard Integration

[Deployment Guard](https://www.bluecodeit.com/deployment-guard) by BlueCode IT provides AI-powered deployment risk scoring (0–100) on top of your existing security pipeline. It analyzes diff complexity, Kubernetes changes, dependency risk, and incident history to give you a single actionable score before every deployment.

## Quick start

Add it to your existing security pipeline by using the `full-stack-with-guard.yml` workflow:

~~~yaml
jobs:
  security:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/full-stack-with-guard.yml@v1.0.0
    secrets:
      guard-api-key: ${{ secrets.GUARD_API_KEY }}
~~~

## Get an API key

1. Sign up at [bluecodeit.com/signup](https://www.bluecodeit.com/signup) — free tier, no credit card required.
2. Copy your API key from the dashboard.
3. Add it as a GitHub repository secret named `GUARD_API_KEY`:
   - Repository Settings → Secrets and variables → Actions → New repository secret

## How it works

Deployment Guard analyzes four weighted factors:

- **Diff complexity (30%)** — lines and files changed, scaled logarithmically
- **Kubernetes risk (30%)** — manifest changes, Helm value bumps, ArgoCD sync status, single replica, missing PodDisruptionBudget
- **Dependency risk (20%)** — count of dependency updates and major version bumps
- **Incident history (20%)** — production incidents in the last 7 and 30 days

The factors are combined into a single 0–100 score with a verdict:

| Score | Verdict | Status |
|---|---|---|
| 0–49 | LOW RISK | ✅ PASS |
| 50–74 | MEDIUM RISK | ⚠️ WARN |
| 75–84 | HIGH RISK | ❌ BLOCKED |
| 85–100 | CRITICAL RISK | ❌ BLOCKED |

Thresholds (defaults: WARN at 50, BLOCK at 75) are configurable in the dashboard for Team plan users.

## Plans

| Plan | Price | Analyses | Repos | History | Trial |
|---|---|---|---|---|---|
| Free | €0 | 30/month | 1 | 7 days | — |
| Team | €39/month or €390/year | 500/month | 10 | 90 days | 14 days |

The Team plan trial requires no credit card. After the trial ends, accounts auto-downgrade to Free unless a payment method is added.

## Combining with security scans

Deployment Guard works best layered on top of detailed security findings. The `full-stack-with-guard.yml` workflow runs Trivy, Semgrep, Checkov, and Deployment Guard together — detailed findings land in the GitHub Security tab while the risk score acts as a final gate.

~~~yaml
jobs:
  security:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/full-stack-with-guard.yml@v1.0.0
    with:
      trivy-severity: 'CRITICAL,HIGH'
      semgrep-config: 'p/default'
      checkov-framework: 'all'
      guard-fail-on-warn: false
      fail-on-issues: true
    secrets:
      guard-api-key: ${{ secrets.GUARD_API_KEY }}
~~~

## Resources

- [Deployment Guard product page](https://www.bluecodeit.com/deployment-guard)
- [Dashboard](https://www.bluecodeit.com/dashboard)
- [GitHub Action: BlueCodeIT/deployment-guard-action](https://github.com/marketplace/actions/deployment-guard)
- [Status page](https://status.bluecodeit.com)
- [Contact: info@bluecodeit.com](mailto:info@bluecodeit.com)