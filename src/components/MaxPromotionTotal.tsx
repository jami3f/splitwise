import { useEffect } from "preact/hooks";
import { Person } from "../app";

export default function MaxPromotionTotal(props: {
  promotion: number;
  maxPromotion: number;
  people: Person[];
}) {
  let maxPromotionHit = false;
  const grandTotal = props.people.reduce((acc, p) => acc + p.total, 0);
  if (
    grandTotal > props.maxPromotion / (props.promotion / 100)
  )
    maxPromotionHit = true;
  return (
    props.promotion &&
    props.maxPromotion > 0 && (
      maxPromotionHit ? "" : <p>Until max promotion:</p>

      // <p className="col-span-2 inline">
      //   {props.people.map((p) => {
      //     return (
      //       <p>
      //         {p.name}: £{(p.total * (props.promotion / 100)).toFixed(2)}
      //       </p>
      //     );
      //   })}
      // </p>
    )
  );
}
