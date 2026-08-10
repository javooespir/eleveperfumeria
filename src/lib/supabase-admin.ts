import { createClient } from "@supabase/supabase-js";

// Cliente server-only con service_role key (bypassa RLS). Nunca importar
// desde un componente "use client" ni exponer esta key con prefijo NEXT_PUBLIC_.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export const PRODUCT_IMAGES_BUCKET = "product-images";

let bucketReady = false;

export async function ensureProductImagesBucket() {
  if (bucketReady) return;
  const supabase = supabaseAdmin();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b) => b.name === PRODUCT_IMAGES_BUCKET)) {
    await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
      public: true,
      fileSizeLimit: "5MB",
    });
  }
  bucketReady = true;
}
