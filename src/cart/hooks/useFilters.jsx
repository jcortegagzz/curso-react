import { useState } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState({
    category: "all",
    min: "",
    max: "",
    product: "",
    from: "",
    to: "",
  });

  // Filtra productos por categoría
  const filterProducts = (products = []) => {
    return products.filter((product) => {
      return (
        filters.category === "all" || product.category === filters.category
      );
    });
  };

  // Filtra historial de compras por monto, producto, fecha
  const filterPurchases = (purchases = []) => {
    return purchases
      .map((purchase) => {
        // Manejo de fechas
        let d;
        if (purchase.date && purchase.date.includes(',')) {
          const [datePart] = purchase.date.split(',');
          const [day, month, year] = datePart.trim().split('/');
          d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        } else {
          d = new Date(purchase.date);
        }
        d.setHours(0, 0, 0, 0);

        if (filters.from) {
          const from = new Date(filters.from);
          from.setHours(0, 0, 0, 0);
          if (d < from) return null;
        }
        if (filters.to) {
          const to = new Date(filters.to);
          to.setHours(0, 0, 0, 0);
          if (d > to) return null;
        }

        // Filtros a nivel de producto (subtotal y nombre)
        const filteredItems = purchase.items
          .map(item => ({
            ...item,
            // Asegura que todos los items tengan subtotal numérico
            subtotal: item.subtotal !== undefined
              ? Number(item.subtotal)
              : Number(item.price) * Number(item.quantity)
          }))
          .filter((item) => {
            const subtotal = item.subtotal;

            if (
              filters.min !== "" &&
              (!Number.isFinite(subtotal) || subtotal < Number(filters.min))
            ) {
              return false;
            }
            if (
              filters.max !== "" &&
              (!Number.isFinite(subtotal) || subtotal > Number(filters.max))
            ) {
              return false;
            }
            if (
              filters.product.trim() !== "" &&
              !item.title.toLowerCase().includes(filters.product.toLowerCase())
            ) {
              return false;
            }
            return true;
          });

        if (filteredItems.length === 0) {
          return null;
        }

        return { ...purchase, items: filteredItems };
      })
      .filter(Boolean);
  };

  // Borrar filtros
  const clearFilters = () => {
    setFilters({
      category: "all",
      min: "",
      max: "",
      product: "",
      from: "",
      to: "",
    });
  };

  return {
    filters,
    setFilters,
    filterProducts,
    filterPurchases,
    clearFilters,
  };
};