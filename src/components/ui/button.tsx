import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  solid: "btn-lux btn-lux-solid",
  line: "btn-lux btn-lux-line",
  lineLight: "btn-lux btn-lux-line-light",
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonBaseProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & ButtonBaseProps & { href?: undefined };
type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonBaseProps & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = "solid", fullWidth, className, ...rest } = props;
    const classes = cn(variants[variant], fullWidth && "w-full", className);

    if ("href" in rest && rest.href) {
      const { href, ...anchorProps } = rest as ButtonAsLink;
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorProps} />
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as ButtonAsButton)}
      />
    );
  },
);