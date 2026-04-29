# Node.js Express API — Pipeline Security Demo

A minimal Node.js Express API configured with the full security stack from this repo.

**This is intentionally vulnerable.** It has hardcoded secrets, SQL injection patterns, missing Kubernetes security contexts, and Dockerfile anti-patterns. The point is to show what the security tools find on real-world-ish code.

## Structure

nodejs-app/
├── package.json                          # Express + pg dependencies
├── src/
│   └── index.js                          # Has SQLi + hardcoded secret
├── Dockerfile                            # No USER, no HEALTHCHECK
├── k8s/
│   └── deployment.yaml                   # Missing security contexts, plain-text secrets
└── .github/workflows/security.yml        # Uses pipeline-security-templates

## What each tool finds

### Trivy (container scan)

- CVEs in `node:20-alpine` base image (varies by week)
- Vulnerabilities in `express`, `pg`, `morgan` versions

### Semgrep (SAST)

- `src/index.js` line 25: SQL injection via template literal
- `src/index.js` line 35: hardcoded admin token

### Checkov (IaC)

- `Dockerfile`: missing USER, no HEALTHCHECK
- `k8s/deployment.yaml`: missing security context, missing resource limits, missing replicas, image without digest, secret in plain text

## Try it locally

### Run the app

```bash
docker build -t nodejs-app:demo .
docker run -p 3000:3000 nodejs-app:demo
curl http://localhost:3000/health
```

### Run scans locally

```bash
# Trivy
docker run --rm -v $PWD:/scan aquasec/trivy:0.55.0 fs --severity HIGH,CRITICAL /scan

# Semgrep
docker run --rm -v $PWD:/src semgrep/semgrep:1.92.0 scan --config p/default --severity WARNING /src

# Checkov
docker run --rm -v $PWD:/scan bridgecrew/checkov:latest --directory /scan/k8s --framework kubernetes
```

## Fix the issues

The Dockerfile and `k8s/deployment.yaml` have commented-out fixes. Uncomment them to see the security findings disappear in the next pipeline run.

## License

MIT — same as the parent repo.