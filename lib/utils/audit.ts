import { supabase } from "@/lib/supabaseClient"

interface AuditLog {
  user_id: string
  action: string
  resource: string
  details: Record<string, any>
  timestamp: string
}

export async function createAuditLog(log: Omit<AuditLog, "timestamp">) {
  try {
    const { error } = await supabase.from("audit_logs").insert({
      ...log,
      timestamp: new Date().toISOString(),
    })

    if (error) throw error
  } catch (error) {
    console.error("Failed to create audit log:", error)
  }
}

export async function getAuditLogs(userId: string) {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Failed to fetch audit logs:", error)
    return []
  }
}