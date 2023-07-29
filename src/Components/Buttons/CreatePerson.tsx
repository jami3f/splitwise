import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import { Person } from "../../Classes";
import { add } from "../../assets/icons";
import { InputField } from "../Common";
export default function CreatePerson(props: {
  setPeople: StateUpdater<{ [key: string]: Person }>;
}) {
  const [inputMode, setInputMode] = useState(false);
  function handleClick() {
    setInputMode(true);
  }
  return inputMode ? (
    <NameInput setInputMode={setInputMode} setPeople={props.setPeople} />
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

function NameInput(props: {
  setInputMode: StateUpdater<boolean>;
  setPeople: StateUpdater<{ [key: string]: Person }>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <InputField
      name="New User"
      passedKey={5}
      ref={inputRef}
      handleEmpty={() => {
        console.log("Empty");
        props.setInputMode(false);
      }}
      handleInput={(e: any) => {
        console.log(e);
        props.setPeople((old) => {
          return {
            ...old,
            [e.target.value]: new Person(
              e.target.value,
              Object.values(old).length
            ),
          };
        });
        props.setInputMode(false);
      }}
      className="ml-2"
    />
  );
}
