import React, { useState, useContext, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { Context } from "../../index";
import { createBook, uploadFile } from "../../http/bookAPI";
import { observer } from "mobx-react-lite";
import { Alert } from "react-bootstrap";

const CreateBook = observer((props) => {
    const [file, setFile] = useState(null);
    const [fimg, setfimg] = useState(null);
    const [name, setName] = useState("");
    const [info, setInfo] = useState("");
    const [series, setSeries] = useState("");
    const [year, setYear] = useState("");
    const [chapters, setChapters] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [validations, setValidations] = useState({
        name: true,
        info: true,
        series: true,
        year: true,
        chapters: true,
    });



    useEffect(() => {
        setIsFormValid(
            name.trim() !== "" &&
            info.trim() !== "" &&
            series.trim() !== "" &&
            !isNaN(year) &&
            year.trim() !== "" &&
            !isNaN(chapters) &&
            chapters.trim() !== "" &&
            file !== null &&
            file.type == 'application/epub+zip' &&
            fimg !== null &&
            fimg.type == 'image/jpeg'
        );
    }, [name, info, series, year, chapters]);

    const [alertshow, setAlertshow] = useState(false);
    const [variant, setVariant] = useState('success');
    const [alertText, setAlertText] = useState('Успешно');

    const addBook = async () => {
        const newbook = {
            BOOK_NAME: name,
            BOOK_INFO: info,
            BOOK_SERIES: series,
            BOOK_RELEASE: year,
            CHAPTERS: chapters
        }
        console.log(newbook);
            const result = await createBook(newbook).catch((error) => {
                setAlertText("Ошибка");
                setVariant('danger');
                setAlertshow(true);
            });
            console.log(result);
            if (file != null && file.type == 'application/epub+zip') {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('name', 'Book' + result.ID + '.epub');
                const data = await uploadFile(formData);
            }else {
                setAlertText("Файл не выбран или не является epub");
                setVariant('danger');
                setAlertshow(true);
            }
            if (fimg != null && fimg.type == 'image/jpeg') {
                const formData = new FormData();
                formData.append('file', fimg);
                console.log(fimg);
                formData.append('name', 'Cover' + result.ID + '.jpg');
                const data = await uploadFile(formData);
            }else {
                setAlertText("Файл не выбран или не является jpg");
                setVariant('danger');
                setAlertshow    (true)
            }
        // Обновить страницу
        if(alertshow == false){
        props.onHide();
        window.location.reload();
        }
        // Закрыть модальное окно
        
    };

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const selectImg = (e) => {
        setfimg(e.target.files[0]);
    };

    const handleInputChange = (event, field) => {
        const { value } = event.target;
        const updatedValidations = { ...validations, [field]: value.trim() !== "" };
        setValidations(updatedValidations);

        switch (field) {
            case "name":
                setName(value);
                break;
            case "info":
                setInfo(value);
                break;
            case "series":
                setSeries(value);
                break;
            case "year":
                setYear(value);
                break;
            case "chapters":
                setChapters(value);
                break;
            default:
                break;
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >{alertshow && (
            <Alert variant={variant} className="mt-3" onClose={() => setAlertshow(false)} dismissible>
                {alertText}
            </Alert>
        )}
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить книгу
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Загрузить файл книги</Form.Label>
                        <Form.Control type="file" onChange={selectFile} />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Загрузить обложку книги</Form.Label>
                        <Form.Control type="file" onChange={selectImg} />
                    </Form.Group>
                    <Form.Control
                        value={name}
                        onChange={(e) => handleInputChange(e, "name")}
                        placeholder="Введите название книги"
                        className="mt-3"

                    />
                    <Form.Control
                        value={info}
                        onChange={(e) => handleInputChange(e, "info")}
                        placeholder="Введите описание книги"
                        className="mt-3"
                    />
                    <Form.Control
                        value={series}
                        onChange={(e) => handleInputChange(e, "series")}
                        placeholder="Введите серию книги"
                        className="mt-3"
                    />
                    <Form.Control
                        value={year}
                        onChange={(e) => handleInputChange(e, "year")}
                        placeholder="Введите год выпуска книги"
                        className="mt-3"
                    />
                    <Form.Control
                        value={chapters}
                        onChange={(e) => handleInputChange(e, "chapters")}
                        placeholder="Введите количество глав книги"
                        className="mt-3"
                    />
                    <Button
                        variant="outline-success"
                        className="mt-3"
                        onClick={addBook}
                        disabled={!isFormValid}
                    >
                        Добавить
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
});

export default CreateBook;
