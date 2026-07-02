# wax-account-permission-auditor — Account Permission Auditor

> **Status:** 🔄 In Active Deep Refinement (PX Perfection Standard)  
> **Category:** Security & Auditing (Tier 1 Foundational)  
> **Parent Catalog:** [pixel-journey/wax-ecosystem-blueprint-catalog](https://github.com/pixel-journey/wax-ecosystem-blueprint-catalog)
> **Benchmark Standard:** gkniftyheads-tracker quality + Pixel Journey retro-pixel excellence + PX Perfection Standard v1.0
> **Companions:** Permission Visualizer + Safe Key Rotation + Multi-Sig Builder

**One-sentence goal:** A powerful, educational auditor that scans WAX/Antelope accounts for permission risks, misconfigurations, weak thresholds, single points of failure, and security issues — with clear risk scoring, visual reports, and actionable recommendations. All client-side.

---

## 1. Educational Core — Why Permission Auditing Matters

Even well-intentioned accounts often accumulate hidden permission risks over time:

- Single points of failure (one key controlling everything)
- Overly permissive or weak thresholds
- Orphaned or forgotten keys
- Multi-sig setups that are either too weak or unnecessarily complex
- Dangerous permission relationships (e.g. active able to affect owner)

This tool makes those risks visible and understandable before they become disasters.

### Common Permission Risks This Tool Detects

| Risk Type                    | Why It's Dangerous                              | How the Auditor Helps                     |
|-----------------------------|--------------------------------------------------|-------------------------------------------|
| Single point of failure     | One compromised key = total loss                 | Clear scoring + visual highlighting       |
| Weak multi-sig thresholds   | Easy to take over                                | Threshold vs weight analysis              |
| Owner key too exposed       | High-value target                                | Specific warnings for owner permission    |
| Orphaned keys               | Dead weight, potential future risk               | Detection of unused or low-weight keys    |
| Active controlling owner    | Complete takeover possible                       | Explicit dangerous relationship detection |
| Overly complex permissions  | Hard to audit and maintain                       | Complexity scoring + simplification tips  |

### Learning Outcomes

After using this auditor, you will be able to:
- Quickly assess the security posture of any WAX/Antelope account
- Identify the most critical permission risks
- Understand common anti-patterns in permission design
- Make informed decisions about improving account security
- Build or integrate permission auditing into your own tools

---

## 2. Tech Recommendations Matrix

| Area                  | Recommended Approach              | Alternative                  | Why Chosen                                      | Trade-off                              |
|-----------------------|-----------------------------------|------------------------------|--------------------------------------------------|----------------------------------------|
| Risk Engine           | Pure client-side rules engine     | On-chain simulation          | Instant feedback, fully educational, private     | Not 100% on-chain until user signs     |
| Visualization         | Risk heatmap + permission tree    | Simple list                  | Much faster comprehension and pattern recognition| Slightly more complex implementation   |
| Batch Scanning        | Client-side processing + export   | Server-side processing       | Better privacy, works offline, no backend cost   | Limited by browser performance         |
| Reporting             | Visual + exportable reports       | Text-only                    | Higher educational value and shareability        | More development effort                |

---

## 3. Machine-Optimized Spec (spec.yaml)

```yaml
blueprint:
  id: wax-account-permission-auditor
  tier: 1
  category: security-auditing
  status: alpha-ready
  benchmark_target: gkniftyheads-tracker + PX
  companions: [visualizer, rotation, multisig]

features:
  - permission_risk_scoring
  - batch_account_audit
  - visual_risk_heatmap
  - actionable_recommendations
  - exportable_reports
  - dangerous_relationship_detection

recommended_stack:
  risk_engine: pure_client_js
  visualization: heatmap + embedded_permission_tree
  batch: client_side_processing

machine_instructions:
  - "Build risk scoring engine with 15+ permission safety rules"
  - "Create visual audit report with risk heatmap"
  - "Support batch scanning of multiple accounts with export"
  - "Detect dangerous permission relationships (e.g. active affecting owner)"
```

---

## 4. Folder Structure

```
wax-account-permission-auditor/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── RiskScoreCard.tsx
│   ├── PermissionRiskHeatmap.tsx
│   ├── AuditReport.tsx
│   └── BatchScanner.tsx
├── lib/
│   ├── riskEngine.ts          # Core 15+ safety rules
│   ├── types.ts
│   └── waxRpc.ts
├── spec.yaml
├── README.md
├── package.json
└── next.config.js
```

## 5. Core Implementation

Full production-ready code is committed to the repository, including:
- Comprehensive risk scoring engine (15+ rules)
- Visual risk heatmap and tree integration
- Batch account scanning with export
- Clear, actionable recommendations

---

## 6. How to Run Locally
```bash
git clone https://github.com/pixel-journey/wax-account-permission-auditor.git
cd wax-account-permission-auditor
npm install
npm run dev
```

Enter any WAX account to get an instant security audit with visual reports and recommendations.

---

## 7. Integration & Ecosystem Fit
- Works standalone or alongside the Permission Visualizer and Key Rotation tools
- `spec.yaml` ready for AI-assisted extension
- Strong synergy with the broader Tier 1 security blueprint family

---

## 8. Accessibility & Design Standards
- WCAG 2.2 AA targeted
- Reduced motion support
- Retro-pixel glassmorphic theme consistent with Pixel Journey
- Clear visual hierarchy for fast risk comprehension

---

## 9. Related Blueprints
Direct Tier 1 security companions:
- `wax-permission-visualizer-and-editor`
- `wax-safe-key-rotation-assistant`
- `wax-multi-sig-proposal-builder-and-simulator`

---

## 10. License & Credits

MIT License — Built to make permission security accessible and understandable.
Pixel Journey — Beautiful, safe, educational interfaces for public blockchain data.

*Last updated: July 02, 2026 — Accelerated Deep Refinement Pass*