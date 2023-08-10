import { MutableRef, StateUpdater, useEffect, useState } from "preact/hooks";
import { JSX, RefObject } from "preact";
import { ForwardedRef, forwardRef } from "preact/compat";
import { Item, Person } from "../../../Types";
import {
  AnimationControls,
  ControlsAnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";
import { v4 as uuid } from "uuid";

import { InputField } from "../../Common";
import { ItemsDisplay, TotalDisplay } from "./index";

import { itemErrorKeyframes } from "../../../assets/Keyframes";
import { DisplayType } from "../../../Types";

const Row = forwardRef(
  (
    props: {
      // names: string[];
      people: Person[];
      setPeople: StateUpdater<{ [key: string]: Person }>;
      handleNameClick: (event: Event) => void;
      passedKey: number;
      refocus: Function;
      addToRefObject?: (ref: HTMLInputElement) => void;
      className?: string;
      limit?: number;
      children?: JSX.Element;
      usePercentage?: boolean;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [items, updateItems] = useState<Item[]>([]);

    useEffect(() => {
      for (const name of names) {
        props.setPeople((old) => {
          const total =
            old[name].items.reduce((acc, cur) => acc + cur.price, 0) /
            names.length;
          return {
            ...old,
            [name]: { ...old[name], total: total },
          };
        });
      }
    }, [items]);

    function addItem(price: number) {
      const newItem = { id: uuid(), price: price };
      updateItems((old) => [...old, newItem]);
      for (const name of names) {
        props.setPeople((old) => ({
          ...old,
          [name]: { ...old[name], items: [...old[name].items, newItem] },
        }));
      }
    }

    function removeItem(id: string) {
      updateItems((old) => old.filter((i) => i.id !== id));
      for (const name of names) {
        props.setPeople((old) => ({
          ...old,
          [name]: {
            ...old[name],
            items: old[name].items.filter((i) => i.id !== id),
          },
        }));
      }
    }

    const names = Object.values(props.people).map((p) => p.name);
    const name = names.join("\n");

    const handleInput = (e: any) => {
      if (props.limit && items.length >= props.limit) {
        itemErrorAnimation.start(itemErrorKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      const newValue = parseFloat(e.target.value);
      addItem(newValue);
      e.target.value = "";
      props.refocus(props.passedKey);
    };

    const itemErrorAnimation = useAnimationControls();

    return (
      <div id="item-entry" className="p-2 grid grid-cols-7 gap-x-2 border-b">
        <p
          onClick={props.handleNameClick}
          className={"self-center col-span-2" + " " + props.className}
        >
          {name}
        </p>
        <InputField
          name={name}
          ref={ref as RefObject<HTMLInputElement>}
          handleInput={handleInput}
          passedKey={props.passedKey}
          addToRefObject={props.addToRefObject}
          errorCondition={(e: any) => {
            const val = parseFloat(e.target.value);
            return isNaN(val) || val <= 0;
          }}
          numeric
        />
        <ItemsDisplay
          items={items}
          removeItem={removeItem}
          type={props.usePercentage ? "Percent" : "Price"}
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
