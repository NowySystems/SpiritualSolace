export const saveState = "SpiritualSolace 0.9 — Admin command screens";

export const navigationGroups = [
  {
    label: "Care Workflow",
    items: [
      { label: "Care Desk", href: "/app" },
      { label: "Intake", href: "/app/intake" },
      { label: "Legacy Requests", href: "/app/support-requests" },
      { label: "Match Workspace", href: "/app/match" },
      { label: "Message Review", href: "/app/message-review" },
      { label: "Delivery Workspace", href: "/app/delivery-workspace" }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Match Support", href: "/app/match-support" },
      { label: "Rules Command", href: "/app/rules-command" },
      { label: "Approved Responders", href: "/app/approved-responders" },
      { label: "Facility Rules", href: "/app/facility-rules" },
      { label: "Guardrails", href: "/app/guardrails" }
    ]
  },
  {
    label: "Records",
    items: [
      { label: "Record Closure", href: "/app/record" },
      { label: "View", href: "/app/patient-view" },
      { label: "Audit Log", href: "/app/audit-log" }
    ]
  }
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);
