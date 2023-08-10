import { DisplayType } from "../../../Types/DisplayType";
import { AnimationControls, motion } from "framer-motion";
import { cancel } from "../../../assets/icons";
import { Item } from "../../../Types";
export default function ItemsDisplay(props: {
  items: Item[];
  removeItem: (id: string) => void;
  type: DisplayType;
  itemErrorAnimation: AnimationControls;
}) {
  return (
    <div className="col-span-2 grid grid-cols-3 justify-center">
      {props.items.map((item, index) => (
        <div className="inline-flex mx-3 self-center">
          <span
            className="mr-1"
          >
            {props.type === "Price" && "£"}
            {item.price.toFixed(2).toString()}
            {props.type === "Percent" && "%"}
          </span>
          <button
            title="Remove"
            type="button"
            onClick={() => props.removeItem(item.id)}
            tabIndex={-1}
            className="w-3"
          >
            <img src={cancel} alt="remove" className="w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
