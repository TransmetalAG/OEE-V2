import React, { useState } from "react";
import { catalogo } from "../data/catalogo";
import { operadores } from "../data/operadores";

export default function Captura() {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    maquina: "",
    inicio: "",
    fin: "",
    carretas: "",
    piezasTotales: "",
    piezasBuenas: "",
    paros: [],
  });

  const [nuevoParo, setNuevoParo] = useState({
    tipo: "",
    minutos: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCodigo = (e) => {
    const codigo = e.target.value;
    const op = operadores.find((o) => o.codigo === codigo);
    setForm({
      ...form,
      codigo,
      nombre: op ? op.nombre : "",
    });
  };

  const agregarParo = () => {
    if (!nuevoParo.tipo || !nuevoParo.minutos || !nuevoParo.descripcion) {
      alert("Debes completar tipo, minutos y descripción del paro.");
      return;
    }
    setForm({ ...form, paros: [...form.paros, nuevoParo] });
    setNuevoParo({ tipo: "", minutos: "", descripcion: "" });
  };

  const eliminarParo = (i) => {
    setForm({ ...form, paros: form.paros.filter((_, idx) => idx !== i) });
  };

  const guardar = () => {
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push(form);
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Registro guardado ✅");
    setForm({
      codigo: "",
      nombre: "",
      maquina: "",
      inicio: "",
      fin: "",
      carretas: "",
      piezasTotales: "",
      piezasBuenas: "",
      paros: [],
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Captura de Datos</h2>

      <label className="block font-semibold">Código de Operador</label>
      <input
        type="text"
        name="codigo"
        value={form.codigo}
        onChange={handleCodigo}
        className="border p-2 w-full mb-2"
      />

      <label className="block font-semibold">Nombre</label>
      <input
        type="text"
        value={form.nombre}
        disabled
        className="border p-2 w-full mb-2 bg-gray-100"
      />

      <label className="block font-semibold">Máquina / Proceso</label>
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
          <label className="block font-semibold">Hora Inicio</label>
          <input
            type="time"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Hora Fin</label>
          <input
            type="time"
            name="fin"
            value={form.fin}
            onChange={handleChange}
            className="border p-2 w-full mb-2"
          />
        </div>
      </div>

      <label className="block font-semibold">Carretas Programadas</label>
      <input
        type="number"
        name="carretas"
        value={form.carretas}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block font-semibold">Piezas Totales</label>
      <input
        type="number"
        name="piezasTotales"
        value={form.piezasTotales}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <label className="block font-semibold">Piezas Buenas</label>
      <input
        type="number"
        name="piezasBuenas"
        value={form.piezasBuenas}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

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
          <option value="Planeado">Planeado</option>
          <option value="Otro">Otro</option>
        </select>
        <input
          type="number"
          placeholder="Minutos"
          value={nuevoParo.minutos}
          onChange={(e) =>
            setNuevoParo({ ...nuevoParo, minutos: e.target.value })
          }
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoParo.descripcion}
          onChange={(e) =>
            setNuevoParo({ ...nuevoParo, descripcion: e.target.value })
          }
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
            <li
              key={i}
              className="flex justify-between items-center border p-2 mb-1"
            >
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
        Guardar Registro
      </button>
    </div>
  );
}
