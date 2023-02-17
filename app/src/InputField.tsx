import {
  useState,
  useRef,
  useEffect,
  StateUpdater,
  EffectCallback,
} from "preact/hooks";
import { JSX, RefObject } from "preact";
import { Person } from "./app";
import remove from "./assets/cancel.svg";

import { PromotionTotal } from "./components/PromotionTotal";

export interface SharedItem {
  ids: number[];
  price: number;
}

export enum DisplayType {
  Price,
  Percent,
}

export function ItemsDisplay(props: {
  items: SharedItem[];
  removeItem: (ids: number[]) => void;
  type: DisplayType;
}) {
  return (
    <p className="col-span-2">
      {props.items.map((item, index) => (
        <div className="inline-flex align-middle mr-3">
          <span className="mr-1">
            {props.type === DisplayType.Price && "£"}
            {item.price.toFixed(2).toString()}
            {props.type === DisplayType.Percent && "%"}
          </span>
          <button
            title="Remove"
            type="button"
            onClick={() => props.removeItem(item.ids)}
            tabIndex={-1}
          >
            <img src={remove} alt="remove" className="w-3" />
          </button>
        </div>
      ))}
    </p>
  );
}

function TotalDisplay(props: { people: Person[]; items: SharedItem[] }) {
  return (
    <p className="col-span-2 inline">
      {props.people.map((p, _, arr) => {
        const prefix = arr.length > 1 ? p.name + ": " : "";
        return (
          <p>
            {props.items.length > 0
              ? `${prefix}£${(
                  props.items.map((i) => i.price).reduce((a, b) => a + b) /
                  props.people.length
                ).toFixed(2)}`
              : ""}
          </p>
        );
      })}
    </p>
  );
}

export function InputSection(props: {
  people: Person[];
  handleNameClick: (event: Event) => void;
  className?: string;
  name?: string;
  limit?: number;
}) {
  const [shouldFocus, setShouldFocus] = useState(false);
  const [items, updateItems] = useState<SharedItem[]>([]);
  const ref = useRef(null) as RefObject<HTMLInputElement>;

  function addItem(price: number) {
    const ids = props.people.map((p) => p.getID());
    updateItems((old) => [...old, { ids, price }]);
    props.people.forEach((p) =>
      p.addItem({ id: p.getID(), price: price / props.people.length })
    );
  }
  function removeItem(ids: number[]) {
    const compArrays = (a: number[], b: number[]) => {
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    };
    updateItems((old) => old.filter((i) => !compArrays(i.ids, ids)));
    props.people.forEach((p, index) => p.removeItem(ids[index]));
  }

  // Refocus input after adding an item
  useEffect(() => {
    ref.current?.focus();
    setShouldFocus(false);
  }, [shouldFocus]);

  // No input focussed on start
  useEffect(() => {
    ref.current?.blur();
  }, []);

  const promotion = props.name === "Promotion";

  return (
    <div className={"p-2 grid grid-cols-7 gap-x-2 border-b"}>
      <p
        onClick={props.handleNameClick}
        className={"self-center w-1/4 col-span-2" + " " + props.className}
      >
        {props.name || props.people.map((p) => p.name).join("\n")}
      </p>
      <input
        ref={ref}
        title={props.name || props.people.map((p) => p.name).join("\n")}
        key={props.people}
        className="border self-center"
        onChange={(e: any) => {
          setShouldFocus(true);
          const newValue = parseFloat(e.target.value);
          if (
            isNaN(newValue) ||
            newValue <= 0 ||
            (props.limit && items.length >= props.limit)
          ) {
            return ((e.target as HTMLInputElement).value = "");
          }
          addItem(newValue);
          e.target.value = "";
        }}
      ></input>
      <ItemsDisplay
        items={items}
        removeItem={removeItem}
        type={promotion ? DisplayType.Percent : DisplayType.Price}
      />
      {promotion ? (
        <PromotionTotal people={props.people} />
      ) : (
        <TotalDisplay people={props.people} items={items} />
      )}
    </div>
  );
}
