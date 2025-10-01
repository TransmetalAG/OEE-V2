import React, { useEffect, useState } from "react";
import { catalogo } from "../data/catalogo";

export default function KPIs() {
  const [registros, setRegistros] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("registros") || "[]");
    setRegistros(data);
  }, []);

  const calcularOEE = (r) => {
    const maquina = catalogo.find(
      (m) => m.maquina === r.maquina && m.proceso === r.proceso
    );
    const eph = maquina && maquina.eph ? Number(maquina.eph) : 1;

    const tiempoCalendario = 24 * 60;
    const inicio = new Date(`1970-01-01T${r.inicio || "00:00"}:00`);
    const fin = new Date(`1970-01-01T${r.fin || "00:00"}:00`);
    const tiempoProgramado = (fin - inicio) / 60000;

    const tiempoLibre = tiempoCalendario - tiempoProgramado;

    const parosNoPlaneados = r.paros
      .filter((p) => p.tipo !== "Planeado")
      .reduce((a, b) => a + Number(b.minutos), 0);

    const parosPlaneados = r.paros
      .filter((p) => p.tipo === "Planeado")
      .reduce((a, b) => a + Number(b.minutos), 0);

    const tiempoOperativo = tiempoProgramado - parosNoPlaneados - parosPlaneados;
    const tiempoOperativoNeto = r.piezasTotales / eph;
    const perdidaRitmo = tiempoOperativo - tiempoOperativoNeto;
    const perdidasCalidad = (r.piezasTotales - r.piezasBuenas) / eph;
    const tiempoUtil = tiempoOperativoNeto - perdidasCalidad;

    const disponibilidad = tiempoProgramado > 0 ? tiempoOperativo / tiempoProgramado : 0;
    const desempeno = tiempoOperativo > 0 ? tiempoOperativoNeto / tiempoOperativo : 0;
    const calidad = tiempoOperativoNeto > 0 ? tiempoUtil / tiempoOperativoNeto : 0;
    const oeeFinal = disponibilidad * desempeno * calidad;

    return {
      tiempoCalendario,
      tiempoProgramado,
      tiempoLibre,
      parosNoPlaneados,
      parosPlaneados,
      tiempoOperativo,
      tiempoOperativoNeto,
      perdidaRitmo,
      perdidasCalidad,
      tiempoUtil,
      disponibilidad,
      desempeno,
      calidad,
      oee: oeeFinal,
    };
  };

  const registrosFiltrados = fechaFiltro
    ? registros.filter((r) => r.fecha === fechaFiltro)
    : registros;

  if (registros.length === 0) {
    return <p className="p-4">No hay datos registrados todavía.</p>;
  }

  // --- Calcular totales ponderados ---
  const totales = registrosFiltrados.reduce(
    (acc, r) => {
      const oee = calcularOEE(r);
      acc.programado += oee.tiempoProgramado;
      acc.operativo += oee.tiempoOperativo;
      acc.neto += oee.tiempoOperativoNeto;
      acc.util += oee.tiempoUtil;
      return acc;
    },
    { programado: 0, operativo: 0, neto: 0, util: 0 }
  );

  const disponibilidadPond = totales.programado > 0 ? totales.operativo / totales.programado : 0;
  const desempenoPond = totales.operativo > 0 ? totales.neto / totales.operativo : 0;
  const calidadPond = totales.neto > 0 ? totales.util / totales.neto : 0;
  const oeePond = disponibilidadPond * desempenoPond * calidadPond;

  return (
    <div className="p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">KPIs y OEE por Máquina</h2>

      {/* Filtro por fecha */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Filtrar por fecha:</label>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          className="border p-2"
        />
        {fechaFiltro && (
          <button
            onClick={() => setFechaFiltro("")}
            className="ml-2 bg-gray-300 px-3 py-1 rounded"
          >
            Quitar filtro
          </button>
        )}
      </div>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Máquina</th>
            <th className="border p-2">Proceso</th>
            <th className="border p-2">Tiempo Programado</th>
            <th className="border p-2">Tiempo Operativo</th>
            <th className="border p-2">Tiempo Operativo Neto</th>
            <th className="border p-2">Tiempo Útil</th>
            <th className="border p-2">Disponibilidad</th>
            <th className="border p-2">Desempeño</th>
            <th className="border p-2">Calidad</th>
            <th className="border p-2">OEE</th>
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((r, i) => {
            const oee = calcularOEE(r);
            return (
              <tr key={i} className="text-center">
                <td className="border p-2">{r.fecha}</td>
                <td className="border p-2">{r.maquina}</td>
                <td className="border p-2">{r.proceso}</td>
                <td className="border p-2">{oee.tiempoProgramado}</td>
                <td className="border p-2">{oee.tiempoOperativo}</td>
                <td className="border p-2">{oee.tiempoOperativoNeto.toFixed(1)}</td>
                <td className="border p-2">{oee.tiempoUtil.toFixed(1)}</td>
                <td className="border p-2">{(oee.disponibilidad * 100).toFixed(1)}%</td>
                <td className="border p-2">{(oee.desempeno * 100).toFixed(1)}%</td>
                <td className="border p-2">{(oee.calidad * 100).toFixed(1)}%</td>
                <td className="border p-2 font-bold">{(oee.oee * 100).toFixed(1)}%</td>
              </tr>
            );
          })}

          {/* Fila de totales ponderados */}
          <tr className="bg-gray-200 font-bold text-center">
            <td className="border p-2" colSpan="3">TOTAL (Ponderado)</td>
            <td className="border p-2">{totales.programado.toFixed(1)}</td>
            <td className="border p-2">{totales.operativo.toFixed(1)}</td>
            <td className="border p-2">{totales.neto.toFixed(1)}</td>
            <td className="border p-2">{totales.util.toFixed(1)}</td>
            <td className="border p-2">{(disponibilidadPond * 100).toFixed(1)}%</td>
            <td className="border p-2">{(desempenoPond * 100).toFixed(1)}%</td>
            <td className="border p-2">{(calidadPond * 100).toFixed(1)}%</td>
            <td className="border p-2">{(oeePond * 100).toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
