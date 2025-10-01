import React, { useEffect, useState } from "react";
import { catalogo } from "../data/catalogo";

export default function KPIs() {
  const [oee, setOee] = useState(null);

  useEffect(() => {
    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    if (registros.length === 0) return;

    // Tomamos el último registro guardado
    const r = registros[registros.length - 1];

    // Buscar EPH en el catálogo
    const maquina = catalogo.find((m) => m.maquina === r.maquina);
    const eph = maquina ? maquina.eph : 1;

    // Calcular tiempos
    const tiempoCalendario = 24 * 60; // 1440 min
    const inicio = new Date(`1970-01-01T${r.inicio}:00`);
    const fin = new Date(`1970-01-01T${r.fin}:00`);
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

    // Cálculo de tasas
    const disponibilidad = tiempoOperativo / tiempoProgramado;
    const desempeno = tiempoOperativoNeto / tiempoOperativo;
    const calidad = tiempoUtil / tiempoOperativoNeto;
    const oeeFinal = disponibilidad * desempeno * calidad;

    setOee({
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
      disponibilidad: (disponibilidad * 100).toFixed(1),
      desempeno: (desempeno * 100).toFixed(1),
      calidad: (calidad * 100).toFixed(1),
      oee: (oeeFinal * 100).toFixed(1),
    });
  }, []);

  if (!oee) {
    return <p className="p-4">No hay datos registrados todavía.</p>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">KPIs y OEE</h2>

      <table className="w-full border mb-4">
        <tbody>
          <tr><td className="border p-2">Tiempo Calendario</td><td className="border p-2">{oee.tiempoCalendario} min</td></tr>
          <tr><td className="border p-2">Tiempo Programado</td><td className="border p-2">{oee.tiempoProgramado} min</td></tr>
          <tr><td className="border p-2">Tiempo Libre</td><td className="border p-2">{oee.tiempoLibre} min</td></tr>
          <tr><td className="border p-2">Paros No Planeados</td><td className="border p-2">{oee.parosNoPlaneados} min</td></tr>
          <tr><td className="border p-2">Paros Planeados</td><td className="border p-2">{oee.parosPlaneados} min</td></tr>
          <tr><td className="border p-2">Tiempo Operativo</td><td className="border p-2">{oee.tiempoOperativo} min</td></tr>
          <tr><td className="border p-2">Tiempo Operativo Neto</td><td className="border p-2">{oee.tiempoOperativoNeto.toFixed(1)} min</td></tr>
          <tr><td className="border p-2">Pérdida de Ritmo</td><td className="border p-2">{oee.perdidaRitmo.toFixed(1)} min</td></tr>
          <tr><td className="border p-2">Pérdidas de Calidad</td><td className="border p-2">{oee.perdidasCalidad.toFixed(1)} min</td></tr>
          <tr><td className="border p-2">Tiempo Útil</td><td className="border p-2">{oee.tiempoUtil.toFixed(1)} min</td></tr>
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2">Tasas</h3>
      <p>Disponibilidad: {oee.disponibilidad}%</p>
      <p>Desempeño: {oee.desempeno}%</p>
      <p>Calidad: {oee.calidad}%</p>
      <p className="font-bold text-xl mt-2">OEE: {oee.oee}%</p>
    </div>
  );
}
