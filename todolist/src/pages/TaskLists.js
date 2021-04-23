import React, { useEffect, useState } from "react";
import api from "../services/api";
import axios from "axios";
import {Form, PageHeader, Input, Button, Row, Col, Table, Space, Popconfirm, message} from "antd";
import {FaList, FaTrash} from 'react-icons/fa';
import {useHistory} from 'react-router-dom';

const TaskLists = () => {
  const [list, setList] = useState([]);
  const history = useHistory();

  async function getLists() {
    const res = await axios.get("http://localhost:3004/lists");
    setList(res.data);
  }

  useEffect(() => {
    getLists();
  }, [])

  const onFinish = async (values) => {
    const id = new Date();
    await api.post("/lists", 
    { id, name: values.lista });
    getLists();
  }

  async function onDelete(list_id) {
    const resp = await api.delete(`/lists/${list_id}`);
    if (resp.status === 200) {
      message.success("Lista deletada com sucesso!");
      getLists(); 
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Ações',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => {
        return (

          <Space>
            <Button onClick={() => history.push(`/list/${record.id}`)} icon={<FaList />}/> 
            <Popconfirm title="Tem certeza que deseja excluir?" onConfirm={() => onDelete(record.id)} okText="Sim" cancelText="Cancelar">
              <Button icon={<FaTrash />}/>
            </Popconfirm>
          </Space>
        );  
      }
    } 
  ]

  return (
    <>
      <PageHeader  title="Listas" subTitle="Minhas Lista de Tarefas" />

      <Form onFinish={onFinish}>
        <Row sm={20}>
          <Col sm={4}>
            <Form.Item name="lista" rules={[ { required: true, message: "É obrigatorio o nome da lista." } ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Button htmlType="submit">Criar</Button>
          </Col>
        </Row>
      </Form>
      
      <Table rowKey="id" dataSource={list} columns={columns} />
    </>
  );
};
export default TaskLists;
