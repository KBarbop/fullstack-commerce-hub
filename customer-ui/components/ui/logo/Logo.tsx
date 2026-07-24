import Link from "next/link";
import Image from "next/image";

import classes from "./logo.module.css";

import imgLogo from "@/assets/logos/yellow-01.svg";
import imgAlternateLogo from "@/assets/logos/2.svg";
import { usePathname } from "next/navigation";

const Logo = () => {
  const pathname = usePathname();

  const logoSrc = pathname === "/profile" ? imgAlternateLogo : imgLogo;
  return (
    <Link href="/">
      <Image className={classes.imgLogo} src={logoSrc} alt="Logo" />
    </Link>
  );
};

export default Logo;
