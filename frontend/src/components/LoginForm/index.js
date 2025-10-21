import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3333/auth/login", formData);

      // salva token e role localmente
      const token = res.data.token.token || res.data.token;
      const role = res.data.user.role;
      console.log(res, token, role)

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // redireciona conforme papel
      if (role === "manager") navigate("/gerente");
      else navigate("/cliente");
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleSubmit}
        className="p-4 shadow rounded bg-white"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-4">BANIF - Login</h3>

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p
          className="text-center mt-3 text-secondary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Não tem uma conta? Cadastre-se
        </p>
      </form>
    </div>
  );
}
