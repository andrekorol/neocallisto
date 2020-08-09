import * as React from "react";

interface HCaptchaState {
  isApiReady: boolean;
  isRemoved: boolean;
  elementId: string;
  captchaId: string;
}

interface HCaptchaProps {
  onExpire?: () => any;
  onError?: (event: string) => any;
  onVerify?: (token: string) => any;
  languageOverride?: string;
  sitekey: string;
  size?: "normal" | "compact" | "invisible";
  theme?: "light" | "dark";
  tabIndex?: number;
  id?: string;
}

declare class HCaptchaComponent extends React.Component<
  HCaptchaProps,
  HCaptchaState
> {
  resetCaptcha(): void;
  renderCaptcha(): void;
  removeCaptcha(): void;
}

export default HCaptchaComponent;
