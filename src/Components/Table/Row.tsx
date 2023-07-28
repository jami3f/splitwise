import {
  useState
} from "preact/hooks";
import { JSX } from "preact";
import { ForwardedRef, forwardRef } from "preact/compat";
import { Person } from "../../Classes";
import {
  AnimationControls,
  ControlsAnimationDefinition,
  motion,
  useAnimationControls
} from "framer-motion";
import { cancel } from "../../assets/icons/";

interface SharedItem {
  ids: number[];
  price: number;
}

enum DisplayType {
  Price,
  Percent,
}

export function ItemsDisplay(props: {
  items: SharedItem[];
  removeItem: (ids: number[]) => void;
  type: DisplayType;
  itemErrorAnimation: AnimationControls;
}) {
  return (
    <div className="col-span-2 flex">
      {props.items.map((item, index) => (
        <div className="inline-flex mr-3 self-center">
          <motion.span
            className="mr-1"
            animate={props.itemErrorAnimation}
            transition={{ duration: 0.5 }}
          >
            {props.type === DisplayType.Price && "£"}
            {item.price.toFixed(2).toString()}
            {props.type === DisplayType.Percent && "%"}
          </motion.span>
          <button
            title="Remove"
            type="button"
            onClick={() => props.removeItem(item.ids)}
            tabIndex={-1}
          >
            <img src={cancel} alt="remove" className="w-3" />
          </button>
        </div>
      ))}
    </div>
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

const Row = forwardRef(
  (
    props: {
      people: Person[];
      handleNameClick: (event: Event) => void;
      passedKey: number;
      refocus: Function;
      className?: string;
      name?: string;
      limit?: number;
      children?: JSX.Element;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [shouldFocus, setShouldFocus] = useState(false);
    const [items, updateItems] = useState<SharedItem[]>([]);
    // const ref = useRef(null) as RefObject<HTMLInputElement>;

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

    const promotion = props.name === "Promotion";

    const errorAnimation = useAnimationControls();
    const errorAnimationKeyframes: ControlsAnimationDefinition = {
      x: [-5, 5, -5, 5, -5, 0],
      outlineColor: [
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(0, 0, 0)",
      ],
    };
    const itemErrorAnimation = useAnimationControls();
    const itemErrorAnimationKeyframes: ControlsAnimationDefinition = {
      x: [-2, 2, -2, 2, -2, 0],
      color: [
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(255, 0, 0)",
        "rgb(0, 0, 0)",
      ],
    };

    const handleInput = (e: any) => {
      if (e.target.value === "") return;
      setShouldFocus(true);
      const newValue = parseFloat(e.target.value);
      if (isNaN(newValue) || newValue <= 0) {
        errorAnimation.start(errorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      } else if (props.limit && items.length >= props.limit) {
        itemErrorAnimation.start(itemErrorAnimationKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      if (promotion) {
        updateItems([{ ids: [0], price: newValue }]);
        props.people[0].setItems([{ id: 0, price: newValue }]);
      } else addItem(newValue);
      e.target.value = "";
      props.refocus(props.passedKey);
    };

    return (
      <div id="item-entry" className="p-2 grid grid-cols-7 gap-x-2 border-b">
        <p
          onClick={props.handleNameClick}
          className={"self-center w-1/4 col-span-2" + " " + props.className}
        >
          {props.name || props.people.map((p) => p.name).join("\n")}
        </p>
        <motion.input
          ref={ref}
          title={props.name || props.people.map((p) => p.name).join("\n")}
          key={props.passedKey}
          animate={errorAnimation}
          transition={{ duration: 0.5 }}
          className="border self-center rounded"
          onKeyDown={(e: any) => e.keyCode === 13 && handleInput(e)}
          onBlur={handleInput}
          type="number"
          inputMode="decimal"
        ></motion.input>
        <ItemsDisplay
          items={items}
          removeItem={removeItem}
          type={promotion ? DisplayType.Percent : DisplayType.Price}
          itemErrorAnimation={itemErrorAnimation}
        />
        {props.children ? (
          props.children
        ) : (
          <TotalDisplay people={props.people} items={items} />
        )}
      </div>
    );
  }
);

export default Row;
