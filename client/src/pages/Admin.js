import React, { useState } from "react";
import { Container, ListGroup, Row } from "react-bootstrap";
import CreateGanre from "../components/modals/CreateGanre";
import CreateAuthor from "../components/modals/CreateAuthor";
import CreateBook from "../components/modals/CreateBook";
import CreateTag from "../components/modals/CreateTag";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { Tabs, Tab } from "react-bootstrap";
import DataTable from "../components/DataTable";
import { useEffect } from "react";
import { schemaUser, schemaBook, schemaAuthor, schemaGenre, schemaTag } from "../utils/shemaTable";

const Admin = observer(() => {
    const [ganreShow, setGanreShow] = React.useState(false)
    const [authorShow, setAuthorShow] = React.useState(false)
    const [bookShow, setBookShow] = React.useState(false)
    const [tagShow, setTagShow] = React.useState(false)
    const [key, setKey] = useState(() => {
        const storedKey = localStorage.getItem('myKey');
        return storedKey !== null ? storedKey : 'users';
    });
    //Если key изменился, сохраняем его в localStorage
    useEffect(() => {
        localStorage.setItem('myKey', key);
    }, [key]);

    return (
        <Container>
            <h1>Admin</h1>
            <Button variant="primary"
                onClick={() => { setGanreShow(true) }}
            >Добавить жанр</Button>
            <Button variant="primary"
                onClick={() => { setAuthorShow(true) }}
            >Добавить автора</Button>
            <Button variant="primary"
                onClick={() => { setBookShow(true) }}
            >Добавить книгу</Button>
            <Button variant="primary"
                onClick={() => { setTagShow(true) }}
            >Добавить тег</Button>
            <CreateGanre show={ganreShow} onHide={() => { setGanreShow(false) }} />
            <CreateAuthor show={authorShow} onHide={() => { setAuthorShow(false) }} />
            <CreateBook show={bookShow} onHide={() => { setBookShow(false) }} />
            <CreateTag show={tagShow} onHide={() => { setTagShow(false) }} />
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="users" title="Пользователи">
                    <DataTable schema={schemaUser} table="users" />
                </Tab>
                <Tab eventKey="book" title="Книги">
                    <DataTable schema={schemaBook} table="books" />
                </Tab>
                <Tab eventKey="authors" title="Авторы">
                    <DataTable schema={schemaAuthor} table="authors" />
                </Tab>
                <Tab eventKey="genres" title="Жанры">
                    <DataTable schema={schemaGenre} table="genres" />
                </Tab>
                <Tab eventKey="tags" title="Теги">
                    <DataTable schema={schemaTag} table="tags" />
                </Tab>
            </Tabs>
        </Container>
    );
}
)
export default Admin;