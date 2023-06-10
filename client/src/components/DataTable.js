import React, { useState, useEffect, useContext } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { PrismaClient } from '@prisma/client';
import { featchUsers } from '../http/userAPI';
import { fetchBook, fetchGanre, fetchTags, fetchAuthor, deleteBook, delAuthor, delGanre, delTag } from '../http/bookAPI';
import { Button } from 'react-bootstrap';
import { BOOKS_ADMIN_ROUTE } from '../utils/const';
import { Context } from '../index';
import { Alert } from 'react-bootstrap';
import { deleteUser } from '../http/userAPI';
import { observer } from 'mobx-react-lite';

const DataTable = observer(({ schema, table }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const { currentBook } = useContext(Context);

  let [alertshow, setAlertshow] = React.useState(false);
  const [variant, setVariant] = React.useState('success');
  const [alertText, setAlertText] = React.useState('Успешно');



  useEffect(() => {
    async function fetchData() {
      var result = [];
      try {
        switch (table) {
          case 'users': result = await featchUsers(page); setData(result.users); break;
          case 'books': result = await fetchBook(page); setData(result.books); break;
          case 'genres': result = await fetchGanre(page); setData(result.genres); break;
          case 'authors': result = await fetchAuthor(page); setData(result.authors); break;
          //case 'series': fetchSeries(page); break;
          case 'tags': result = await fetchTags(page); setData(result.tags); break;
          default: console.log("Такой таблицы не существует"); break;
        }
        const count = result.totalPages;
        setTotalCount(count);
      } catch (e) {
        console.log(e);
        setAlertshow(true);
        setVariant('danger');
        setAlertText('Произошла ошибка');

      }
    }
    fetchData();
  }, [page]);

  const columns = schema;
  console.log(columns);

  const handleDelete = async (id) => {
    switch (table) {
      case 'users': await deleteUser(id).then( () => window.location.reload() ).catch((e) => { setAlertshow(true); setVariant('danger'); setAlertText('Произошла ошибка'); }); break;
      case 'books': await deleteBook(id).then( () => window.location.reload() ).catch((e) => { setAlertshow(true); setVariant('danger'); setAlertText('Произошла ошибка'); }); break;
      case 'genres': await delGanre(id).then( () => window.location.reload() ).catch((e) => { setAlertshow(true); setVariant('danger'); setAlertText('Произошла ошибка'); }); break;
      case 'authors': await delAuthor(id).then( () => window.location.reload() ).catch((e) => { setAlertshow(true); setVariant('danger'); setAlertText('Произошла ошибка'); }); break;
      case 'tags': await delTag(id).then( () => window.location.reload() ).catch((e) => { setAlertshow(true); setVariant('danger'); setAlertText('Произошла ошибка'); }); break;
      default: console.log("Такой таблицы не существует"); break;
    }
    //Обновляем страницу
    
  };
  const handleEdit = async (id) => {
    switch (table) {
      case 'users': break;
      case 'books':
        //Отрываем страницу редактирования книги
        localStorage.setItem('bookId', id);
        // сохраняем данные в контекст
        window.location.href = BOOKS_ADMIN_ROUTE;
        //console.log(currentBook);
        break;
      case 'genres': break;
      case 'authors': break;
      //case 'series': fetchSeries(page); break;
      case 'tags': break;
    }
  };

  return (
    <>
      {alertshow && <Alert variant={variant} className="mt-3" onClose={() => setAlertshow(false)} dismissible>{alertText}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label}>{column.label}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.label}`}>
                  {row[column.field] && row[column.field].length > 100
                    ? `${row[column.field].slice(0, 100)}...`
                    : row[column.field]}
                </td>
              ))}
              <td>{table === 'books' && <Button variant="primary" onClick={() => handleEdit(row.ID)}>Редактировать</Button>}
                <Button variant="danger" onClick={() => handleDelete(row.ID)}>Удалить</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <Pagination.First
          disabled={page === 1}
          onClick={() => setPage(1)}
        />
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        />

        {/* Отображение страниц */}
        {Array.from({ length: Math.ceil(totalCount) }).map((_, index) => (
          <Pagination.Item
            key={index}
            active={page === index + 1}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={page === Math.ceil(totalCount)}
          onClick={() => setPage(page + 1)}
        />
        <Pagination.Last
          disabled={page === Math.ceil(totalCount)}
          onClick={() => setPage(Math.ceil(totalCount))}
        />
      </Pagination>

    </>
  );
});

export default DataTable;
