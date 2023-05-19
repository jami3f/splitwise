import { useEffect } from "preact/hooks";
import { Person } from "../app";

export default function MaxPromotionTotal(props: {
  promotion: number | undefined;
  maxPromotion: number | undefined;
  people: Person[];
}) {
  if (!props.promotion || !props.maxPromotion) return <div></div>;
  const grandTotal = props.people.reduce((acc, p) => acc + p.total, 0);

  const maxPromotionHit =
    grandTotal > props.maxPromotion / (props.promotion / 100);

  const untilMax = props.maxPromotion / (props.promotion / 100) - grandTotal;

  return (
    <div>
      {props.promotion &&
        props.maxPromotion > 0 &&
        (maxPromotionHit ? (
          <p>Getting £{props.maxPromotion.toFixed(2)} off</p>
        ) : (
          <p>£{untilMax.toFixed(2)} to promotion cap</p>
        ))}
    </div>
    // <p className="col-span-2 inline">
    //   {props.people.map((p) => {
    //     return (
    //       <p>
    //         {p.name}: £{(p.total * (props.promotion / 100)).toFixed(2)}
    //       </p>
    //     );
    //   })}
    // </p>
  );
}
