import { useEffect } from "preact/hooks";
import { Person } from "../../Types";

export default function TotalView(props: {
    people: Person[];
    promotion: number | undefined;
    maxPromotion: number | undefined;
    service: number;
  }) {

    let truePromotion = 0;
    let trueMaxPromotion = 0;

    useEffect(() => {
        truePromotion = props.promotion || 0;
        trueMaxPromotion = props.maxPromotion || 0;
    })

    const peopleFiltered = props.people.filter((p) => p.total > 0);
    let usePromotion = true;
    const grandTotal = peopleFiltered.reduce((acc, p) => acc + p.total, 0);
    if (trueMaxPromotion > 0 && grandTotal > trueMaxPromotion)
      usePromotion = false;
    const calculateTotalWithPromotion = (total: number) => {
      if (
        trueMaxPromotion == 0 ||
        grandTotal < trueMaxPromotion / (truePromotion / 100)
      )
        // doesn't hit max promotion - applies promotion to each person's order
        return total * ((100 - truePromotion) / 100);
      // hits max promotion and calculates how much to take off each person's order - weighted by how much they spent
      else return total - (total / grandTotal) * trueMaxPromotion;
    };
    const totals = peopleFiltered.map((person) => {
      const totalNoService = calculateTotalWithPromotion(person.total);
      const individualTotal =
        totalNoService + props.service / peopleFiltered.length;
      return { name: person.name, total: individualTotal };
    });
  
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