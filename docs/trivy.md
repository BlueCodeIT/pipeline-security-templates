# Trivy — Container & Filesystem Vulnerability Scanning

[Trivy](https://aquasecurity.github.io/trivy/) by Aqua Security is the de-facto standard for container vulnerability scanning. Fast, accurate, and free.

## What it scans

- Container images (Docker, OCI)
- Filesystem (your repo's dependencies)
- Git repositories
- Kubernetes manifests
- Terraform / CloudFormation

## What it finds

- Known CVEs in OS packages (apt, apk, yum)
- Vulnerable application dependencies (npm, pip, gem, cargo, go.mod)
- Misconfigurations in IaC files
- Hardcoded secrets

## Quick start

### Scan a container image you've already built

```yaml
jobs:
  trivy:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/trivy-container-scan.yml@v1
    with:
      image: ghcr.io/your-org/your-app:latest
```

### Build from Dockerfile and scan

```yaml
jobs:
  trivy:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/trivy-container-scan.yml@v1
    # No `image` input → builds from ./Dockerfile automatically
```

### Custom Dockerfile path

```yaml
jobs:
  trivy:
    uses: BlueCodeIT/pipeline-security-templates/.github/workflows/trivy-container-scan.yml@v1
    with:
      dockerfile: ./docker/Dockerfile.prod
```

## Configuration

| Input | Default | Description |
|---|---|---|
| `image` | `''` | Image ref to scan. Empty = build from Dockerfile |
| `dockerfile` | `Dockerfile` | Path to Dockerfile (if building) |
| `severity` | `CRITICAL,HIGH` | Severities to report and fail on |
| `fail-on-issues` | `true` | Fail the build on findings |
| `ignore-unfixed` | `true` | Skip CVEs with no available patch |

## Tuning for your team

**Strict (production-critical apps):**

```yaml
with:
  severity: 'CRITICAL,HIGH,MEDIUM'
  fail-on-issues: true
  ignore-unfixed: false
```

**Pragmatic (development repos):**

```yaml
with:
  severity: 'CRITICAL'
  fail-on-issues: true
  ignore-unfixed: true
```

**Reporting only (no build break):**

```yaml
with:
  fail-on-issues: false
```

Findings still land in GitHub Security tab — useful for visibility without blocking PRs.

## Where to see results

After the scan runs, results appear in three places:

1. **GitHub Security tab** — `Repository → Security → Code scanning alerts` (filterable by severity, dismissable)
2. **Pull request annotations** — Vulnerabilities appear inline on changed files
3. **Action logs** — Plain-text table output in the workflow run

## Common gotchas

- **First run is slow** — Trivy downloads its CVE database (~150MB). Subsequent runs use cached DB.
- **Private images** — Login to your registry before the workflow:
```yaml
  - uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}
```
- **Build context size** — If your Docker build pulls large dependencies, scan time scales with image size.

## Beyond container scanning

Trivy can also scan your **filesystem** for dependency CVEs without building an image. See `trivy-fs-scan.yml` (coming soon) for that template.

## Resources

- [Trivy documentation](https://aquasecurity.github.io/trivy/)
- [Trivy GitHub Action](https://github.com/aquasecurity/trivy-action)
- [SARIF format spec](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
