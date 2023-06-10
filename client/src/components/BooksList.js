import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Badge, CloseButton, Row, Col } from 'react-bootstrap';
import { fetchBookSearch, fetchTags, fetchAuthor, fetchGanre } from '../http/bookAPI';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import BookItem from './BookItem';
import { Pagination } from 'react-bootstrap';
import { InputGroup, FormControl } from 'react-bootstrap';



const BookList = observer(() => {
    const { book } = useContext(Context);
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [genres, setGenres] = useState([]);
    const [tags, setTags] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterParams, setFilterParams] = useState({ tags: [], genres: [], authors: [] });

    const [authorSearch, setAuthorSearch] = useState('');
    const [genreSearch, setGenreSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');

    let [alertshow, setAlertshow] = React.useState(false);
    const [variant, setVariant] = React.useState('success');
    const [alertText, setAlertText] = React.useState('Успешно');


    async function fetchData() {
        try{
        const result = await fetchBookSearch(currentPage, searchTerm, filterParams);
        setBooks(result.books);
        setTotalPages(result.totalPages);
        }
        catch (e) {
            console.log(e);
            setAlertshow(true);
            setVariant('danger');
            setAlertText('Произошла ошибка: ' + e.response.data.message);

        }
    }

    async function fetchfiltres() {
        try {
            const _genres = await fetchGanre(0);
            setGenres([...new Set(_genres)]);
            const _tags = await fetchTags(0);
            setTags([...new Set(_tags)]);
            const _authors = await fetchAuthor(0);
            setAuthors([...new Set(_authors)]);
        } catch (e) {
            console.log(e);
            setAlertshow(true);
            setVariant('danger');
            setAlertText('Произошла ошибка: ' + e.response.data.message);

        }
    }
    useEffect(() => {
        fetchData();
        if (genres.length === 0) {
            fetchfiltres();
        }
    }, [currentPage, searchTerm, filterParams]);

    function handleTagChange(selected) {
        const tags = [...filterParams.tags];
        const index = tags.findIndex((tag) => tag.ID === selected.ID);
        if (index !== -1) {
            tags.splice(index, 1);
        } else {
            tags.push(selected);
        }
        setFilterParams({ ...filterParams, tags });
    }


    function handleGenreChange(selected) {
        const genres = [...filterParams.genres];
        const index = genres.findIndex((genre) => genre.ID === selected.ID);
        if (index !== -1) {
            genres.splice(index, 1);
        } else {
            genres.push(selected);
        }
        setFilterParams({ ...filterParams, genres });
    }

    function handleAuthorChange(selected) {
        const authors = [...filterParams.authors];
        const index = authors.findIndex((author) => author.ID === selected.ID);
        console.log(index);
        console.log(selected);
        console.log(authors);
        if (index !== -1) {
            console.log("Удалаем автора");
            authors.splice(index, 1);
        } else {
            console.log("Добавляем автора");
            authors.push(selected);
        }

        setFilterParams({ ...filterParams, authors });
        console.log(filterParams);
    }


    function handleSubmit(event) {
        event.preventDefault();

        setCurrentPage(1);
    }

    return (
        <div>


            <Form onSubmit={handleSubmit} className='w-100'>
                <Row>
                    <Form.Group controlId="searchTerm" className='w-100'>
                        <Form.Label>Поиск</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название книги, серию или год издания..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </Form.Group>
                </Row>
                <Row className='d-flex wrap'>

                    <Col xs={12} md={4}>

                        <Form.Group controlId="authors" className='w-100'>
                            <Form.Label>Авторы</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Поиск авторов..."
                                    value={authorSearch}
                                    onChange={(e) => setAuthorSearch(e.target.value)}
                                />
                            </InputGroup>
                            <div>
                                {authors
                                    .filter((author) =>
                                        author.AUTHOR_NAME.toLowerCase().includes(authorSearch.toLowerCase())
                                    )
                                    .slice(0, 10)
                                    .map((author) => (
                                        <Form.Check
                                            inline
                                            label={author.AUTHOR_NAME}
                                            type="checkbox"
                                            id={author.ID}
                                            key={author.ID}
                                            checked={filterParams.authors.findIndex((item) => item.ID === author.ID) >= 0}
                                            onChange={() => handleAuthorChange(author)}
                                        />
                                    ))}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group controlId="genres" className='w-100'>
                            <Form.Label>Жанры</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Поиск жанров..."
                                    value={genreSearch}
                                    onChange={(e) => setGenreSearch(e.target.value)}
                                />
                            </InputGroup>
                            <div>
                                {genres
                                    .filter((genre) =>
                                        genre.GENRE_NAME.toLowerCase().includes(genreSearch.toLowerCase())
                                    )
                                    .slice(0, 10)
                                    .map((genre) => (
                                        <Form.Check
                                            inline
                                            label={genre.GENRE_NAME}
                                            type="checkbox"
                                            id={genre.ID}
                                            key={genre.ID}
                                            checked={filterParams.genres.findIndex((item) => item.ID === genre.ID) !== -1}
                                            onChange={() => handleGenreChange(genre)}
                                        />
                                    ))}
                            </div>
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group controlId="tags" className='w-100'>
                            <Form.Label>Теги</Form.Label>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    placeholder="Поиск тегов..."
                                    value={tagSearch}
                                    onChange={(e) => setTagSearch(e.target.value)}
                                />
                            </InputGroup>
                            <div>
                                {tags
                                    .filter((tag) =>
                                        tag.TAG_NAME.toLowerCase().includes(tagSearch.toLowerCase())
                                    )
                                    .slice(0, 10)
                                    .map((tag) => (
                                        <Form.Check
                                            inline
                                            label={tag.TAG_NAME}
                                            type="checkbox"
                                            id={tag.ID}
                                            key={tag.ID}
                                            checked={filterParams.tags.findIndex((item) => item.ID === tag.ID) !== -1}
                                            onChange={() => handleTagChange(tag)}
                                        />
                                    ))}
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>


            <div className="d-flex justify-content-center align-items-center">
                <div style={{ display: 'flex', flexWrap: 'wrap', grap: '10px' }}>
                    {books.map((book) => (
                        <BookItem key={book.ID} book={book} />
                    ))}
                </div>
                
            </div>
            <Pagination>
                <Pagination.First
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                />

                {/* Отображение страниц */}
                {Array.from({ length: Math.ceil(totalPages) }).map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next
                    disabled={currentPage === Math.ceil(totalPages)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                />
                <Pagination.Last
                    disabled={currentPage === Math.ceil(totalPages)}
                    onClick={() => setCurrentPage(Math.ceil(totalPages))}
                />
            </Pagination>

            
        </div>
    )
}
)
export default BookList;
