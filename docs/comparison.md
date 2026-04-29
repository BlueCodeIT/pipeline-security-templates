# Tool Comparison — Which Security Scanner When?

A practical guide to choosing the right tool (or combination) for your DevSecOps pipeline.

## The short answer

**Use all three.** They cover different layers and rarely overlap.

| Tool | Layer | Speed |
|---|---|---|
| **Trivy** | Runtime — container images, OS packages, dependencies | <30s |
| **Semgrep** | Source code — application logic, code patterns | 1–5min |
| **Checkov** | Infrastructure as Code — Terraform, Kubernetes, CloudFormation | <1min |

If you only have time for one, pick by what you ship most often:

- **Container-heavy?** Start with Trivy.
- **App-code-heavy?** Start with Semgrep.
- **Infra-as-code-heavy?** Start with Checkov.

## What each tool finds

### Trivy

- ✅ Known CVEs in container base images (Debian, Alpine, RHEL packages)
- ✅ Vulnerable dependencies (npm, pip, gem, cargo, go.mod, Maven)
- ✅ Misconfigurations in Dockerfile
- ✅ Hardcoded secrets in built images
- ✅ License compliance
- ❌ Custom application logic flaws
- ❌ IaC misconfigurations (limited support)

### Semgrep

- ✅ SQL injection, command injection, path traversal
- ✅ XSS, CSRF, SSRF patterns
- ✅ Hardcoded credentials and secrets in source code
- ✅ Insecure cryptography (weak ciphers, hardcoded keys)
- ✅ OWASP Top 10 patterns across 40+ languages
- ✅ Custom organization-specific patterns
- ❌ Runtime container vulnerabilities
- ❌ IaC misconfigurations

### Checkov

- ✅ Public-facing cloud resources (S3, blob storage, databases)
- ✅ Missing encryption at rest / in transit
- ✅ Overly-permissive IAM policies
- ✅ Container security in Kubernetes manifests
- ✅ Compliance frameworks (CIS, NIST, SOC2, HIPAA, PCI)
- ✅ 1000+ checks for AWS, Azure, GCP, Kubernetes, Helm
- ❌ Application code vulnerabilities
- ❌ Runtime container CVEs

## Overlap zones (where tools touch)

### Dockerfile scanning

- **Trivy** scans the *built* image — finds CVEs in installed packages
- **Checkov** scans the Dockerfile *source* — finds misconfigurations like `USER root`
- **Semgrep** can pattern-match Dockerfile too, but Checkov has deeper rules

→ **Use Trivy + Checkov for Dockerfiles.**

### Hardcoded secrets

- **Semgrep** finds secrets in source code (best for code patterns)
- **Trivy** finds secrets in built images (catches what slipped through)
- **Checkov** finds secrets in IaC files (catches Terraform-embedded keys)

→ **All three together cover all layers.** Plus consider a dedicated tool like [Gitleaks](https://github.com/gitleaks/gitleaks) for git-history scanning.

### Kubernetes security

- **Trivy** scans the container images deployed to K8s
- **Checkov** scans the K8s manifests (RBAC, network policies, pod security)
- **Semgrep** is rarely used for K8s

→ **Trivy + Checkov for full K8s coverage.**

## Performance

Rough estimates on a medium-sized repo (~50k LOC, ~10 IaC files, 1 container):

| Tool | First run | Subsequent runs |
|---|---|---|
| Trivy | 60–120s (DB download) | 20–40s |
| Semgrep | 30–90s | 30–90s (no caching benefit) |
| Checkov | 30–60s | 30–60s |

In parallel via [`full-stack.yml`](../github-actions/full-stack.yml): **~3–5 minutes total**.

## False positives

All three tools produce false positives. Expect to spend ~1 hour initially tuning each:

- **Trivy** — common: `ignore-unfixed: true` reduces noise dramatically
- **Semgrep** — common: exclude `tests/`, `vendor/`, `node_modules/` paths; use `// nosemgrep` inline
- **Checkov** — common: skip checks that don't apply to your context (e.g. `CKV_AWS_18` for logging buckets)

## Compliance frameworks

Need SOC2 / HIPAA / PCI-DSS reports?

- **Checkov** has the strongest compliance focus — built-in mappings for major frameworks
- **Trivy** has a `--compliance` flag for some standards (NSA, CIS Docker Benchmark)
- **Semgrep** has compliance rulesets (`p/cwe-top-25`, `p/owasp-top-ten`)

For regulated industries, consider a dedicated compliance platform on top of these tools.

## Coverage matrix

| Concern | Trivy | Semgrep | Checkov |
|---|:---:|:---:|:---:|
| Container CVEs | ✅ | ❌ | ❌ |
| Dependency CVEs | ✅ | ❌ | ❌ |
| Application code flaws | ❌ | ✅ | ❌ |
| Infrastructure misconfigurations | 🟡 | ❌ | ✅ |
| Compliance reporting | 🟡 | 🟡 | ✅ |
| Hardcoded secrets in code | 🟡 | ✅ | 🟡 |
| Hardcoded secrets in images | ✅ | ❌ | ❌ |
| Hardcoded secrets in IaC | ❌ | ❌ | ✅ |
| Dockerfile security | 🟡 | 🟡 | ✅ |
| Kubernetes manifest security | 🟡 | ❌ | ✅ |
| Custom patterns | 🟡 | ✅ | ✅ |
| Multi-language support | ✅ | ✅ | 🟡 |

✅ Strong support · 🟡 Partial support · ❌ Not designed for it

## What this stack doesn't cover

For complete DevSecOps, also consider:

- **Dynamic Application Security Testing (DAST)** — [OWASP ZAP](https://www.zaproxy.org/), [Nuclei](https://github.com/projectdiscovery/nuclei)
- **Git history secret scanning** — [Gitleaks](https://github.com/gitleaks/gitleaks), [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- **Software Composition Analysis (SCA) deeper** — [Snyk](https://snyk.io/), [Dependabot](https://docs.github.com/en/code-security/dependabot)
- **Runtime threat detection** — [Falco](https://falco.org/), [Tetragon](https://tetragon.io/)
- **Deployment risk scoring** — [Deployment Guard](https://www.bluecodeit.com/deployment-guard) (combines all of the above into a single 0–100 score)

## Summary

These three tools — Trivy, Semgrep, Checkov — cover ~80% of common DevSecOps concerns for typical web/API services running on Kubernetes or container platforms. They're free, well-maintained, and integrate with GitHub Security tab via SARIF.

For the missing 20%, layer in tools above based on your specific concerns.

For deployment risk scoring on top of all findings, see [Deployment Guard](https://www.bluecodeit.com/deployment-guard).