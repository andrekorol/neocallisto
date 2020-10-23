import clsx from "clsx";
import React from "react";
import Toggle from "react-toggle";
import styles from "./styles.module.css";

type IconProps = {
  icon: string;
  style: Record<string, unknown>;
};

const Dark = ({ icon, style }: IconProps) => (
  <span className={clsx(styles.toggle, styles.dark)} style={style}>
    {icon}
  </span>
);
const Light = ({ icon, style }: IconProps) => (
  <span className={clsx(styles.toggle, styles.light)} style={style}>
    {icon}
  </span>
);

type ToggleProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const ThemeToggle = ({ darkMode, setDarkMode }: ToggleProps) => {
  const darkIcon = "🌙";
  const darkIconStyle = { marginTop: "1px", marginLeft: "2px" };
  const lightIcon = "🌞";
  const lightIconStyle = { marginTop: "1px", marginLeft: "1px" };

  return (
    <Toggle
      checked={darkMode}
      onChange={() => setDarkMode(!darkMode)}
      icons={{
        checked: <Dark icon={darkIcon} style={darkIconStyle} />,
        unchecked: <Light icon={lightIcon} style={lightIconStyle} />,
      }}
    />
  );
};

export default ThemeToggle;
