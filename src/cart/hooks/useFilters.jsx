import { useState } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState({
    // Productos
    category: "all",
    // Historial de compras
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
    return purchases.filter((purchase) => {
      // Filtro por monto mínimo
      if (
        filters.min !== "" &&
        parseFloat(purchase.total) < parseFloat(filters.min)
      ) {
        return false;
      }
      // Filtro por monto máximo
      if (
        filters.max !== "" &&
        parseFloat(purchase.total) > parseFloat(filters.max)
      ) {
        return false;
      }
      // Filtro nombre de producto (parcial, insensible a mayúsculas)
      if (
        filters.product.trim() !== "" &&
        !purchase.items.some((item) =>
          item.title.toLowerCase().includes(filters.product.toLowerCase())
        )
      ) {
        return false;
      }

      // --- FILTROS DE FECHA ROBUSTOS PARA FORMATO LOCAL ---
      // Soporta fechas como "4/7/2025, 9:46:51 p.m." (d/m/yyyy)
      let d;
      if (purchase.date && purchase.date.includes(',')) {
        // Formato local: "4/7/2025, 9:46:51 p.m."
        const [datePart] = purchase.date.split(',');
        const [day, month, year] = datePart.trim().split('/');
        d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        // Por si acaso tienes algún formato ISO o solo la fecha
        d = new Date(purchase.date);
      }
      d.setHours(0, 0, 0, 0);

      // Filtro fecha desde
      if (filters.from) {
        const from = new Date(filters.from);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }
      // Filtro fecha hasta
      if (filters.to) {
        const to = new Date(filters.to);
        to.setHours(0, 0, 0, 0);
        if (d > to) return false;
      }

      return true;
    });
  };

//borrar filtros
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