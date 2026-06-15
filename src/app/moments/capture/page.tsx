"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { photosApi } from "@/lib/api/photos";
import { uploadsApi } from "@/lib/api/uploads";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CaptureForm() {
  const router = useRouter();
  const [placeId, setPlaceId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !placeId) return;
    setLoading(true);
    setError("");
    try {
      const upload = await uploadsApi.directUpload(file, "moment");
      await photosApi.createPhoto({
        placeId,
        url: upload.url,
        r2Key: upload.key,
      });
      router.push("/moments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Capture a Moment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Place ID</label>
          <Input
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            placeholder="Enter place ID from a place page"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
            required
          />
        </div>
        {error && <p className="text-sm text-hano-danger-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Uploading..." : "Share moment"}
        </Button>
      </form>
    </div>
  );
}

export default function CaptureMomentPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen p-4">
        <CaptureForm />
      </div>
    </AuthGuard>
  );
}
