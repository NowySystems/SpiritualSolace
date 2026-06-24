declare module "driver.js" {
  export type DriveStep = {
    element?: string | Element;
    popover?: {
      title?: string;
      description?: string;
      side?: "top" | "right" | "bottom" | "left";
      align?: "start" | "center" | "end";
    };
  };

  export type DriverConfig = {
    showProgress?: boolean;
    allowClose?: boolean;
    overlayOpacity?: number;
    stagePadding?: number;
    nextBtnText?: string;
    prevBtnText?: string;
    doneBtnText?: string;
    onHighlighted?: (element?: Element) => void;
    onDestroyed?: () => void;
    onPopoverRender?: (popover: { footerButtons?: HTMLElement }) => void;
    steps?: DriveStep[];
  };

  export function driver(config?: DriverConfig): {
    drive: () => void;
    destroy: () => void;
  };
}
