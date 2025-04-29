import { useContext } from "react";
import UserContext from "../../context";

const Question = () => {
  const { questions } = useContext(UserContext);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#323437]">
      <div className="w-lg rounded-lg border-[2px] border-[#fdc600e8] p-5">
        {
          questions?.slice(0,1).map((item) => (
            <div key={item.id} className="flex flex-col gap-4">
              <h1 className="text-xl font-bold text-[#FDC700]"><span>{item.id}. </span>{item.question}</h1>
              <div className="font-medium flex flex-col gap-2 text-[#FDC700] pl-5">
                <p>A. {item.option_a}</p>
                <p>B. {item.option_b}</p>
                <p>C. {item.option_c}</p>
                <p>D. {item.option_d}</p>
              </div>
              {/* <div className="">
                <p className="w-32 h-32 font-medium text-[#FDC700] border ">{"10s"}</p>
              </div> */}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Question;