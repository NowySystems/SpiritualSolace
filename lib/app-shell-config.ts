export const saveState = "SpiritualSolace 1.0 — Workflow command structure";

export const navigationGroups = [
  {
    label: "Care Workflow",
    items: [
      { label: "Care Desk", href: "/app" },
      { label: "Intake", href: "/app/intake" },
      { label: "Match", href: "/app/match" },
      { label: "Review", href: "/app/message-review" },
      { label: "Fulfillment", href: "/app/fulfillment" },
      { label: "Record", href: "/app/record" }
    ]
  },
  {
    label: "Decision Support",
    items: [
      { label: "Match Support", href: "/app/match-support" },
      { label: "Rules Command", href: "/app/rules-command" },
      { label: "Guardrails Command", href: "/app/guardrails-command" }
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
  },
  {
    label: "Legacy",
    items: [
      { label: "Legacy Requests", href: "/app/support-requests" },
      { label: "Delivery Workspace", href: "/app/delivery-workspace" }
    ]
  }
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);
