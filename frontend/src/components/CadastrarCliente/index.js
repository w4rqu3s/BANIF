import React, { useState } from "react";
import api from "../../api/api";
import { Form, Button, Alert } from "react-bootstrap";

export default function CadastrarCliente() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cpf: "",
    adress: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        adress: formData.adress,
        role: "client", // o gerente só pode criar clientes
      });

      setMessage("✅ Cliente cadastrado com sucesso!");
      setFormData({ name: "", email: "", password: "", cpf: "", adress: ""});
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao cadastrar cliente." + err);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div>
      <h5>🧾 Cadastrar Novo Cliente</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>CPF</Form.Label>
          <Form.Control
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </Form>

      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}
