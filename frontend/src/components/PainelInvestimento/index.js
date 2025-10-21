import React, { useState } from "react";
import api from "../../api/api";
import { Form, Button, Alert } from "react-bootstrap";

export default function Investir() {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("poupanca");
  const [message, setMessage] = useState("");

  const handleInvest = async (e) => {
    e.preventDefault();
    try {
      await api.post("/investments/invest", { amount: Number(amount), type });
      setMessage("✅ Investimento criado com sucesso!");
    } catch {
      setMessage("❌ Erro ao investir.");
    }
  };

  return (
    <div>
      <h5>📈 Novo investimento</h5>
      <Form onSubmit={handleInvest}>
        <Form.Group className="mb-2">
          <Form.Label>Valor (R$)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Tipo</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="poupanca">Poupança</option>
            <option value="cdb">CDB</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit">Investir</Button>
      </Form>
      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}
