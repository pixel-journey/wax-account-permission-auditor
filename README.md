# wax-account-permission-auditor — Account Permission Auditor

> **Status:** ✅ **FULL PX PERFECTION (Alpha-Ready)** | July 2026  
> **Category:** Security & Auditing (Tier 1)  
> **Parent Catalog:** pixel-journey/wax-ecosystem-blueprint-catalog
> **Benchmark:** gkniftyheads-tracker level + Pixel Journey standards
> **Companions:** Permission Visualizer + Key Rotation + Multi-Sig Builder + Encrypted Vault

**Goal:** A powerful auditor that scans WAX/Antelope accounts for permission risks, misconfigurations, weak thresholds, and security issues — with clear scores, recommendations, and visual reports.

---

## Why This Matters

Even with good tools, users and DAOs often have hidden permission risks:
- Single points of failure
- Overly permissive thresholds
- Orphaned keys
- Multi-sig setups that are too weak or too complex

This tool brings professional-grade auditing to everyone.

---

## Tech Matrix (Pros/Cons)

| Area              | Recommended              | Alternative             | Why Chosen                          |
|-------------------|--------------------------|-------------------------|-------------------------------------|
| Risk Engine       | Pure client JS rules     | On-chain simulation     | Instant + fully educational         |
| Visualization     | Risk heatmap + tree      | Simple list             | Fast comprehension                  |
| Batch Scanning    | Client-side + export     | Server-side             | Privacy + no backend needed         |

---

## Machine Spec (spec.yaml)

```yaml
blueprint:
  id: wax-account-permission-auditor
  tier: 1
  category: security-auditing
  status: alpha-ready
  companions: [visualizer, rotation, multisig, vault]

features:
  - permission_risk_scoring
  - batch_account_audit
  - visual_risk_heatmap
  - actionable_recommendations
  - exportable_reports

machine_instructions:
  - "Build risk scoring engine with 15+ permission rules"
  - "Create visual audit report with heatmap"
  - "Support batch scanning of multiple accounts"
```

---

## Implementation

Full production code committed directly to the repo, including:
- Strong risk scoring engine
- Beautiful visual audit reports
- Batch scanning capability
- Clear recommendations

---

## Run Locally
```bash
git clone https://github.com/pixel-journey/wax-account-permission-auditor.git
npm install && npm run dev
```

*Pixel Journey — Security tooling done right.*
