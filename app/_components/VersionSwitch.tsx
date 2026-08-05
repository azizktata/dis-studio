"use client";

import { usePathname } from "next/navigation";

/**
 * Switches between the two design concepts while they are under review.
 *
 * Each version is its own root layout with its own fonts, so this uses plain
 * anchors: a client-side transition between root layouts forces a full reload
 * anyway, and `<a>` keeps it working without JS.
 *
 * This is a review aid, not part of the product — remove it once a direction
 * is chosen.
 */

const VERSIONS = [
  { href: "/v1", label: "Version 1" },
  { href: "/v2", label: "Version 2" },
];

export default function VersionSwitch() {
  const pathname = usePathname();

  return (
    <nav className="vswitch" aria-label="Version du design">
      {VERSIONS.map((v) => (
        <a
          key={v.href}
          href={v.href}
          className="vswitch-item"
          aria-current={pathname === v.href ? "page" : undefined}
        >
          {v.label}
        </a>
      ))}
    </nav>
  );
}
