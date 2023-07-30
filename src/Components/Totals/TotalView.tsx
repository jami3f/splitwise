import { Person } from "../../Types";

export default function TotalView(props: {
    people: Person[];
    promotion: number;
    maxPromotion: number;
    service: number;
  }) {
    const peopleFiltered = props.people.filter((p) => p.total > 0);
    let usePromotion = true;
    const grandTotal = peopleFiltered.reduce((acc, p) => acc + p.total, 0);
    if (props.maxPromotion > 0 && grandTotal > props.maxPromotion)
      usePromotion = false;
    const calculateTotalWithPromotion = (total: number) => {
      if (
        props.maxPromotion == 0 ||
        grandTotal < props.maxPromotion / (props.promotion / 100)
      )
        // doesn't hit max promotion - applies promotion to each person's order
        return total * ((100 - props.promotion) / 100);
      // hits max promotion and calculates how much to take off each person's order
      else return total - (total / grandTotal) * props.maxPromotion;
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