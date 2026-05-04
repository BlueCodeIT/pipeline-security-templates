# GitLab CI Templates — Setup Guide

GitLab CI templates for Trivy, Semgrep, Checkov, and Deployment Guard.

Unlike GitHub Actions' Reusable Workflows, GitLab uses an `include` + `extends` pattern. Templates define a base job (`.template_name`), and your `.gitlab-ci.yml` extends it with optional overrides.

## Quick start

### Single tool — Trivy

```yaml
# .gitlab-ci.yml
include:
  - remote: 'https://raw.githubusercontent.com/BlueCodeIT/pipeline-security-templates/main/gitlab-ci/trivy.yml'

stages:
  - test

trivy_scan:
  extends: .trivy_template
  stage: test
```

That's it. Push and watch the pipeline.

### Full stack — all three tools

```yaml
# .gitlab-ci.yml
include:
  - remote: 'https://raw.githubusercontent.com/BlueCodeIT/pipeline-security-templates/main/gitlab-ci/full-stack.yml'

stages:
  - security

trivy_scan:
  extends: .trivy_template
  stage: security

semgrep_scan:
  extends: .semgrep_template
  stage: security

checkov_scan:
  extends: .checkov_template
  stage: security
```

All three jobs run in parallel within the `security` stage.

### Full stack + Deployment Guard

```yaml
# .gitlab-ci.yml
include:
  - remote: 'https://raw.githubusercontent.com/BlueCodeIT/pipeline-security-templates/main/gitlab-ci/full-stack-with-guard.yml'

variables:
  GIT_DEPTH: 2   # Required for Deployment Guard diff analysis

stages:
  - security
  - risk

trivy_scan:
  extends: .trivy_template
  stage: security

semgrep_scan:
  extends: .semgrep_template
  stage: security

checkov_scan:
  extends: .checkov_template
  stage: security

deployment_guard:
  extends: .deployment_guard_template
  stage: risk
```

Set `GUARD_API_KEY` in your repo's CI/CD variables (Settings → CI/CD → Variables → Add variable, masked: yes).

## Customization

Override variables in your job:

```yaml
trivy_scan:
  extends: .trivy_template
  variables:
    TRIVY_IMAGE: "registry.example.com/myapp:latest"
    TRIVY_SEVERITY: "CRITICAL,HIGH,MEDIUM"
    TRIVY_FAIL_ON_ISSUES: "false"
```

See each individual template for available variables.

## Where to see results

### GitLab Free Tier

- **Job logs** — full output in the pipeline run
- **Artifacts** — JSON/SARIF reports downloadable from each job

### GitLab Premium / Ultimate

- **Security Dashboard** — Findings appear in `Security & Compliance` (Container Scanning, SAST)
- **Merge Request widgets** — Vulnerability summaries show on MRs
- **Vulnerability Reports** — Searchable, filterable, dismissible

## Common gotchas

### "Docker-in-Docker required" (Trivy)

If your `.gitlab-ci.yml` doesn't already have a Dockerfile-build step, Trivy needs to build the image itself, which requires DinD.

**Solution 1** — pre-build the image in an earlier stage:

```yaml
build:
  stage: build
  script:
    - docker build -t myapp:latest .

trivy_scan:
  extends: .trivy_template
  stage: test
  variables:
    TRIVY_IMAGE: "myapp:latest"
```

**Solution 2** — use Docker-in-Docker:

```yaml
trivy_scan:
  extends: .trivy_template
  services:
    - docker:dind
```

### "Could not find previous commit" (Deployment Guard)

The Guard requires the previous commit to compute diff. Set `GIT_DEPTH: 2`:

```yaml
variables:
  GIT_DEPTH: 2
```

Or globally in your pipeline.

### "Reports not appearing in Security Dashboard"

GitLab's Security Dashboard requires **Premium** or **Ultimate** tier. On Free, reports are only available as job artifacts.

## GitLab.com vs. self-hosted GitLab

These templates work on both. For self-hosted with restricted internet access, you may need to:

- Mirror the template `.yml` files to your internal Git
- Pre-pull the Docker images (`aquasec/trivy`, `semgrep/semgrep`, `bridgecrew/checkov`) to your registry
- Replace `remote:` includes with `local:` or `project:` includes
