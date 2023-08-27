import { useEffect, useState } from "preact/hooks";
import { Person } from "../../Types";

export default function TotalView(props: {
  people: Person[];
  promotion: number | undefined;
  promotionCap: number | undefined;
  service: number;
}) {
  const peopleFiltered = props.people.filter((p) => p.total > 0);

  const grandTotal = peopleFiltered.reduce((acc, p) => acc + p.total, 0);

  const [remainder, setRemainder] = useState(0);

  const [totals, setTotals] = useState<{ name: string; total: number }[]>([]);

  const calculateTotalWithPromotion = (total: number) => {
    if (
      (props.promotionCap || 0) === 0 ||
      grandTotal < (props.promotionCap || 0) / ((props.promotion || 0) / 100)
    )
      // doesn't hit max promotion - applies promotion to each person's order
      return total * ((100 - (props.promotion || 0)) / 100);
    // hits max promotion and calculates how much to take off each person's order - weighted by how much they spent
    else return total - (total / grandTotal) * (props.promotionCap || 0);
  };

  useEffect(() => {
    const tempTotals = peopleFiltered.map((person) => {
      const totalNoService = calculateTotalWithPromotion(person.total);
      const individualTotal =
        totalNoService + props.service / peopleFiltered.length;
      return { name: person.name, total: individualTotal };
    });
    setTotals(tempTotals);
    setRemainder(() => {
      const total = totals.reduce((acc, p) => acc + p.total, 0);
      const totalFixed = totals.reduce(
        (acc, p) => acc + Math.floor(p.total * 10) / 10,
        0
      );
      return total - totalFixed;
    });
  }, [peopleFiltered]);

  return (
    <div className="p-2 pr-5">
      <p className="font-semibold">Totals:</p>
      {totals.map((person) => (
        <p>
          {person.name}: £{person.total.toFixed(2)}
        </p>
      ))}
      <p className="pt-5">
        Total: £{totals.reduce((acc, p) => acc + p.total, 0).toFixed(2)}
      </p>
    </div>
  );
}
