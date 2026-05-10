import { TemplateRef } from "@angular/core";

export interface ToastParams {
  timeout?: number;
  key?: string;
  contentTemplate?: TemplateRef<any>;
  text?: string;
  action?: string;
  showKey?: boolean;
  callback?: () => void;
  reject?: () => void;
  zIndex?: number;
  top?: number;
  parent?: HTMLElement;
  className?: ToastStyleTypes;
  showTimeleft?: boolean;
  labelTimeleft?: string;
  emitActionTimeout?: boolean;
  mouseoverRestartTimer?: boolean;
  closeButton?: boolean;
  hasIcon?: boolean;
  icon?: string;
}

export const TOAST_ICONS = {
  TOAST_INFORMER: "toast-informer",
  TOAST_REJECT_NEW: "toast-reject-new",
  TOAST_REJECT_NEW_WHITE: "toast-reject-new-white",
  TOAST_RESOLVE_NEW: "toast-resolve-new",
  TOAST_RESOLVE_NEW_WHITE: "toast-resolve-new-white",
  TOAST_WARNING_NEW: "toast-warning-new"
} as const;

export const toastStyles = [...Object.values(TOAST_ICONS), "toast-reject", "toast-resolve", "toast-warning"] as const;

export type ToastStyleTypes = (typeof toastStyles)[number];
