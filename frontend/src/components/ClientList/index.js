import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Table, Spinner } from "react-bootstrap";

export default function ContasList() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContas() {
      try {
        const res = await api.get("/accounts");
        setContas(res.data);
      } catch (err) {
        console.error("Erro ao carregar contas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContas();
  }, []);

  return (
    <div>
      <h5>📋 Lista de Contas</h5>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID Conta</th>
              <th>Número</th>
              <th>Cliente</th>
              <th>Saldo (R$)</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta) => (
              <tr key={conta.id}>
                <td>{conta.id}</td>
                <td>{conta.accountNumber}</td>
                <td>{conta.user?.name || "—"}</td>
                <td>{Number(conta.balance).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
