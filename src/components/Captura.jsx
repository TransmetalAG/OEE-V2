import React, { useState } from "react";
import { catalogo } from "../data/catalogo";
import { operadores } from "../data/operadores";

export default function Captura() {
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    maquina: "",
    proceso: "",
    fecha: new Date().toISOString().slice(0, 10),
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
    if (!form.maquina || !form.proceso) {
      alert("Debes seleccionar máquina y proceso.");
      return;
    }
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push(form);
    localStorage.setItem("registros", JSON.stringify(registros));
    alert("Registro guardado ✅");
    setForm({
      codigo: "",
      nombre: "",
      maquina: "",
      proceso: "",
      fecha: new Date().toISOString().slice(0, 10),
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

      {/* Máquina */}
      <label className="block font-semibold">Máquina</label>
      <select
        name="maquina"
        value={form.maquina}
        onChange={handleChange}
        className="border p-2 w-full mb-2 rounded-none"
      >
        <option value="">Seleccione...</option>
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
      >
        <option value="">Seleccione...</option>
        {catalogo
          .filter((m) => m.maquina === form.maquina)
          .map((m, i) => (
            <option key={i} value={m.proceso}>
              {m.proceso}
            </option>
          ))}
      </select>

      {/* Fecha y Operador */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-semibold">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Código operador</label>
          <input
            type="text"
            name="codigo"
            value={form.codigo}
            onChange={handleCodigo}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
      </div>

      <label className="block font-semibold">Nombre y apellido</label>
      <input
        type="text"
        value={form.nombre}
        disabled
        className="border p-2 w-full mb-2 bg-gray-100 rounded-none"
      />

      {/* Horas */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-semibold">Hora inicio</label>
          <input
            type="time"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Hora fin</label>
          <input
            type="time"
            name="fin"
            value={form.fin}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Carretas programadas</label>
          <input
            type="number"
            name="carretas"
            value={form.carretas}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
      </div>

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
          className="bg-blue-600 text-white px-4 py-2 mb-2"
        >
          + Agregar paro
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
                className="bg-red-600 text-white px-2 py-1"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Piezas */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-semibold">Piezas totales</label>
          <input
            type="number"
            name="piezasTotales"
            value={form.piezasTotales}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
        <div className="flex-1">
          <label className="block font-semibold">Piezas buenas</label>
          <input
            type="number"
            name="piezasBuenas"
            value={form.piezasBuenas}
            onChange={handleChange}
            className="border p-2 w-full mb-2 rounded-none"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={guardar}
          className="bg-green-600 text-white px-4 py-2"
        >
          Guardar registro
        </button>
        <button
          onClick={() =>
            setForm({
              codigo: "",
              nombre: "",
              maquina: "",
              proceso: "",
              fecha: new Date().toISOString().slice(0, 10),
              inicio: "",
              fin: "",
              carretas: "",
              piezasTotales: "",
              piezasBuenas: "",
              paros: [],
            })
          }
          className="bg-gray-600 text-white px-4 py-2"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  );
}
