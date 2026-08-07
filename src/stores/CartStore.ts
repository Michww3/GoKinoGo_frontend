import { types, Instance } from "mobx-state-tree";

const CartItem = types.model("CartItem", {
  movieId: types.identifierNumber,
  name: types.string,
  posterUrl: types.string,
  price: types.number,
  quantity: types.number,
});

export const CartStore = types
  .model("CartStore", {
    items: types.array(CartItem),
  })
  .views((self) => ({
    get totalItems() {
      return self.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    get totalPrice() {
      return self.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    },
  }))
  .actions((self) => ({
    addItem(movie: { id: number; name: string; posterUrl: string; price: number }) {
      const existing = self.items.find((i) => i.movieId === movie.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        self.items.push({
          movieId: movie.id,
          name: movie.name,
          posterUrl: movie.posterUrl,
          price: movie.price,
          quantity: 1,
        });
      }
    },
    removeItem(movieId: number) {
      const item = self.items.find((i) => i.movieId === movieId);
      if (item) self.items.remove(item);
    },
    setQuantity(movieId: number, quantity: number) {
      const item = self.items.find((i) => i.movieId === movieId);
      if (!item) return;
      if (quantity <= 0) {
        self.items.remove(item);
      } else {
        item.quantity = quantity;
      }
    },
    clear() {
      self.items.clear();
    },
  }));

export type CartStoreInstance = Instance<typeof CartStore>;