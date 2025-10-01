import React, { useState } from "react";
import { catalogo } from "../data/catalogo";
import { operadores } from "../data/operadores";

export default function Captura() {
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    codigo: "",
    nombre: "",
    maquina: "",
    proceso: "",
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

  // Cambios generales
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Buscar operador por código
  const handleCodigo = (e) => {
    const codigo = e.target.value;
    const op = operadores.find((o) => o.codigo === codigo);
    setForm({
      ...form,
      codigo,
      nombre: op ? op.nombre : "",
    });
  };

  // Agregar paro solo si está completo
  const agregarParo = () => {
    if (!nuevoParo.tipo || !nuevoParo.minutos || !nuevoParo.descripcion) {
      alert("Debes completar tipo, minutos y descripción del paro.");
      return;
    }
    setForm({ ...form, paros: [...form.paros, nuevoParo] });
    setNuevoParo({ tipo: "", minutos: "", descripcion: "" });
  };

  // Eliminar paro
  const eliminarParo = (i) => {
    setForm({ ...form, paros: form.paros.filter((_, idx) => idx !== i) });
  };

  // Validar y guardar en localStorage
  const guardar = () => {
    if (
      !form.fecha ||
      !form.codigo ||
      !form.nombre ||
      !form.maquina ||
      !form.proceso ||
      !form.inicio ||
      !form.fin ||
      !form.carretas ||
      !form.piezasTotales ||
      !form.piezasBuenas
    ) {
      alert("⚠️ Debes completar todos los campos antes de guardar.");
      return;
    }

    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push(form);
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Registro guardado ✅");

    setForm({
      fecha: new Date().toISOString().split("T")[0],
      codigo: "",
      nombre: "",
      maquina: "",
      proceso: "",
      inicio: "",
      fin: "",
      carretas: "",
      piezasTotales: "",
      piezasBuenas: "",
      paros: [],
    });
  };

  return (
    <div className="p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Registro de Producción</h2>

      {/* Fecha */}
      <label className="block font-semibold">Fecha</label>
      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
      />

      {/* Código operador */}
      <label className="block font-semibold">Código de Operador</label>
      <input
        type="text"
        name="codigo"
        value={form.codigo}
        onChange={handleCodigo}
        className="border p-2 w-full mb-2 rounded-none"
      />

      <label className="block font-semibold">Nombre</label>
      <input
        type="text"
        value={form.nombre}
        disabled
        className="border p-2 w-full mb-2 bg-gray-100 rounded-none"
      />

      {/* Máquina */}
      <label className="block font-semibold">Máquina</label>
      <select
        name="maquina"
        value={form.maquina}
        onChange={(e) =>
          setForm({ ...form, maquina: e.target.value, proceso: "" })
        }
        className="border p-2 w-full mb-2 rounded-none"
      >
        <option value="">Seleccione máquina...</option>
        {[...new Set(catalogo.map((m) => m.maquina))].map((maq, i) => (
          <option key={i} value={maq}>
            {maq}
          </option>
        ))}
      </select>

      {/* Proceso */}
      <label className="block font-semibold">Proceso / Pieza</label>
      <select
        name="proceso"
        value={form.proceso}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
        disabled={!form.maquina}
      >
        <option value="">Seleccione proceso...</option>
        {catalogo
          .filter((m) => m.maquina === form.maquina)
          .map((m, i) => (
            <option key={i} value={m.proceso}>
              {m.proceso}
            </option>
          ))}
      </select>

      {/* Horarios */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-semibold">Hora Inicio</label>
          <input
            type="time"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Hora Fin</label>
          <input
            type="time"
            name="fin"
            value={form.fin}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
      </div>

      {/* Carretas */}
      <label className="block font-semibold">Carretas Programadas</label>
      <input
        type="number"
        name="carretas"
        value={form.carretas}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
      />

      {/* Piezas */}
      <label className="block font-semibold">Piezas Totales</label>
      <input
        type="number"
        name="piezasTotales"
        value={form.piezasTotales}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
      />

      <label className="block font-semibold">Piezas Buenas</label>
      <input
        type="number"
        name="piezasBuenas"
        value={form.piezasBuenas}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
      />

      {/* Paros */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Paros</h3>
        <select
          value={nuevoParo.tipo}
          onChange={(e) => setNuevoParo({ ...nuevoParo, tipo: e.target.value })}
          className="border p-2 w-full mb-2 rounded-none"
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
          className="border p-2 w-full mb-2 rounded-none"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoParo.descripcion}
          onChange={(e) =>
            setNuevoParo({ ...nuevoParo, descripcion: e.target.value })
          }
          className="border p-2 w-full mb-2 rounded-none"
        />
        <button
          onClick={agregarParo}
          className="bg-blue-600 text-white px-4 py-2 rounded-none"
        >
          Agregar paro
        </button>

        <ul className="mt-2">
          {form.paros.map((p, i) => (
            <li
              key={i}
              className="flex justify-between items-center border p-2 mb-1 rounded-none"
            >
              <span>
                {p.tipo} - {p.minutos} min - {p.descripcion}
              </span>
              <button
                onClick={() => eliminarParo(i)}
                className="bg-red-600 text-white px-2 py-1 rounded-none"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón Guardar */}
      <button
        onClick={guardar}
        className="bg-green-600 text-white px-4 py-2 rounded-none mt-4"
      >
        Guardar Registro
      </button>
    </div>
  );
}
