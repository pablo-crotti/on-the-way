"use client";

import Link from "next/link";
import styles from "./footer.module.css";
import { usePathname } from "next/navigation";

export default function FooterElement(props: {
  href: string;
  icon: string;
  name: string;
}) {
  const pathName = usePathname();
  return (
    <Link
      href={"/" + props.href}
      className={
        "basis-1/4 flex flex-col justify-center justify-items-center text-center text-sm " +
        (pathName.split("/")[1] === props.href
          ? "text-font-primary" + " " + styles.active
          : "text-font-secondary")
      }
    >
      <span className="material-symbols-rounded text-center text-5xl">
        {props.icon}
      </span>
      {pathName.split("/")[1] === props.href ? props.name : ""}
    </Link>
  );
}
