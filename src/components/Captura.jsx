<label className="block font-semibold">Máquina</label>
<select
  name="maquina"
  value={form.maquina}
  onChange={handleChange}
  className="border p-2 w-full mb-2"
>
  <option value="">Seleccione máquina...</option>
  {catalogo.map((m, i) => (
    <option key={i} value={m.maquina}>
      {m.maquina}
    </option>
  ))}
</select>

<label className="block font-semibold">Proceso / Pieza</label>
<select
  name="proceso"
  value={form.proceso || ""}
  onChange={(e) =>
    setForm({
      ...form,
      proceso: e.target.value,
      // guardamos también el eph del proceso
      eph:
        catalogo
          .find((m) => m.maquina === form.maquina)
          ?.procesos.find((p) => p.nombre === e.target.value)?.eph || 0,
    })
  }
  className="border p-2 w-full mb-2"
  disabled={!form.maquina} // deshabilitado si no hay máquina
>
  <option value="">Seleccione proceso...</option>
  {catalogo
    .find((m) => m.maquina === form.maquina)
    ?.procesos.map((p, i) => (
      <option key={i} value={p.nombre}>
        {p.nombre}
      </option>
    ))}
</select>
