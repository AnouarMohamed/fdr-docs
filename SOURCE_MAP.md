# Documentation source map

This file records how the standalone guide covers the FDR repository. Raw
machine artifacts remain in the source repository and are linked from the
corresponding guide page.

| Repository source | Standalone route |
|---|---|
| `README.md`, `docs/README.md` | `#/contents`, `#/concepts` |
| `docs/getting-started.md` | `#/getting-started` |
| Cross-workflow operational procedures | `#/walkthroughs` |
| `docs/configuration.md` | `#/configuration` |
| `fdrd.man` | `#/command-line` |
| `docs/operations.md`, `fdr.service` | `#/systemd`, `#/observability`, `#/incident-response`, `#/troubleshooting` |
| `deploy/kubernetes/README.md`, manifests | `#/kubernetes`, `#/deployment-reference` |
| `deploy/helm/fdr/README.md`, `values.yaml`, `values.schema.json`, templates | `#/kubernetes`, `#/deployment-reference` |
| `deploy/kind/README.md` | `#/kind-lab` |
| `tests/vm/README.md` | `#/vm-validation` |
| `SECURITY.md` | `#/security` |
| `docs/performance-optimization-plan.md` | `#/performance`, `#/roadmap` |
| `docs/benchmarks/*.md`, `docs/benchmarks/*.tsv` | `#/benchmark-catalog` with raw-source links |
| `docs/validation/README.md`, recorded reports | `#/validation` with raw-source links |
| Recorded validation screenshots | `#/observability`, `#/validation` with annotations |
| `CONTRIBUTING.md`, `Makefile` | `#/development` |
| `Makefile`, RPM spec, OCI Dockerfile | `#/packaging` |
| `ROADMAP.md` | `#/roadmap` |
| `CHANGELOG.md` | `#/release-notes` |

## Deliberately linked, not copied

- validation logs and environment dumps;
- recorded screenshots;
- benchmark TSV rows;
- executable test fixtures and harness implementations;
- rendered Grafana JSON and Kubernetes YAML source;
- source code and commit history.

These artifacts are evidence or implementation, not reference prose. Their
authoritative versions remain tied to the source revision that produced them.

Architecture, reload, Kubernetes, and incident-response explanations are
maintained as native page content so they remain accessible and match the
active documentation theme.
