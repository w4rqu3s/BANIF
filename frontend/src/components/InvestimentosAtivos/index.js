import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Button, Table } from "react-bootstrap";

export default function InvestimentosAtivos() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    async function fetchInvestments() {
      const res = await api.get("/investments/list");
      setInvestments(res.data);
    }
    fetchInvestments();
  }, []);

  async function handleWithdraw(id) {
    await api.post(`/investments/redeem`, {investmentId: id });
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "withdrawn" } : inv
      )
    );
  }

  return (
    <div>
      <h5>📊 Meus Investimentos</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.type}</td>
              <td>R$ {inv.amount}</td>
              <td>{inv.status}</td>
              <td>
                <Button
                  variant="warning"
                  disabled={inv.status !== "active"}
                  onClick={() => handleWithdraw(inv.id)}
                >
                  Sacar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
