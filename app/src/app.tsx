import {
  useState,
  useRef,
  useEffect,
  StateUpdater,
  EffectCallback,
} from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { JSX } from "preact/jsx-runtime";
import { InputSection } from "./InputField";
import add from "./assets/add.svg";
import done from "./assets/done.svg";
import cancel from "./assets/cancel.svg";

export class Person {
  name: string;
  totals: number[];
  setTotals: StateUpdater<number[]>;

  constructor(name: string) {
    this.name = name;
    [this.totals, this.setTotals] = useState<number[]>([]);
  }
  addItem(item: number) {
    this.setTotals((old) => [...old, item]);
  }
}

export function App() {
  function handleNameClick(event: Event) {
    const name = (event.target as HTMLParagraphElement).innerText;
    if (selection.filter((i) => i.name === name).length > 0) {
      setSelection((old) => old.filter((person) => person.name !== name));
      console.log(selection.map((i) => i.name));
      return;
    }
    setSelection((old) => [...old, people[name]]);
  }

  function TopBar() {
    return (
      <div className="h-5 flex bg-gradient-to-r from-red-300 to-blue-300 w-200% animate-inf-scroll"></div>
    );
  }

  const people: { [key: string]: Person } = {
    Dan: new Person("Dan"),
    Jamie: new Person("Jamie"),
    Leena: new Person("Leena"),
    Sophie: new Person("Sophie"),
  };

  const [shared, setShared] = useState<Person[][]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selection, setSelection] = useState<Person[]>([]);

  function SelectPrompt() {
    const checkExists = () => {
      if (selection.length === 1) return true;
      for (const personArr of shared) {
        if (personArr.length !== selection.length) continue;
        if (
          personArr.every((person) =>
            selection.map((p) => p.name).includes(person.name)
          )
        )
          return true;
      }
    };

    return (
      <div className="bg-gray-100 p-2">
        <p className="text-gray-500">Select people to share an item:</p>
        {selection.map((person) => (
          <p className={checkExists() ? "text-red-600" : ""}>{person.name}</p>
        ))}
        <button
          title="done"
          type="button"
          onClick={() => {
            if (checkExists()) return;
            setShared((old) => [...old, selection]);
            setSelection([]);
            setSelectionMode(false);
          }}
        >
          <img src={done} alt="" />
        </button>
        <button
          title="cancel"
          type="button"
          onClick={() => {
            setSelection([]);
            setSelectionMode(false);
          }}
        >
          <img src={cancel} alt="" />
        </button>
      </div>
    );
  }

  function Headings() {
    return (
      <div className="grid grid-cols-6 p-2 ">
        <div className="font-semibold">Name </div>
        <div className="font-semibold">Price </div>
        <div className="font-semibold col-span-2">Items</div>
        <div className="font-semibold col-span-2">Total</div>
      </div>
    );
  }

  function IndividualsList() {
    return (
      <>
        {Object.values(people).map((person) => (
          <InputSection
            className={selectionMode ? "text-blue-600 cursor-pointer" : ""}
            people={[person]}
            number={1}
            handleNameClick={handleNameClick}
          />
        ))}
      </>
    );
  }

  function SharedList() {
    return (
      <>
        {shared.map((people) => (
          <InputSection
            className="text-gray-700"
            people={[...people]}
            number={people.length}
            handleNameClick={() => {}}
          ></InputSection>
        ))}
      </>
    );
  }

  function AddSharedButton() {
    return selectionMode ? (
      <SelectPrompt />
    ) : (
      <button
        className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-sm m-2 py-2 px-2 rounded inline-flex items-center transition-colors"
        type="button"
        onClick={() => setSelectionMode(true)}
      >
        <img alt="add icon" src={add} className="w-5 mr-1"></img>
        Add Shared Item
      </button>
    );
  }

  return (
    <div className="w-screen overflow-hidden">
      <TopBar />

      <div className="grid grid-cols-1">
        <div className="border w-auto h-auto">
          <Headings />
          <IndividualsList />
          <InputSection
            className="text-orange-500"
            people={[new Person("Service")]}
            number={1}
            handleNameClick={() => {}}
          />
          <SharedList />

          <AddSharedButton />
        </div>
      </div>
    </div>
  );
}
