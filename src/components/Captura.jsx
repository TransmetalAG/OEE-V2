import React, { useState } from "react";
import { catalogo } from "../data/catalogo";
import { operadores } from "../data/operadores";

export default function Captura() {
  const [form, setForm] = useState({
    fecha: "",
    codigo: "",
    nombre: "",
    maquina: "",
    inicio: "",
    fin: "",
    carretas: 0,
    piezasTotales: 0,
    piezasBuenas: 0,
    paros: [],
  });

  const [nuevoParo, setNuevoParo] = useState({
    tipo: "",
    minutos: "",
    descripcion: "",
  });

  // Manejo de inputs normales
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Autocompletar nombre de operador por código
  const handleCodigo = (e) => {
    const codigo = e.target.value;
    const op = operadores.find((o) => o.codigo === codigo);
    setForm({
      ...form,
      codigo,
      nombre: op ? op.nombre : "",
    });
  };

  // Agregar paro
  const agregarParo = () => {
    if (!nuevoParo.tipo || !nuevoParo.minutos || !nuevoParo.descripcion) {
      alert("Debes completar todos los campos del paro.");
      return;
    }
    setForm({ ...form, paros: [...form.paros, nuevoParo] });
    setNuevoParo({ tipo: "", minutos: "", descripcion: "" });
  };

  // Eliminar paro
  const eliminarParo = (i) => {
    setForm({ ...form, paros: form.paros.filter((_, idx) => idx !== i) });
  };

  // Guardar registro en localStorage
  const guardar = () => {
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push(form);
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Registro guardado exitosamente ✅");
    setForm({
      fecha: "",
      codigo: "",
      nombre: "",
      maquina: "",
      inicio: "",
      fin: "",
      carretas: 0,
      piezasTotales: 0,
      piezasBuenas: 0,
      paros: [],
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Captura de Producción</h2>

      <label>Código operador</label>
      <input
        type="text"
        name="codigo"
        value={form.codigo}
        onChange={handleCodigo}
        className="border p-2 w-full mb-2"
      />

      <label>Nombre</label>
      <input
        type="text"
        value={form.nombre}
        disabled
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      <label>Máquina</label>
      <select
        name="maquina"
        value={form.maquina}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Seleccione...</option>
        {catalogo.map((m, i) => (
          <option key={i} value={m.maquina}>
            {m.maquina} • {m.proceso}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <div className="flex-1">
          <label>Hora inicio</label>
          <input
            type="time"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
        </div>
        <div className="flex-1">
          <label>Hora fin</label>
          <input
            type="time"
            name="fin"
            value={form.fin}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
        </div>
      </div>

      <label>Carretas programadas</label>
      <input
        type="number"
        name="carretas"
        value={form.carretas}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label>Piezas Totales</label>
      <input
        type="number"
        name="piezasTotales"
        value={form.piezasTotales}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label>Piezas Buenas</label>
      <input
        type="number"
        name="piezasBuenas"
        value={form.piezasBuenas}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      {/* Paros */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Paros</h3>
        <select
          value={nuevoParo.tipo}
          onChange={(e) => setNuevoParo({ ...nuevoParo, tipo: e.target.value })}
          className="border p-2 w-full mb-2"
        >
          <option value="">Seleccione tipo</option>
          <option value="Mecánico">Mecánico</option>
          <option value="Eléctrico">Eléctrico</option>
          <option value="Planeado">Paro Planeado</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          type="number"
          placeholder="Minutos"
          value={nuevoParo.minutos}
          onChange={(e) => setNuevoParo({ ...nuevoParo, minutos: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoParo.descripcion}
          onChange={(e) => setNuevoParo({ ...nuevoParo, descripcion: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button
          onClick={agregarParo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar paro
        </button>

        <ul className="mt-2">
          {form.paros.map((p, i) => (
            <li key={i} className="flex justify-between items-center border p-2 mb-1">
              <span>
                {p.tipo} - {p.minutos} min - {p.descripcion}
              </span>
              <button
                onClick={() => eliminarParo(i)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={guardar}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Guardar registro
      </button>
    </div>
  );
}
