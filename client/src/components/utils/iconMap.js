
import {
  MdFavorite,
  MdPsychology,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { FaTooth,  FaStethoscope } from "react-icons/fa6";
import { GiStomach, GiLungs, GiHeartOrgan } from "react-icons/gi";
import { PiBrainBold } from "react-icons/pi";


export const specialtyIcons = {
  cardiology: <MdFavorite className="text-2xl text-blue-500 mb-1" />,
  neurology: <PiBrainBold className="text-2xl text-blue-500 mb-1" />,
  orthopedic: <MdOutlineHealthAndSafety className="text-2xl text-blue-500 mb-1" />,
  dentistry: <FaTooth className="text-2xl text-blue-500 mb-1" />,
  pulmonology: <GiLungs className="text-2xl text-blue-500 mb-1" />,
  gastroenterology: <GiStomach className="text-2xl text-blue-500 mb-1" />,
  general: <FaStethoscope className="text-2xl text-blue-500 mb-1" />,
};

export const fallbackIcons = [
  
  <GiHeartOrgan className="text-2xl text-blue-500 mb-1" />,
  <MdPsychology className="text-2xl text-blue-500 mb-1" />,
  <FaStethoscope className="text-2xl text-blue-500 mb-1" />,
  <GiLungs className="text-2xl text-blue-500 mb-1" />,
];