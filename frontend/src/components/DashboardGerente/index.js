import React, { useState } from "react";
import { Button } from "react-bootstrap";
import CadastrarCliente from "../CadastrarCliente";
import ContasList from "../ClientList";

export default function DashboardGerente() {
  const [painel, setPainel] = useState("none");

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">👔 Painel do Gerente</h2>

      <div className="d-flex justify-content-center gap-3 mb-4">
        <Button onClick={() => setPainel("cadastrar")} variant="primary">
          Cadastrar Cliente
        </Button>
        <Button onClick={() => setPainel("contas")} variant="info">
          Ver Contas
        </Button>
      </div>

      {painel === "cadastrar" && <CadastrarCliente />}
      {painel === "contas" && <ContasList />}
    </div>
  );
}
