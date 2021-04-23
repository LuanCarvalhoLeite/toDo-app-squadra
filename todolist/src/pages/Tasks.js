import { useEffect, useState } from "react";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { useParams, useLocation } from "react-router-dom";
import api from "../services/api";
import axios from 'axios';
import {Form, Input, Button, Row, Col, Divider} from 'antd';

const Tasks = () => {

  const params = useParams();
  const location = useLocation();
  const [list, setList] = useState([]);
  const [lista, setLista] = useState({});
  const [isOnlyPending, setIsOnlyPending] = useState(false);
  const [isEditing, setIsEditing] = useState("");

  async function getTasks(id) {
    const resp = await api.get(`/tasks?list_id=${id}`);
    if (resp.status === 200) {
      setList(resp.data);
    }
  }

  async function getList(id) {
    const resp = await api.get(`/lists/${id}`);
    if (resp.status === 200) {
      setLista(resp.data);
    }
  }

  useEffect(() => {
    console.log(params);
    if (params.id) {
      getTasks(params.id)
      getList(params.id)
    }
  }, [location])

  async function onSubmit(values) {
    const task = {
      id: new Date(),
      list_id: params.id,
      name: values.task,
      status: "pendente",
    };

    await api.post("/tasks", task);
    getTasks(params.id);
  }

  async function toggle(item) {
    item.status = item.status === "pendente" ? "feito" : "pendente";
    await api.put(`/tasks/${item.id}`, item);
    getTasks(params.id);
  }

  async function filter() {
    let url = "http://localhost:3004/tasks";
    if (!isOnlyPending) {
      url = url + "?status=pendente";
    }
    const resp = await axios.get(url);
    if (resp.status === 200) setList(resp.data);
    setIsOnlyPending(!isOnlyPending);
      
    } 

  function save(newName, item) {
    const newList = list.map((t) => {
      if (t.id === item.id) t.name = newName;
      return t;
    });
    setList(newList);
    setIsEditing("");
  }

  function onKeyDown(e, item) {
    if (e.charCode === 13 || e.keyCode === 13) save(e.target.value, item);
  }

  function onBlur(e, item) {
    save(e.target.value, item);
  }

  return (
    <div className="App">
      <h1>{lista && lista.name}</h1>
      <Divider/>
      <Form onFinish={onSubmit}>
        <Row>
          <Col sm={20}>
            <Form.Item name="task">
              <Input id="task" />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Button htmlType="submit">Adicionar</Button>
          </Col>
        </Row>
      </Form> 

      <div>
        <Button type="link" onClick={filter}>
          {isOnlyPending ? "Todos" : "Pendentes"}
        </Button>
      </div>

      <ul>
        {list.map((item, index) => {
          return (
            <li style={item.status === "feito" ? { textDecoration: "line-through" } : {}} key={index}>
              <span>
                {isEditing === item.id ? (
                  <input defaultValue={item.name} onBlur={(e) => onBlur(e, item)} onKeyDown={(e) => onKeyDown(e, item)} />
                ) : (
                  <b onClick={() => setIsEditing(item.id)}>{item.name}</b>
                )}
              </span>
              <button onClick={() => toggle(item)}>{item.status === "feito" ? <FaRegCheckSquare /> : <FaRegSquare />}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tasks;
