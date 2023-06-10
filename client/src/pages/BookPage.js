import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Image, Stack, Button, ListGroup, Form, Table, Tabs, Tab, Card, Nav } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { fetchOneBook, getComments } from "../http/bookAPI";
import { Context } from "../index";
import { Embed } from "mdbreact";
import { Link } from "react-router-dom";
import { getBookAuthor, getBookIDGenre, getBookIDTag, getBookAvarageRaiting } from "../http/bookAPI";
import { getBoomarkId, addMarks } from "../http/userAPI";
import ReadBook from "../components/ReadBook";
import Feedback from "../components/Feedback";
import { Book } from 'epubjs';
import { Alert } from "react-bootstrap";

import { formatDate } from '../utils/const';

const BookPage = observer(() => {
    let { currentBook } = useContext(Context);
    const { id } = useParams();
    let [loading, setLoading] = useState(true);
    const [showList, setShowList] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    let [marks, setMarks] = useState([]);
    let [comments, setComments] = useState([]);
    let [comment, setComment] = useState("");
    let [raiting, setRaiting] = useState(0);
    let [author, setAuthor] = useState([]);
    let [genre, setGenre] = useState([]);
    let [tag, setTag] = useState([]);
    let [readDate, setReadDate] = useState(null);
    const { user } = useContext(Context);


    let [alertshow, setAlertshow] = React.useState(false);
    const [variant, setVariant] = React.useState('success');
    const [alertText, setAlertText] = React.useState('Успешно');


    useEffect(() => {
        const load = async () => {
            try{
            currentBook.setid(id);
            await fetchOneBook(id).then(data => {
                currentBook.setBook(data);
            });
            await getBookAuthor(id).then(data => {

                setAuthor(data);
            });
            await getBookIDGenre(id).then(data => {

                setGenre(data);
            });
            await getBookIDTag(id).then(data => {
                setTag(data);
            });
            if (user.isAuth) {
            
            await getBoomarkId(localStorage.getItem("id"), currentBook.id).then(data => {

                let Lists = [{ id: 1, name: 'Читаю' }, { id: 2, name: 'Прочитано' }, { id: 3, name: 'Хочу прочитать' }, { id: 4, name: 'Брошено' }, { id: 5, name: 'Отложено' }, { id: 6, name: 'Любимое' }];
                setMarks(Lists);
                setReadDate(null)
                if (data) {
                    setReadDate(data.DATA_READING);
                    const id = Lists.find(item => item.name === data.STATUS_READING);
                    setSelectedItem(id || null);
                    localStorage.setItem('bookProgress', data.MARKS);
                }
                else {
                    //Удалить закладку
                    localStorage.setItem('bookProgress', 0);

                }
            });
        }
            await getBookAvarageRaiting(id).then(data => {
                if (data._avg.RATING == null) {
                    setRaiting(0);
                }
                else {
                    setRaiting(data._avg.RATING);
                }
            });
            
        setLoading(false);
            
        } catch (e) {
            setAlertshow(true);
            setVariant('danger');
            setAlertText('Произошла ошибка: ' + e.message);
        }
        }
        load();
    }, [id]);


    const handleDownload = () => {
        window.open(process.env.REACT_APP_API_URL + 'Book' + id + '.EPUB');
    };
    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowList(false);
        const createBookmark = async () => {
            if(item==null){
                item = {name: 'История', id: -1};
            }
            await addMarks(localStorage.getItem('id'), currentBook.id, localStorage.getItem('bookProgress'), item.name).then(data => {
                currentBook.setBookmark(data);
            });
        }
        createBookmark();
    }

    const handleShowList = () => {
        setShowList(!showList);
    }

    if (loading) {
        return <div>Загрузка...</div>
    }
    return (
        <Container className="mt-5">
        {alertshow && <Alert variant={variant} className="mt-3" onClose={() => setAlertshow(false)} dismissible>{alertText}</Alert>}

            <Row>
                <Col xs={12} md={4} style={{ width: '320px' }}>
                    <Image src={process.env.REACT_APP_API_URL + 'Cover' + id + '.jpg'} style={{ width: '299px', height: '450px' }} fluid />
                    <Card className="text-center" style={{ width: '299px' }} >
                        <Card.Body >
                            {user.isAuth &&
                            <div className="d-grid gap-2">
                                <Button variant="primary" onClick={handleDownload}>Скачать файл</Button>

                                <Button variant="outline-primary" onClick={handleShowList}>
                                    {selectedItem ? selectedItem.name : 'Выберите тип закладки'}
                                </Button>
                                {showList && (
                                    <div>
                                        <h3>Выберите тип закладки</h3>
                                        <ListGroup>
                                            {marks.map((item) => (
                                                <ListGroup.Item
                                                    key={item.id}
                                                    active={selectedItem && selectedItem.id === item.id}
                                                    onClick={() => handleItemClick(item)}
                                                >
                                                    {item.name}
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>

                                        {selectedItem && (
                                            <Button onClick={() => handleItemClick(null)}>Сбросить выбор</Button>
                                        )}
                                    </div>
                                )}

                            </div>
}
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <Row>
                                {readDate != null ? <h6>Последее посещение: {formatDate(readDate)}</h6> : <h6>Вы здесь в первые</h6>}
                            </Row>
                        </Card.Footer>


                    </Card>
                </Col>
                <Col xs={12} md={8} style={{ minwidth: '370px' }}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <div className="d-flex align-items-center">
                                    <img src={process.env.REACT_APP_API_URL + "star_icon.png"} alt="star" width={30} height={30} />
                                    <h2 style={{ color: '#FFA500' }} className="ml-2 mb-0">{raiting}</h2>
                                    

                                </div>
                                <h2>{currentBook.name}</h2>
                            </Row>
                        </Card.Body>
                        <Card.Footer>
                        <Row>

                            <Col style={{ width: '10%' }}>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link eventKey="disabled" disabled style={{ color: 'black' }}>
                                        {author.length === 1 ? 'Автор:' : 'Авторы:'}
                                    </Nav.Link>
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link eventKey="disabled" disabled style={{ color: 'black' }}>
                                        {genre.length === 1 ? 'Жанр:' : 'Жанры:'}
                                    </Nav.Link>
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link eventKey="disabled" disabled style={{ color: 'black' }}>
                                        {tag.length === 1 ? 'Тег:' : 'Теги:'}
                                    </Nav.Link>
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link eventKey="disabled" disabled style={{ color: 'black' }}>
                                        Год издания:
                                    </Nav.Link>
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link eventKey="disabled" disabled style={{ color: 'black' }}>
                                        Серия книг:
                                    </Nav.Link>
                                </Nav>
                            </Col>
                            <Col style={{ width: '120%' }}>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    {author.map((item) => (
                                        <Nav.Link key={item.ID} href={`/author/${item.AUTHOR_NAME}/${item.ID}`}>
                                            {item.AUTHOR_NAME || null}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    {genre.map((item) => (
                                        <Nav.Link key={item.ID} href={`/genre/${item.GENRE_NAME}/${item.ID}`}>
                                            {item.GENRE_NAME || null}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    {tag.map((item) => (
                                        <Nav.Link key={item.ID} href={`/tag/${item.TAG_NAME}/${item.ID}`}>
                                            {item.TAG_NAME || null}
                                        </Nav.Link>
                                    ))}
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link href={`/year/${currentBook.year}`} >
                                        {currentBook.year}
                                    </Nav.Link>
                                </Nav>
                                <Nav style={{ display: 'flex', alignItems: 'center' }}>
                                    <Nav.Link href={`/series/${currentBook.series}`} >
                                        {currentBook.series}
                                    </Nav.Link>
                                </Nav>
                            </Col>

                        </Row>
                       
                        </Card.Footer>
                    </Card>


                </Col>
                
                
            </Row>
            <Row className="mt-5">
                <Col>
                <p style={{ marginLeft: 0 }}>{currentBook.description}</p>
                </Col>
            </Row>
            <Row className="mt-5">
                <ReadBook data={id} />
                <Col className="mt-5">
                    <Feedback idBook={id} />
                </Col>
            </Row>
        </Container>
    );
});
export default BookPage;