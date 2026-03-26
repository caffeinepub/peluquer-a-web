import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CalendarCheck, MessageCircle, Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Reserva {
  id: string;
  nombre: string;
  telefono: string;
  fecha: string;
  hora: string;
  servicios: string[];
  total: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  mensajeWhatsApp: string;
}

const SERVICIOS = [
  { id: "Corte", label: "Corte de cabello", precio: 15 },
  { id: "Barba", label: "Barba", precio: 10 },
  { id: "Color", label: "Coloración", precio: 25 },
];

const STORAGE_KEY = "reservas";
const DEFAULT_MENSAJE = "Hola {nombre}, tu reserva es el {fecha} a las {hora}.";

function loadReservas(): Reserva[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reserva[]) : [];
  } catch {
    return [];
  }
}

function saveReservas(list: Reserva[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function App() {
  const [reservas, setReservas] = useState<Reserva[]>(loadReservas);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [mensajeWA, setMensajeWA] = useState(DEFAULT_MENSAJE);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    saveReservas(reservas);
  }, [reservas]);

  const total = seleccionados.reduce((acc, s) => {
    const srv = SERVICIOS.find((x) => x.id === s);
    return acc + (srv ? srv.precio : 0);
  }, 0);

  function toggleServicio(id: string) {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function resetForm() {
    setNombre("");
    setTelefono("");
    setFecha("");
    setHora("");
    setSeleccionados([]);
    setMensajeWA(DEFAULT_MENSAJE);
  }

  function handleReservar(e: React.FormEvent) {
    e.preventDefault();
    if (seleccionados.length === 0) {
      toast.error("Selecciona al menos un servicio.");
      return;
    }
    const nueva: Reserva = {
      id: Date.now().toString(),
      nombre,
      telefono,
      fecha,
      hora,
      servicios: seleccionados,
      total,
      estado: "pendiente",
      mensajeWhatsApp: mensajeWA,
    };
    setReservas((prev) => [...prev, nueva]);
    setExito(true);
    toast.success(`¡Reserva creada para ${nombre}!`);
    resetForm();
    setTimeout(() => setExito(false), 4000);
  }

  function confirmarReserva(id: string) {
    const r = reservas.find((x) => x.id === id);
    setReservas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: "confirmada" } : item,
      ),
    );
    if (r) {
      const msg = r.mensajeWhatsApp
        .replace(/\{nombre\}/g, r.nombre)
        .replace(/\{fecha\}/g, r.fecha)
        .replace(/\{hora\}/g, r.hora);
      const url = `https://wa.me/${r.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
      toast.success(`Reserva de ${r.nombre} confirmada. Abriendo WhatsApp…`);
    }
  }

  function cancelarReserva(id: string) {
    setReservas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, estado: "cancelada" } : item,
      ),
    );
    toast.error("Reserva cancelada.");
  }

  function estadoBadge(estado: Reserva["estado"]) {
    if (estado === "confirmada")
      return (
        <Badge className="bg-green-700 text-white hover:bg-green-700">
          Confirmada
        </Badge>
      );
    if (estado === "cancelada")
      return <Badge variant="destructive">Cancelada</Badge>;
    return (
      <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">
        Pendiente
      </Badge>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <header className="border-b border-border bg-card/80 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <Scissors className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-primary leading-none">
              Peluquería
            </h1>
            <p className="text-xs text-muted-foreground">Sistema de Reservas</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-10">
        {/* FORM SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <CalendarCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-semibold">
              Nueva Reserva
            </h2>
          </div>

          {exito && (
            <div className="mb-4 rounded-lg bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 text-sm">
              ✅ ¡Reserva registrada con éxito! Aparece en la tabla a
              continuación.
            </div>
          )}

          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <form
                onSubmit={handleReservar}
                data-ocid="reserva.form"
                className="space-y-5"
              >
                {/* Nombre */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    data-ocid="reserva.input"
                    placeholder="Ej: María García"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">
                    Teléfono (con código de país)
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    data-ocid="reserva.input"
                    placeholder="Ej: 5491123456789"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Sin espacios ni guiones. Se usará para WhatsApp.
                  </p>
                </div>

                {/* Servicios con checkboxes */}
                <div className="space-y-2">
                  <Label>Servicios</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {SERVICIOS.map((s) => (
                      <div
                        key={s.id}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          seleccionados.includes(s.id)
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background"
                        }`}
                      >
                        <Checkbox
                          id={`srv-${s.id}`}
                          data-ocid="reserva.checkbox"
                          checked={seleccionados.includes(s.id)}
                          onCheckedChange={() => toggleServicio(s.id)}
                        />
                        <Label
                          htmlFor={`srv-${s.id}`}
                          className="cursor-pointer flex-1 space-y-0.5"
                        >
                          <span className="text-sm font-medium block">
                            {s.label}
                          </span>
                          <span className="text-xs text-primary font-semibold block">
                            ${s.precio}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  {seleccionados.length > 0 && (
                    <p className="text-sm font-semibold text-primary">
                      Total: ${total}
                    </p>
                  )}
                </div>

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      data-ocid="reserva.input"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      data-ocid="reserva.input"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mensaje WhatsApp */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="mensajeWA"
                    className="flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    Mensaje de recordatorio (WhatsApp)
                  </Label>
                  <Textarea
                    id="mensajeWA"
                    data-ocid="reserva.textarea"
                    value={mensajeWA}
                    onChange={(e) => setMensajeWA(e.target.value)}
                    rows={2}
                    placeholder="Usa {nombre}, {fecha}, {hora} como variables"
                  />
                  <p className="text-xs text-muted-foreground">
                    Variables:{" "}
                    <code className="text-primary">&#123;nombre&#125;</code>,{" "}
                    <code className="text-primary">&#123;fecha&#125;</code>,{" "}
                    <code className="text-primary">&#123;hora&#125;</code>
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button
                    type="submit"
                    data-ocid="reserva.submit_button"
                    className="flex-1 font-semibold"
                  >
                    Reservar turno
                  </Button>
                  <Button
                    type="button"
                    data-ocid="reserva.secondary_button"
                    variant="outline"
                    className="flex-1"
                    onClick={resetForm}
                  >
                    Hacer otra reserva
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* TABLE SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <CalendarCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-2xl font-semibold">
              Reservas registradas
            </h2>
            <Badge variant="secondary" className="ml-auto">
              {reservas.length}
            </Badge>
          </div>

          {reservas.length === 0 ? (
            <div
              data-ocid="reservas.empty_state"
              className="text-center py-16 rounded-xl border border-dashed border-border text-muted-foreground"
            >
              <Scissors className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">¡Aún no hay reservas. Crea la primera!</p>
            </div>
          ) : (
            <div
              className="overflow-x-auto rounded-xl border border-border"
              data-ocid="reservas.table"
            >
              <Table>
                <TableHeader>
                  <TableRow className="bg-card hover:bg-card">
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Servicios</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservas.map((r, i) => (
                    <TableRow key={r.id} data-ocid={`reservas.item.${i + 1}`}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {r.nombre}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {r.telefono}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {r.fecha}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {r.hora}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {r.servicios.join(", ")}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-primary">
                        ${r.total}
                      </TableCell>
                      <TableCell>{estadoBadge(r.estado)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {r.estado !== "confirmada" &&
                            r.estado !== "cancelada" && (
                              <Button
                                size="sm"
                                data-ocid={`reservas.confirm_button.${i + 1}`}
                                className="bg-green-700 hover:bg-green-600 text-white h-8 px-3 text-xs"
                                onClick={() => confirmarReserva(r.id)}
                              >
                                Confirmar
                              </Button>
                            )}
                          {r.estado !== "cancelada" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              data-ocid={`reservas.delete_button.${i + 1}`}
                              className="h-8 px-3 text-xs"
                              onClick={() => cancelarReserva(r.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border mt-12 py-5">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Hecho con ❤️ usando{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
