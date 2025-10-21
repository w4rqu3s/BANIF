import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Table } from "react-bootstrap";

import { DateTime } from 'luxon'

export default function Extrato() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchExtrato() {
      const res = await api.get("/accounts/history");
      setItems(res.data.history || []);
    }
    fetchExtrato();
  }, []);

  return (
    <div>
      <h5>🧾 Extrato de Movimentações</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.record_id}>
              <td>{DateTime.fromISO(i.created_at).toLocaleString(DateTime.DATE_SHORT)}</td>
              <td>{i.description}</td>
              <td
                className={
                  ["deposit", "transfer_in", "investment_redeemed", "yield"].includes(i.type)
                    ? "text-success fw-bold"
                    : "text-danger fw-bold"
                }
              >
                {["deposit", "transfer_in", "investment_redeemed", "yield"].includes(i.type) ? "+" : "-"} R${" "}
                {Number(i.amount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
