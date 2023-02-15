import {
  useState,
  useRef,
  useEffect,
  StateUpdater,
  EffectCallback,
} from "preact/hooks";
import { RefObject } from "preact";
import { Person } from "./app";
import remove from "./assets/cancel.svg";

function ItemsDisplay(props: {
  items: number[];
  removeItem: (index: number) => void;
}) {
  return (
    <p className="col-span-2">
      {props.items.map((item, index) => (
        <div className="inline-flex align-middle mr-3">
          <span className="mr-1">£{item.toFixed(2)}</span>
          <button
            title="Remove"
            type="button"
            onClick={() => props.removeItem(index)}
            tabIndex={-1}
          >
            <img src={remove} alt="remove" className="w-3" />
          </button>
        </div>
      ))}
    </p>
  );
}

export function InputSection(props: {
  people: Person[];
  handleNameClick: (event: Event) => void;
  className?: string;
  index: number;
}) {
  const [shouldFocus, setShouldFocus] = useState(false);
  const [items, updateItems] = useState<number[]>([]);
  const ref = useRef(null) as RefObject<HTMLInputElement>;

  function addItem(item: number) {
    updateItems((old) => [...old, item]);
  }

  function removeItem(index: number) {
    updateItems((old) => old.filter((_, i) => i !== index));
  }

  // Refocus input after adding an item
  useEffect(() => {
    ref.current?.focus();
    setShouldFocus(false);
  }, [shouldFocus]);

  // No input focussed by default
  useEffect(() => {
    ref.current?.blur();
  }, []);

  return (
    <div className={"p-2 grid grid-cols-6 gap-x-2 border"}>
      <p
        onClick={props.handleNameClick}
        className={"self-center w-1/4 " + props.className}
      >
        {props.people.map((p) => p.name).join("\n")}
      </p>
      <input
        ref={ref}
        title={props.people.map((p) => p.name).join("\n")}
        key={props.people}
        className="border self-center"
        onChange={(e: any) => {
          setShouldFocus(true);
          const newValue = parseFloat(e.target.value);
          if (isNaN(newValue) || newValue <= 0) {
            return ((e.target as HTMLInputElement).value = "");
          }
          addItem(newValue);
          props.people.forEach((p) =>
            p.addItem(newValue / props.people.length)
          );
          e.target.value = "";
        }}
      ></input>
      <ItemsDisplay items={items} removeItem={removeItem} />
      <p className="col-span-2 inline">
        {props.people.map((p, _, arr) => {
          const prefix = arr.length > 1 ? p.name + ": " : "";
          return (
            <p>
              {items.length > 0
                ? `${prefix}£${(
                    items.reduce((a, b) => a + b) / props.people.length
                  ).toFixed(2)}`
                : ""}
            </p>
          );
        })}
      </p>
    </div>
  );
}
