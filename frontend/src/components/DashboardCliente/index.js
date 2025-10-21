import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import Extrato from "../Extrato";
import Investir from "../PainelInvestimento";
import Transferir from "../PainelTransferencia";
import InvestimentosAtivos from "../InvestimentosAtivos";
import api from "../../api/api";

export default function DashboardCliente() {
  const [saldo, setSaldo] = useState(0);
  const [painel, setPainel] = useState("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaldo() {
      try {
        const res = await api.get("/accounts/me");
        setSaldo(res.data.balance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSaldo();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">🏦 BANIF - Painel do Cliente</h2>

      <Card className="p-3 text-center mb-4">
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <h4>
            Saldo atual:{" "}
            <span className="text-success">
              R$ {Number(saldo).toFixed(2)}
            </span>
          </h4>
        )}
      </Card>

      <div className="d-flex justify-content-around flex-wrap gap-2 mb-3">
        <Button onClick={() => setPainel("transferir")} variant="primary">
          Transferir
        </Button>
        <Button onClick={() => setPainel("investir")} variant="success">
          Investir
        </Button>
        <Button onClick={() => setPainel("ativos")} variant="info">
          Meus Investimentos
        </Button>
        <Button onClick={() => setPainel("extrato")} variant="secondary">
          Extrato
        </Button>
      </div>

      <div className="mt-4">
        {painel === "transferir" && <Transferir />}
        {painel === "investir" && <Investir />}
        {painel === "ativos" && <InvestimentosAtivos />}
        {painel === "extrato" && <Extrato />}
      </div>
    </div>
  );
}
