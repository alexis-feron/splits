import { Card } from "@/app/components/ui/card";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Tutorial = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className=" relative  rounded-lg p-6 max-w-lg w-full">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 h-10 w-10"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        <p className="mb-4">
          Guess the driver in six tries. Each guess must be a valid F1 driver
          name. Hit the submit button to validate.
        </p>
        <div className="grid gap-2">
          <div className="flex items-center">
            <div className="h-8 w-12 border border-gray-700 bg-customGreen flex-shrink-0 rounded-md"></div>
            <p className="ml-4">Information is correct</p>
          </div>
          <div className="flex items-center">
            <div className="relative border border-gray-700 flex items-center justify-center overflow-hidden text-center h-8 w-12 bg-customPurple bg-opacity-50 rounded-md after:content-[''] after:absolute after:w-0 after:h-0 after:border-l-[48px] after:border-l-transparent after:border-r-[48px] after:border-r-transparent after:border-b-[32px] after:border-b-customPurple"></div>
            <p className="ml-4">The correct number is bigger</p>
          </div>
          <div className="flex items-center">
            <div className="relative border border-gray-700 flex items-center justify-center overflow-hidden text-center h-8 w-12 bg-customBlue bg-opacity-50 rounded-md after:content-[''] after:absolute after:w-0 after:h-0 after:border-l-[48px] after:border-l-transparent after:border-r-[48px] after:border-r-transparent after:border-t-[32px] after:border-t-customBlue"></div>
            <p className="ml-4">The correct number is smaller</p>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-12 border border-gray-700 bg-customRed flex-shrink-0 rounded-md"></div>
            <p className="ml-4">Information is incorrect</p>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-12 border border-gray-700 bg-customYellow flex-shrink-0 rounded-md"></div>
            <p className="ml-4">Information is partly correct</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Tutorial;
