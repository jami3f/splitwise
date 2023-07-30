import { MutableRef, StateUpdater, useEffect, useState } from "preact/hooks";
import { JSX, RefObject } from "preact";
import { ForwardedRef, forwardRef } from "preact/compat";
import { Person } from "../../../Types";
import {
  AnimationControls,
  ControlsAnimationDefinition,
  motion,
  useAnimationControls,
} from "framer-motion";

import { InputField } from "../../Common";
import { ISharedItem, DisplayType, ItemsDisplay, TotalDisplay } from "./index";

import { itemErrorKeyframes } from "../../../assets/Keyframes";

const Row = forwardRef(
  (
    props: {
      names: string[];
      people: Person[];
      handleNameClick: (event: Event) => void;
      passedKey: number;
      refocus: Function;
      className?: string;
      name?: string;
      limit?: number;
      children?: JSX.Element;
      usePercentage?: boolean;
    },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [items, updateItems] = useState<ISharedItem[]>([]);

    useEffect(() => {
      const total =
        items.reduce((acc, cur) => acc + cur.price, 0) / props.names.length;
      // for (name of props.names) {
      //   props.setTotals((old) => ({ ...old, [name]: total }));
      // }
    }, [items]);

    function addItem(price: number) {
      const ids = props.people.map((p) => p.id);
      updateItems((old) => [...old, { ids, price }]);
      // props.people.forEach((p) =>
      //   p.addItem({ id: p.id, price: price / props.people.length })
      // );
    }

    function removeItem(ids: number[]) {
      const compArrays = (a: number[], b: number[]) => {
        if (a.length !== b.length) return false;
        return a.every((v, i) => v === b[i]);
      };
      updateItems((old) => old.filter((i) => !compArrays(i.ids, ids)));
      // props.people.forEach((p, index) => p.removeItem(ids[index]));
    }

    let name = props.names.join("\n");

    const handleInput = (e: any) => {
      if (props.limit && items.length >= props.limit) {
        itemErrorAnimation.start(itemErrorKeyframes);
        return ((e.target as HTMLInputElement).value = "");
      }
      const newValue = parseFloat(e.target.value);
      if (props.usePercentage) {
        updateItems([{ ids: [0], price: newValue }]);
        // props.people[0].setItems([{ id: 0, price: newValue }]);
      } else addItem(newValue);
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
          type={props.usePercentage ? DisplayType.Percent : DisplayType.Price}
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
