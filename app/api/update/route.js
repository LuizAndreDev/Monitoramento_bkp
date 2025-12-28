// app/api/update/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Aceita variações e normaliza
function normalizeStatus(s) {
  const v = String(s || "").toLowerCase().trim();
  if (v === "sucesso") return "ok";
  if (v === "erro") return "erro";
  if (v === "warning" || v === "alerta") return "warning";
  if (v === "ok") return "ok";
  return "warning";
}

function toStr(v, maxLen) {
  if (v === null || v === undefined) return null;
  return String(v).slice(0, maxLen);
}

export async function POST(req) {
  try {
    const token = req.headers.get("x-monitor-token");
    if (!token || token !== process.env.MONITOR_TOKEN) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid json" }, { status: 400 });
    }

    // ✅ Agora o identificador “oficial” é client_name
    const client_name = toStr(body.client_name ?? body.database_id ?? body.client_code, 120)?.trim();
    const status = normalizeStatus(body.status);
    const message = toStr(body.message, 500);
    const machine_ip = toStr(body.machine_ip, 120);
    const disk_free_gb = toStr(body.disk_free_gb, 50);

    const arquivo_nome = toStr(body.arquivo_nome, 260);
    const tamanho_bytes =
      body.tamanho_bytes === null || body.tamanho_bytes === undefined || String(body.tamanho_bytes).trim() === ""
        ? null
        : Number(body.tamanho_bytes);

    if (!client_name) {
      return NextResponse.json({ error: "missing client_name" }, { status: 400 });
    }

    // ✅ Upsert por client_name (id bigint identity fica por conta do banco)
    const { data: dbRow, error: upErr } = await supabase
      .from("databases")
      .upsert(
        {
          client_name,
          status,
          message,
          machine_ip,
          disk_free_gb,
          last_update: new Date().toISOString(),
        },
        { onConflict: "client_name" }
      )
      .select("id, client_name")
      .single();

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    // ✅ Auditoria em logs_backup (não inclui database_id pq sua tabela não tem essa coluna no print)
    const { error: logErr } = await supabase.from("logs_backup").insert({
      cliente_nome: client_name,
      status,
      mensagem: message,
      arquivo_nome,
      tamanho_bytes: Number.isFinite(tamanho_bytes) ? tamanho_bytes : null,
      created_at: new Date().toISOString(),
    });

    if (logErr) {
      // não derruba a request principal, mas registra em console
      console.error("logs_backup insert error:", logErr);
    }

    return NextResponse.json(
      { success: true, id: String(dbRow.id), client_name: dbRow.client_name },
      { status: 200 }
    );
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: e?.message || "Internal Server Error" }, { status: 500 });
  }
}
