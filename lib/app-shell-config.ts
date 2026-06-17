export const saveState = "SpiritualSolace 0.6 — Decision workflow build";

export const navigationGroups = [
  {
    label: "Care Workflow",
    items: [
      { label: "Care Desk", href: "/app" },
      { label: "Support Requests", href: "/app/support-requests" },
      { label: "Match Workspace", href: "/app/match" },
      { label: "Message Review", href: "/app/message-review" },
      { label: "Delivery Workspace", href: "/app/delivery-workspace" }
    ]
  },
  {
    label: "Administration",
    items: [
      { label: "Approved Responders", href: "/app/approved-responders" },
      { label: "Facility Rules", href: "/app/facility-rules" },
      { label: "Guardrails", href: "/app/guardrails" }
    ]
  },
  {
    label: "Records",
    items: [
      { label: "View", href: "/app/patient-view" },
      { label: "Audit Log", href: "/app/audit-log" }
    ]
  }
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);
