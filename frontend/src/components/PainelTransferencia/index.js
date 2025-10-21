import React, { useState } from "react";
import api from "../../api/api";
import { Form, Button, Alert } from "react-bootstrap";

export default function Transferir() {
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/transactions/transfer", {
        accountNumber: toAccountId,
        amount: Number(amount),
      });
      setMessage(`✅ Transferência realizada: ${res.data.description}`);
    } catch {
      setMessage("❌ Erro ao transferir.");
    }
  };

  return (
    <div>
      <h5>💸 Transferir para outra conta</h5>
      <Form onSubmit={handleTransfer}>
        <Form.Group className="mb-2">
          <Form.Label>ID da conta destino</Form.Label>
          <Form.Control
            type="string"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Valor (R$)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Enviar</Button>
      </Form>
      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}
