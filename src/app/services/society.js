const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { toast } from 'sonner';

export async function getSocieties({
  userId = 1,
  status = "Active",
  pageNumber = 0,
  pageSize = 20,
}) {
  const url = `${BASE_URL}/homent?eventType=GET_SOCIETY&userId=${userId}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch societies");
  return res.json();
}

export async function getSocietyById(societyId, userId = 1) {
  const url = `${BASE_URL}/homent?eventType=GET_SOCIETY_SINGLE&userId=${userId}&societyId=${societyId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch society");
  return res.json();
}

export async function enrollSociety(payload, userId = 1) {
  const url = `${BASE_URL}/homent?eventType=ADD_SOCIETY&userId=${userId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to enroll society");
  return response.json();
}

export async function deleteSociety(societyId, userId = 1) {
  const url = `${BASE_URL}/homent?eventType=DELETE_SOCIETY&userId=${userId}&societyId=${societyId}`;
  const response = await fetch(url, {
    method: 'POST',
  });
  if (!response.ok) throw new Error("Failed to delete society");
  return response.json();
}

export async function updateSociety(societyId, payload, userId = 1) {
  const url = `${BASE_URL}/homent?eventType=UPDATE_SOCIETY&userId=${userId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: societyId, ...payload }),
  });
  if (!response.ok) throw new Error("Failed to update society");
  return response.json();
}

export async function uploadSocietyFiles(societyId, files, userId = 1) {
  if (!societyId || !Array.isArray(files) || files.length === 0) return;

  const formData = new FormData();

  files.forEach((file) => {
    if (file instanceof File) {
      formData.append("files", file);
    }
  });

  const uploadResp = await fetch(
    `${BASE_URL}/homent?societyId=${societyId}&userId=${userId}&eventType=ADD_SOCIETY_FILES`,
    {
      method: "PUT",
      body: formData,
    }
  );

  if (!uploadResp.ok) {
    const text = await uploadResp.text();
    throw new Error(text || "Photo upload failed");
  }

  toast.success("Photos uploaded successfully");
}
