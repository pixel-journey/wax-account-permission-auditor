export function RelatedBlueprints() {
  const links = [
    {
      href: "https://github.com/pixel-journey/wax-permission-visualizer-and-editor",
      label: "Permission visualizer",
      why: "Interactive tree, threshold sim, baseline/diff",
    },
    {
      href: "https://github.com/pixel-journey/wax-social-recovery-and-key-backup-tools",
      label: "Social recovery & key backup",
      why: "Owner weights, runbooks, collusion math",
    },
    {
      href: "https://github.com/pixel-journey/wax-wharfkit-session-keys-and-linked-permissions",
      label: "Session keys & linked permissions",
      why: "Custom perms + linkauth",
    },
    {
      href: "https://github.com/pixel-journey/wax-safe-key-rotation-assistant",
      label: "Safe key rotation",
      why: "Rotate without lockout",
    },
  ];

  return (
    <section className="mt-12 border-t border-white/10 pt-6 text-xs">
      <p className="mb-3 tracking-widest text-[10px] uppercase opacity-60">
        Related blueprints
      </p>
      <ul className="space-y-3 max-w-xl">
        {links.map((l) => (
          <li key={l.href}>
            <a
              className="text-emerald-400 underline font-mono"
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
            <p className="text-white/50 mt-0.5">{l.why}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
