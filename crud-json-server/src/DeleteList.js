import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteList(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    props.deleteList(props.item.id);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this item?</p>
          <p>
            <input
              name="id"
              disabled={true}
              className="d-block my-3"
              value={props.item.title}
            />
            {/* <strong>Title:</strong> {props.item.title} */}
          </p>
          <p>
            <input
              name="id"
              disabled={true}
              className="d-block my-3"
              value={props.item.author}
            />
            {/* <strong>Author:</strong> {props.item.author} */}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default DeleteList;
