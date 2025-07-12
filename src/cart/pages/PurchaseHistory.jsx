import { Table, Image, Button, Row, Col, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFilters } from "../hooks/useFilters";
import PurchaseDetailModal from "../../components/PurchaseDetailModal";

export const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const { filters, setFilters, filterPurchases, clearFilters } = useFilters();
  const navigate = useNavigate();

  const [detailPurchase, setDetailPurchase] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("purchases");
    if (stored) {
      setPurchases(JSON.parse(stored));
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sortData = (data) => {
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "total") {
        return sortOrder === "asc"
          ? parseFloat(a.total) - parseFloat(b.total)
          : parseFloat(b.total) - parseFloat(a.total);
      }
      return 0;
    });
    return sorted;
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return null;
    return (
      <i
        className={`bi ${
          sortOrder === "asc" ? "bi-arrow-up" : "bi-arrow-down"
        } ms-1`}
      ></i>
    );
  };

  const filteredPurchases = sortData(filterPurchases(purchases));

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Historial de Compras</h2>
        <Button variant="primary" onClick={() => navigate("/grafica")}>
          Ver Gráfico
        </Button>
      </div>
      <Form className="mb-3">
        <Row className="g-2 align-items-end">
          <Col md>
            <Form.Label>Monto mínimo</Form.Label>
            <Form.Control
              type="number"
              name="min"
              value={filters.min}
              onChange={handleFilterChange}
              placeholder="Min"
            />
          </Col>
          <Col md>
            <Form.Label>Monto máximo</Form.Label>
            <Form.Control
              type="number"
              name="max"
              value={filters.max}
              onChange={handleFilterChange}
              placeholder="Max"
            />
          </Col>
          <Col md>
            <Form.Label>Nombre de producto</Form.Label>
            <Form.Control
              type="text"
              name="product"
              value={filters.product}
              onChange={handleFilterChange}
              placeholder="Producto"
            />
          </Col>
          <Col md>
            <Form.Label>Fecha desde</Form.Label>
            <Form.Control
              type="date"
              name="from"
              value={filters.from}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md>
            <Form.Label>Fecha hasta</Form.Label>
            <Form.Control
              type="date"
              name="to"
              value={filters.to}
              onChange={handleFilterChange}
            />
          </Col>
          <Col xs="auto">
            <Button variant="outline-secondary" onClick={clearFilters}>
              Borrar filtros
            </Button>
          </Col>
        </Row>
      </Form>
      {filteredPurchases.length === 0 ? (
        <p className="text-center text-muted mt-4">Sin elementos</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Fecha {renderSortIcon("date")}
              </th>
              <th>Productos</th>
              <th
                onClick={() => handleSort("total")}
                style={{ cursor: "pointer" }}
              >
                Total {renderSortIcon("total")}
              </th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.map((purchase, index) => (
              <tr key={purchase.id}>
                <td>{index + 1}</td>
                <td>{purchase.date}</td>
                <td>
                  <Table bordered size="sm" className="mt-2">
                    <thead className="table-secondary">
                      <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <Image
                              src={item.image}
                              alt={item.title}
                              thumbnail
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td>{item.title}</td>
                          <td>{item.description}</td>
                          <td>
                            {parseFloat(item.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                          </td>
                          <td>{item.quantity}</td>
                          <td>
                            {(parseFloat(item.price) * parseInt(item.quantity)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </td>
                <td>
                  {parseFloat(purchase.total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setDetailPurchase(purchase);
                      setShowDetail(true);
                    }}
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <PurchaseDetailModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        purchase={detailPurchase}
      />
    </div>
  );
};