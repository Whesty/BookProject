import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { createAuthor } from "../../http/bookAPI";
import { Formik, Field, ErrorMessage } from "formik";

const CreateAuthor = (props) => {
  const [alertshow, setAlertshow] = useState(false);
  const [variant, setVariant] = useState("success");
  const [alertText, setAlertText] = useState("Успешно");

  const addAuthor = async (values, { resetForm }) => {
    try {
      const result = await createAuthor({ name: values.value });
      setAlertshow(false);
      resetForm();
      props.onHide();
    } catch (error) {
      setAlertshow(true);
      setVariant("danger");
      setAlertText("Возможно такой автор уже существует");
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {alertshow && (
        <Alert
          variant={variant}
          className="mt-3"
          onClose={() => setAlertshow(false)}
          dismissible
        >
          {alertText}
        </Alert>
      )}
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Создать автора
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ value: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.value) {
              errors.value = "Введите название автора";
            }
            return errors;
          }}
          onSubmit={addAuthor}
        >
          {({ values, handleChange, handleSubmit, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Field
                type="text"
                name="value"
                value={values.value}
                onChange={handleChange}
                placeholder="Введите название автора"
                as={Form.Control}
                isInvalid={!!errors.value}
              />
              <ErrorMessage
                name="value"
                component={Form.Control.Feedback}
                type="invalid"
              />
              <Button type="submit">Создать</Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAuthor;
