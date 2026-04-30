import React from "react";

const NextImage = ({ src, alt, fill: _fill, ...props }: { src: string; alt: string; fill?: boolean; [key: string]: unknown }) => {
  return <img src={src} alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />;
};

export default NextImage;
