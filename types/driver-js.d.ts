declare module "driver.js" {
  export type DriveStep = {
    element?: string | Element;
    popover?: {
      title?: string;
      description?: string;
      side?: "top" | "right" | "bottom" | "left";
      align?: "start" | "center" | "end";
      popoverClass?: string;
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
    popoverClass?: string;
    progressText?: string;
    onPopoverRender?: (
      popover: {
        wrapper?: HTMLElement;
        title?: HTMLElement;
        description?: HTMLElement;
        footer?: HTMLElement;
        footerButtons?: HTMLElement;
        progress?: HTMLElement;
      },
      opts?: { state?: { activeIndex?: number } }
    ) => void;
    steps?: DriveStep[];
  };

  export function driver(config?: DriverConfig): {
    drive: () => void;
    destroy: () => void;
    moveNext: () => void;
    movePrevious: () => void;
  };
}
