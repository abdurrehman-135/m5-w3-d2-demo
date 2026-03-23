import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function UpdateList(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    props.loadList(props.elementId);
  };

  const handleUpdate = () => {
    props.updateList(props.elementId);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={props.singledata.title}
            onChange={props.handleChange}
            className="d-block my-3"
          />

          <label>Author</label>
          <input
            type="text"
            placeholder="Author"
            name="author"
            value={props.singledata.author}
            onChange={props.handleChange}
            className="d-block my-3"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default UpdateList;
