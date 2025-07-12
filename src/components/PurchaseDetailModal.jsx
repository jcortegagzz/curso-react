import { Modal, Table, Image, Button } from "react-bootstrap";

const PurchaseDetailModal = ({ show, onHide, purchase }) => {
  if (!purchase) return null;
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Detalle de compra</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><b>Fecha:</b> {purchase.date}</p>
        <Table bordered size="sm">
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
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{parseFloat(item.price).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td>{item.quantity}</td>
                <td>
                  {(parseFloat(item.price) * parseInt(item.quantity)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="text-end fw-bold">
          Total: {parseFloat(purchase.total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PurchaseDetailModal;