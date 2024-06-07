import Image from "next/image";
import Timer from "./Timer";

const NavBar = () => {
  return (
    <nav className="w-screen bg-white sm:px-28 pt-6 pb-4 flex justify-between items-baseline">
      <div className="flex gap-2  ">
        <Image alt="logo" src={"/images/logo.png"} width={63} height={62} className="object-contain" />
        <span className=" mt-auto">
          <h2 className="text-lg sm:text-xl">Frontend developer</h2> <p className="text-[var(--grey-text)] text-xs sm:text-sm">Skill assessment test</p>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Timer />
        <span className="h-[30px] w-[30px] rounded-[50%] bg-[var(--deepGrey-bg)] max-[639px]:hidden">
          <Image width={20} height={20} alt="eye" src={"/images/eye.svg"} className="m-[5px]" />
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
