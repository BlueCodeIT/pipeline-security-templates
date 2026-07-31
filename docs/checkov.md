# Checkov — Infrastructure as Code (IaC) Security Scanning

[Checkov](https://www.checkov.io/) by Bridgecrew (now Prisma Cloud) scans your Infrastructure as Code for security misconfigurations and compliance violations. Free, fast, and supports 1000+ built-in checks.

## What it scans

- **Terraform** (HCL + Terraform Plan JSON)
- **Kubernetes** manifests (YAML)
- **Helm** charts
- **CloudFormation** (JSON/YAML)
- **AWS CDK** (synthesized templates)
- **Azure ARM / Bicep**
- **Dockerfile**
- **Ansible**
- **GitHub Actions workflows**
- **GitLab CI / Bitbucket Pipelines**
- **Argo Workflows**
- **Serverless Framework**

## What it finds

- Public-facing S3 buckets, databases, storage accounts
- Missing encryption at rest / in transit
- Overly-permissive IAM policies
- Containers running as root, privileged mode, host network
- Missing resource limits in Kubernetes
- Hardcoded secrets in IaC files
- CIS / NIST / SOC2 / HIPAA compliance violations
- Logging and monitoring gaps

## Quick start

### Scan everything in your repo

```yaml
jobs:
  checkov:
    uses: PantevoSystems/pipeline-security-templates/.github/workflows/checkov-iac.yml@v1
```

Default scans all detected frameworks in repo root.

### Scan only Kubernetes manifests

```yaml
jobs:
  checkov:
    uses: PantevoSystems/pipeline-security-templates/.github/workflows/checkov-iac.yml@v1
    with:
      directory: ./k8s
      framework: kubernetes
```

### Scan Terraform with strict mode

```yaml
jobs:
  checkov:
    uses: PantevoSystems/pipeline-security-templates/.github/workflows/checkov-iac.yml@v1
    with:
      directory: ./terraform
      framework: terraform
      soft-fail: false
```

### Multiple frameworks, soft-fail (report only)

```yaml
jobs:
  checkov:
    uses: PantevoSystems/pipeline-security-templates/.github/workflows/checkov-iac.yml@v1
    with:
      framework: terraform,kubernetes,dockerfile
      soft-fail: true
```

### Skip specific checks (false positives)

```yaml
jobs:
  checkov:
    uses: PantevoSystems/pipeline-security-templates/.github/workflows/checkov-iac.yml@v1
    with:
      skip-checks: 'CKV_AWS_18,CKV_K8S_43,CKV_DOCKER_2'
```

## Configuration

| Input | Default | Description |
|---|---|---|
| `directory` | `.` | Path to scan |
| `framework` | `all` | Frameworks to scan (comma-separated) |
| `soft-fail` | `false` | Report without failing the build |
| `skip-checks` | `''` | Comma-separated check IDs to skip |
| `check` | `''` | Run only specific check IDs |

## Supported frameworks

| Value | Scans |
|---|---|
| `all` | Auto-detect everything (default) |
| `terraform` | `.tf` files |
| `terraform_plan` | `terraform plan` JSON output |
| `kubernetes` | K8s YAML manifests |
| `helm` | Helm charts (`Chart.yaml`, `templates/`) |
| `cloudformation` | CFN JSON/YAML |
| `dockerfile` | Dockerfile and `*.dockerfile` |
| `github_actions` | `.github/workflows/*.yml` |
| `gitlab_ci` | `.gitlab-ci.yml` |
| `bitbucket_pipelines` | `bitbucket-pipelines.yml` |
| `arm` | Azure ARM templates |
| `bicep` | Azure Bicep |
| `ansible` | Ansible playbooks |
| `argo_workflows` | Argo CRDs |
| `serverless` | Serverless Framework |

## Common check categories

| Prefix | Domain |
|---|---|
| `CKV_AWS_*` | AWS resources |
| `CKV_AZURE_*` | Azure resources |
| `CKV_GCP_*` | Google Cloud resources |
| `CKV_K8S_*` | Kubernetes |
| `CKV_DOCKER_*` | Dockerfile |
| `CKV_GHA_*` | GitHub Actions |
| `CKV2_*` | Composite (cross-resource) checks |

Browse all checks: [checkov.io/5.Policy Index](https://www.checkov.io/5.Policy%20Index/all.html)

## Where to see results

1. **GitHub Security tab** — `Repository → Security → Code scanning alerts`
2. **Pull request annotations** — Findings inline on changed IaC files
3. **Action logs** — Detailed CLI output with file:line references

## Common gotchas

- **Terraform modules from registry** — Checkov needs to download them. The default `download_external_modules: true` handles this. Modules from private registries need credentials.
- **Helm charts** — Checkov templates them with default values. Custom value overrides in your CI need explicit `values.yaml` flags (not exposed in this template — open an issue if you need it).
- **Generated files** — If you generate YAML in CI (`kustomize build`, `helm template`), run Checkov **after** generation, not on the source.
- **Soft-fail for legacy repos** — Start with `soft-fail: true`, fix findings over time, then flip to strict.

## Suppressing findings

### Inline (per-resource)

In Terraform:

```hcl
resource "aws_s3_bucket" "logs" {
  # checkov:skip=CKV_AWS_18:Logging bucket — no logging needed
  bucket = "company-access-logs"
}
```

In Kubernetes:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: legacy-app
  annotations:
    checkov.io/skip: CKV_K8S_43=Image pinned via deploy script, not manifest
```

### Repo-wide via `.checkov.yaml`

```yaml
skip-check:
  - CKV_AWS_18
  - CKV_K8S_43

framework:
  - terraform
  - kubernetes
```

## When to use Checkov vs. other tools

| Task | Tool |
|---|---|
| Scan Terraform / K8s for misconfigs | **Checkov** |
| Find CVEs in container images | **Trivy** |
| Find vulnerabilities in source code | **Semgrep** |
| Compliance reports (SOC2, HIPAA) | **Checkov** with custom rules |
| Hardcoded secrets in IaC | **Checkov** (basic) or **Gitleaks** (specialized) |

For deployment risk scoring on top of all of these, see [Deployment Guard](https://www.pantevosystems.com/deployment-guard).

## Resources

- [Checkov documentation](https://www.checkov.io/)
- [Checkov GitHub](https://github.com/bridgecrewio/checkov)
- [Policy index — all checks](https://www.checkov.io/5.Policy%20Index/all.html)
- [Custom policies](https://www.checkov.io/3.Custom%20Policies/Custom%20Policies%20Overview.html)
