declare module "react-sky" {
  import React from "react";

  interface SkyProps {
    images: Record<string, unknown>;
    how: number;
    time?: number;
    size?: string;
    background?: string;
  }

  export default class Sky extends React.Component<SkyProps> {
    constructor(props: SkyProps) {
      // do nothing.
    }
  }
}
