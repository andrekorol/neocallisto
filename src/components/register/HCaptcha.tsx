import * as React from "react";

interface HCaptchaState {
  isApiReady: boolean;
  isRemoved: boolean;
  elementId: string;
  captchaId: string;
}

interface HCaptchaProps {
  onExpire?: () => void;
  onError?: (event: string) => void;
  onVerify?: (token: string) => void;
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
