import { StateUpdater, useEffect, useState } from "preact/hooks";
import Item from "./Item";

export default class Person {
  name: string;
  id: number;
  items: Item[];
  setItems: StateUpdater<Item[]>;
  total: number;
  setTotal: StateUpdater<number>;
  limit = 0;
  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
    [this.items, this.setItems] = useState<Item[]>([]);
    [this.total, this.setTotal] = useState(0);
    useEffect(() => {
      this.setTotal(this.items.reduce((acc, item) => acc + item.price, 0));
    }, [this.items]);
  }
  addItem(item: Item) {
    this.setItems((old) => [...old, item]);
  }
  removeItem(id: number) {
    this.setItems((old) => old.filter((i) => i.id !== id));
  }
}
