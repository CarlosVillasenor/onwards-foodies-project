'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import classes from "./nav-link.module.css";

export default function NavLink({ href, children }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={
        pathname.startsWith(href)
        ? `${classes.link} ${classes.active}`
        : `${classes.link}`
      }
    >
      {children}
    </Link>
  );
}
