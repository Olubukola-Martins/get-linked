import NavBar from "../components/nav/NavBar";
import SystemCheckPage from "../components/systemCheck/SystemCheckPage";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-5 w-screen">
        <NavBar />
        <SystemCheckPage />
        <p className="text-sm text-[var(--grey-text)] ">
          POWERED BY <span className="text-lg text-[#0E0E2C]">Getlinked.AI</span>
        </p>
      </div>
    </>
  );
}
