import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { Filters } from "../../cart/components/Filters";
import { NavLink, useNavigate } from "react-router";
import { useCartSidebar } from "../../cart/hooks/useCartSidebar";
import { Button } from "react-bootstrap";
import useHasPurchases from "../../hooks/useHasPurchases"; // Importa el hook

export const Header = ({ changeFilters, category }) => {
  const navigate = useNavigate();
  const { openSidebar } = useCartSidebar();
  const hasPurchases = useHasPurchases();

  const onLogout = () => {
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <>
      <Navbar
        sticky="top"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          {/* Logo y Home */}
          <div className="d-flex align-items-center">
            <Navbar.Brand>Carrito con React</Navbar.Brand>
            <NavLink className="nav-item nav-link text-white" to="/">
              Home
            </NavLink>
          </div>
          {/* Íconos a la derecha */}
          <div className="d-flex gap-2">
            {/* Botón historial SOLO si hay compras */}
            {hasPurchases && (
              <Button
                variant="outline-light"
                onClick={() => navigate("/historial")}
                aria-label="Historial de compras"
                title="Historial de compras"
              >
                <i className="bi bi-clock-history" aria-hidden="true"></i>
                <span className="visually-hidden">Historial de compras</span>
              </Button>
            )}
            <Button onClick={openSidebar} variant="outline-light">
              <i className="bi bi-cart-fill"></i>
            </Button>
            <Button variant="outline-light">
              <i className="bi bi-person-circle"></i>
            </Button>
            <Button onClick={onLogout} variant="outline-light">
              <i className="bi bi-box-arrow-left"></i>
            </Button>
          </div>
        </Container>
      </Navbar>

      <Filters onChange={changeFilters} category={category} />
    </>
  );
};