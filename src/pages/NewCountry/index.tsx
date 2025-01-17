import React, { useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Header from '../../components/Header';

import { Container, Title } from './styles';

interface FormData {
  nome: string;
  sigla: string;
  gentilico: string;
}

const NewCountry: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const token = localStorage.getItem('@CadastroDePaises:token');
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: FormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          nome: Yup.string().required('Preencha o nome do País'),
          sigla: Yup.string()
            .required('Preencha a sigla')
            .max(2, 'A sigla deve conter apenas 2 caracteres'),
          gentilico: Yup.string().required('Preencha o gentílico'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('pais/salvar', data, {
          params: {
            token,
          },
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }
      }
    },
    [history, token],
  );
  return (
    <>
      <Header />
      <Container>
        <Title>Novo País</Title>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <Input name="nome" placeholder="Nome do País" />

          <Input name="sigla" placeholder="Sigla" maxLength={2} />

          <Input name="gentilico" placeholder="Gentílico" />

          <Button type="submit">Salvar</Button>

          <Link to="/dashboard">Cancelar</Link>
        </Form>
      </Container>
    </>
  );
};

export default NewCountry;
