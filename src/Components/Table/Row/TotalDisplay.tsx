import { Person } from "../../../Classes";
import ISharedItem from "./ISharedItem";
export default function TotalDisplay(props: { people: Person[]; items: ISharedItem[] }) {
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
