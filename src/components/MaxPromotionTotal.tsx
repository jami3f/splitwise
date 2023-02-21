import { useEffect } from "preact/hooks";
import { Person } from "../app";

export default function MaxPromotionTotal(props: {
  promotion: number;
  maxPromotion: number;
  people: Person[];
}) {
  if (!props.promotion) return <p></p>;

  return (
    <p className="col-span-2 inline">
      {props.people.map((p) => {
        return (
          <p>
            {p.name}: £
            {(p.total * (props.promotion / 100)).toFixed(2)}
          </p>
        );
      })}
    </p>
  );
}
