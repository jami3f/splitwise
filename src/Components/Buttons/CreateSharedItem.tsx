import { StateUpdater } from "preact/hooks";
import { add, cancel, done } from "../../assets/icons";
import { Person } from "../../Types";

export default function CreateSharedItem(props: {
  selection: Person[];
  setSelection: StateUpdater<Person[]>;
  selectionMode: boolean;
  setSelectionMode: StateUpdater<boolean>;
  shared: Person[][];
  setShared: StateUpdater<Person[][]>;
}) {
  return props.selectionMode ? (
    <SelectPrompt
      selection={props.selection}
      setSelection={props.setSelection}
      setSelectionMode={props.setSelectionMode}
      shared={props.shared}
      setShared={props.setShared}
    />
  ) : (
    <button
      className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-sm m-2 py-2 px-2 rounded inline-flex items-center transition-colors"
      type="button"
      onClick={() => props.setSelectionMode(true)}
    >
      <img alt="add icon" src={add} className="w-5 mr-1"></img>
      Add Shared Item
    </button>
  );
}

function SelectPrompt(props: {
  selection: Person[];
  setSelection: StateUpdater<Person[]>;
  setSelectionMode: StateUpdater<boolean>;
  shared: Person[][];
  setShared: StateUpdater<Person[][]>;
}) {
  const checkExists = () => {
    if (props.selection.length === 1) return true;
    for (const personArr of props.shared) {
      if (personArr.length !== props.selection.length) continue;
      if (
        personArr.every((person) =>
          props.selection.map((p) => p.name).includes(person.name)
        )
      )
        return true;
    }
  };

  return (
    <div className="bg-gray-100 p-2">
      <p className="text-gray-500">Select people to share an item:</p>
      {props.selection.map((person) => (
        <p className={checkExists() ? "text-red-600" : ""}>{person.name}</p>
      ))}
      <button
        title="done"
        type="button"
        onClick={() => {
          if (checkExists()) return;
          props.setShared((old) => [...old, props.selection]);
          props.setSelection([]);
          props.setSelectionMode(false);
        }}
      >
        <img src={done} alt="" />
      </button>
      <button
        title="cancel"
        type="button"
        onClick={() => {
          props.setSelection([]);
          props.setSelectionMode(false);
        }}
      >
        <img src={cancel} alt="" />
      </button>
    </div>
  );
}
