import Image from "next/image";

const NavBar = () => {
  return (
    <nav className="w-screen bg-white px-28 pt-6 pb-4 flex justify-between items-baseline">
      <div className="flex gap-2  ">
        <Image alt="logo" src={"/images/logo.png"} width={63} height={62} className="object-contain" />
        <span className=" mt-auto">
          <h2 className="text-xl">Frontend developer</h2> <p className="text-[var(--grey-text)] text-sm">Skill assessment test</p>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-[var(--deepGrey-bg)] py-2 px-4 rounded-lg flex gap-2">
          <Image width={16} height={16} alt="timer" src={"/images/timer.svg"} />
          <p className="text-lg text-[var(--app-purple)]">29:10 time left</p>
        </div>
        <span className="h-[30px] w-[30px] rounded-[50%] bg-[var(--deepGrey-bg)] ">
          <Image width={20} height={20} alt="eye" src={"/images/eye.svg"} className="m-[5px]"/>
        </span>
      </div>
    </nav>
  );
};

export default NavBar;
