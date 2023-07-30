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
    <div className="col-span-2 flex justify-center">
      {props.items.map((item, index) => (
        <div className="inline-flex mx-3 self-center">
          <motion.span
            className="mr-1"
            animate={props.itemErrorAnimation}
            transition={{ duration: 0.5 }}
          >
            {props.type === "Price" && "£"}
            {item.price.toFixed(2).toString()}
            {props.type === "Percent" && "%"}
          </motion.span>
          <button
            title="Remove"
            type="button"
            onClick={() => props.removeItem(item.id)}
            tabIndex={-1}
          >
            <img src={cancel} alt="remove" className="w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
