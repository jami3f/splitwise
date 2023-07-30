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
      names: string[];
      people: Person[];
      setPeople: StateUpdater<{ [key: string]: Person }>;
      handleNameClick: (event: Event) => void;
      passedKey: number;
      refocus: Function;
      className?: string;
      limit?: number;
      children?: JSX.Element;
      usePercentage?: boolean;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [items, updateItems] = useState<Item[]>([]);

    useEffect(() => {
      for (name of props.names) {
        props.setPeople((old) => ({
          ...old,
          [name]: { ...old[name], items: items },
        }));
      }

      // ------------------------------------------------------
      const total =
        items.reduce((acc, cur) => acc + cur.price, 0) / props.names.length;
      for (name of props.names) {
        props.setPeople((old) => ({
          ...old,
          [name]: { ...old[name], total: old[name].total + total },
        }));
      }
    }, [items]);

    function addItem(price: number) {
      updateItems((old) => [...old, { id: uuid(), price: price }]);
    }

    function removeItem(id: string) {
      updateItems((old) => old.filter((i) => i.id !== id));
    }

    // function removeItem(ids: number[]) {
    //   const compArrays = (a: number[], b: number[]) => {
    //     if (a.length !== b.length) return false;
    //     return a.every((v, i) => v === b[i]);
    //   };
    //   updateItems((old) => old.filter((i) => !compArrays(i.ids, ids)));
    // props.people.forEach((p, index) => p.removeItem(ids[index]));
    // }

    let name = props.names.join("\n");

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
