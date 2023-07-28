import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import { Person } from "../../Classes";
import { add } from "../../assets/icons";
export default function CreatePerson() {
  const [inputMode, setInputMode] = useState(false);
  function handleClick() {
    setInputMode(true);
  }
  return inputMode ? (
    <InputName />
  ) : (
    <button
      className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-sm my-2 ml-2 py-2 px-2 rounded inline-flex items-center transition-colors"
      type="button"
      onClick={handleClick}
    >
      <img alt="add icon" src={add} className="w-5 mr-1"></img>
      Add Person
    </button>
  );
}

function InputName() {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
  return (
    <input
      type="text"
      placeholder="Name"
      ref={inputRef}
      className="border rounded p-1 h-10"
    ></input>
  );
}
