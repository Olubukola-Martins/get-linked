import { Progress } from "antd";
import Image from "next/image";

const ProgressCard = ({ result = "pass" || "fail" || "average", parameter = "Webcam" || "Speed" || "Gadget mic" || "Lighting", checkComplete = true || false }) => {
  const image = <Image alt={parameter} src={parameter === "Speed" ? "/images/internet.svg" : parameter === "Lighting" ? "/images/lighting.svg" : "/images/webcam.svg"} width={18} height={18} className="top-2 left-2 absolute"/>;

  const srcImageChekComplete = () => {
    if (result === "pass" || result === "average") {
      return "/images/check.svg";
    } else return "/images/fail.svg";

  };
  return (
    <div className="w-24 h-[71px] rounded-[10px] bg-[var(--background)] px-5 py-3">
      {!checkComplete ? (
        <div className="w-24 h-[71px] relative">
          <div className="bg-[#E6E0FF] h-9 w-9 rounded-[50%] relative">{image} </div>
          <p className="font-semibold text-[10px] pt-1">{parameter}</p>

          <div className="w-[10px] h-[10px] bg-[var(--app-purple)] rounded-[50%] top-[-4px] right-[24px] absolute" key={parameter} />
        </div>
      ) : (
        <div className="w-24 h-[71px] relative ">
          <div className="w-[35px] h-[35px] relative ">
            <Progress
              type="circle"
              percent={result === "pass" ? 100 : result === "average" ? 50 : 25}
              strokeColor={result === "pass" ? "var(--app-purple)" : result === "average" ? "var(--app-purple)" : "#FF5F56"}
              // className="w-9 h-9 rounded-[50%] "
              className={`${result === "pass" ? "bg-[var(--app-purple)]" : "bg-[#E6E0FF]"} rounded-[50%] absolute top-0`}
              status={result === "pass" ? "success" : result === "average" ? "success" : "exception"}
              strokeWidth={3}
              // success={{ strokeColor:{result === "fail" ? "#FF5F56" : "var(--app-purple)"} }}
              size={35}
              format={() => {
                "";
              }}
            />
            <Image alt="parameter" src={srcImageChekComplete()} className=" absolute top-2 left-2  " width={18} height={18} />{" "}
          </div>
          <p className="font-semibold text-[10px] pt-1">{parameter}</p>

          <span className={`w-[10px] h-[10px] ${result === "fail" ? "bg-[#FF5F56]" : "bg-[var(--app-purple)]"}  rounded-[50%] top-[-4px] right-[24px]  absolute`} key={parameter} />
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
