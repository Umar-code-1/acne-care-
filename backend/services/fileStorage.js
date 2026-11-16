// services/fileStorage.js
// Saari uploads (scan photos, licences, payment receipts) yahan se save / read / delete hoti hain.
//
// - Cloudinary keys .env mein hon to file Cloudinary par PRIVATE ("authenticated") jaati hai.
//   DB mein reference save hota hai:  cloudinary:<resourceType>:<publicId>:<format>
// - Keys na hon to purane tareeqe se backend/uploads/ folder mein (local dev fallback).
//   DB mein:  /uploads/...   (purani files bhi isi tarah chalti rahengi)
//
// Files kabhi public URL se nahi khulti — hamesha protected backend route se stream hoti hain.

const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const UPLOAD_ROOT = path.join(__dirname, "..", "uploads");
const PREFIX = "cloudinary:";

// kind -> local subfolder (scans purani jagah, uploads/ ke root mein)
const LOCAL_FOLDERS = { scans: "", licenses: "licenses", payments: "payments", fees: "fees" };

const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/jpg":  "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};
const MIME_BY_EXT = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf" };

const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME: name, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  return Boolean(name && key && secret) && !/^your_/i.test(name);
};

let configured = false;
const cld = () => {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
};

const parseCloudRef = (ref) => {
  const [, resourceType, publicId, format] = ref.split(":");
  return { resourceType, publicId, format };
};

// multer memory file -> saved reference string
// kind: "scans" | "licenses" | "payments", name: filename prefix e.g. "scan-<userId>"
const saveFile = async (file, { kind, name }) => {
  if (!LOCAL_FOLDERS.hasOwnProperty(kind)) throw new Error(`Unknown upload kind: ${kind}`);
  const ext  = EXT_BY_MIME[file.mimetype] || "bin";
  const base = `${name}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  if (isCloudinaryConfigured()) {
    // PDF ko "raw" rakho — free plan par image-type PDF delivery band hoti hai
    const resourceType = ext === "pdf" ? "raw" : "image";
    const result = await new Promise((resolve, reject) => {
      cld().uploader.upload_stream(
        {
          folder: `acnecare/${kind}`,
          public_id: resourceType === "raw" ? `${base}.${ext}` : base,
          resource_type: resourceType,
          type: "authenticated", // private: sirf signed URL se milegi
          overwrite: false,
        },
        (err, res) => (err ? reject(err) : resolve(res))
      ).end(file.buffer);
    });
    return `${PREFIX}${resourceType}:${result.public_id}:${result.format || ext}`;
  }

  const sub = LOCAL_FOLDERS[kind];
  const dir = path.join(UPLOAD_ROOT, sub);
  await fs.promises.mkdir(dir, { recursive: true });
  const filename = `${base}.${ext}`;
  await fs.promises.writeFile(path.join(dir, filename), file.buffer);
  return `/uploads/${sub ? `${sub}/` : ""}${filename}`;
};

// local ref ko safe absolute path mein badlo (../ wali chaal se bachao)
const localPath = (ref) => {
  const rel = ref.replace(/^\/?uploads\//, "");
  const sub = path.posix.dirname(rel) === "." ? "" : path.posix.dirname(rel);
  if (!Object.values(LOCAL_FOLDERS).includes(sub)) return null;
  return path.join(UPLOAD_ROOT, sub, path.basename(rel));
};

// reference -> { buffer, contentType } ya null agar file nahi mili
const readFile = async (ref) => {
  if (!ref) return null;

  if (ref.startsWith(PREFIX)) {
    const { resourceType, publicId, format } = parseCloudRef(ref);
    // private download (API) — PDF/raw ke liye bhi chalta hai aur CDN cache nahi hota,
    // isliye delete ke baad file foran gayab ho jaati hai
    const url = cld().utils.private_download_url(publicId, resourceType === "image" ? format : "", {
      resource_type: resourceType,
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + 60,
    });
    const res = await fetch(url);
    if (!res.ok) return null;
    return {
      buffer: Buffer.from(await res.arrayBuffer()),
      contentType: MIME_BY_EXT[format] || res.headers.get("content-type") || "application/octet-stream",
    };
  }

  const filePath = localPath(ref);
  if (!filePath || !fs.existsSync(filePath)) return null;
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return { buffer: await fs.promises.readFile(filePath), contentType: MIME_BY_EXT[ext] || "application/octet-stream" };
};

// file hatao — fail ho to bas log karo, request na roko
const deleteFile = async (ref) => {
  if (!ref) return;
  try {
    if (ref.startsWith(PREFIX)) {
      const { resourceType, publicId } = parseCloudRef(ref);
      await cld().uploader.destroy(publicId, { resource_type: resourceType, type: "authenticated", invalidate: true });
      return;
    }
    const filePath = localPath(ref);
    if (filePath) await fs.promises.unlink(filePath).catch(() => {});
  } catch (err) {
    console.error("File delete failed:", err.message);
  }
};

// protected route se file bhejo
const sendStoredFile = async (res, ref, missingMessage = "File missing") => {
  const file = await readFile(ref);
  if (!file) return res.status(404).json({ message: missingMessage });
  res.set("Content-Type", file.contentType);
  res.set("Cache-Control", "private, no-store");
  res.send(file.buffer);
};

module.exports = { saveFile, readFile, deleteFile, sendStoredFile, isCloudinaryConfigured };
