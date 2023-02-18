import {
  useState,
  useRef,
  useEffect,
  StateUpdater,
  EffectCallback,
} from "preact/hooks";
import preactLogo from "./assets/preact.svg";
import { JSX } from "preact/jsx-runtime";
import { InputSection, DisplayType } from "./InputField";
import add from "./assets/add.svg";
import done from "./assets/done.svg";
import cancel from "./assets/cancel.svg";

export class Person {
  name: string;
  items: Item[];
  setItems: StateUpdater<Item[]>;
  total: number;
  setTotal: StateUpdater<number>;
  limit = 0;
  constructor(name: string) {
    this.name = name;
    [this.items, this.setItems] = useState<Item[]>([]);
    [this.total, this.setTotal] = useState(0);
    useEffect(() => {
      this.setTotal(this.items.reduce((acc, item) => acc + item.price, 0));
    }, [this.items]);
  }
  addItem(item: Item) {
    this.setItems((old) => [...old, item]);
  }
  removeItem(id: number) {
    this.setItems((old) => old.filter((i) => i.id !== id));
  }
  getID() {
    return this.items.length;
  }
}

function TopBar() {
  return (
    <div className="h-5 flex bg-gradient-to-r from-red-300 to-blue-300 w-200% animate-inf-scroll"></div>
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

function AddSharedButton(props: {
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

function Headings() {
  return (
    <div className="p-2 grid grid-cols-7 gap-x-2 border-b">
      <div className="font-semibold col-span-2">Name </div>
      <div className="font-semibold">Price </div>
      <div className="font-semibold col-span-2">Items</div>
      <div className="font-semibold col-span-2">Total</div>
    </div>
  );
}

interface Item {
  id: number;
  price: number;
}

export function App() {
  const people: { [key: string]: Person } = {
    Dan: new Person("Dan"),
    Jamie: new Person("Jamie"),
    Leena: new Person("Leena"),
    Sophie: new Person("Sophie"),
  };

  function handleNameClick(event: Event) {
    const name = (event.target as HTMLParagraphElement).innerText;
    if (selection.filter((i) => i.name === name).length > 0) {
      setSelection((old) => old.filter((person) => person.name !== name));
      console.log(selection.map((i) => i.name));
      return;
    }
    setSelection((old) => [...old, people[name]]);
  }

  const service = new Person("Service");
  const promotion = new Person("Promotion");
  const maxPromotion = new Person("Max Promotion");
  promotion.limit = 1;
  maxPromotion.limit = 1;

  const [shared, setShared] = useState<Person[][]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selection, setSelection] = useState<Person[]>([]);
  // const [promotion, setPromotion] = useState(0);
  // const [maxPromotion, setMaxPromotion] = useState(0);
  // const [serviceCharge, setServiceCharge] = useState(0);

  return (
    <div className="w-screen overflow-hidden">
      <TopBar />
      <div className="grid grid-cols-2">
        <div className=" w-auto h-auto border-b">
          <Headings />
          <InputSection
            className="text-green-700"
            people={[promotion, maxPromotion, ...Object.values(people)]}
            name="Promotion"
            handleNameClick={() => {}}
            limit={1}
          />
          <InputSection
            className="text-green-500"
            people={[maxPromotion]}
            handleNameClick={() => {}}
          />
          <InputSection
            className="text-orange-500"
            people={[service]}
            handleNameClick={() => {}}
          />
          {Object.values(people).map((person) => (
            <InputSection
              className={selectionMode ? "text-blue-600 cursor-pointer" : ""}
              people={[person]}
              handleNameClick={handleNameClick}
            />
          ))}
          {shared.map((people) => (
            <InputSection
              className="text-gray-700"
              people={[...people]}
              handleNameClick={() => {}}
            ></InputSection>
          ))}
          <AddSharedButton
            {...{
              selection,
              setSelection,
              selectionMode,
              setSelectionMode,
              shared,
              setShared,
            }}
          />
        </div>
        <div className="p-2 border">
          <p className="font-semibold">Subtotals:</p>
          {Object.values(people).map((person) => (
            <p>
              {person.name}: £{person.total.toFixed(2)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
