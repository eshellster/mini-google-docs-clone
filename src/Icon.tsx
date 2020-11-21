import React from "react";
import IcomoonReact from "icomoon-react";
import iconSet from "./selection.json";

interface IconProps {
  className?: string;
  color?: string;
  icon: string;
  size?: string | number;
}

const Icon = (props: IconProps) => {
  const { color, size, icon, className } = props;
  return (
    <IcomoonReact
      className={className}
      iconSet={iconSet}
      color={color}
      size={size}
      icon={icon}
    />
  );
};

export default Icon;
