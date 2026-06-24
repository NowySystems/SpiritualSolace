export const saveState = "SpiritualSolace Care Binder — local demo workflow";

export const navigationGroups = [
  {
    label: "Primary",
    items: [
      { label: "Care Binder", href: "/app" },
      { label: "Intake", href: "/app/intake" },
      { label: "Review", href: "/app/message-review" },
      { label: "Record", href: "/app/record" }
    ]
  },
  {
    label: "Secondary",
    items: [
      { label: "Approved Responders", href: "/app/approved-responders" },
      { label: "Facility Rules", href: "/app/facility-rules" },
      { label: "Audit Log", href: "/app/audit-log" }
    ]
  }
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);
