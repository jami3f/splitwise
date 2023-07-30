import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import { Person } from "../../Types";
import { add } from "../../assets/icons";
import { InputField } from "../Common";
export default function CreatePerson(props: {
  people: { [key: string]: Person };
  setPeople: StateUpdater<{ [key: string]: Person }>;
}) {
  const [inputMode, setInputMode] = useState(false);
  function handleClick() {
    setInputMode(true);
  }
  return inputMode ? (
    <NameInput
      people={props.people}
      setPeople={props.setPeople}
      setInputMode={setInputMode}
    />
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
  people: { [key: string]: Person };
  setPeople: StateUpdater<{ [key: string]: Person }>;
  setInputMode: StateUpdater<boolean>;
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
        const newPerson: Person = {
          name: e.target.value,
          items: [],
          total: 0,
          id: Object.keys(props.people).length,
        };
        localStorage.setItem(
          "people",
          JSON.stringify({ ...props.people, [newPerson.name]: newPerson })
        );
        console.log(localStorage.getItem("people"));
        props.setPeople((old) => {
          return {
            ...old,
            [e.target.value]: {
              name: e.target.value,
              items: [],
              total: 0,
              id: Object.keys(old).length,
            },
          };
        });
        props.setInputMode(false);
      }}
      className="ml-2"
    />
  );
}
