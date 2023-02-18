import { useEffect } from "preact/hooks";
import { Person } from "../app";

export function PromotionTotal(props: { people: Person[] }) {
  if (!props.people[0].items[0]) return <p></p>;
  const promotionValue = props.people[0].items[0].price;
  const maxPromotion = props.people[1].items[0].price;
  useEffect(() => {
    console.log(promotionValue)
  }, [promotionValue])
  return (
    <p className="col-span-2 inline">
      {props.people.slice(2).map((p) => {
        return (
          <p>{p.name + ": " + p.total + " " + promotionValue/100}{p.name + ": " + "£" + (p.total * (promotionValue/100)).toFixed(2)}</p>
        );
      })}
    </p>
  );
}
