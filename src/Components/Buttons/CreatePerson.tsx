import { StateUpdater, useEffect, useRef, useState } from "preact/hooks";
import { Person } from "../../Types";
import { add } from "../../assets/icons";
import { InputField } from "../Common";
import Button from "./Button";
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
    <Button text="Add Person" handleClick={handleClick} icon={add} />
  );
}

function NameInput(props: {
  people: { [key: string]: Person };
  setPeople: StateUpdater<{ [key: string]: Person }>;
  setInputMode: StateUpdater<boolean>;
}) {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef?.focus();
  }, [inputRef]);
  return (
    <InputField
      name="New User"
      handleEmpty={() => {
        props.setInputMode(false);
      }}
      addToRefObject={(ref: HTMLInputElement) => {
        setInputRef(ref);
      }}
      handleInput={(e: any) => {
        const input = (e.target.value as string).trim();
        const name = input
          .split(" ")
          .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
          .join(" ");
        console.log("Creating person: " + name);
        props.setPeople((old) => {
          return {
            ...old,
            [name]: {
              name: name,
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
