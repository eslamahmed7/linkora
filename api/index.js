var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server/config/env.ts
import dotenv from "dotenv";
var config;
var init_env = __esm({
  "server/config/env.ts"() {
    "use strict";
    dotenv.config();
    config = {
      // Server
      PORT: process.env.PORT || 3001,
      NODE_ENV: process.env.NODE_ENV || "development",
      // JWT
      JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
      JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
      // QR Code
      QR_REDIRECT_URL: process.env.QR_REDIRECT_URL || "http://localhost:3001/r",
      QR_SIZE: parseInt(process.env.QR_SIZE || "300"),
      // Analytics
      ANALYTICS_RETENTION_DAYS: parseInt(process.env.ANALYTICS_RETENTION_DAYS || "90"),
      // NFC
      NFC_ENABLED: process.env.NFC_ENABLED === "true",
      // CORS
      CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:7879",
      // API Rate Limiting
      RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
      // 15 minutes
      RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
      // Supabase
      SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
      SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || "",
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    };
  }
});

// server/types/index.ts
var APIError;
var init_types = __esm({
  "server/types/index.ts"() {
    "use strict";
    APIError = class extends Error {
      constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = "APIError";
      }
      statusCode;
      code;
      details;
    };
  }
});

// server/utils/errors.ts
function isAPIError(error) {
  return error instanceof APIError;
}
var ValidationError, AuthenticationError, AuthorizationError, NotFoundError, ConflictError;
var init_errors = __esm({
  "server/utils/errors.ts"() {
    "use strict";
    init_types();
    ValidationError = class extends APIError {
      constructor(message, details) {
        super(400, "VALIDATION_ERROR", message, details);
      }
    };
    AuthenticationError = class extends APIError {
      constructor(message = "Authentication failed") {
        super(401, "AUTHENTICATION_ERROR", message);
      }
    };
    AuthorizationError = class extends APIError {
      constructor(message = "Access denied") {
        super(403, "AUTHORIZATION_ERROR", message);
      }
    };
    NotFoundError = class extends APIError {
      constructor(resource) {
        super(404, "NOT_FOUND", `${resource} not found`);
      }
    };
    ConflictError = class extends APIError {
      constructor(message) {
        super(409, "CONFLICT", message);
      }
    };
  }
});

// node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/stringify.js
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
var byteToHex;
var init_stringify = __esm({
  "node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/stringify.js"() {
    byteToHex = [];
    for (let i = 0; i < 256; ++i) {
      byteToHex.push((i + 256).toString(16).slice(1));
    }
  }
});

// node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/rng.js
function rng() {
  return crypto.getRandomValues(rnds8);
}
var rnds8;
var init_rng = __esm({
  "node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/rng.js"() {
    rnds8 = new Uint8Array(16);
  }
});

// node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/v4.js
function v4(options, buf, offset) {
  if (!buf && !options && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return _v4(options, buf, offset);
}
function _v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default;
var init_v4 = __esm({
  "node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/v4.js"() {
    init_rng();
    init_stringify();
    v4_default = v4;
  }
});

// node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/index.js
var init_dist_node = __esm({
  "node_modules/.pnpm/uuid@14.0.1/node_modules/uuid/dist-node/index.js"() {
    init_v4();
  }
});

// server/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";
var supabaseClient, supabase;
var init_supabase = __esm({
  "server/utils/supabase.ts"() {
    "use strict";
    init_env();
    if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Missing Supabase credentials. Backend requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
    supabaseClient = null;
    supabase = new Proxy({}, {
      get(target, prop) {
        if (!supabaseClient) {
          if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase credentials: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is empty in Vercel Environment Variables");
          }
          supabaseClient = createClient(
            config.SUPABASE_URL,
            config.SUPABASE_SERVICE_ROLE_KEY,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          );
        }
        return supabaseClient[prop];
      }
    });
  }
});

// server/repositories/LinkPageRepository.ts
var LinkPageRepository, linkPageRepository;
var init_LinkPageRepository = __esm({
  "server/repositories/LinkPageRepository.ts"() {
    "use strict";
    init_supabase();
    init_dist_node();
    LinkPageRepository = class {
      async create(pageData) {
        const id = v4_default();
        const now = /* @__PURE__ */ new Date();
        const { data: existingHandle } = await supabase.from("link_pages").select("id").eq("username", pageData.handle.toLowerCase()).single();
        if (existingHandle) {
          throw new Error("Handle already taken");
        }
        const dbData = {
          id,
          user_id: pageData.userId,
          username: pageData.handle.toLowerCase(),
          title: pageData.title,
          description: pageData.description || null,
          bio: pageData.bio || null,
          theme: pageData.theme,
          background_color: pageData.customColors?.background || "#000000",
          profile_image_url: pageData.avatar || null,
          design: pageData.design || null,
          is_published: pageData.isPublished,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        const { data, error } = await supabase.from("link_pages").insert([dbData]).select().single();
        if (error) {
          throw new Error(`Failed to create link page: ${error.message}`);
        }
        return this.mapToLinkPage(data);
      }
      async findById(id) {
        const { data, error } = await supabase.from("link_pages").select("*").eq("id", id).is("deleted_at", null).single();
        if (error || !data) return null;
        return this.mapToLinkPage(data);
      }
      async findByHandle(handle) {
        const { data, error } = await supabase.from("link_pages").select("*").eq("username", handle.toLowerCase()).is("deleted_at", null).single();
        if (error || !data) return null;
        return this.mapToLinkPage(data);
      }
      async findByUserId(userId) {
        const { data, error } = await supabase.from("link_pages").select("*").eq("user_id", userId).is("deleted_at", null);
        if (error || !data) return [];
        return data.map(this.mapToLinkPage);
      }
      async update(id, updates) {
        const dbUpdates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
        if (updates.handle !== void 0) dbUpdates.username = updates.handle.toLowerCase();
        if (updates.title !== void 0) dbUpdates.title = updates.title;
        if (updates.description !== void 0) dbUpdates.description = updates.description;
        if (updates.bio !== void 0) dbUpdates.bio = updates.bio;
        if (updates.theme !== void 0) dbUpdates.theme = updates.theme;
        if (updates.avatar !== void 0) dbUpdates.profile_image_url = updates.avatar;
        if (updates.design !== void 0) dbUpdates.design = updates.design;
        if (updates.isPublished !== void 0) dbUpdates.is_published = updates.isPublished;
        if (updates.customColors?.background) dbUpdates.background_color = updates.customColors.background;
        const { data, error } = await supabase.from("link_pages").update(dbUpdates).eq("id", id).select().single();
        if (error) {
          console.error("Supabase update error:", error);
          throw new Error(`Database error: ${error.message}`);
        }
        if (!data) return null;
        return this.mapToLinkPage(data);
      }
      async delete(id) {
        const { error } = await supabase.from("link_pages").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
        return !error;
      }
      async list(userId, skip = 0, take = 10) {
        const [{ data, error }, { count }] = await Promise.all([
          supabase.from("link_pages").select("*").eq("user_id", userId).is("deleted_at", null).range(skip, skip + take - 1),
          supabase.from("link_pages").select("*", { count: "exact", head: true }).eq("user_id", userId).is("deleted_at", null)
        ]);
        if (error || !data) return { pages: [], total: 0 };
        return {
          pages: data.map(this.mapToLinkPage),
          total: count || 0
        };
      }
      async handleExists(handle) {
        const { data } = await supabase.from("link_pages").select("id").eq("username", handle.toLowerCase()).single();
        return !!data;
      }
      mapToLinkPage(dbPage) {
        return {
          id: dbPage.id,
          userId: dbPage.user_id,
          handle: dbPage.username,
          title: dbPage.title,
          description: dbPage.description || void 0,
          bio: dbPage.bio || void 0,
          theme: dbPage.theme,
          customColors: dbPage.background_color ? {
            primary: "",
            secondary: "",
            text: "",
            background: dbPage.background_color
          } : void 0,
          avatar: dbPage.profile_image_url || void 0,
          design: dbPage.design || void 0,
          isPublished: dbPage.is_published,
          isNFCEnabled: false,
          createdAt: new Date(dbPage.created_at),
          updatedAt: new Date(dbPage.updated_at)
        };
      }
    };
    linkPageRepository = new LinkPageRepository();
  }
});

// server/repositories/LinkRepository.ts
var LinkRepository, linkRepository;
var init_LinkRepository = __esm({
  "server/repositories/LinkRepository.ts"() {
    "use strict";
    init_supabase();
    init_dist_node();
    LinkRepository = class {
      async create(linkData) {
        const id = v4_default();
        const now = /* @__PURE__ */ new Date();
        const dbData = {
          id,
          page_id: linkData.pageId,
          title: linkData.title,
          url: linkData.url,
          description: linkData.description || null,
          icon_url: linkData.icon || null,
          color: linkData.color || null,
          is_active: linkData.isActive,
          display_order: linkData.order,
          click_count: linkData.clicks,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        const { data, error } = await supabase.from("links").insert([dbData]).select().single();
        if (error) {
          throw new Error(`Failed to create link: ${error.message}`);
        }
        return this.mapToLink(data);
      }
      async findById(id) {
        const { data, error } = await supabase.from("links").select("*").eq("id", id).is("deleted_at", null).single();
        if (error || !data) return null;
        return this.mapToLink(data);
      }
      async findByPageId(pageId) {
        const { data, error } = await supabase.from("links").select("*").eq("page_id", pageId).is("deleted_at", null).order("display_order", { ascending: true });
        if (error || !data) return [];
        return data.map(this.mapToLink);
      }
      async update(id, updates) {
        const dbUpdates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
        if (updates.title !== void 0) dbUpdates.title = updates.title;
        if (updates.url !== void 0) dbUpdates.url = updates.url;
        if (updates.description !== void 0) dbUpdates.description = updates.description;
        if (updates.icon !== void 0) dbUpdates.icon_url = updates.icon;
        if (updates.color !== void 0) dbUpdates.color = updates.color;
        if (updates.order !== void 0) dbUpdates.display_order = updates.order;
        if (updates.isActive !== void 0) dbUpdates.is_active = updates.isActive;
        if (updates.clicks !== void 0) dbUpdates.click_count = updates.clicks;
        const { data, error } = await supabase.from("links").update(dbUpdates).eq("id", id).select().single();
        if (error || !data) return null;
        return this.mapToLink(data);
      }
      async incrementClicks(id) {
        const link = await this.findById(id);
        if (!link) return null;
        return this.update(id, { clicks: link.clicks + 1 });
      }
      async reorder(pageId, links) {
        const updatedLinks = [];
        for (const { id, order } of links) {
          const link = await this.update(id, { order });
          if (link) updatedLinks.push(link);
        }
        return updatedLinks;
      }
      async delete(id) {
        const { error } = await supabase.from("links").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
        return !error;
      }
      async deleteByPageId(pageId) {
        const { data, error } = await supabase.from("links").update({ deleted_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("page_id", pageId).is("deleted_at", null).select("id");
        if (error) return 0;
        return data ? data.length : 0;
      }
      mapToLink(dbLink) {
        return {
          id: dbLink.id,
          pageId: dbLink.page_id,
          title: dbLink.title,
          url: dbLink.url,
          description: dbLink.description || void 0,
          icon: dbLink.icon_url || void 0,
          color: dbLink.color || void 0,
          order: dbLink.display_order,
          clicks: dbLink.click_count || 0,
          isActive: dbLink.is_active,
          createdAt: new Date(dbLink.created_at),
          updatedAt: new Date(dbLink.updated_at)
        };
      }
    };
    linkRepository = new LinkRepository();
  }
});

// server/repositories/QRCodeRepository.ts
var QRCodeRepository, qrCodeRepository;
var init_QRCodeRepository = __esm({
  "server/repositories/QRCodeRepository.ts"() {
    "use strict";
    init_supabase();
    init_dist_node();
    QRCodeRepository = class {
      async create(qrData) {
        const id = v4_default();
        const now = /* @__PURE__ */ new Date();
        const dbData = {
          id,
          page_id: qrData.pageId,
          link_id: qrData.linkId || null,
          code_data: qrData.code,
          format: qrData.format,
          size: qrData.size,
          error_correction_level: qrData.errorCorrection,
          style: qrData.designStyle,
          logo_url: qrData.customLogo || null,
          color_dark: qrData.customColors?.dark || "#000000",
          color_light: qrData.customColors?.light || "#FFFFFF",
          image_base64: JSON.stringify({
            name: qrData.name || "",
            url: qrData.url || "",
            customization: qrData.customization,
            is_active: qrData.isActive ?? true
          }),
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        const { data, error } = await supabase.from("qr_codes").insert([dbData]).select().single();
        if (error) {
          throw new Error(`Failed to create QR code: ${error.message}`);
        }
        return this.mapToQRCode(data, qrData.redirectUrl);
      }
      async findById(id) {
        const { data, error } = await supabase.from("qr_codes").select("*").eq("id", id).single();
        if (error || !data) return null;
        return this.mapToQRCode(data, "");
      }
      async findByPageId(pageId) {
        const { data, error } = await supabase.from("qr_codes").select("*").eq("page_id", pageId);
        if (error || !data) return [];
        return data.map((d) => this.mapToQRCode(d, ""));
      }
      async findByCode(code) {
        const { data, error } = await supabase.from("qr_codes").select("*").eq("code_data", code).single();
        if (error || !data) return null;
        return this.mapToQRCode(data, "");
      }
      async update(id, updates) {
        const dbUpdates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
        if (updates.format) dbUpdates.format = updates.format;
        if (updates.size) dbUpdates.size = updates.size;
        if (updates.errorCorrection) dbUpdates.error_correction_level = updates.errorCorrection;
        if (updates.designStyle) dbUpdates.style = updates.designStyle;
        if (updates.customLogo !== void 0) dbUpdates.logo_url = updates.customLogo;
        if (updates.customColors?.dark) dbUpdates.color_dark = updates.customColors.dark;
        if (updates.customColors?.light) dbUpdates.color_light = updates.customColors.light;
        if (updates.pageId) dbUpdates.page_id = updates.pageId;
        if (updates.linkId !== void 0) dbUpdates.link_id = updates.linkId;
        if (updates.customization || updates.name || updates.url || updates.isActive !== void 0) {
          const existing = await this.findById(id);
          if (existing) {
            dbUpdates.image_base64 = JSON.stringify({
              name: updates.name ?? existing.name,
              url: updates.url ?? existing.url,
              customization: updates.customization ?? existing.customization,
              is_active: updates.isActive ?? existing.isActive
            });
          }
        }
        const { data, error } = await supabase.from("qr_codes").update(dbUpdates).eq("id", id).select().single();
        if (error || !data) return null;
        return this.mapToQRCode(data, updates.redirectUrl || "");
      }
      async delete(id) {
        const { error } = await supabase.from("qr_codes").delete().eq("id", id);
        return !error;
      }
      async deleteByPageId(pageId) {
        const { data, error } = await supabase.from("qr_codes").delete().eq("page_id", pageId).select("id");
        if (error) return 0;
        return data ? data.length : 0;
      }
      async list(pageId, skip = 0, take = 10) {
        const [{ data, error }, { count }] = await Promise.all([
          supabase.from("qr_codes").select("*").eq("page_id", pageId).range(skip, skip + take - 1),
          supabase.from("qr_codes").select("*", { count: "exact", head: true }).eq("page_id", pageId)
        ]);
        if (error || !data) return { qrCodes: [], total: 0 };
        return {
          qrCodes: data.map((d) => this.mapToQRCode(d, "")),
          total: count || 0
        };
      }
      async listByPageIds(pageIds) {
        if (pageIds.length === 0) return [];
        const { data, error } = await supabase.from("qr_codes").select("*").in("page_id", pageIds).order("created_at", { ascending: false });
        if (error || !data) return [];
        return data.map((d) => this.mapToQRCode(d, ""));
      }
      mapToQRCode(dbQR, redirectUrl) {
        let parsedExtras = {};
        if (dbQR.image_base64) {
          try {
            parsedExtras = JSON.parse(dbQR.image_base64);
          } catch (e) {
          }
        }
        let custom = parsedExtras.customization;
        if (typeof custom === "string") {
          try {
            custom = JSON.parse(custom);
          } catch (e) {
            custom = {};
          }
        }
        return {
          id: dbQR.id,
          pageId: dbQR.page_id,
          linkId: dbQR.link_id || void 0,
          code: dbQR.code_data,
          format: dbQR.format,
          size: dbQR.size,
          errorCorrection: dbQR.error_correction_level,
          designStyle: dbQR.style,
          customLogo: dbQR.logo_url || void 0,
          customColors: {
            dark: dbQR.color_dark || "#000000",
            light: dbQR.color_light || "#FFFFFF"
          },
          redirectUrl,
          // This was not in DB, returning passed value or empty
          createdAt: new Date(dbQR.created_at),
          updatedAt: new Date(dbQR.updated_at),
          name: parsedExtras.name || "",
          url: parsedExtras.url || "",
          customization: parsedExtras.customization,
          isActive: parsedExtras.is_active ?? true,
          scans: dbQR.scan_count || 0
        };
      }
    };
    qrCodeRepository = new QRCodeRepository();
  }
});

// server/repositories/AnalyticsRepository.ts
var AnalyticsRepository, analyticsRepository;
var init_AnalyticsRepository = __esm({
  "server/repositories/AnalyticsRepository.ts"() {
    "use strict";
    init_supabase();
    init_dist_node();
    AnalyticsRepository = class {
      async create(analyticsData) {
        const id = v4_default();
        const dbData = {
          id,
          link_id: analyticsData.linkId || null,
          page_id: analyticsData.pageId,
          qr_code_id: analyticsData.qrCodeId || null,
          event_type: analyticsData.type,
          user_agent: analyticsData.userAgent,
          ip_address: analyticsData.ipAddress,
          country: analyticsData.country || null,
          city: analyticsData.city || null,
          device_type: analyticsData.deviceType,
          referrer_url: analyticsData.referer || null,
          created_at: analyticsData.timestamp.toISOString()
        };
        const { data, error } = await supabase.from("analytics_events").insert([dbData]).select().single();
        if (error) {
          console.error("Failed to create analytics event", error);
          return { ...analyticsData, id };
        }
        return this.mapToAnalytics(data);
      }
      async findByPageId(pageId, skip = 0, take = 100) {
        const [{ data, error }, { count }] = await Promise.all([
          supabase.from("analytics_events").select("*").eq("page_id", pageId).order("created_at", { ascending: false }).range(skip, skip + take - 1),
          supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("page_id", pageId)
        ]);
        if (error || !data) return { analytics: [], total: 0 };
        return {
          analytics: data.map(this.mapToAnalytics),
          total: count || 0
        };
      }
      async findByLinkId(linkId) {
        const { data, error } = await supabase.from("analytics_events").select("*").eq("link_id", linkId).order("created_at", { ascending: false });
        if (error || !data) return [];
        return data.map(this.mapToAnalytics);
      }
      async findByQRCodeId(qrCodeId) {
        const { data, error } = await supabase.from("analytics_events").select("*").eq("qr_code_id", qrCodeId).order("created_at", { ascending: false });
        if (error || !data) return [];
        return data.map(this.mapToAnalytics);
      }
      async getStats(pageId) {
        const { data, error } = await supabase.from("analytics_events").select("event_type").eq("page_id", pageId);
        if (error || !data) {
          return { totalViews: 0, totalClicks: 0, totalQRScans: 0, totalNFCTaps: 0 };
        }
        return {
          totalViews: data.filter((a) => a.event_type === "page_view").length,
          totalClicks: data.filter((a) => a.event_type === "link_click").length,
          totalQRScans: data.filter((a) => a.event_type === "qr_scan").length,
          totalNFCTaps: data.filter((a) => a.event_type === "nfc_tap").length
        };
      }
      async getDeviceStats(pageId) {
        const { data, error } = await supabase.from("analytics_events").select("device_type").eq("page_id", pageId);
        const stats = {
          mobile: 0,
          tablet: 0,
          desktop: 0,
          unknown: 0
        };
        if (error || !data) return stats;
        for (const analytics of data) {
          const type = analytics.device_type;
          if (stats[type] !== void 0) {
            stats[type]++;
          } else {
            stats.unknown++;
          }
        }
        return stats;
      }
      async deleteByPageId(pageId) {
        const { data, error } = await supabase.from("analytics_events").delete().eq("page_id", pageId).select("id");
        if (error) return 0;
        return data ? data.length : 0;
      }
      mapToAnalytics(dbAnalytics) {
        return {
          id: dbAnalytics.id,
          pageId: dbAnalytics.page_id,
          linkId: dbAnalytics.link_id || void 0,
          qrCodeId: dbAnalytics.qr_code_id || void 0,
          type: dbAnalytics.event_type,
          userAgent: dbAnalytics.user_agent || "",
          ipAddress: dbAnalytics.ip_address || "",
          country: dbAnalytics.country || void 0,
          city: dbAnalytics.city || void 0,
          deviceType: dbAnalytics.device_type,
          referer: dbAnalytics.referrer_url || void 0,
          timestamp: new Date(dbAnalytics.created_at)
        };
      }
    };
    analyticsRepository = new AnalyticsRepository();
  }
});

// server/repositories/NFCRepository.ts
var NFCRepository, nfcRepository;
var init_NFCRepository = __esm({
  "server/repositories/NFCRepository.ts"() {
    "use strict";
    init_supabase();
    init_dist_node();
    NFCRepository = class {
      async create(cardData) {
        const id = v4_default();
        const now = /* @__PURE__ */ new Date();
        const dbData = {
          id,
          page_id: cardData.pageId ? cardData.pageId : null,
          link_id: null,
          nfc_id: cardData.title || id,
          nfc_uri: cardData.description || "",
          nfc_type: "card",
          is_active: cardData.isActive ?? true,
          scan_count: 0,
          card_design: cardData.cardDesign ? JSON.stringify(cardData.cardDesign) : null,
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        console.log("Inserting NFC with dbData:", JSON.stringify(dbData));
        const { data, error } = await supabase.from("nfc_tags").insert([dbData]).select().single();
        if (error) {
          throw new Error(`Failed to create NFC card: ${error.message}`);
        }
        return this.mapToNFCCard(data);
      }
      async findById(id) {
        const { data, error } = await supabase.from("nfc_tags").select("*").eq("id", id).single();
        if (error || !data) return null;
        return this.mapToNFCCard(data);
      }
      async findByUserId(userId) {
        const { data: pages } = await supabase.from("link_pages").select("id").eq("user_id", userId);
        if (!pages || pages.length === 0) return [];
        const pageIds = pages.map((p) => p.id);
        const { data, error } = await supabase.from("nfc_tags").select("*").in("page_id", pageIds);
        if (error || !data) return [];
        return data.map((d) => this.mapToNFCCard(d, userId));
      }
      async update(id, updates) {
        const dbUpdates = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
        if (updates.title !== void 0) dbUpdates.nfc_id = updates.title;
        if (updates.description !== void 0) dbUpdates.nfc_uri = updates.description || "";
        if (updates.tagId !== void 0) dbUpdates.nfc_type = updates.tagId;
        if (updates.isActive !== void 0) dbUpdates.is_active = updates.isActive;
        if (updates.cardDesign !== void 0) {
          dbUpdates.card_design = updates.cardDesign ? JSON.stringify(updates.cardDesign) : null;
        }
        const { data, error } = await supabase.from("nfc_tags").update(dbUpdates).eq("id", id).select().single();
        if (error || !data) return null;
        return this.mapToNFCCard(data);
      }
      async saveDesign(id, cardDesign) {
        const { data, error } = await supabase.from("nfc_tags").update({
          card_design: JSON.stringify(cardDesign),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", id).select().single();
        if (error || !data) return null;
        return this.mapToNFCCard(data);
      }
      async delete(id) {
        const { error } = await supabase.from("nfc_tags").delete().eq("id", id);
        return !error;
      }
      async deleteByPageId(pageId) {
        const { data, error } = await supabase.from("nfc_tags").delete().eq("page_id", pageId).select("id");
        if (error) return 0;
        return data ? data.length : 0;
      }
      mapToNFCCard(dbCard, userId) {
        let cardDesign;
        if (dbCard.card_design) {
          try {
            cardDesign = typeof dbCard.card_design === "string" ? JSON.parse(dbCard.card_design) : dbCard.card_design;
          } catch {
            cardDesign = void 0;
          }
        }
        return {
          id: dbCard.id,
          userId: userId || "",
          pageId: dbCard.page_id || "",
          title: dbCard.nfc_id,
          description: dbCard.nfc_uri,
          tagId: dbCard.nfc_type !== "card" ? dbCard.nfc_type : void 0,
          isActive: dbCard.is_active,
          cardDesign,
          createdAt: new Date(dbCard.created_at),
          updatedAt: new Date(dbCard.updated_at)
        };
      }
    };
    nfcRepository = new NFCRepository();
  }
});

// server/services/LinkPageService.ts
var LinkPageService_exports = {};
__export(LinkPageService_exports, {
  LinkPageService: () => LinkPageService,
  linkPageService: () => linkPageService
});
var LinkPageService, linkPageService;
var init_LinkPageService = __esm({
  "server/services/LinkPageService.ts"() {
    "use strict";
    init_LinkPageRepository();
    init_LinkRepository();
    init_QRCodeRepository();
    init_AnalyticsRepository();
    init_NFCRepository();
    init_errors();
    LinkPageService = class {
      async createPage(userId, pageData) {
        const finalHandle = pageData.handle ? pageData.handle.toLowerCase() : Math.random().toString(36).substring(2, 8);
        if (pageData.handle && await linkPageRepository.handleExists(finalHandle)) {
          throw new ConflictError("Handle already taken");
        }
        try {
          return await linkPageRepository.create({
            userId,
            handle: finalHandle,
            title: pageData.title,
            description: pageData.description,
            bio: pageData.bio,
            theme: pageData.theme || "dark",
            isPublished: false,
            isNFCEnabled: false
          });
        } catch (error) {
          console.error("Failed to create page in DB:", error);
          throw error;
        }
      }
      async getPage(pageId) {
        const page = await linkPageRepository.findById(pageId);
        if (!page) {
          throw new NotFoundError("LinkPage");
        }
        return page;
      }
      async getPageByHandle(handle) {
        const page = await linkPageRepository.findByHandle(handle);
        if (!page) {
          throw new NotFoundError("LinkPage");
        }
        return page;
      }
      async getUserPages(userId, skip = 0, take = 10) {
        return linkPageRepository.list(userId, skip, take);
      }
      async updatePage(pageId, userId, updates) {
        const page = await this.getPage(pageId);
        if (page.userId !== userId) {
          throw new AuthorizationError("You do not own this page");
        }
        if (updates.handle && updates.handle !== page.handle) {
          if (await linkPageRepository.handleExists(updates.handle)) {
            throw new ConflictError("Handle already taken");
          }
        }
        try {
          const updated = await linkPageRepository.update(pageId, {
            ...updates,
            handle: updates.handle?.toLowerCase() || page.handle,
            updatedAt: /* @__PURE__ */ new Date()
          });
          if (!updated) {
            throw new NotFoundError("Page");
          }
          return updated;
        } catch (error) {
          console.error("Failed to update page in DB:", error);
          throw error;
        }
      }
      async publishPage(pageId, userId) {
        const page = await this.getPage(pageId);
        if (page.userId !== userId) {
          throw new AuthorizationError("You do not own this page");
        }
        return this.updatePage(pageId, userId, { isPublished: true });
      }
      async unpublishPage(pageId, userId) {
        const page = await this.getPage(pageId);
        if (page.userId !== userId) {
          throw new AuthorizationError("You do not own this page");
        }
        return this.updatePage(pageId, userId, { isPublished: false });
      }
      async deletePage(pageId, userId) {
        const page = await this.getPage(pageId);
        if (page.userId !== userId) {
          throw new AuthorizationError("You do not own this page");
        }
        await linkRepository.deleteByPageId(pageId);
        await qrCodeRepository.deleteByPageId(pageId);
        await analyticsRepository.deleteByPageId(pageId);
        await nfcRepository.deleteByPageId(pageId);
        await linkPageRepository.delete(pageId);
      }
      async getPageStats(pageId, userId) {
        const page = await this.getPage(pageId);
        if (page.userId !== userId) {
          throw new AuthorizationError("You do not own this page");
        }
        const stats = await analyticsRepository.getStats(pageId);
        const deviceStats = await analyticsRepository.getDeviceStats(pageId);
        return {
          ...stats,
          devices: deviceStats
        };
      }
    };
    linkPageService = new LinkPageService();
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assertError.js
var require_assertError = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assertError.js"(exports, module) {
    "use strict";
    module.exports = class AssertError extends Error {
      name = "AssertError";
      constructor(message, ctor) {
        super(message || "Unknown error");
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, ctor);
        }
      }
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/stringify.js
var require_stringify = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/stringify.js"(exports, module) {
    "use strict";
    module.exports = function(...args) {
      try {
        return JSON.stringify(...args);
      } catch (err) {
        return "[Cannot display object: " + err.message + "]";
      }
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assert.js
var require_assert = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/assert.js"(exports, module) {
    "use strict";
    var AssertError = require_assertError();
    var Stringify = require_stringify();
    var assert = module.exports = function(condition, ...args) {
      if (condition) {
        return;
      }
      if (args.length === 1 && args[0] instanceof Error) {
        throw args[0];
      }
      const msgs = args.filter((arg) => arg !== "").map((arg) => {
        return typeof arg === "string" ? arg : arg instanceof Error ? arg.message : Stringify(arg);
      });
      throw new AssertError(msgs.join(" "), assert);
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reach.js
var require_reach = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reach.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var internals = {};
    module.exports = function(obj, chain, options) {
      if (chain === false || chain === null || chain === void 0) {
        return obj;
      }
      options = options || {};
      if (typeof options === "string") {
        options = { separator: options };
      }
      const isChainArray = Array.isArray(chain);
      Assert(!isChainArray || !options.separator, "Separator option is not valid for array-based chain");
      const path = isChainArray ? chain : chain.split(options.separator || ".");
      let ref = obj;
      for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        const type = options.iterables && internals.iterables(ref);
        if (Array.isArray(ref) || type === "set") {
          const number = Number(key);
          if (Number.isInteger(number)) {
            key = number < 0 ? ref.length + number : number;
          }
        }
        if (!ref || typeof ref === "function" && options.functions === false || // Defaults to true
        !type && ref[key] === void 0) {
          Assert(!options.strict || i + 1 === path.length, "Missing segment", key, "in reach path ", chain);
          Assert(typeof ref === "object" || options.functions === true || typeof ref !== "function", "Invalid segment", key, "in reach path ", chain);
          ref = options.default;
          break;
        }
        if (!type) {
          ref = ref[key];
        } else if (type === "set") {
          ref = [...ref][key];
        } else {
          ref = ref.get(key);
        }
      }
      return ref;
    };
    internals.iterables = function(ref) {
      if (ref instanceof Set) {
        return "set";
      }
      if (ref instanceof Map) {
        return "map";
      }
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/types.js"(exports, module) {
    "use strict";
    var internals = {};
    exports = module.exports = {
      array: Array.prototype,
      buffer: Buffer && Buffer.prototype,
      // $lab:coverage:ignore$
      date: Date.prototype,
      error: Error.prototype,
      generic: Object.prototype,
      map: Map.prototype,
      promise: Promise.prototype,
      regex: RegExp.prototype,
      set: Set.prototype,
      url: URL.prototype,
      weakMap: WeakMap.prototype,
      weakSet: WeakSet.prototype
    };
    internals.typeMap = /* @__PURE__ */ new Map([
      ["[object Error]", exports.error],
      ["[object Map]", exports.map],
      ["[object Promise]", exports.promise],
      ["[object Set]", exports.set],
      ["[object URL]", exports.url],
      ["[object WeakMap]", exports.weakMap],
      ["[object WeakSet]", exports.weakSet]
    ]);
    exports.getInternalProto = function(obj) {
      if (Array.isArray(obj)) {
        return exports.array;
      }
      if (Buffer && obj instanceof Buffer) {
        return exports.buffer;
      }
      if (obj instanceof Date) {
        return exports.date;
      }
      if (obj instanceof RegExp) {
        return exports.regex;
      }
      if (obj instanceof Error) {
        return exports.error;
      }
      const objName = Object.prototype.toString.call(obj);
      return internals.typeMap.get(objName) || exports.generic;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/utils.js
var require_utils = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/utils.js"(exports) {
    "use strict";
    exports.keys = function(obj, options = {}) {
      return options.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/clone.js
var require_clone = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/clone.js"(exports, module) {
    "use strict";
    var Reach = require_reach();
    var Types = require_types();
    var Utils = require_utils();
    var internals = {
      needsProtoHack: /* @__PURE__ */ new Set([Types.set, Types.map, Types.weakSet, Types.weakMap]),
      structuredCloneExists: typeof structuredClone === "function"
    };
    module.exports = internals.clone = function(obj, options = {}, _seen = null) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      let clone = internals.clone;
      let seen = _seen;
      if (options.shallow) {
        if (options.shallow !== true) {
          return internals.cloneWithShallow(obj, options);
        }
        clone = (value) => value;
      } else if (seen) {
        const lookup = seen.get(obj);
        if (lookup) {
          return lookup;
        }
      } else {
        seen = /* @__PURE__ */ new Map();
      }
      const baseProto = Types.getInternalProto(obj);
      switch (baseProto) {
        case Types.buffer:
          return Buffer?.from(obj);
        case Types.date:
          return new Date(obj.getTime());
        case Types.regex:
        case Types.url:
          return new baseProto.constructor(obj);
      }
      const newObj = internals.base(obj, baseProto, options);
      if (newObj === obj) {
        return obj;
      }
      if (seen) {
        seen.set(obj, newObj);
      }
      if (baseProto === Types.set) {
        for (const value of obj) {
          newObj.add(clone(value, options, seen));
        }
      } else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
          newObj.set(key, clone(value, options, seen));
        }
      }
      const keys = Utils.keys(obj, options);
      for (const key of keys) {
        if (key === "__proto__") {
          continue;
        }
        if (baseProto === Types.array && key === "length") {
          newObj.length = obj.length;
          continue;
        }
        if (internals.structuredCloneExists && baseProto === Types.error && key === "stack") {
          continue;
        }
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
          if (descriptor.get || descriptor.set) {
            Object.defineProperty(newObj, key, descriptor);
          } else if (descriptor.enumerable) {
            newObj[key] = clone(obj[key], options, seen);
          } else {
            Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: clone(obj[key], options, seen) });
          }
        } else {
          Object.defineProperty(newObj, key, {
            enumerable: true,
            writable: true,
            configurable: true,
            value: clone(obj[key], options, seen)
          });
        }
      }
      return newObj;
    };
    internals.cloneWithShallow = function(source, options) {
      const keys = options.shallow;
      options = Object.assign({}, options);
      options.shallow = false;
      const seen = /* @__PURE__ */ new Map();
      for (const key of keys) {
        const ref = Reach(source, key);
        if (typeof ref === "object" || typeof ref === "function") {
          seen.set(ref, ref);
        }
      }
      return internals.clone(source, options, seen);
    };
    internals.base = function(obj, baseProto, options) {
      if (options.prototype === false) {
        if (internals.needsProtoHack.has(baseProto)) {
          return new baseProto.constructor();
        }
        return baseProto === Types.array ? [] : {};
      }
      const proto = Object.getPrototypeOf(obj);
      if (proto && proto.isImmutable) {
        return obj;
      }
      if (baseProto === Types.array) {
        const newObj = [];
        if (proto !== baseProto) {
          Object.setPrototypeOf(newObj, proto);
        }
        return newObj;
      } else if (baseProto === Types.error && internals.structuredCloneExists && (proto === baseProto || Error.isPrototypeOf(proto.constructor))) {
        const err = structuredClone(obj);
        if (Object.getPrototypeOf(err) !== proto) {
          Object.setPrototypeOf(err, proto);
        }
        return err;
      }
      if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
          Object.setPrototypeOf(newObj, proto);
        }
        return newObj;
      }
      return Object.create(proto);
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/merge.js
var require_merge = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/merge.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Utils = require_utils();
    var internals = {};
    module.exports = internals.merge = function(target, source, options) {
      Assert(target && typeof target === "object", "Invalid target value: must be an object");
      Assert(source === null || source === void 0 || typeof source === "object", "Invalid source value: must be null, undefined, or an object");
      if (!source) {
        return target;
      }
      options = Object.assign({ nullOverride: true, mergeArrays: true }, options);
      if (Array.isArray(source)) {
        Assert(Array.isArray(target), "Cannot merge array onto an object");
        if (!options.mergeArrays) {
          target.length = 0;
        }
        for (let i = 0; i < source.length; ++i) {
          target.push(Clone(source[i], { symbols: options.symbols }));
        }
        return target;
      }
      const keys = Utils.keys(source, options);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (key === "__proto__" || !Object.prototype.propertyIsEnumerable.call(source, key)) {
          continue;
        }
        const value = source[key];
        if (value && typeof value === "object") {
          if (target[key] === value) {
            continue;
          }
          if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key]) !== Array.isArray(value) || value instanceof Date || Buffer && Buffer.isBuffer(value) || // $lab:coverage:ignore$
          value instanceof RegExp) {
            target[key] = Clone(value, { symbols: options.symbols });
          } else {
            internals.merge(target[key], value, options);
          }
        } else {
          if (value !== null && value !== void 0) {
            target[key] = value;
          } else if (options.nullOverride) {
            target[key] = value;
          }
        }
      }
      return target;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/applyToDefaults.js
var require_applyToDefaults = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/applyToDefaults.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var Clone = require_clone();
    var Merge = require_merge();
    var Reach = require_reach();
    var internals = {};
    module.exports = function(defaults, source, options = {}) {
      Assert(defaults && typeof defaults === "object", "Invalid defaults value: must be an object");
      Assert(!source || source === true || typeof source === "object", "Invalid source value: must be true, falsy or an object");
      Assert(typeof options === "object", "Invalid options: must be an object");
      if (!source) {
        return null;
      }
      if (options.shallow) {
        return internals.applyToDefaultsWithShallow(defaults, source, options);
      }
      const copy = Clone(defaults);
      if (source === true) {
        return copy;
      }
      const nullOverride = options.nullOverride !== void 0 ? options.nullOverride : false;
      return Merge(copy, source, { nullOverride, mergeArrays: false });
    };
    internals.applyToDefaultsWithShallow = function(defaults, source, options) {
      const keys = options.shallow;
      Assert(Array.isArray(keys), "Invalid keys");
      const seen = /* @__PURE__ */ new Map();
      const merge = source === true ? null : /* @__PURE__ */ new Set();
      for (let key of keys) {
        key = Array.isArray(key) ? key : key.split(".");
        const ref = Reach(defaults, key);
        if (ref && typeof ref === "object") {
          seen.set(ref, merge && Reach(source, key) || ref);
        } else if (merge) {
          merge.add(key);
        }
      }
      const copy = Clone(defaults, {}, seen);
      if (!merge) {
        return copy;
      }
      for (const key of merge) {
        internals.reachCopy(copy, source, key);
      }
      const nullOverride = options.nullOverride !== void 0 ? options.nullOverride : false;
      return Merge(copy, source, { nullOverride, mergeArrays: false });
    };
    internals.reachCopy = function(dst, src, path) {
      for (const segment of path) {
        if (!(segment in src)) {
          return;
        }
        const val = src[segment];
        if (typeof val !== "object" || val === null) {
          return;
        }
        src = val;
      }
      const value = src;
      let ref = dst;
      for (let i = 0; i < path.length - 1; ++i) {
        const segment = path[i];
        if (typeof ref[segment] !== "object") {
          ref[segment] = {};
        }
        ref = ref[segment];
      }
      ref[path[path.length - 1]] = value;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/bench.js
var require_bench = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/bench.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = internals.Bench = class {
      constructor() {
        this.ts = 0;
        this.reset();
      }
      reset() {
        this.ts = internals.Bench.now();
      }
      elapsed() {
        return internals.Bench.now() - this.ts;
      }
      static now() {
        const ts = process.hrtime();
        return ts[0] * 1e3 + ts[1] / 1e6;
      }
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/ignore.js
var require_ignore = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/ignore.js"(exports, module) {
    "use strict";
    module.exports = function() {
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/block.js
var require_block = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/block.js"(exports, module) {
    "use strict";
    var Ignore = require_ignore();
    module.exports = function() {
      return new Promise(Ignore);
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/deepEqual.js
var require_deepEqual = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/deepEqual.js"(exports, module) {
    "use strict";
    var Types = require_types();
    var internals = {
      mismatched: null
    };
    module.exports = function(obj, ref, options) {
      options = Object.assign({ prototype: true }, options);
      return !!internals.isDeepEqual(obj, ref, options, []);
    };
    internals.isDeepEqual = function(obj, ref, options, seen) {
      if (obj === ref) {
        return obj !== 0 || 1 / obj === 1 / ref;
      }
      const type = typeof obj;
      if (type !== typeof ref) {
        return false;
      }
      if (obj === null || ref === null) {
        return false;
      }
      if (type === "function") {
        if (!options.deepFunction || obj.toString() !== ref.toString()) {
          return false;
        }
      } else if (type !== "object") {
        return obj !== obj && ref !== ref;
      }
      const instanceType = internals.getSharedType(obj, ref, !!options.prototype);
      switch (instanceType) {
        case Types.buffer:
          return Buffer && Buffer.prototype.equals.call(obj, ref);
        // $lab:coverage:ignore$
        case Types.promise:
          return obj === ref;
        case Types.regex:
        case Types.url:
          return obj.toString() === ref.toString();
        case internals.mismatched:
          return false;
      }
      for (let i = seen.length - 1; i >= 0; --i) {
        if (seen[i].isSame(obj, ref)) {
          return true;
        }
      }
      seen.push(new internals.SeenEntry(obj, ref));
      try {
        return !!internals.isDeepEqualObj(instanceType, obj, ref, options, seen);
      } finally {
        seen.pop();
      }
    };
    internals.getSharedType = function(obj, ref, checkPrototype) {
      if (checkPrototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
          return internals.mismatched;
        }
        return Types.getInternalProto(obj);
      }
      const type = Types.getInternalProto(obj);
      if (type !== Types.getInternalProto(ref)) {
        return internals.mismatched;
      }
      return type;
    };
    internals.valueOf = function(obj) {
      const objValueOf = obj.valueOf;
      if (objValueOf === void 0) {
        return obj;
      }
      try {
        return objValueOf.call(obj);
      } catch (err) {
        return err;
      }
    };
    internals.hasOwnEnumerableProperty = function(obj, key) {
      return Object.prototype.propertyIsEnumerable.call(obj, key);
    };
    internals.isSetSimpleEqual = function(obj, ref) {
      for (const entry of Set.prototype.values.call(obj)) {
        if (!Set.prototype.has.call(ref, entry)) {
          return false;
        }
      }
      return true;
    };
    internals.isDeepEqualObj = function(instanceType, obj, ref, options, seen) {
      const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals;
      const { keys, getOwnPropertySymbols } = Object;
      if (instanceType === Types.array) {
        if (options.part) {
          for (const objValue of obj) {
            for (const refValue of ref) {
              if (isDeepEqual(objValue, refValue, options, seen)) {
                return true;
              }
            }
          }
        } else {
          if (obj.length !== ref.length) {
            return false;
          }
          for (let i = 0; i < obj.length; ++i) {
            if (!isDeepEqual(obj[i], ref[i], options, seen)) {
              return false;
            }
          }
          return true;
        }
      } else if (instanceType === Types.set) {
        if (obj.size !== ref.size) {
          return false;
        }
        if (!internals.isSetSimpleEqual(obj, ref)) {
          const ref2 = new Set(Set.prototype.values.call(ref));
          for (const objEntry of Set.prototype.values.call(obj)) {
            if (ref2.delete(objEntry)) {
              continue;
            }
            let found = false;
            for (const refEntry of ref2) {
              if (isDeepEqual(objEntry, refEntry, options, seen)) {
                ref2.delete(refEntry);
                found = true;
                break;
              }
            }
            if (!found) {
              return false;
            }
          }
        }
      } else if (instanceType === Types.map) {
        if (obj.size !== ref.size) {
          return false;
        }
        for (const [key, value] of Map.prototype.entries.call(obj)) {
          if (value === void 0 && !Map.prototype.has.call(ref, key)) {
            return false;
          }
          if (!isDeepEqual(value, Map.prototype.get.call(ref, key), options, seen)) {
            return false;
          }
        }
      } else if (instanceType === Types.error) {
        if (obj.name !== ref.name || obj.message !== ref.message) {
          return false;
        }
      }
      const valueOfObj = valueOf(obj);
      const valueOfRef = valueOf(ref);
      if ((obj !== valueOfObj || ref !== valueOfRef) && !isDeepEqual(valueOfObj, valueOfRef, options, seen)) {
        return false;
      }
      const objKeys = keys(obj);
      if (!options.part && objKeys.length !== keys(ref).length && !options.skip) {
        return false;
      }
      let skipped = 0;
      for (const key of objKeys) {
        if (options.skip && options.skip.includes(key)) {
          if (ref[key] === void 0) {
            ++skipped;
          }
          continue;
        }
        if (!hasOwnEnumerableProperty(ref, key)) {
          return false;
        }
        if (!isDeepEqual(obj[key], ref[key], options, seen)) {
          return false;
        }
      }
      if (!options.part && objKeys.length - skipped !== keys(ref).length) {
        return false;
      }
      if (options.symbols !== false) {
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));
        for (const key of objSymbols) {
          if (!options.skip?.includes(key)) {
            if (hasOwnEnumerableProperty(obj, key)) {
              if (!hasOwnEnumerableProperty(ref, key)) {
                return false;
              }
              if (!isDeepEqual(obj[key], ref[key], options, seen)) {
                return false;
              }
            } else if (hasOwnEnumerableProperty(ref, key)) {
              return false;
            }
          }
          refSymbols.delete(key);
        }
        for (const key of refSymbols) {
          if (hasOwnEnumerableProperty(ref, key)) {
            return false;
          }
        }
      }
      return true;
    };
    internals.SeenEntry = class {
      constructor(obj, ref) {
        this.obj = obj;
        this.ref = ref;
      }
      isSame(obj, ref) {
        return this.obj === obj && this.ref === ref;
      }
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeRegex.js
var require_escapeRegex = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeRegex.js"(exports, module) {
    "use strict";
    module.exports = function(string) {
      return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, "\\$&");
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/contain.js
var require_contain = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/contain.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    var DeepEqual = require_deepEqual();
    var EscapeRegex = require_escapeRegex();
    var Utils = require_utils();
    var internals = {};
    module.exports = function(ref, values, options = {}) {
      if (typeof values !== "object") {
        values = [values];
      }
      Assert(!Array.isArray(values) || values.length, "Values array cannot be empty");
      if (typeof ref === "string") {
        return internals.string(ref, values, options);
      }
      if (Array.isArray(ref)) {
        return internals.array(ref, values, options);
      }
      Assert(typeof ref === "object", "Reference must be string or an object");
      return internals.object(ref, values, options);
    };
    internals.array = function(ref, values, options) {
      if (!Array.isArray(values)) {
        values = [values];
      }
      if (!ref.length) {
        return false;
      }
      if (options.only && options.once && ref.length !== values.length) {
        return false;
      }
      let compare;
      const map = /* @__PURE__ */ new Map();
      for (const value of values) {
        if (!options.deep || !value || typeof value !== "object") {
          const existing = map.get(value);
          if (existing) {
            ++existing.allowed;
          } else {
            map.set(value, { allowed: 1, hits: 0 });
          }
        } else {
          compare = compare ?? internals.compare(options);
          let found = false;
          for (const [key, existing] of map.entries()) {
            if (compare(key, value)) {
              ++existing.allowed;
              found = true;
              break;
            }
          }
          if (!found) {
            map.set(value, { allowed: 1, hits: 0 });
          }
        }
      }
      let hits = 0;
      for (const item of ref) {
        let match;
        if (!options.deep || !item || typeof item !== "object") {
          match = map.get(item);
        } else {
          compare = compare ?? internals.compare(options);
          for (const [key, existing] of map.entries()) {
            if (compare(key, item)) {
              match = existing;
              break;
            }
          }
        }
        if (match) {
          ++match.hits;
          ++hits;
          if (options.once && match.hits > match.allowed) {
            return false;
          }
        }
      }
      if (options.only && hits !== ref.length) {
        return false;
      }
      for (const match of map.values()) {
        if (match.hits === match.allowed) {
          continue;
        }
        if (match.hits < match.allowed && !options.part) {
          return false;
        }
      }
      return !!hits;
    };
    internals.object = function(ref, values, options) {
      Assert(options.once === void 0, "Cannot use option once with object");
      const keys = Utils.keys(ref, options);
      if (!keys.length) {
        return false;
      }
      if (Array.isArray(values)) {
        return internals.array(keys, values, options);
      }
      const symbols = Object.getOwnPropertySymbols(values).filter((sym) => values.propertyIsEnumerable(sym));
      const targets = [...Object.keys(values), ...symbols];
      const compare = internals.compare(options);
      const set = new Set(targets);
      for (const key of keys) {
        if (!set.has(key)) {
          if (options.only) {
            return false;
          }
          continue;
        }
        if (!compare(values[key], ref[key])) {
          return false;
        }
        set.delete(key);
      }
      if (set.size) {
        return options.part ? set.size < targets.length : false;
      }
      return true;
    };
    internals.string = function(ref, values, options) {
      if (ref === "") {
        return values.length === 1 && values[0] === "" || // '' contains ''
        !options.once && !values.some((v) => v !== "");
      }
      const map = /* @__PURE__ */ new Map();
      const patterns = [];
      for (const value of values) {
        Assert(typeof value === "string", "Cannot compare string reference to non-string value");
        if (value) {
          const existing = map.get(value);
          if (existing) {
            ++existing.allowed;
          } else {
            map.set(value, { allowed: 1, hits: 0 });
            patterns.push(EscapeRegex(value));
          }
        } else if (options.once || options.only) {
          return false;
        }
      }
      if (!patterns.length) {
        return true;
      }
      const regex = new RegExp(`(${patterns.join("|")})`, "g");
      const leftovers = ref.replace(regex, ($0, $1) => {
        ++map.get($1).hits;
        return "";
      });
      if (options.only && leftovers) {
        return false;
      }
      let any = false;
      for (const match of map.values()) {
        if (match.hits) {
          any = true;
        }
        if (match.hits === match.allowed) {
          continue;
        }
        if (match.hits < match.allowed && !options.part) {
          return false;
        }
        if (options.once) {
          return false;
        }
      }
      return !!any;
    };
    internals.compare = function(options) {
      if (!options.deep) {
        return internals.shallow;
      }
      const hasOnly = options.only !== void 0;
      const hasPart = options.part !== void 0;
      const flags = {
        prototype: hasOnly ? options.only : hasPart ? !options.part : false,
        part: hasOnly ? !options.only : hasPart ? options.part : false
      };
      return (a, b) => DeepEqual(a, b, flags);
    };
    internals.shallow = function(a, b) {
      return a === b;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHeaderAttribute.js
var require_escapeHeaderAttribute = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHeaderAttribute.js"(exports, module) {
    "use strict";
    var Assert = require_assert();
    module.exports = function(attribute) {
      Assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), "Bad attribute value (" + attribute + ")");
      return attribute.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHtml.js
var require_escapeHtml = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeHtml.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(input) {
      if (!input) {
        return "";
      }
      let escaped = "";
      for (let i = 0; i < input.length; ++i) {
        const charCode = input.charCodeAt(i);
        if (internals.isSafe(charCode)) {
          escaped += input[i];
        } else {
          escaped += internals.escapeHtmlChar(charCode);
        }
      }
      return escaped;
    };
    internals.escapeHtmlChar = function(charCode) {
      const namedEscape = internals.namedHtml.get(charCode);
      if (namedEscape) {
        return namedEscape;
      }
      if (charCode >= 256) {
        return "&#" + charCode + ";";
      }
      const hexValue = charCode.toString(16).padStart(2, "0");
      return `&#x${hexValue};`;
    };
    internals.isSafe = function(charCode) {
      return internals.safeCharCodes.has(charCode);
    };
    internals.namedHtml = /* @__PURE__ */ new Map([
      [38, "&amp;"],
      [60, "&lt;"],
      [62, "&gt;"],
      [34, "&quot;"],
      [160, "&nbsp;"],
      [162, "&cent;"],
      [163, "&pound;"],
      [164, "&curren;"],
      [169, "&copy;"],
      [174, "&reg;"]
    ]);
    internals.safeCharCodes = (function() {
      const safe = /* @__PURE__ */ new Set();
      for (let i = 32; i < 123; ++i) {
        if (i >= 97 || // a-z
        i >= 65 && i <= 90 || // A-Z
        i >= 48 && i <= 57 || // 0-9
        i === 32 || // space
        i === 46 || // .
        i === 44 || // ,
        i === 45 || // -
        i === 58 || // :
        i === 95) {
          safe.add(i);
        }
      }
      return safe;
    })();
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeJson.js
var require_escapeJson = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/escapeJson.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(input) {
      if (!input) {
        return "";
      }
      return input.replace(/[<>&\u2028\u2029]/g, internals.escape);
    };
    internals.escape = function(char) {
      return internals.replacements.get(char);
    };
    internals.replacements = /* @__PURE__ */ new Map([
      ["<", "\\u003c"],
      [">", "\\u003e"],
      ["&", "\\u0026"],
      ["\u2028", "\\u2028"],
      ["\u2029", "\\u2029"]
    ]);
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/flatten.js
var require_flatten = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/flatten.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = internals.flatten = function(array, target) {
      const result = target || [];
      for (const entry of array) {
        if (Array.isArray(entry)) {
          internals.flatten(entry, result);
        } else {
          result.push(entry);
        }
      }
      return result;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/intersect.js
var require_intersect = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/intersect.js"(exports, module) {
    "use strict";
    var internals = {};
    module.exports = function(array1, array2, options = {}) {
      if (!array1 || !array2) {
        return options.first ? null : [];
      }
      const common = [];
      const hash = Array.isArray(array1) ? new Set(array1) : array1;
      const found = /* @__PURE__ */ new Set();
      for (const value of array2) {
        if (internals.has(hash, value) && !found.has(value)) {
          if (options.first) {
            return value;
          }
          common.push(value);
          found.add(value);
        }
      }
      return options.first ? null : common;
    };
    internals.has = function(ref, key) {
      if (typeof ref.has === "function") {
        return ref.has(key);
      }
      return ref[key] !== void 0;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/isPromise.js
var require_isPromise = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/isPromise.js"(exports, module) {
    "use strict";
    module.exports = function(promise) {
      return typeof promise?.then === "function";
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/once.js
var require_once = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/once.js"(exports, module) {
    "use strict";
    var internals = {
      wrapped: /* @__PURE__ */ Symbol("wrapped")
    };
    module.exports = function(method) {
      if (method[internals.wrapped]) {
        return method;
      }
      let once = false;
      const wrappedFn = function(...args) {
        if (!once) {
          once = true;
          method(...args);
        }
      };
      wrappedFn[internals.wrapped] = true;
      return wrappedFn;
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reachTemplate.js
var require_reachTemplate = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/reachTemplate.js"(exports, module) {
    "use strict";
    var Reach = require_reach();
    module.exports = function(obj, template, options) {
      return template.replace(/{([^{}]+)}/g, ($0, chain) => {
        const value = Reach(obj, chain, options);
        return value ?? "";
      });
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/wait.js
var require_wait = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/wait.js"(exports, module) {
    "use strict";
    var internals = {
      maxTimer: 2 ** 31 - 1
      // ~25 days
    };
    module.exports = function(timeout, returnValue, options) {
      if (typeof timeout === "bigint") {
        timeout = Number(timeout);
      }
      if (timeout >= Number.MAX_SAFE_INTEGER) {
        timeout = Infinity;
      }
      if (typeof timeout !== "number" && timeout !== void 0) {
        throw new TypeError("Timeout must be a number or bigint");
      }
      return new Promise((resolve) => {
        const _setTimeout = options ? options.setTimeout : setTimeout;
        const activate = () => {
          const time = Math.min(timeout, internals.maxTimer);
          timeout -= time;
          _setTimeout(() => timeout > 0 ? activate() : resolve(returnValue), time);
        };
        if (timeout !== Infinity) {
          activate();
        }
      });
    };
  }
});

// node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/index.js
var require_lib = __commonJS({
  "node_modules/.pnpm/@hapi+hoek@11.0.7/node_modules/@hapi/hoek/lib/index.js"(exports) {
    "use strict";
    exports.applyToDefaults = require_applyToDefaults();
    exports.assert = require_assert();
    exports.AssertError = require_assertError();
    exports.Bench = require_bench();
    exports.block = require_block();
    exports.clone = require_clone();
    exports.contain = require_contain();
    exports.deepEqual = require_deepEqual();
    exports.escapeHeaderAttribute = require_escapeHeaderAttribute();
    exports.escapeHtml = require_escapeHtml();
    exports.escapeJson = require_escapeJson();
    exports.escapeRegex = require_escapeRegex();
    exports.flatten = require_flatten();
    exports.ignore = require_ignore();
    exports.intersect = require_intersect();
    exports.isPromise = require_isPromise();
    exports.merge = require_merge();
    exports.once = require_once();
    exports.reach = require_reach();
    exports.reachTemplate = require_reachTemplate();
    exports.stringify = require_stringify();
    exports.wait = require_wait();
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/package.json"(exports, module) {
    module.exports = {
      name: "joi",
      description: "Object schema validation",
      version: "18.2.3",
      repository: {
        url: "git://github.com/hapijs/joi.git",
        type: "git"
      },
      engines: {
        node: ">= 20"
      },
      main: "lib/index.js",
      types: "lib/index.d.ts",
      browser: "dist/joi-browser.min.js",
      files: [
        "lib/**/*",
        "dist/*"
      ],
      keywords: [
        "schema",
        "validation"
      ],
      dependencies: {
        "@hapi/address": "^5.1.1",
        "@hapi/formula": "^3.0.2",
        "@hapi/hoek": "^11.0.7",
        "@hapi/pinpoint": "^2.0.1",
        "@hapi/tlds": "^1.1.1",
        "@hapi/topo": "^6.0.2",
        "@standard-schema/spec": "^1.1.0"
      },
      devDependencies: {
        "@hapi/bourne": "^3.0.0",
        "@hapi/code": "^9.0.3",
        "@hapi/eslint-plugin": "^7.0.0",
        "@hapi/joi-legacy-test": "npm:@hapi/joi@15.x.x",
        "@hapi/lab": "^26.0.0",
        "@types/node": "^20.17.47",
        ajv: "^8.18.0",
        "ajv-formats": "^3.0.1",
        typescript: "^5.8.3"
      },
      scripts: {
        prepublishOnly: "cd browser && npm install && npm run build",
        test: "lab -t 100 -a @hapi/code -L -Y",
        "test-cov-html": "lab -r html -o coverage.html -a @hapi/code"
      },
      license: "BSD-3-Clause"
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/schemas.js
var require_schemas = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/schemas.js"(exports) {
    "use strict";
    var Joi2 = require_lib5();
    var internals = {};
    internals.wrap = Joi2.string().min(1).max(2).allow(false);
    exports.preferences = Joi2.object({
      allowUnknown: Joi2.boolean(),
      abortEarly: Joi2.boolean(),
      artifacts: Joi2.boolean(),
      cache: Joi2.boolean(),
      context: Joi2.object(),
      convert: Joi2.boolean(),
      dateFormat: Joi2.valid("date", "iso", "string", "time", "utc"),
      debug: Joi2.boolean(),
      errors: {
        escapeHtml: Joi2.boolean(),
        label: Joi2.valid("path", "key", false),
        language: [
          Joi2.string(),
          Joi2.object().ref()
        ],
        render: Joi2.boolean(),
        stack: Joi2.boolean(),
        wrap: {
          label: internals.wrap,
          array: internals.wrap,
          string: internals.wrap
        }
      },
      externals: Joi2.boolean(),
      messages: Joi2.object(),
      noDefaults: Joi2.boolean(),
      nonEnumerables: Joi2.boolean(),
      presence: Joi2.valid("required", "optional", "forbidden"),
      skipFunctions: Joi2.boolean(),
      stripUnknown: Joi2.object({
        arrays: Joi2.boolean(),
        objects: Joi2.boolean()
      }).or("arrays", "objects").allow(true, false),
      warnings: Joi2.boolean()
    }).strict();
    internals.nameRx = /^[a-zA-Z0-9]\w*$/;
    internals.rule = Joi2.object({
      alias: Joi2.array().items(Joi2.string().pattern(internals.nameRx)).single(),
      args: Joi2.array().items(
        Joi2.string(),
        Joi2.object({
          name: Joi2.string().pattern(internals.nameRx).required(),
          ref: Joi2.boolean(),
          assert: Joi2.alternatives([
            Joi2.function(),
            Joi2.object().schema()
          ]).conditional("ref", { is: true, then: Joi2.required() }),
          normalize: Joi2.function(),
          message: Joi2.string().when("assert", { is: Joi2.function(), then: Joi2.required() })
        })
      ),
      convert: Joi2.boolean(),
      manifest: Joi2.boolean(),
      method: Joi2.function().allow(false),
      multi: Joi2.boolean(),
      validate: Joi2.function(),
      jsonSchema: Joi2.function()
    });
    exports.extension = Joi2.object({
      type: Joi2.alternatives([
        Joi2.string(),
        Joi2.object().regex()
      ]).required(),
      args: Joi2.function(),
      cast: Joi2.object().pattern(internals.nameRx, Joi2.object({
        from: Joi2.function().maxArity(1).required(),
        to: Joi2.function().minArity(1).maxArity(2).required()
      })),
      base: Joi2.object().schema().when("type", { is: Joi2.object().regex(), then: Joi2.forbidden() }),
      coerce: [
        Joi2.function().maxArity(3),
        Joi2.object({ method: Joi2.function().maxArity(3).required(), from: Joi2.array().items(Joi2.string()).single() })
      ],
      flags: Joi2.object().pattern(internals.nameRx, Joi2.object({
        setter: Joi2.string(),
        default: Joi2.any()
      })),
      manifest: {
        build: Joi2.function().arity(2)
      },
      messages: [Joi2.object(), Joi2.string()],
      modifiers: Joi2.object().pattern(internals.nameRx, Joi2.function().minArity(1).maxArity(2)),
      overrides: Joi2.object().pattern(internals.nameRx, Joi2.function()),
      prepare: Joi2.function().maxArity(3),
      rebuild: Joi2.function().arity(1),
      rules: Joi2.object().pattern(internals.nameRx, internals.rule),
      jsonSchema: Joi2.function(),
      terms: Joi2.object().pattern(internals.nameRx, Joi2.object({
        init: Joi2.array().allow(null).required(),
        manifest: Joi2.object().pattern(/.+/, [
          Joi2.valid("schema", "single"),
          Joi2.object({
            mapped: Joi2.object({
              from: Joi2.string().required(),
              to: Joi2.string().required()
            }).required()
          })
        ])
      })),
      validate: Joi2.function().maxArity(3)
    }).strict();
    exports.extensions = Joi2.array().items(Joi2.object(), Joi2.function().arity(1)).strict();
    internals.desc = {
      buffer: Joi2.object({
        buffer: Joi2.string()
      }),
      func: Joi2.object({
        function: Joi2.function().required(),
        options: {
          literal: true
        }
      }),
      override: Joi2.object({
        override: true
      }),
      ref: Joi2.object({
        ref: Joi2.object({
          type: Joi2.valid("value", "global", "local"),
          path: Joi2.array().required(),
          separator: Joi2.string().length(1).allow(false),
          ancestor: Joi2.number().min(0).integer().allow("root"),
          map: Joi2.array().items(Joi2.array().length(2)).min(1),
          adjust: Joi2.function(),
          iterables: Joi2.boolean(),
          in: Joi2.boolean(),
          render: Joi2.boolean()
        }).required()
      }),
      regex: Joi2.object({
        regex: Joi2.string().min(3)
      }),
      special: Joi2.object({
        special: Joi2.valid("deep").required()
      }),
      template: Joi2.object({
        template: Joi2.string().required(),
        options: Joi2.object()
      }),
      value: Joi2.object({
        value: Joi2.alternatives([Joi2.object(), Joi2.array()]).required()
      })
    };
    internals.desc.entity = Joi2.alternatives([
      Joi2.array().items(Joi2.link("...")),
      Joi2.boolean(),
      Joi2.function(),
      Joi2.number(),
      Joi2.string(),
      internals.desc.buffer,
      internals.desc.func,
      internals.desc.ref,
      internals.desc.regex,
      internals.desc.special,
      internals.desc.template,
      internals.desc.value,
      Joi2.link("/")
    ]);
    internals.desc.values = Joi2.array().items(
      null,
      Joi2.boolean(),
      Joi2.function(),
      Joi2.number().allow(Infinity, -Infinity, NaN),
      Joi2.string().allow(""),
      Joi2.symbol(),
      internals.desc.buffer,
      internals.desc.func,
      internals.desc.override,
      internals.desc.ref,
      internals.desc.regex,
      internals.desc.template,
      internals.desc.value
    );
    internals.desc.messages = Joi2.object().pattern(/.+/, [
      Joi2.string(),
      internals.desc.template,
      Joi2.object().pattern(/.+/, [Joi2.string(), internals.desc.template])
    ]);
    exports.description = Joi2.object({
      type: Joi2.string().required(),
      flags: Joi2.object({
        cast: Joi2.string(),
        default: Joi2.any(),
        description: Joi2.string(),
        empty: Joi2.link("/"),
        failover: internals.desc.entity,
        id: Joi2.string(),
        label: Joi2.string(),
        only: true,
        presence: ["optional", "required", "forbidden"],
        result: ["raw", "strip"],
        strip: Joi2.boolean(),
        unit: Joi2.string()
      }).unknown(),
      preferences: {
        allowUnknown: Joi2.boolean(),
        abortEarly: Joi2.boolean(),
        artifacts: Joi2.boolean(),
        cache: Joi2.boolean(),
        convert: Joi2.boolean(),
        dateFormat: ["date", "iso", "string", "time", "utc"],
        errors: {
          escapeHtml: Joi2.boolean(),
          label: ["path", "key"],
          language: [
            Joi2.string(),
            internals.desc.ref
          ],
          wrap: {
            label: internals.wrap,
            array: internals.wrap
          }
        },
        externals: Joi2.boolean(),
        messages: internals.desc.messages,
        noDefaults: Joi2.boolean(),
        nonEnumerables: Joi2.boolean(),
        presence: ["required", "optional", "forbidden"],
        skipFunctions: Joi2.boolean(),
        stripUnknown: Joi2.object({
          arrays: Joi2.boolean(),
          objects: Joi2.boolean()
        }).or("arrays", "objects").allow(true, false),
        warnings: Joi2.boolean()
      },
      allow: internals.desc.values,
      invalid: internals.desc.values,
      rules: Joi2.array().min(1).items({
        name: Joi2.string().required(),
        args: Joi2.object().min(1),
        keep: Joi2.boolean(),
        message: [
          Joi2.string(),
          internals.desc.messages
        ],
        warn: Joi2.boolean()
      }),
      // Terms
      keys: Joi2.object().pattern(/.*/, Joi2.link("/")),
      link: internals.desc.ref
    }).pattern(/^[a-z]\w*$/, Joi2.any());
  }
});

// node_modules/.pnpm/@hapi+formula@3.0.2/node_modules/@hapi/formula/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/.pnpm/@hapi+formula@3.0.2/node_modules/@hapi/formula/lib/index.js"(exports) {
    "use strict";
    var internals = {
      operators: ["!", "^", "*", "/", "%", "+", "-", "<", "<=", ">", ">=", "==", "!=", "&&", "||", "??"],
      operatorCharacters: ["!", "^", "*", "/", "%", "+", "-", "<", "=", ">", "&", "|", "?"],
      operatorsOrder: [["^"], ["*", "/", "%"], ["+", "-"], ["<", "<=", ">", ">="], ["==", "!="], ["&&"], ["||", "??"]],
      operatorsPrefix: ["!", "n"],
      literals: {
        '"': '"',
        "`": "`",
        "'": "'",
        "[": "]"
      },
      numberRx: /^(?:[0-9]*(\.[0-9]*)?){1}$/,
      tokenRx: /^[\w\$\#\.\@\:\{\}]+$/,
      symbol: /* @__PURE__ */ Symbol("formula"),
      settings: /* @__PURE__ */ Symbol("settings")
    };
    exports.Parser = class {
      constructor(string, options = {}) {
        if (!options[internals.settings] && options.constants) {
          for (const constant in options.constants) {
            const value = options.constants[constant];
            if (value !== null && !["boolean", "number", "string"].includes(typeof value)) {
              throw new Error(`Formula constant ${constant} contains invalid ${typeof value} value type`);
            }
          }
        }
        this.settings = options[internals.settings] ? options : Object.assign({ [internals.settings]: true, constants: {}, functions: {} }, options);
        this.single = null;
        this._parts = null;
        this._parse(string);
      }
      _parse(string) {
        let parts = [];
        let current = "";
        let parenthesis = 0;
        let literal = false;
        const flush = (inner) => {
          if (parenthesis) {
            throw new Error("Formula missing closing parenthesis");
          }
          const last = parts.length ? parts[parts.length - 1] : null;
          if (!literal && !current && !inner) {
            return;
          }
          if (last && last.type === "reference" && inner === ")") {
            last.type = "function";
            last.value = this._subFormula(current, last.value);
            current = "";
            return;
          }
          if (inner === ")") {
            const sub = new exports.Parser(current, this.settings);
            parts.push({ type: "segment", value: sub });
          } else if (literal) {
            if (literal === "]") {
              parts.push({ type: "reference", value: current });
              current = "";
              return;
            }
            parts.push({ type: "literal", value: current });
          } else if (internals.operatorCharacters.includes(current)) {
            if (last && last.type === "operator" && internals.operators.includes(last.value + current)) {
              last.value += current;
            } else {
              parts.push({ type: "operator", value: current });
            }
          } else if (current.match(internals.numberRx)) {
            parts.push({ type: "constant", value: parseFloat(current) });
          } else if (this.settings.constants[current] !== void 0) {
            parts.push({ type: "constant", value: this.settings.constants[current] });
          } else {
            if (!current.match(internals.tokenRx)) {
              throw new Error(`Formula contains invalid token: ${current}`);
            }
            parts.push({ type: "reference", value: current });
          }
          current = "";
        };
        for (const c of string) {
          if (literal) {
            if (c === literal) {
              flush();
              literal = false;
            } else {
              current += c;
            }
          } else if (parenthesis) {
            if (c === "(") {
              current += c;
              ++parenthesis;
            } else if (c === ")") {
              --parenthesis;
              if (!parenthesis) {
                flush(c);
              } else {
                current += c;
              }
            } else {
              current += c;
            }
          } else if (c in internals.literals) {
            literal = internals.literals[c];
          } else if (c === "(") {
            flush();
            ++parenthesis;
          } else if (internals.operatorCharacters.includes(c)) {
            flush();
            current = c;
            flush();
          } else if (c !== " ") {
            current += c;
          } else {
            flush();
          }
        }
        flush();
        parts = parts.map((part, i) => {
          if (part.type !== "operator" || part.value !== "-" || i && parts[i - 1].type !== "operator") {
            return part;
          }
          return { type: "operator", value: "n" };
        });
        let operator = false;
        for (const part of parts) {
          if (part.type === "operator") {
            if (internals.operatorsPrefix.includes(part.value)) {
              continue;
            }
            if (!operator) {
              throw new Error("Formula contains an operator in invalid position");
            }
            if (!internals.operators.includes(part.value)) {
              throw new Error(`Formula contains an unknown operator ${part.value}`);
            }
          } else if (operator) {
            throw new Error("Formula missing expected operator");
          }
          operator = !operator;
        }
        if (!operator) {
          throw new Error("Formula contains invalid trailing operator");
        }
        if (parts.length === 1 && ["reference", "literal", "constant"].includes(parts[0].type)) {
          this.single = { type: parts[0].type === "reference" ? "reference" : "value", value: parts[0].value };
        }
        this._parts = parts.map((part) => {
          if (part.type === "operator") {
            return internals.operatorsPrefix.includes(part.value) ? part : part.value;
          }
          if (part.type !== "reference") {
            return part.value;
          }
          if (this.settings.tokenRx && !this.settings.tokenRx.test(part.value)) {
            throw new Error(`Formula contains invalid reference ${part.value}`);
          }
          if (this.settings.reference) {
            return this.settings.reference(part.value);
          }
          return internals.reference(part.value);
        });
      }
      _subFormula(string, name) {
        const method = this.settings.functions[name];
        if (typeof method !== "function") {
          throw new Error(`Formula contains unknown function ${name}`);
        }
        let args = [];
        if (string) {
          let current = "";
          let parenthesis = 0;
          let literal = false;
          const flush = () => {
            if (!current) {
              throw new Error(`Formula contains function ${name} with invalid arguments ${string}`);
            }
            args.push(current);
            current = "";
          };
          for (let i = 0; i < string.length; ++i) {
            const c = string[i];
            if (literal) {
              current += c;
              if (c === literal) {
                literal = false;
              }
            } else if (c in internals.literals && !parenthesis) {
              current += c;
              literal = internals.literals[c];
            } else if (c === "," && !parenthesis) {
              flush();
            } else {
              current += c;
              if (c === "(") {
                ++parenthesis;
              } else if (c === ")") {
                --parenthesis;
              }
            }
          }
          flush();
        }
        args = args.map((arg) => new exports.Parser(arg, this.settings));
        return function(context) {
          const innerValues = [];
          for (const arg of args) {
            innerValues.push(arg.evaluate(context));
          }
          return method.call(context, ...innerValues);
        };
      }
      evaluate(context) {
        const parts = this._parts.slice();
        for (let i = parts.length - 2; i >= 0; --i) {
          const part = parts[i];
          if (part && part.type === "operator") {
            const current = parts[i + 1];
            parts.splice(i + 1, 1);
            const value = internals.evaluate(current, context);
            parts[i] = internals.single(part.value, value);
          }
        }
        internals.operatorsOrder.forEach((set) => {
          for (let i = 1; i < parts.length - 1; ) {
            if (set.includes(parts[i])) {
              const operator = parts[i];
              const left = internals.evaluate(parts[i - 1], context);
              const right = internals.evaluate(parts[i + 1], context);
              parts.splice(i, 2);
              const result = internals.calculate(operator, left, right);
              parts[i - 1] = result === 0 ? 0 : result;
            } else {
              i += 2;
            }
          }
        });
        return internals.evaluate(parts[0], context);
      }
    };
    exports.Parser.prototype[internals.symbol] = true;
    internals.reference = function(name) {
      return function(context) {
        return context && context[name] !== void 0 ? context[name] : null;
      };
    };
    internals.evaluate = function(part, context) {
      if (part === null) {
        return null;
      }
      if (typeof part === "function") {
        return part(context);
      }
      if (part[internals.symbol]) {
        return part.evaluate(context);
      }
      return part;
    };
    internals.single = function(operator, value) {
      if (operator === "!") {
        return value ? false : true;
      }
      const negative = -value;
      if (negative === 0) {
        return 0;
      }
      return negative;
    };
    internals.calculate = function(operator, left, right) {
      if (operator === "??") {
        return internals.exists(left) ? left : right;
      }
      if (typeof left === "string" || typeof right === "string") {
        if (operator === "+") {
          left = internals.exists(left) ? left : "";
          right = internals.exists(right) ? right : "";
          return left + right;
        }
      } else {
        switch (operator) {
          case "^":
            return Math.pow(left, right);
          case "*":
            return left * right;
          case "/":
            return left / right;
          case "%":
            return left % right;
          case "+":
            return left + right;
          case "-":
            return left - right;
        }
      }
      switch (operator) {
        case "<":
          return left < right;
        case "<=":
          return left <= right;
        case ">":
          return left > right;
        case ">=":
          return left >= right;
        case "==":
          return left === right;
        case "!=":
          return left !== right;
        case "&&":
          return left && right;
        case "||":
          return left || right;
      }
      return null;
    };
    internals.exists = function(value) {
      return value !== null && value !== void 0;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/annotate.js
var require_annotate = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/annotate.js"(exports) {
    "use strict";
    var { clone } = require_lib();
    var Common = require_common();
    var internals = {
      annotations: /* @__PURE__ */ Symbol("annotations")
    };
    exports.error = function(stripColorCodes) {
      if (!this._original || typeof this._original !== "object") {
        return this.details[0].message;
      }
      const redFgEscape = stripColorCodes ? "" : "\x1B[31m";
      const redBgEscape = stripColorCodes ? "" : "\x1B[41m";
      const endColor = stripColorCodes ? "" : "\x1B[0m";
      const obj = clone(this._original);
      for (let i = this.details.length - 1; i >= 0; --i) {
        const pos = i + 1;
        const error = this.details[i];
        const path = error.path;
        let node = obj;
        for (let j = 0; ; ++j) {
          const seg = path[j];
          if (Common.isSchema(node)) {
            node = node.clone();
          }
          if (j + 1 < path.length && typeof node[seg] !== "string") {
            node = node[seg];
          } else {
            const refAnnotations = node[internals.annotations] || { errors: {}, missing: {} };
            node[internals.annotations] = refAnnotations;
            const cacheKey = seg || error.context.key;
            if (node[seg] !== void 0) {
              refAnnotations.errors[cacheKey] = refAnnotations.errors[cacheKey] || [];
              refAnnotations.errors[cacheKey].push(pos);
            } else {
              refAnnotations.missing[cacheKey] = pos;
            }
            break;
          }
        }
      }
      const replacers = {
        key: /_\$key\$_([, \d]+)_\$end\$_"/g,
        missing: /"_\$miss\$_([^|]+)\|(\d+)_\$end\$_": "__missing__"/g,
        arrayIndex: /\s*"_\$idx\$_([, \d]+)_\$end\$_",?\n(.*)/g,
        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)]"/g
      };
      let message = internals.safeStringify(obj, 2).replace(replacers.key, ($0, $1) => `" ${redFgEscape}[${$1}]${endColor}`).replace(replacers.missing, ($0, $1, $2) => `${redBgEscape}"${$1}"${endColor}${redFgEscape} [${$2}]: -- missing --${endColor}`).replace(replacers.arrayIndex, ($0, $1, $2) => `
${$2} ${redFgEscape}[${$1}]${endColor}`).replace(replacers.specials, ($0, $1) => $1);
      message = `${message}
${redFgEscape}`;
      for (let i = 0; i < this.details.length; ++i) {
        const pos = i + 1;
        message = `${message}
[${pos}] ${this.details[i].message}`;
      }
      message = message + endColor;
      return message;
    };
    internals.safeStringify = function(obj, spaces) {
      return JSON.stringify(obj, internals.serializer(), spaces);
    };
    internals.serializer = function() {
      const keys = [];
      const stack = [];
      const cycleReplacer = (key, value) => {
        if (stack[0] === value) {
          return "[Circular ~]";
        }
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]";
      };
      return function(key, value) {
        if (stack.length > 0) {
          const thisPos = stack.indexOf(this);
          if (~thisPos) {
            stack.length = thisPos + 1;
            keys.length = thisPos + 1;
            keys[thisPos] = key;
          } else {
            stack.push(this);
            keys.push(key);
          }
          if (~stack.indexOf(value)) {
            value = cycleReplacer.call(this, key, value);
          }
        } else {
          stack.push(value);
        }
        if (value) {
          const annotations = value[internals.annotations];
          if (annotations) {
            if (Array.isArray(value)) {
              const annotated = [];
              for (let i = 0; i < value.length; ++i) {
                if (annotations.errors[i]) {
                  annotated.push(`_$idx$_${annotations.errors[i].sort().join(", ")}_$end$_`);
                }
                annotated.push(value[i]);
              }
              value = annotated;
            } else {
              for (const errorKey of Object.keys(annotations.errors)) {
                value[`${errorKey}_$key$_${annotations.errors[errorKey].sort().join(", ")}_$end$_`] = value[errorKey];
                value[errorKey] = void 0;
              }
              for (const missingKey of Object.keys(annotations.missing)) {
                value[`_$miss$_${missingKey}|${annotations.missing[missingKey]}_$end$_`] = "__missing__";
              }
            }
            return value;
          }
        }
        if (value === Infinity || value === -Infinity || Number.isNaN(value) || typeof value === "function" || typeof value === "symbol") {
          return "[" + value.toString() + "]";
        }
        return value;
      };
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/errors.js"(exports) {
    "use strict";
    var Annotate = require_annotate();
    var Common = require_common();
    var Template = require_template();
    exports.Report = class {
      constructor(code, value, local, flags, messages, state, prefs) {
        this.code = code;
        this.flags = flags;
        this.messages = messages;
        this.path = state.path;
        this.prefs = prefs;
        this.state = state;
        this.value = value;
        this.message = null;
        this.template = null;
        this.local = local || {};
        this.local.label = exports.label(this.flags, this.state, this.prefs, this.messages);
        if (this.value !== void 0 && !this.local.hasOwnProperty("value")) {
          this.local.value = this.value;
        }
        if (this.path.length) {
          const key = this.path[this.path.length - 1];
          if (typeof key !== "object") {
            this.local.key = key;
          }
        }
      }
      _setTemplate(template) {
        this.template = template;
        if (!this.flags.label && this.path.length === 0) {
          const localized = this._template(this.template, "root");
          if (localized) {
            this.local.label = localized;
          }
        }
      }
      toString() {
        if (this.message) {
          return this.message;
        }
        const code = this.code;
        if (!this.prefs.errors.render) {
          return this.code;
        }
        const template = this._template(this.template) || this._template(this.prefs.messages) || this._template(this.messages);
        if (template === void 0) {
          return `Error code "${code}" is not defined, your custom type is missing the correct messages definition`;
        }
        this.message = template.render(this.value, this.state, this.prefs, this.local, { errors: this.prefs.errors, messages: [this.prefs.messages, this.messages] });
        if (!this.prefs.errors.label) {
          this.message = this.message.replace(/^"" /, "").trim();
        }
        return this.message;
      }
      _template(messages, code) {
        return exports.template(this.value, messages, code || this.code, this.state, this.prefs);
      }
    };
    exports.path = function(path) {
      let label = "";
      for (const segment of path) {
        if (typeof segment === "object") {
          continue;
        }
        if (typeof segment === "string") {
          if (label) {
            label += ".";
          }
          label += segment;
        } else {
          label += `[${segment}]`;
        }
      }
      return label;
    };
    exports.template = function(value, messages, code, state, prefs) {
      if (!messages) {
        return;
      }
      if (Template.isTemplate(messages)) {
        return code !== "root" ? messages : null;
      }
      let lang = prefs.errors.language;
      if (Common.isResolvable(lang)) {
        lang = lang.resolve(value, state, prefs);
      }
      if (lang && messages[lang]) {
        if (messages[lang][code] !== void 0) {
          return messages[lang][code];
        }
        if (messages[lang]["*"] !== void 0) {
          return messages[lang]["*"];
        }
      }
      if (!messages[code]) {
        return messages["*"];
      }
      return messages[code];
    };
    exports.label = function(flags, state, prefs, messages) {
      if (!prefs.errors.label) {
        return "";
      }
      if (flags.label) {
        return flags.label;
      }
      let path = state.path;
      if (prefs.errors.label === "key" && state.path.length > 1) {
        path = state.path.slice(-1);
      }
      const normalized = exports.path(path);
      if (normalized) {
        return normalized;
      }
      return exports.template(null, prefs.messages, "root", state, prefs) || messages && exports.template(null, messages, "root", state, prefs) || "value";
    };
    exports.process = function(errors, original, prefs) {
      if (!errors) {
        return null;
      }
      const { override, message, details } = exports.details(errors);
      if (override) {
        return override;
      }
      if (prefs.errors.stack) {
        return new exports.ValidationError(message, details, original);
      }
      const limit = Error.stackTraceLimit;
      Error.stackTraceLimit = 0;
      const validationError = new exports.ValidationError(message, details, original);
      Error.stackTraceLimit = limit;
      return validationError;
    };
    exports.details = function(errors, options = {}) {
      let messages = [];
      const details = [];
      for (const item of errors) {
        if (item instanceof Error) {
          if (options.override !== false) {
            return { override: item };
          }
          const message2 = item.toString();
          messages.push(message2);
          details.push({
            message: message2,
            type: "override",
            context: { error: item }
          });
          continue;
        }
        const message = item.toString();
        messages.push(message);
        details.push({
          message,
          path: item.path.filter((v) => typeof v !== "object"),
          type: item.code,
          context: item.local
        });
      }
      if (messages.length > 1) {
        messages = [...new Set(messages)];
      }
      return { message: messages.join(". "), details };
    };
    exports.ValidationError = class extends Error {
      constructor(message, details, original) {
        super(message);
        this._original = original;
        this.details = details;
      }
      static isError(err) {
        return err instanceof exports.ValidationError;
      }
    };
    exports.ValidationError.prototype.isJoi = true;
    exports.ValidationError.prototype.name = "ValidationError";
    exports.ValidationError.prototype.annotate = Annotate.error;
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/ref.js
var require_ref = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/ref.js"(exports) {
    "use strict";
    var { assert, clone, reach } = require_lib();
    var Common = require_common();
    var Template;
    var internals = {
      symbol: /* @__PURE__ */ Symbol("ref"),
      // Used to internally identify references (shared with other joi versions)
      defaults: {
        adjust: null,
        in: false,
        iterables: null,
        map: null,
        separator: ".",
        type: "value"
      }
    };
    exports.create = function(key, options = {}) {
      assert(typeof key === "string", "Invalid reference key:", key);
      Common.assertOptions(options, ["adjust", "ancestor", "in", "iterables", "map", "prefix", "render", "separator"]);
      assert(!options.prefix || typeof options.prefix === "object", "options.prefix must be of type object");
      const ref = Object.assign({}, internals.defaults, options);
      delete ref.prefix;
      const separator = ref.separator;
      const context = internals.context(key, separator, options.prefix);
      ref.type = context.type;
      key = context.key;
      if (ref.type === "value") {
        if (context.root) {
          assert(!separator || key[0] !== separator, "Cannot specify relative path with root prefix");
          ref.ancestor = "root";
          if (!key) {
            key = null;
          }
        }
        if (separator && separator === key) {
          key = null;
          ref.ancestor = 0;
        } else {
          if (ref.ancestor !== void 0) {
            assert(!separator || !key || key[0] !== separator, "Cannot combine prefix with ancestor option");
          } else {
            const [ancestor, slice] = internals.ancestor(key, separator);
            if (slice) {
              key = key.slice(slice);
              if (key === "") {
                key = null;
              }
            }
            ref.ancestor = ancestor;
          }
        }
      }
      ref.path = separator ? key === null ? [] : key.split(separator) : [key];
      return new internals.Ref(ref);
    };
    exports.in = function(key, options = {}) {
      return exports.create(key, { ...options, in: true });
    };
    exports.isRef = function(ref) {
      return ref ? !!ref[Common.symbols.ref] : false;
    };
    internals.Ref = class {
      constructor(options) {
        assert(typeof options === "object", "Invalid reference construction");
        Common.assertOptions(options, [
          "adjust",
          "ancestor",
          "in",
          "iterables",
          "map",
          "path",
          "render",
          "separator",
          "type",
          // Copied
          "depth",
          "key",
          "root",
          "display"
          // Overridden
        ]);
        assert([false, void 0].includes(options.separator) || typeof options.separator === "string" && options.separator.length === 1, "Invalid separator");
        assert(!options.adjust || typeof options.adjust === "function", "options.adjust must be a function");
        assert(!options.map || Array.isArray(options.map), "options.map must be an array");
        assert(!options.map || !options.adjust, "Cannot set both map and adjust options");
        Object.assign(this, internals.defaults, options);
        assert(this.type === "value" || this.ancestor === void 0, "Non-value references cannot reference ancestors");
        if (Array.isArray(this.map)) {
          this.map = new Map(this.map);
        }
        this.depth = this.path.length;
        this.key = this.path.length ? this.path.join(this.separator) : null;
        this.root = this.path[0];
        this.updateDisplay();
      }
      resolve(value, state, prefs, local, options = {}) {
        assert(!this.in || options.in, "Invalid in() reference usage");
        if (this.type === "global") {
          return this._resolve(prefs.context, state, options);
        }
        if (this.type === "local") {
          return this._resolve(local, state, options);
        }
        if (!this.ancestor) {
          return this._resolve(value, state, options);
        }
        if (this.ancestor === "root") {
          return this._resolve(state.ancestors[state.ancestors.length - 1], state, options);
        }
        assert(this.ancestor <= state.ancestors.length, "Invalid reference exceeds the schema root:", this.display);
        return this._resolve(state.ancestors[this.ancestor - 1], state, options);
      }
      _resolve(target, state, options) {
        let resolved;
        if (this.type === "value" && state.mainstay.shadow && options.shadow !== false) {
          resolved = state.mainstay.shadow.get(this.absolute(state));
        }
        if (resolved === void 0) {
          resolved = reach(target, this.path, { iterables: this.iterables, functions: true });
        }
        if (this.adjust) {
          resolved = this.adjust(resolved);
        }
        if (this.map) {
          const mapped = this.map.get(resolved);
          if (mapped !== void 0) {
            resolved = mapped;
          }
        }
        if (state.mainstay) {
          state.mainstay.tracer.resolve(state, this, resolved);
        }
        return resolved;
      }
      toString() {
        return this.display;
      }
      absolute(state) {
        return [...state.path.slice(0, -this.ancestor), ...this.path];
      }
      clone() {
        return new internals.Ref(this);
      }
      describe() {
        const ref = { path: this.path };
        if (this.type !== "value") {
          ref.type = this.type;
        }
        if (this.separator !== ".") {
          ref.separator = this.separator;
        }
        if (this.type === "value" && this.ancestor !== 1) {
          ref.ancestor = this.ancestor;
        }
        if (this.map) {
          ref.map = [...this.map];
        }
        for (const key of ["adjust", "iterables", "render"]) {
          if (this[key] !== null && this[key] !== void 0) {
            ref[key] = this[key];
          }
        }
        if (this.in !== false) {
          ref.in = true;
        }
        return { ref };
      }
      updateDisplay() {
        const key = this.key !== null ? this.key : "";
        if (this.type !== "value") {
          this.display = `ref:${this.type}:${key}`;
          return;
        }
        if (!this.separator) {
          this.display = `ref:${key}`;
          return;
        }
        if (!this.ancestor) {
          this.display = `ref:${this.separator}${key}`;
          return;
        }
        if (this.ancestor === "root") {
          this.display = `ref:root:${key}`;
          return;
        }
        if (this.ancestor === 1) {
          this.display = `ref:${key || ".."}`;
          return;
        }
        const lead = new Array(this.ancestor + 1).fill(this.separator).join("");
        this.display = `ref:${lead}${key || ""}`;
      }
    };
    internals.Ref.prototype[Common.symbols.ref] = true;
    exports.build = function(desc) {
      desc = Object.assign({}, internals.defaults, desc);
      if (desc.type === "value" && desc.ancestor === void 0) {
        desc.ancestor = 1;
      }
      return new internals.Ref(desc);
    };
    internals.context = function(key, separator, prefix = {}) {
      key = key.trim();
      if (prefix) {
        const globalp = prefix.global === void 0 ? "$" : prefix.global;
        if (globalp !== separator && key.startsWith(globalp)) {
          return { key: key.slice(globalp.length), type: "global" };
        }
        const local = prefix.local === void 0 ? "#" : prefix.local;
        if (local !== separator && key.startsWith(local)) {
          return { key: key.slice(local.length), type: "local" };
        }
        const root = prefix.root === void 0 ? "/" : prefix.root;
        if (root !== separator && key.startsWith(root)) {
          return { key: key.slice(root.length), type: "value", root: true };
        }
      }
      return { key, type: "value" };
    };
    internals.ancestor = function(key, separator) {
      if (!separator) {
        return [1, 0];
      }
      if (key[0] !== separator) {
        return [1, 0];
      }
      if (key[1] !== separator) {
        return [0, 1];
      }
      let i = 2;
      while (key[i] === separator) {
        ++i;
      }
      return [i - 1, i];
    };
    exports.toSibling = 0;
    exports.toParent = 1;
    exports.Manager = class {
      constructor() {
        this.refs = [];
      }
      register(source, target) {
        if (!source) {
          return;
        }
        target = target === void 0 ? exports.toParent : target;
        if (Array.isArray(source)) {
          for (const ref of source) {
            this.register(ref, target);
          }
          return;
        }
        if (Common.isSchema(source)) {
          for (const item of source._refs.refs) {
            if (item.ancestor - target >= 0) {
              this.refs.push({ ancestor: item.ancestor - target, root: item.root });
            }
          }
          return;
        }
        if (exports.isRef(source) && source.type === "value" && source.ancestor - target >= 0) {
          this.refs.push({ ancestor: source.ancestor - target, root: source.root });
        }
        Template = Template || require_template();
        if (Template.isTemplate(source)) {
          this.register(source.refs(), target);
        }
      }
      get length() {
        return this.refs.length;
      }
      clone() {
        const copy = new exports.Manager();
        copy.refs = clone(this.refs);
        return copy;
      }
      reset() {
        this.refs = [];
      }
      roots() {
        return this.refs.filter((ref) => !ref.ancestor).map((ref) => ref.root);
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/template.js
var require_template = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/template.js"(exports, module) {
    "use strict";
    var { assert, clone, escapeHtml } = require_lib();
    var Formula = require_lib2();
    var Common = require_common();
    var Errors = require_errors();
    var Ref = require_ref();
    var internals = {
      symbol: /* @__PURE__ */ Symbol("template"),
      opens: new Array(1e3).join("\0"),
      closes: new Array(1e3).join(""),
      dateFormat: {
        date: Date.prototype.toDateString,
        iso: Date.prototype.toISOString,
        string: Date.prototype.toString,
        time: Date.prototype.toTimeString,
        utc: Date.prototype.toUTCString
      }
    };
    module.exports = exports = internals.Template = class {
      constructor(source, options) {
        assert(typeof source === "string", "Template source must be a string");
        assert(!source.includes("\0") && !source.includes(""), "Template source cannot contain reserved control characters");
        this.source = source;
        this.rendered = source;
        this._template = null;
        if (options) {
          const { functions, ...opts } = options;
          this._settings = Object.keys(opts).length ? clone(opts) : void 0;
          this._functions = functions;
          if (this._functions) {
            assert(Object.keys(this._functions).every((key) => typeof key === "string"), "Functions keys must be strings");
            assert(Object.values(this._functions).every((key) => typeof key === "function"), "Functions values must be functions");
          }
        } else {
          this._settings = void 0;
          this._functions = void 0;
        }
        this._parse();
      }
      _parse() {
        if (!this.source.includes("{")) {
          return;
        }
        const encoded = internals.encode(this.source);
        const parts = internals.split(encoded);
        let refs = false;
        const processed = [];
        const head = parts.shift();
        if (head) {
          processed.push(internals.decode(head));
        }
        for (const part of parts) {
          const raw = part[0] !== "{";
          const ender = raw ? "}" : "}}";
          const end = part.indexOf(ender);
          if (end === -1 || // Ignore non-matching closing
          part[1] === "{") {
            processed.push(`{${internals.decode(part)}`);
            continue;
          }
          let variable = part.slice(raw ? 0 : 1, end);
          const wrapped = variable[0] === ":";
          if (wrapped) {
            variable = variable.slice(1);
          }
          const dynamic = this._ref(internals.decode(variable), { raw, wrapped });
          processed.push(dynamic);
          if (typeof dynamic !== "string") {
            refs = true;
          }
          const rest = part.slice(end + ender.length);
          if (rest) {
            processed.push(internals.decode(rest));
          }
        }
        if (!refs) {
          this.rendered = processed.join("");
          return;
        }
        this._template = processed;
      }
      static date(date, prefs) {
        return internals.dateFormat[prefs.dateFormat].call(date);
      }
      describe(options = {}) {
        if (!this._settings && options.compact) {
          return this.source;
        }
        const desc = { template: this.source };
        if (this._settings) {
          desc.options = this._settings;
        }
        if (this._functions) {
          desc.functions = this._functions;
        }
        return desc;
      }
      static build(desc) {
        return new internals.Template(desc.template, desc.options || desc.functions ? { ...desc.options, functions: desc.functions } : void 0);
      }
      isDynamic() {
        return !!this._template;
      }
      static isTemplate(template) {
        return template ? !!template[Common.symbols.template] : false;
      }
      refs() {
        if (!this._template) {
          return;
        }
        const refs = [];
        for (const part of this._template) {
          if (typeof part !== "string") {
            refs.push(...part.refs);
          }
        }
        return refs;
      }
      resolve(value, state, prefs, local) {
        if (this._template && this._template.length === 1) {
          return this._part(
            this._template[0],
            /* context -> [*/
            value,
            state,
            prefs,
            local,
            {}
            /*] */
          );
        }
        return this.render(value, state, prefs, local);
      }
      _part(part, ...args) {
        if (part.ref) {
          return part.ref.resolve(...args);
        }
        return part.formula.evaluate(args);
      }
      render(value, state, prefs, local, options = {}) {
        if (!this.isDynamic()) {
          return this.rendered;
        }
        const parts = [];
        for (const part of this._template) {
          if (typeof part === "string") {
            parts.push(part);
          } else {
            const rendered = this._part(
              part,
              /* context -> [*/
              value,
              state,
              prefs,
              local,
              options
              /*] */
            );
            const string = internals.stringify(rendered, value, state, prefs, local, options);
            if (string !== void 0) {
              const result = part.raw || (options.errors && options.errors.escapeHtml) === false ? string : escapeHtml(string);
              parts.push(internals.wrap(result, part.wrapped && prefs.errors.wrap.label));
            }
          }
        }
        return parts.join("");
      }
      _ref(content, { raw, wrapped }) {
        const refs = [];
        const reference = (variable) => {
          const ref = Ref.create(variable, this._settings);
          refs.push(ref);
          return (context) => {
            const resolved = ref.resolve(...context);
            return resolved !== void 0 ? resolved : null;
          };
        };
        try {
          const functions = this._functions ? { ...internals.functions, ...this._functions } : internals.functions;
          var formula = new Formula.Parser(content, { reference, functions, constants: internals.constants });
        } catch (err) {
          err.message = `Invalid template variable "${content}" fails due to: ${err.message}`;
          throw err;
        }
        if (formula.single) {
          if (formula.single.type === "reference") {
            const ref = refs[0];
            return { ref, raw, refs, wrapped: wrapped || ref.type === "local" && ref.key === "label" };
          }
          return internals.stringify(formula.single.value);
        }
        return { formula, raw, refs };
      }
      toString() {
        return this.source;
      }
    };
    internals.Template.prototype[Common.symbols.template] = true;
    internals.Template.prototype.isImmutable = true;
    internals.encode = function(string) {
      return string.replace(/\\(\{+)/g, ($0, $1) => {
        return internals.opens.slice(0, $1.length);
      }).replace(/\\(\}+)/g, ($0, $1) => {
        return internals.closes.slice(0, $1.length);
      });
    };
    internals.decode = function(string) {
      return string.replace(/\u0000/g, "{").replace(/\u0001/g, "}");
    };
    internals.split = function(string) {
      const parts = [];
      let current = "";
      for (let i = 0; i < string.length; ++i) {
        const char = string[i];
        if (char === "{") {
          let next = "";
          while (i + 1 < string.length && string[i + 1] === "{") {
            next += "{";
            ++i;
          }
          parts.push(current);
          current = next;
        } else {
          current += char;
        }
      }
      parts.push(current);
      return parts;
    };
    internals.wrap = function(value, ends) {
      if (!ends) {
        return value;
      }
      if (ends.length === 1) {
        return `${ends}${value}${ends}`;
      }
      return `${ends[0]}${value}${ends[1]}`;
    };
    internals.stringify = function(value, original, state, prefs, local, options = {}) {
      const type = typeof value;
      const wrap = prefs && prefs.errors && prefs.errors.wrap || {};
      let skipWrap = false;
      if (Ref.isRef(value) && value.render) {
        skipWrap = value.in;
        value = value.resolve(original, state, prefs, local, { in: value.in, ...options });
      }
      if (value === null) {
        return "null";
      }
      if (type === "string") {
        return internals.wrap(value, options.arrayItems && wrap.string);
      }
      if (type === "number" || type === "function" || type === "symbol") {
        return value.toString();
      }
      if (type !== "object") {
        return JSON.stringify(value);
      }
      if (value instanceof Date) {
        return internals.Template.date(value, prefs);
      }
      if (value instanceof Map) {
        const pairs = [];
        for (const [key, sym] of value.entries()) {
          pairs.push(`${key.toString()} -> ${sym.toString()}`);
        }
        value = pairs;
      }
      if (!Array.isArray(value)) {
        return value.toString();
      }
      const values = [];
      for (const item of value) {
        values.push(internals.stringify(item, original, state, prefs, local, { arrayItems: true, ...options }));
      }
      return internals.wrap(values.join(", "), !skipWrap && wrap.array);
    };
    internals.constants = {
      true: true,
      false: false,
      null: null,
      second: 1e3,
      minute: 60 * 1e3,
      hour: 60 * 60 * 1e3,
      day: 24 * 60 * 60 * 1e3
    };
    internals.functions = {
      if(condition, then, otherwise) {
        return condition ? then : otherwise;
      },
      length(item) {
        if (typeof item === "string") {
          return item.length;
        }
        if (!item || typeof item !== "object") {
          return null;
        }
        if (Array.isArray(item)) {
          return item.length;
        }
        return Object.keys(item).length;
      },
      msg(code) {
        const [value, state, prefs, local, options] = this;
        const messages = options.messages;
        if (!messages) {
          return "";
        }
        const template = Errors.template(value, messages[0], code, state, prefs) || Errors.template(value, messages[1], code, state, prefs);
        if (!template) {
          return "";
        }
        return template.render(value, state, prefs, local, options);
      },
      number(value) {
        if (typeof value === "number") {
          return value;
        }
        if (typeof value === "string") {
          return parseFloat(value);
        }
        if (typeof value === "boolean") {
          return value ? 1 : 0;
        }
        if (value instanceof Date) {
          return value.getTime();
        }
        return null;
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/messages.js
var require_messages = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/messages.js"(exports) {
    "use strict";
    var { assert, clone } = require_lib();
    var Template = require_template();
    exports.compile = function(messages, target) {
      if (typeof messages === "string") {
        assert(!target, "Cannot set single message string");
        return new Template(messages);
      }
      if (Template.isTemplate(messages)) {
        assert(!target, "Cannot set single message template");
        return messages;
      }
      assert(typeof messages === "object" && !Array.isArray(messages), "Invalid message options");
      target = target ? clone(target) : {};
      for (const code of Object.keys(messages)) {
        const message = messages[code];
        if (code === "root" || Template.isTemplate(message)) {
          target[code] = message;
          continue;
        }
        if (typeof message === "string") {
          target[code] = new Template(message);
          continue;
        }
        assert(typeof message === "object" && !Array.isArray(message), "Invalid message for", code);
        const language = code;
        target[language] = target[language] || {};
        for (const key of Object.keys(message)) {
          const localized = message[key];
          if (key === "root" || Template.isTemplate(localized)) {
            target[language][key] = localized;
            continue;
          }
          assert(typeof localized === "string", "Invalid message for", key, "in", language);
          target[language][key] = new Template(localized);
        }
      }
      return target;
    };
    exports.decompile = function(messages) {
      const target = {};
      for (const code of Object.keys(messages)) {
        const message = messages[code];
        if (code === "root") {
          target.root = message;
          continue;
        }
        if (Template.isTemplate(message)) {
          target[code] = message.describe({ compact: true });
          continue;
        }
        const language = code;
        target[language] = {};
        for (const key of Object.keys(message)) {
          const localized = message[key];
          if (key === "root") {
            target[language].root = localized;
            continue;
          }
          target[language][key] = localized.describe({ compact: true });
        }
      }
      return target;
    };
    exports.merge = function(base, extended) {
      if (!base) {
        return exports.compile(extended);
      }
      if (!extended) {
        return base;
      }
      if (typeof extended === "string") {
        return new Template(extended);
      }
      if (Template.isTemplate(extended)) {
        return extended;
      }
      const target = clone(base);
      for (const code of Object.keys(extended)) {
        const message = extended[code];
        if (code === "root" || Template.isTemplate(message)) {
          target[code] = message;
          continue;
        }
        if (typeof message === "string") {
          target[code] = new Template(message);
          continue;
        }
        assert(typeof message === "object" && !Array.isArray(message), "Invalid message for", code);
        const language = code;
        target[language] = target[language] || {};
        for (const key of Object.keys(message)) {
          const localized = message[key];
          if (key === "root" || Template.isTemplate(localized)) {
            target[language][key] = localized;
            continue;
          }
          assert(typeof localized === "string", "Invalid message for", key, "in", language);
          target[language][key] = new Template(localized);
        }
      }
      return target;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/common.js
var require_common = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/common.js"(exports) {
    "use strict";
    var { assert: Assert, AssertError } = require_lib();
    var Pkg = require_package();
    var Messages;
    var Schemas;
    var internals = {
      isoDate: /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/
    };
    exports.version = Pkg.version;
    exports.defaults = {
      abortEarly: true,
      allowUnknown: false,
      artifacts: false,
      cache: true,
      context: null,
      convert: true,
      dateFormat: "iso",
      errors: {
        escapeHtml: false,
        label: "path",
        language: null,
        render: true,
        stack: false,
        wrap: {
          label: '"',
          array: "[]"
        }
      },
      externals: true,
      messages: {},
      nonEnumerables: false,
      noDefaults: false,
      presence: "optional",
      skipFunctions: false,
      stripUnknown: false,
      warnings: false
    };
    exports.symbols = {
      any: /* @__PURE__ */ Symbol.for("@hapi/joi/schema"),
      // Used to internally identify any-based types (shared with other joi versions)
      arraySingle: /* @__PURE__ */ Symbol("arraySingle"),
      deepDefault: /* @__PURE__ */ Symbol("deepDefault"),
      errors: /* @__PURE__ */ Symbol("errors"),
      literal: /* @__PURE__ */ Symbol("literal"),
      override: /* @__PURE__ */ Symbol("override"),
      parent: /* @__PURE__ */ Symbol("parent"),
      prefs: /* @__PURE__ */ Symbol("prefs"),
      ref: /* @__PURE__ */ Symbol("ref"),
      template: /* @__PURE__ */ Symbol("template"),
      values: /* @__PURE__ */ Symbol("values")
    };
    exports.assertOptions = function(options, keys, name = "Options") {
      Assert(options && typeof options === "object" && !Array.isArray(options), "Options must be of type object");
      const unknownKeys = Object.keys(options).filter((k) => !keys.includes(k));
      Assert(unknownKeys.length === 0, `${name} contain unknown keys: ${unknownKeys}`);
    };
    exports.checkPreferences = function(prefs) {
      Schemas = Schemas || require_schemas();
      const result = Schemas.preferences.validate(prefs);
      if (result.error) {
        throw new AssertError([result.error.details[0].message]);
      }
    };
    exports.compare = function(a, b, operator) {
      switch (operator) {
        case "=":
          return a === b;
        case ">":
          return a > b;
        case "<":
          return a < b;
        case ">=":
          return a >= b;
        case "<=":
          return a <= b;
      }
    };
    exports.default = function(value, defaultValue) {
      return value === void 0 ? defaultValue : value;
    };
    exports.intersect = function(set, other) {
      if (typeof set.intersection === "function") {
        return set.intersection(other);
      }
      const result = /* @__PURE__ */ new Set();
      for (const item of set) {
        if (other.has(item)) {
          result.add(item);
        }
      }
      return result;
    };
    exports.isIsoDate = function(date) {
      return internals.isoDate.test(date);
    };
    exports.isNumber = function(value) {
      return typeof value === "number" && !isNaN(value);
    };
    exports.isResolvable = function(obj) {
      if (!obj) {
        return false;
      }
      return obj[exports.symbols.ref] || obj[exports.symbols.template];
    };
    exports.isSchema = function(schema, options = {}) {
      const any = schema && schema[exports.symbols.any];
      if (!any) {
        return false;
      }
      Assert(options.legacy || any.version === exports.version, "Cannot mix different versions of joi schemas");
      return true;
    };
    exports.isValues = function(obj) {
      return obj[exports.symbols.values];
    };
    exports.limit = function(value) {
      return Number.isSafeInteger(value) && value >= 0;
    };
    exports.preferences = function(target, source) {
      Messages = Messages || require_messages();
      target = target || {};
      source = source || {};
      const merged = Object.assign({}, target, source);
      if (source.errors && target.errors) {
        merged.errors = Object.assign({}, target.errors, source.errors);
        merged.errors.wrap = Object.assign({}, target.errors.wrap, source.errors.wrap);
      }
      if (source.messages) {
        merged.messages = Messages.compile(source.messages, target.messages);
      }
      delete merged[exports.symbols.prefs];
      return merged;
    };
    exports.tryWithPath = function(fn, key, options = {}) {
      try {
        return fn();
      } catch (err) {
        if (err.path !== void 0) {
          err.path = key + "." + err.path;
        } else {
          err.path = key;
        }
        if (options.append) {
          err.message = `${err.message} (${err.path})`;
        }
        throw err;
      }
    };
    exports.validateArg = function(value, label, { assert, message }) {
      if (exports.isSchema(assert)) {
        const result = assert.validate(value);
        if (!result.error) {
          return;
        }
        return result.error.message;
      } else if (!assert(value)) {
        return label ? `${label} ${message}` : message;
      }
    };
    exports.verifyFlat = function(args, method) {
      for (const arg of args) {
        Assert(!Array.isArray(arg), "Method no longer accepts array arguments:", method);
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/cache.js
var require_cache = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/cache.js"(exports) {
    "use strict";
    var { assert, clone } = require_lib();
    var Common = require_common();
    var internals = {
      max: 1e3,
      supported: /* @__PURE__ */ new Set(["undefined", "boolean", "number", "string"])
    };
    exports.provider = {
      provision(options) {
        return new internals.Cache(options);
      }
    };
    internals.Cache = class {
      constructor(options = {}) {
        Common.assertOptions(options, ["max"]);
        assert(options.max === void 0 || options.max && options.max > 0 && isFinite(options.max), "Invalid max cache size");
        this._max = options.max || internals.max;
        this._map = /* @__PURE__ */ new Map();
        this._list = new internals.List();
      }
      get length() {
        return this._map.size;
      }
      set(key, value) {
        if (key !== null && !internals.supported.has(typeof key)) {
          return;
        }
        let node = this._map.get(key);
        if (node) {
          node.value = value;
          this._list.first(node);
          return;
        }
        node = this._list.unshift({ key, value });
        this._map.set(key, node);
        this._compact();
      }
      get(key) {
        const node = this._map.get(key);
        if (node) {
          this._list.first(node);
          return clone(node.value);
        }
      }
      _compact() {
        if (this._map.size > this._max) {
          const node = this._list.pop();
          this._map.delete(node.key);
        }
      }
    };
    internals.List = class {
      constructor() {
        this.tail = null;
        this.head = null;
      }
      unshift(node) {
        node.next = null;
        node.prev = this.head;
        if (this.head) {
          this.head.next = node;
        }
        this.head = node;
        if (!this.tail) {
          this.tail = node;
        }
        return node;
      }
      first(node) {
        if (node === this.head) {
          return;
        }
        this._remove(node);
        this.unshift(node);
      }
      pop() {
        return this._remove(this.tail);
      }
      _remove(node) {
        const { next, prev } = node;
        next.prev = prev;
        if (prev) {
          prev.next = next;
        }
        if (node === this.tail) {
          this.tail = next;
        }
        node.prev = null;
        node.next = null;
        return node;
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/compile.js
var require_compile = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/compile.js"(exports) {
    "use strict";
    var { assert } = require_lib();
    var Common = require_common();
    var Ref = require_ref();
    var internals = {};
    exports.schema = function(Joi2, config2, options = {}) {
      Common.assertOptions(options, ["appendPath", "override"]);
      try {
        return internals.schema(Joi2, config2, options);
      } catch (err) {
        if (options.appendPath && err.path !== void 0) {
          err.message = `${err.message} (${err.path})`;
        }
        throw err;
      }
    };
    internals.schema = function(Joi2, config2, options) {
      assert(config2 !== void 0, "Invalid undefined schema");
      if (Array.isArray(config2)) {
        assert(config2.length, "Invalid empty array schema");
        if (config2.length === 1) {
          config2 = config2[0];
        }
      }
      const valid = (base, ...values) => {
        if (options.override !== false) {
          return base.valid(Joi2.override, ...values);
        }
        return base.valid(...values);
      };
      if (internals.simple(config2)) {
        return valid(Joi2, config2);
      }
      if (typeof config2 === "function") {
        return Joi2.custom(config2);
      }
      assert(typeof config2 === "object", "Invalid schema content:", typeof config2);
      if (Common.isResolvable(config2)) {
        return valid(Joi2, config2);
      }
      if (Common.isSchema(config2)) {
        return config2;
      }
      if (Array.isArray(config2)) {
        for (const item of config2) {
          if (!internals.simple(item)) {
            return Joi2.alternatives().try(...config2);
          }
        }
        return valid(Joi2, ...config2);
      }
      if (config2 instanceof RegExp) {
        return Joi2.string().regex(config2);
      }
      if (config2 instanceof Date) {
        return valid(Joi2.date(), config2);
      }
      assert(Object.getPrototypeOf(config2) === Object.getPrototypeOf({}), "Schema can only contain plain objects");
      return Joi2.object().keys(config2);
    };
    exports.ref = function(id, options) {
      return Ref.isRef(id) ? id : Ref.create(id, options);
    };
    exports.compile = function(root, schema, options = {}) {
      Common.assertOptions(options, ["legacy"]);
      const any = schema && schema[Common.symbols.any];
      if (any) {
        assert(options.legacy || any.version === Common.version, "Cannot mix different versions of joi schemas:", any.version, Common.version);
        return schema;
      }
      if (typeof schema !== "object" || !options.legacy) {
        return exports.schema(root, schema, { appendPath: true });
      }
      const compiler = internals.walk(schema);
      if (!compiler) {
        return exports.schema(root, schema, { appendPath: true });
      }
      return compiler.compile(compiler.root, schema);
    };
    internals.walk = function(schema) {
      if (typeof schema !== "object") {
        return null;
      }
      if (Array.isArray(schema)) {
        for (const item of schema) {
          const compiler = internals.walk(item);
          if (compiler) {
            return compiler;
          }
        }
        return null;
      }
      const any = schema[Common.symbols.any];
      if (any) {
        return { root: schema[any.root], compile: any.compile };
      }
      assert(Object.getPrototypeOf(schema) === Object.getPrototypeOf({}), "Schema can only contain plain objects");
      for (const key of Object.keys(schema)) {
        const compiler = internals.walk(schema[key]);
        if (compiler) {
          return compiler;
        }
      }
      return null;
    };
    internals.simple = function(value) {
      return value === null || ["boolean", "string", "number"].includes(typeof value);
    };
    exports.when = function(schema, condition, options) {
      if (options === void 0) {
        assert(condition && typeof condition === "object", "Missing options");
        options = condition;
        condition = Ref.create(".");
      }
      if (Array.isArray(options)) {
        options = { switch: options };
      }
      Common.assertOptions(options, ["is", "not", "then", "otherwise", "switch", "break"]);
      if (Common.isSchema(condition)) {
        assert(options.is === void 0, '"is" can not be used with a schema condition');
        assert(options.not === void 0, '"not" can not be used with a schema condition');
        assert(options.switch === void 0, '"switch" can not be used with a schema condition');
        return internals.condition(schema, { is: condition, then: options.then, otherwise: options.otherwise, break: options.break });
      }
      assert(Ref.isRef(condition) || typeof condition === "string", "Invalid condition:", condition);
      assert(options.not === void 0 || options.is === void 0, 'Cannot combine "is" with "not"');
      if (options.switch === void 0) {
        let rule2 = options;
        if (options.not !== void 0) {
          rule2 = { is: options.not, then: options.otherwise, otherwise: options.then, break: options.break };
        }
        let is = rule2.is !== void 0 ? schema.$_compile(rule2.is) : schema.$_root.invalid(null, false, 0, "").required();
        assert(rule2.then !== void 0 || rule2.otherwise !== void 0, 'options must have at least one of "then", "otherwise", or "switch"');
        assert(rule2.break === void 0 || rule2.then === void 0 || rule2.otherwise === void 0, "Cannot specify then, otherwise, and break all together");
        if (options.is !== void 0 && !Ref.isRef(options.is) && !Common.isSchema(options.is)) {
          is = is.required();
        }
        return internals.condition(schema, { ref: exports.ref(condition), is, then: rule2.then, otherwise: rule2.otherwise, break: rule2.break });
      }
      assert(Array.isArray(options.switch), '"switch" must be an array');
      assert(options.is === void 0, 'Cannot combine "switch" with "is"');
      assert(options.not === void 0, 'Cannot combine "switch" with "not"');
      assert(options.then === void 0, 'Cannot combine "switch" with "then"');
      const rule = {
        ref: exports.ref(condition),
        switch: [],
        break: options.break
      };
      for (let i = 0; i < options.switch.length; ++i) {
        const test = options.switch[i];
        const last = i === options.switch.length - 1;
        Common.assertOptions(test, last ? ["is", "then", "otherwise"] : ["is", "then"]);
        assert(test.is !== void 0, 'Switch statement missing "is"');
        assert(test.then !== void 0, 'Switch statement missing "then"');
        const item = {
          is: schema.$_compile(test.is),
          then: schema.$_compile(test.then)
        };
        if (!Ref.isRef(test.is) && !Common.isSchema(test.is)) {
          item.is = item.is.required();
        }
        if (last) {
          assert(options.otherwise === void 0 || test.otherwise === void 0, 'Cannot specify "otherwise" inside and outside a "switch"');
          const otherwise = options.otherwise !== void 0 ? options.otherwise : test.otherwise;
          if (otherwise !== void 0) {
            assert(rule.break === void 0, "Cannot specify both otherwise and break");
            item.otherwise = schema.$_compile(otherwise);
          }
        }
        rule.switch.push(item);
      }
      return rule;
    };
    internals.condition = function(schema, condition) {
      for (const key of ["then", "otherwise"]) {
        if (condition[key] === void 0) {
          delete condition[key];
        } else {
          condition[key] = schema.$_compile(condition[key]);
        }
      }
      return condition;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/extend.js
var require_extend = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/extend.js"(exports) {
    "use strict";
    var { assert, clone } = require_lib();
    var Common = require_common();
    var Messages = require_messages();
    var internals = {};
    exports.type = function(from, options) {
      const base = Object.getPrototypeOf(from);
      const prototype = clone(base);
      const schema = from._assign(Object.create(prototype));
      const def = Object.assign({}, options);
      delete def.base;
      prototype._definition = def;
      const parent = base._definition || {};
      def.messages = Messages.merge(parent.messages, def.messages);
      def.properties = Object.assign({}, parent.properties, def.properties);
      schema.type = def.type;
      def.flags = Object.assign({}, parent.flags, def.flags);
      const terms = Object.assign({}, parent.terms);
      if (def.terms) {
        for (const name of Object.keys(def.terms)) {
          const term = def.terms[name];
          assert(schema.$_terms[name] === void 0, "Invalid term override for", def.type, name);
          schema.$_terms[name] = term.init;
          terms[name] = term;
        }
      }
      def.terms = terms;
      if (!def.args) {
        def.args = parent.args;
      }
      def.prepare = internals.prepare(def.prepare, parent.prepare);
      if (def.coerce) {
        if (typeof def.coerce === "function") {
          def.coerce = { method: def.coerce };
        }
        if (def.coerce.from && !Array.isArray(def.coerce.from)) {
          def.coerce = { method: def.coerce.method, from: [].concat(def.coerce.from) };
        }
      }
      def.coerce = internals.coerce(def.coerce, parent.coerce);
      def.validate = internals.validate(def.validate, parent.validate);
      const rules = Object.assign({}, parent.rules);
      if (def.rules) {
        for (const name of Object.keys(def.rules)) {
          const rule = def.rules[name];
          assert(typeof rule === "object", "Invalid rule definition for", def.type, name);
          let method = rule.method;
          if (method === void 0) {
            method = function() {
              return this.$_addRule(name);
            };
          }
          if (method) {
            assert(!prototype[name], "Rule conflict in", def.type, name);
            prototype[name] = method;
          }
          assert(!rules[name], "Rule conflict in", def.type, name);
          rules[name] = rule;
          if (rule.alias) {
            const aliases = [].concat(rule.alias);
            for (const alias of aliases) {
              prototype[alias] = rule.method;
            }
          }
          if (rule.args) {
            rule.argsByName = /* @__PURE__ */ new Map();
            rule.args = rule.args.map((arg) => {
              if (typeof arg === "string") {
                arg = { name: arg };
              }
              assert(!rule.argsByName.has(arg.name), "Duplicated argument name", arg.name);
              if (Common.isSchema(arg.assert)) {
                arg.assert = arg.assert.strict().label(arg.name);
              }
              rule.argsByName.set(arg.name, arg);
              return arg;
            });
          }
        }
      }
      def.rules = rules;
      if (!def.jsonSchema) {
        def.jsonSchema = parent.jsonSchema;
      }
      const modifiers = Object.assign({}, parent.modifiers);
      if (def.modifiers) {
        for (const name of Object.keys(def.modifiers)) {
          assert(!prototype[name], "Rule conflict in", def.type, name);
          const modifier = def.modifiers[name];
          assert(typeof modifier === "function", "Invalid modifier definition for", def.type, name);
          const method = function(arg) {
            return this.rule({ [name]: arg });
          };
          prototype[name] = method;
          modifiers[name] = modifier;
        }
      }
      def.modifiers = modifiers;
      if (def.overrides) {
        prototype._super = base;
        schema.$_super = {};
        for (const override of Object.keys(def.overrides)) {
          assert(base[override], "Cannot override missing", override);
          def.overrides[override][Common.symbols.parent] = base[override];
          schema.$_super[override] = base[override].bind(schema);
        }
        Object.assign(prototype, def.overrides);
      }
      def.cast = Object.assign({}, parent.cast, def.cast);
      const manifest = Object.assign({}, parent.manifest, def.manifest);
      manifest.build = internals.build(def.manifest && def.manifest.build, parent.manifest && parent.manifest.build);
      def.manifest = manifest;
      def.rebuild = internals.rebuild(def.rebuild, parent.rebuild);
      return schema;
    };
    internals.build = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(obj, desc) {
        return parent(child(obj, desc), desc);
      };
    };
    internals.coerce = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return {
        from: child.from && parent.from ? [.../* @__PURE__ */ new Set([...child.from, ...parent.from])] : null,
        method(value, helpers) {
          let coerced;
          if (!parent.from || parent.from.includes(typeof value)) {
            coerced = parent.method(value, helpers);
            if (coerced) {
              if (coerced.errors || coerced.value === void 0) {
                return coerced;
              }
              value = coerced.value;
            }
          }
          if (!child.from || child.from.includes(typeof value)) {
            const own = child.method(value, helpers);
            if (own) {
              return own;
            }
          }
          return coerced;
        }
      };
    };
    internals.prepare = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(value, helpers) {
        const prepared = child(value, helpers);
        if (prepared) {
          if (prepared.errors || prepared.value === void 0) {
            return prepared;
          }
          value = prepared.value;
        }
        return parent(value, helpers) || prepared;
      };
    };
    internals.rebuild = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(schema) {
        parent(schema);
        child(schema);
      };
    };
    internals.validate = function(child, parent) {
      if (!child || !parent) {
        return child || parent;
      }
      return function(value, helpers) {
        const result = parent(value, helpers);
        if (result) {
          if (result.errors && (!Array.isArray(result.errors) || result.errors.length)) {
            return result;
          }
          value = result.value;
        }
        return child(value, helpers) || result;
      };
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/manifest.js
var require_manifest = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/manifest.js"(exports) {
    "use strict";
    var { assert, clone } = require_lib();
    var Common = require_common();
    var Messages = require_messages();
    var Ref = require_ref();
    var Template = require_template();
    var Schemas;
    var internals = {};
    exports.describe = function(schema) {
      const def = schema._definition;
      const desc = {
        type: schema.type,
        flags: {},
        rules: []
      };
      for (const flag of Object.keys(schema._flags)) {
        if (flag[0] !== "_") {
          desc.flags[flag] = internals.describe(schema._flags[flag]);
        }
      }
      if (!Object.keys(desc.flags).length) {
        delete desc.flags;
      }
      if (schema._preferences) {
        desc.preferences = clone(schema._preferences, { shallow: ["messages"] });
        delete desc.preferences[Common.symbols.prefs];
        if (desc.preferences.messages) {
          desc.preferences.messages = Messages.decompile(desc.preferences.messages);
        }
      }
      if (schema._valids) {
        desc.allow = schema._valids.describe();
      }
      if (schema._invalids) {
        desc.invalid = schema._invalids.describe();
      }
      for (const rule of schema._rules) {
        const ruleDef = def.rules[rule.name];
        if (ruleDef.manifest === false) {
          continue;
        }
        const item = { name: rule.name };
        for (const custom of Object.keys(def.modifiers)) {
          if (rule[custom] !== void 0) {
            item[custom] = internals.describe(rule[custom]);
          }
        }
        if (rule.args) {
          item.args = {};
          for (const key of Object.keys(rule.args)) {
            const arg = rule.args[key];
            if (key === "options" && !Object.keys(arg).length) {
              continue;
            }
            item.args[key] = internals.describe(arg, { assign: key });
          }
          if (!Object.keys(item.args).length) {
            delete item.args;
          }
        }
        desc.rules.push(item);
      }
      if (!desc.rules.length) {
        delete desc.rules;
      }
      for (const term of Object.keys(schema.$_terms)) {
        if (term[0] === "_") {
          continue;
        }
        assert(!desc[term], "Cannot describe schema due to internal name conflict with", term);
        const items = schema.$_terms[term];
        if (!items) {
          continue;
        }
        if (items instanceof Map) {
          if (items.size) {
            desc[term] = [...items.entries()];
          }
          continue;
        }
        if (Common.isValues(items)) {
          desc[term] = items.describe();
          continue;
        }
        assert(def.terms[term], "Term", term, "missing configuration");
        const manifest = def.terms[term].manifest;
        const mapped = typeof manifest === "object";
        if (!items.length && !mapped) {
          continue;
        }
        const normalized = [];
        for (const item of items) {
          normalized.push(internals.describe(item));
        }
        if (mapped) {
          const { from, to } = manifest.mapped;
          desc[term] = {};
          for (const item of normalized) {
            desc[term][item[to]] = item[from];
          }
          continue;
        }
        if (manifest === "single") {
          assert(normalized.length === 1, "Term", term, "contains more than one item");
          desc[term] = normalized[0];
          continue;
        }
        desc[term] = normalized;
      }
      internals.validate(schema.$_root, desc);
      return desc;
    };
    internals.describe = function(item, options = {}) {
      if (Array.isArray(item)) {
        return item.map(internals.describe);
      }
      if (item === Common.symbols.deepDefault) {
        return { special: "deep" };
      }
      if (typeof item !== "object" || item === null) {
        return item;
      }
      if (options.assign === "options") {
        return clone(item);
      }
      if (Buffer && Buffer.isBuffer(item)) {
        return { buffer: item.toString("binary") };
      }
      if (item instanceof Date) {
        return item.toISOString();
      }
      if (item instanceof Error) {
        return item;
      }
      if (item instanceof RegExp) {
        if (options.assign === "regex") {
          return item.toString();
        }
        return { regex: item.toString() };
      }
      if (item[Common.symbols.literal]) {
        return { function: item.literal };
      }
      if (typeof item.describe === "function") {
        if (options.assign === "ref") {
          return item.describe().ref;
        }
        return item.describe();
      }
      const normalized = {};
      for (const key of Object.keys(item)) {
        const value = item[key];
        if (value === void 0) {
          continue;
        }
        normalized[key] = internals.describe(value, { assign: key });
      }
      return normalized;
    };
    exports.build = function(joi, desc) {
      const builder = new internals.Builder(joi);
      return builder.parse(desc);
    };
    internals.Builder = class {
      constructor(joi) {
        this.joi = joi;
      }
      parse(desc) {
        internals.validate(this.joi, desc);
        let schema = this.joi[desc.type]()._bare();
        const def = schema._definition;
        if (desc.flags) {
          for (const flag of Object.keys(desc.flags)) {
            const setter = def.flags[flag] && def.flags[flag].setter || flag;
            assert(typeof schema[setter] === "function", "Invalid flag", flag, "for type", desc.type);
            schema = schema[setter](this.build(desc.flags[flag]));
          }
        }
        if (desc.preferences) {
          schema = schema.preferences(this.build(desc.preferences));
        }
        if (desc.allow) {
          schema = schema.allow(...this.build(desc.allow));
        }
        if (desc.invalid) {
          schema = schema.invalid(...this.build(desc.invalid));
        }
        if (desc.rules) {
          for (const rule of desc.rules) {
            assert(typeof schema[rule.name] === "function", "Invalid rule", rule.name, "for type", desc.type);
            const args = [];
            if (rule.args) {
              const built = {};
              for (const key of Object.keys(rule.args)) {
                built[key] = this.build(rule.args[key], { assign: key });
              }
              const keys = Object.keys(built);
              const definition = def.rules[rule.name].args;
              if (definition) {
                assert(keys.length <= definition.length, "Invalid number of arguments for", desc.type, rule.name, "(expected up to", definition.length, ", found", keys.length, ")");
                for (const { name } of definition) {
                  args.push(built[name]);
                }
              } else {
                assert(keys.length === 1, "Invalid number of arguments for", desc.type, rule.name, "(expected up to 1, found", keys.length, ")");
                args.push(built[keys[0]]);
              }
            }
            schema = schema[rule.name](...args);
            const options = {};
            for (const custom of Object.keys(def.modifiers)) {
              if (rule[custom] !== void 0) {
                options[custom] = this.build(rule[custom]);
              }
            }
            if (Object.keys(options).length) {
              schema = schema.rule(options);
            }
          }
        }
        const terms = {};
        for (const key of Object.keys(desc)) {
          if (["allow", "flags", "invalid", "whens", "preferences", "rules", "type"].includes(key)) {
            continue;
          }
          assert(def.terms[key], "Term", key, "missing configuration");
          const manifest = def.terms[key].manifest;
          if (manifest === "schema") {
            terms[key] = desc[key].map((item) => this.parse(item));
            continue;
          }
          if (manifest === "values") {
            terms[key] = desc[key].map((item) => this.build(item));
            continue;
          }
          if (manifest === "single") {
            terms[key] = this.build(desc[key]);
            continue;
          }
          if (typeof manifest === "object") {
            terms[key] = {};
            for (const name of Object.keys(desc[key])) {
              const value = desc[key][name];
              terms[key][name] = this.parse(value);
            }
            continue;
          }
          terms[key] = this.build(desc[key]);
        }
        if (desc.whens) {
          terms.whens = desc.whens.map((when) => this.build(when));
        }
        schema = def.manifest.build(schema, terms);
        schema.$_temp.ruleset = false;
        return schema;
      }
      build(desc, options = {}) {
        if (desc === null) {
          return null;
        }
        if (Array.isArray(desc)) {
          return desc.map((item) => this.build(item));
        }
        if (desc instanceof Error) {
          return desc;
        }
        if (options.assign === "options") {
          return clone(desc);
        }
        if (options.assign === "regex") {
          return internals.regex(desc);
        }
        if (options.assign === "ref") {
          return Ref.build(desc);
        }
        if (typeof desc !== "object") {
          return desc;
        }
        if (Object.keys(desc).length === 1) {
          if (desc.buffer) {
            assert(Buffer, "Buffers are not supported");
            return Buffer && Buffer.from(desc.buffer, "binary");
          }
          if (desc.function) {
            return { [Common.symbols.literal]: true, literal: desc.function };
          }
          if (desc.override) {
            return Common.symbols.override;
          }
          if (desc.ref) {
            return Ref.build(desc.ref);
          }
          if (desc.regex) {
            return internals.regex(desc.regex);
          }
          if (desc.special) {
            assert(["deep"].includes(desc.special), "Unknown special value", desc.special);
            return Common.symbols.deepDefault;
          }
          if (desc.value) {
            return clone(desc.value);
          }
        }
        if (desc.type) {
          return this.parse(desc);
        }
        if (desc.template) {
          return Template.build(desc);
        }
        const normalized = {};
        for (const key of Object.keys(desc)) {
          normalized[key] = this.build(desc[key], { assign: key });
        }
        return normalized;
      }
    };
    internals.regex = function(string) {
      const end = string.lastIndexOf("/");
      const exp = string.slice(1, end);
      const flags = string.slice(end + 1);
      return new RegExp(exp, flags);
    };
    internals.validate = function(joi, desc) {
      Schemas = Schemas || require_schemas();
      joi.assert(desc, Schemas.description);
    };
  }
});

// node_modules/.pnpm/@hapi+pinpoint@2.0.1/node_modules/@hapi/pinpoint/lib/index.js
var require_lib3 = __commonJS({
  "node_modules/.pnpm/@hapi+pinpoint@2.0.1/node_modules/@hapi/pinpoint/lib/index.js"(exports) {
    "use strict";
    exports.location = function(depth = 0) {
      const orig = Error.prepareStackTrace;
      Error.prepareStackTrace = (ignore, stack) => stack;
      const capture = {};
      Error.captureStackTrace(capture, this);
      const line = capture.stack[depth + 1];
      Error.prepareStackTrace = orig;
      return {
        filename: line.getFileName(),
        line: line.getLineNumber()
      };
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/trace.js
var require_trace = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/trace.js"(exports) {
    "use strict";
    var { deepEqual } = require_lib();
    var Pinpoint = require_lib3();
    var Errors = require_errors();
    var internals = {
      codes: {
        error: 1,
        pass: 2,
        full: 3
      },
      labels: {
        0: "never used",
        1: "always error",
        2: "always pass"
      }
    };
    exports.setup = function(root) {
      const trace = function() {
        root._tracer = root._tracer || new internals.Tracer();
        return root._tracer;
      };
      root.trace = trace;
      root[/* @__PURE__ */ Symbol.for("@hapi/lab/coverage/initialize")] = trace;
      root.untrace = () => {
        root._tracer = null;
      };
    };
    exports.location = function(schema) {
      return schema.$_setFlag("_tracerLocation", Pinpoint.location(2));
    };
    internals.Tracer = class {
      constructor() {
        this.name = "Joi";
        this._schemas = /* @__PURE__ */ new Map();
      }
      _register(schema) {
        const existing = this._schemas.get(schema);
        if (existing) {
          return existing.store;
        }
        const store = new internals.Store(schema);
        const { filename, line } = schema._flags._tracerLocation || Pinpoint.location(5);
        this._schemas.set(schema, { filename, line, store });
        return store;
      }
      _combine(merged, sources) {
        for (const { store } of this._schemas.values()) {
          store._combine(merged, sources);
        }
      }
      report(file) {
        const coverage = [];
        for (const { filename, line, store } of this._schemas.values()) {
          if (file && file !== filename) {
            continue;
          }
          const missing = [];
          const skipped = [];
          for (const [schema, log] of store._sources.entries()) {
            if (internals.sub(log.paths, skipped)) {
              continue;
            }
            if (!log.entry) {
              missing.push({
                status: "never reached",
                paths: [...log.paths]
              });
              skipped.push(...log.paths);
              continue;
            }
            for (const type of ["valid", "invalid"]) {
              const set = schema[`_${type}s`];
              if (!set) {
                continue;
              }
              const values = new Set(set._values);
              const refs = new Set(set._refs);
              for (const { value, ref } of log[type]) {
                values.delete(value);
                refs.delete(ref);
              }
              if (values.size || refs.size) {
                missing.push({
                  status: [...values, ...[...refs].map((ref) => ref.display)],
                  rule: `${type}s`
                });
              }
            }
            const rules = schema._rules.map((rule) => rule.name);
            for (const type of ["default", "failover"]) {
              if (schema._flags[type] !== void 0) {
                rules.push(type);
              }
            }
            for (const name of rules) {
              const status = internals.labels[log.rule[name] || 0];
              if (status) {
                const report = { rule: name, status };
                if (log.paths.size) {
                  report.paths = [...log.paths];
                }
                missing.push(report);
              }
            }
          }
          if (missing.length) {
            coverage.push({
              filename,
              line,
              missing,
              severity: "error",
              message: `Schema missing tests for ${missing.map(internals.message).join(", ")}`
            });
          }
        }
        return coverage.length ? coverage : null;
      }
    };
    internals.Store = class {
      constructor(schema) {
        this.active = true;
        this._sources = /* @__PURE__ */ new Map();
        this._combos = /* @__PURE__ */ new Map();
        this._scan(schema);
      }
      debug(state, source, name, result) {
        state.mainstay.debug && state.mainstay.debug.push({ type: source, name, result, path: state.path });
      }
      entry(schema, state) {
        internals.debug(state, { type: "entry" });
        this._record(schema, (log) => {
          log.entry = true;
        });
      }
      filter(schema, state, source, value) {
        internals.debug(state, { type: source, ...value });
        this._record(schema, (log) => {
          log[source].add(value);
        });
      }
      log(schema, state, source, name, result) {
        internals.debug(state, { type: source, name, result: result === "full" ? "pass" : result });
        this._record(schema, (log) => {
          log[source][name] = log[source][name] || 0;
          log[source][name] |= internals.codes[result];
        });
      }
      resolve(state, ref, to) {
        if (!state.mainstay.debug) {
          return;
        }
        const log = { type: "resolve", ref: ref.display, to, path: state.path };
        state.mainstay.debug.push(log);
      }
      value(state, by, from, to, name) {
        if (!state.mainstay.debug || deepEqual(from, to)) {
          return;
        }
        const log = { type: "value", by, from, to, path: state.path };
        if (name) {
          log.name = name;
        }
        state.mainstay.debug.push(log);
      }
      _record(schema, each) {
        const log = this._sources.get(schema);
        if (log) {
          each(log);
          return;
        }
        const sources = this._combos.get(schema);
        for (const source of sources) {
          this._record(source, each);
        }
      }
      _scan(schema, _path) {
        const path = _path || [];
        let log = this._sources.get(schema);
        if (!log) {
          log = {
            paths: /* @__PURE__ */ new Set(),
            entry: false,
            rule: {},
            valid: /* @__PURE__ */ new Set(),
            invalid: /* @__PURE__ */ new Set()
          };
          this._sources.set(schema, log);
        }
        if (path.length) {
          log.paths.add(path);
        }
        const each = (sub, source) => {
          const subId = internals.id(sub, source);
          this._scan(sub, path.concat(subId));
        };
        schema.$_modify({ each, ref: false });
      }
      _combine(merged, sources) {
        this._combos.set(merged, sources);
      }
    };
    internals.message = function(item) {
      const path = item.paths ? Errors.path(item.paths[0]) + (item.rule ? ":" : "") : "";
      return `${path}${item.rule || ""} (${item.status})`;
    };
    internals.id = function(schema, { source, name, path, key }) {
      if (schema._flags.id) {
        return schema._flags.id;
      }
      if (key) {
        return key;
      }
      name = `@${name}`;
      if (source === "terms") {
        return [name, path[Math.min(path.length - 1, 1)]];
      }
      return name;
    };
    internals.sub = function(paths, skipped) {
      for (const path of paths) {
        for (const skip of skipped) {
          if (deepEqual(path.slice(0, skip.length), skip)) {
            return true;
          }
        }
      }
      return false;
    };
    internals.debug = function(state, event) {
      if (state.mainstay.debug) {
        event.path = state.debug ? [...state.path, state.debug] : state.path;
        state.mainstay.debug.push(event);
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/modify.js
var require_modify = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/modify.js"(exports) {
    "use strict";
    var { assert } = require_lib();
    var Common = require_common();
    var Ref = require_ref();
    var internals = {};
    exports.Ids = internals.Ids = class {
      constructor() {
        this._byId = /* @__PURE__ */ new Map();
        this._byKey = /* @__PURE__ */ new Map();
        this._schemaChain = false;
      }
      clone() {
        const clone = new internals.Ids();
        clone._byId = new Map(this._byId);
        clone._byKey = new Map(this._byKey);
        clone._schemaChain = this._schemaChain;
        return clone;
      }
      concat(source) {
        if (source._schemaChain) {
          this._schemaChain = true;
        }
        for (const [id, value] of source._byId.entries()) {
          assert(!this._byKey.has(id), "Schema id conflicts with existing key:", id);
          this._byId.set(id, value);
        }
        for (const [key, value] of source._byKey.entries()) {
          assert(!this._byId.has(key), "Schema key conflicts with existing id:", key);
          this._byKey.set(key, value);
        }
      }
      fork(path, adjuster, root) {
        const chain = this._collect(path);
        chain.push({ schema: root });
        const tail = chain.shift();
        let adjusted = { id: tail.id, schema: adjuster(tail.schema) };
        assert(Common.isSchema(adjusted.schema), "adjuster function failed to return a joi schema type");
        for (const node of chain) {
          adjusted = { id: node.id, schema: internals.fork(node.schema, adjusted.id, adjusted.schema) };
        }
        return adjusted.schema;
      }
      labels(path, behind = []) {
        const current = path[0];
        const node = this._get(current);
        if (!node) {
          return [...behind, ...path].join(".");
        }
        const forward = path.slice(1);
        behind = [...behind, node.schema._flags.label || current];
        if (!forward.length) {
          return behind.join(".");
        }
        return node.schema._ids.labels(forward, behind);
      }
      reach(path, behind = []) {
        const current = path[0];
        const node = this._get(current);
        assert(node, "Schema does not contain path", [...behind, ...path].join("."));
        const forward = path.slice(1);
        if (!forward.length) {
          return node.schema;
        }
        return node.schema._ids.reach(forward, [...behind, current]);
      }
      register(schema, { key } = {}) {
        if (!schema || !Common.isSchema(schema)) {
          return;
        }
        if (schema.$_property("schemaChain") || schema._ids._schemaChain) {
          this._schemaChain = true;
        }
        const id = schema._flags.id;
        if (id) {
          const existing = this._byId.get(id);
          assert(!existing || existing.schema === schema, "Cannot add different schemas with the same id:", id);
          assert(!this._byKey.has(id), "Schema id conflicts with existing key:", id);
          this._byId.set(id, { schema, id });
        }
        if (key) {
          assert(!this._byKey.has(key), "Schema already contains key:", key);
          assert(!this._byId.has(key), "Schema key conflicts with existing id:", key);
          this._byKey.set(key, { schema, id: key });
        }
      }
      reset() {
        this._byId = /* @__PURE__ */ new Map();
        this._byKey = /* @__PURE__ */ new Map();
        this._schemaChain = false;
      }
      _collect(path, behind = [], nodes = []) {
        const current = path[0];
        const node = this._get(current);
        assert(node, "Schema does not contain path", [...behind, ...path].join("."));
        nodes = [node, ...nodes];
        const forward = path.slice(1);
        if (!forward.length) {
          return nodes;
        }
        return node.schema._ids._collect(forward, [...behind, current], nodes);
      }
      _get(id) {
        return this._byId.get(id) || this._byKey.get(id);
      }
    };
    internals.fork = function(schema, id, replacement) {
      const each = (item, { key }) => {
        if (id === (item._flags.id || key)) {
          return replacement;
        }
      };
      const obj = exports.schema(schema, { each, ref: false });
      return obj ? obj.$_mutateRebuild() : schema;
    };
    exports.schema = function(schema, options) {
      let obj;
      for (const name of Object.keys(schema._flags)) {
        if (name[0] === "_") {
          continue;
        }
        const result = internals.scan(schema._flags[name], { source: "flags", name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          obj._flags[name] = result;
        }
      }
      for (let i = 0; i < schema._rules.length; ++i) {
        const rule = schema._rules[i];
        const result = internals.scan(rule.args, { source: "rules", name: rule.name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          const clone = Object.assign({}, rule);
          clone.args = result;
          obj._rules[i] = clone;
          const existingUnique = obj._singleRules.get(rule.name);
          if (existingUnique === rule) {
            obj._singleRules.set(rule.name, clone);
          }
        }
      }
      for (const name of Object.keys(schema.$_terms)) {
        if (name[0] === "_") {
          continue;
        }
        const result = internals.scan(schema.$_terms[name], { source: "terms", name }, options);
        if (result !== void 0) {
          obj = obj || schema.clone();
          obj.$_terms[name] = result;
        }
      }
      return obj;
    };
    internals.scan = function(item, source, options, _path, _key) {
      const path = _path || [];
      if (item === null || typeof item !== "object") {
        return;
      }
      let clone;
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; ++i) {
          const key = source.source === "terms" && source.name === "keys" && item[i].key;
          const result = internals.scan(item[i], source, options, [i, ...path], key);
          if (result !== void 0) {
            clone = clone || item.slice();
            clone[i] = result;
          }
        }
        return clone;
      }
      if (options.schema !== false && Common.isSchema(item) || options.ref !== false && Ref.isRef(item)) {
        const result = options.each(item, { ...source, path, key: _key });
        if (result === item) {
          return;
        }
        return result;
      }
      for (const key of Object.keys(item)) {
        if (key[0] === "_") {
          continue;
        }
        const result = internals.scan(item[key], source, options, [key, ...path], _key);
        if (result !== void 0) {
          clone = clone || Object.assign({}, item);
          clone[key] = result;
        }
      }
      return clone;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/state.js
var require_state = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/state.js"(exports, module) {
    "use strict";
    var { clone, reach } = require_lib();
    var Common = require_common();
    var internals = {
      value: /* @__PURE__ */ Symbol("value")
    };
    module.exports = internals.State = class {
      constructor(path, ancestors, state) {
        this.path = path;
        this.ancestors = ancestors;
        this.mainstay = state.mainstay;
        this.schemas = state.schemas;
        this.debug = null;
      }
      localize(path, ancestors = null, schema = null) {
        const state = new internals.State(path, ancestors, this);
        if (schema && state.schemas) {
          state.schemas = [internals.schemas(schema), ...state.schemas];
        }
        return state;
      }
      nest(schema, debug) {
        const state = new internals.State(this.path, this.ancestors, this);
        state.schemas = state.schemas && [internals.schemas(schema), ...state.schemas];
        state.debug = debug;
        return state;
      }
      shadow(value, reason) {
        this.mainstay.shadow = this.mainstay.shadow || new internals.Shadow();
        this.mainstay.shadow.set(this.path, value, reason);
      }
      snapshot() {
        if (this.mainstay.shadow) {
          this._snapshot = clone(this.mainstay.shadow.node(this.path));
        }
        this.mainstay.snapshot();
      }
      restore() {
        if (this.mainstay.shadow) {
          this.mainstay.shadow.override(this.path, this._snapshot);
          this._snapshot = void 0;
        }
        this.mainstay.restore();
      }
      commit() {
        if (this.mainstay.shadow) {
          this.mainstay.shadow.override(this.path, this._snapshot);
          this._snapshot = void 0;
        }
        this.mainstay.commit();
      }
    };
    internals.schemas = function(schema) {
      if (Common.isSchema(schema)) {
        return { schema };
      }
      return schema;
    };
    internals.Shadow = class {
      constructor() {
        this._values = null;
      }
      set(path, value, reason) {
        if (!path.length) {
          return;
        }
        if (reason === "strip" && typeof path[path.length - 1] === "number") {
          return;
        }
        this._values = this._values || /* @__PURE__ */ new Map();
        let node = this._values;
        for (let i = 0; i < path.length; ++i) {
          const segment = path[i];
          let next = node.get(segment);
          if (!next) {
            next = /* @__PURE__ */ new Map();
            node.set(segment, next);
          }
          node = next;
        }
        node[internals.value] = value;
      }
      get(path) {
        const node = this.node(path);
        if (node) {
          return node[internals.value];
        }
      }
      node(path) {
        if (!this._values) {
          return;
        }
        return reach(this._values, path, { iterables: true });
      }
      override(path, node) {
        if (!this._values) {
          return;
        }
        const parents = path.slice(0, -1);
        const own = path[path.length - 1];
        const parent = reach(this._values, parents, { iterables: true });
        if (node) {
          parent.set(own, node);
          return;
        }
        if (parent) {
          parent.delete(own);
        }
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/validator.js
var require_validator = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/validator.js"(exports) {
    "use strict";
    var { assert, clone, ignore, reach } = require_lib();
    var Common = require_common();
    var Errors = require_errors();
    var State = require_state();
    var internals = {
      result: /* @__PURE__ */ Symbol("result")
    };
    exports.entry = function(value, schema, prefs) {
      let settings = Common.defaults;
      if (prefs) {
        assert(prefs.warnings === void 0, "Cannot override warnings preference in synchronous validation");
        assert(prefs.artifacts === void 0, "Cannot override artifacts preference in synchronous validation");
        settings = Common.preferences(Common.defaults, prefs);
      }
      const result = internals.entry(value, schema, settings);
      assert(!result.mainstay.externals.length, "Schema with external rules must use validateAsync()");
      const outcome = { value: result.value };
      if (result.error) {
        outcome.error = result.error;
      }
      if (result.mainstay.warnings.length) {
        outcome.warning = Errors.details(result.mainstay.warnings);
      }
      if (result.mainstay.debug) {
        outcome.debug = result.mainstay.debug;
      }
      if (result.mainstay.artifacts) {
        outcome.artifacts = result.mainstay.artifacts;
      }
      return outcome;
    };
    exports.entryAsync = async function(value, schema, prefs) {
      let settings = Common.defaults;
      if (prefs) {
        settings = Common.preferences(Common.defaults, prefs);
      }
      const result = internals.entry(value, schema, settings);
      const mainstay = result.mainstay;
      if (result.error) {
        if (mainstay.debug) {
          result.error.debug = mainstay.debug;
        }
        throw result.error;
      }
      if (mainstay.externals.length) {
        let root = result.value;
        const errors = [];
        for (const external of mainstay.externals) {
          const path = external.state.path;
          const linked = external.schema.type === "link" ? mainstay.links.get(external.schema) : null;
          let node = root;
          let key;
          let parent;
          const ancestors = path.length ? [root] : [];
          const original = path.length ? reach(value, path) : value;
          if (path.length) {
            key = path[path.length - 1];
            let current = root;
            for (const segment of path.slice(0, -1)) {
              current = current[segment];
              ancestors.unshift(current);
            }
            parent = ancestors[0];
            node = parent[key];
          }
          try {
            const createError = (code, local) => (linked || external.schema).$_createError(code, node, local, external.state, settings);
            const output = await external.method(node, {
              schema: external.schema,
              linked,
              state: external.state,
              prefs,
              original,
              error: createError,
              errorsArray: internals.errorsArray,
              warn: (code, local) => mainstay.warnings.push((linked || external.schema).$_createError(code, node, local, external.state, settings)),
              message: (messages, local) => (linked || external.schema).$_createError("external", node, local, external.state, settings, { messages })
            });
            if (output === void 0 || output === node) {
              continue;
            }
            if (output instanceof Errors.Report) {
              mainstay.tracer.log(external.schema, external.state, "rule", "external", "error");
              errors.push(output);
              if (settings.abortEarly) {
                break;
              }
              continue;
            }
            if (Array.isArray(output) && output[Common.symbols.errors]) {
              mainstay.tracer.log(external.schema, external.state, "rule", "external", "error");
              errors.push(...output);
              if (settings.abortEarly) {
                break;
              }
              continue;
            }
            if (parent) {
              mainstay.tracer.value(external.state, "rule", node, output, "external");
              parent[key] = output;
            } else {
              mainstay.tracer.value(external.state, "rule", root, output, "external");
              root = output;
            }
          } catch (err) {
            if (settings.errors.label) {
              err.message += ` (${external.label})`;
            }
            throw err;
          }
        }
        result.value = root;
        if (errors.length) {
          result.error = Errors.process(errors, value, settings);
          if (mainstay.debug) {
            result.error.debug = mainstay.debug;
          }
          throw result.error;
        }
      }
      if (!settings.warnings && !settings.debug && !settings.artifacts) {
        return result.value;
      }
      const outcome = { value: result.value };
      if (mainstay.warnings.length) {
        outcome.warning = Errors.details(mainstay.warnings);
      }
      if (mainstay.debug) {
        outcome.debug = mainstay.debug;
      }
      if (mainstay.artifacts) {
        outcome.artifacts = mainstay.artifacts;
      }
      return outcome;
    };
    exports.standard = function(value, schema, options) {
      const prefs = options?.libraryOptions;
      if (schema.isAsync()) {
        return exports.entryAsync(value, schema, prefs);
      }
      return exports.entry(value, schema, prefs);
    };
    internals.Mainstay = class {
      constructor(tracer, debug, links) {
        this.externals = [];
        this.warnings = [];
        this.tracer = tracer;
        this.debug = debug;
        this.links = links;
        this.shadow = null;
        this.artifacts = null;
        this._snapshots = [];
      }
      snapshot() {
        this._snapshots.push({
          externals: this.externals.slice(),
          warnings: this.warnings.slice()
        });
      }
      restore() {
        const snapshot = this._snapshots.pop();
        this.externals = snapshot.externals;
        this.warnings = snapshot.warnings;
      }
      commit() {
        this._snapshots.pop();
      }
    };
    internals.entry = function(value, schema, prefs) {
      const { tracer, cleanup } = internals.tracer(schema, prefs);
      const debug = prefs.debug ? [] : null;
      const links = schema._ids._schemaChain ? /* @__PURE__ */ new Map() : null;
      const mainstay = new internals.Mainstay(tracer, debug, links);
      const schemas2 = schema._ids._schemaChain ? [{ schema }] : null;
      const state = new State([], [], { mainstay, schemas: schemas2 });
      const result = exports.validate(value, schema, state, prefs);
      if (cleanup) {
        schema.$_root.untrace();
      }
      const error = Errors.process(result.errors, value, prefs);
      return { value: result.value, error, mainstay };
    };
    internals.tracer = function(schema, prefs) {
      if (schema.$_root._tracer) {
        return { tracer: schema.$_root._tracer._register(schema) };
      }
      if (prefs.debug) {
        assert(schema.$_root.trace, "Debug mode not supported");
        return { tracer: schema.$_root.trace()._register(schema), cleanup: true };
      }
      return { tracer: internals.ignore };
    };
    exports.validate = function(value, schema, state, prefs, overrides = {}) {
      if (schema.$_terms.whens) {
        schema = schema._generate(value, state, prefs).schema;
      }
      if (schema._preferences) {
        prefs = internals.prefs(schema, prefs);
      }
      if (schema._cache && prefs.cache) {
        const result = schema._cache.get(value);
        state.mainstay.tracer.debug(state, "validate", "cached", !!result);
        if (result) {
          return result;
        }
      }
      const createError = (code, local, localState) => schema.$_createError(code, value, local, localState || state, prefs);
      const helpers = {
        original: value,
        prefs,
        schema,
        state,
        error: createError,
        errorsArray: internals.errorsArray,
        warn: (code, local, localState) => state.mainstay.warnings.push(createError(code, local, localState)),
        message: (messages, local) => schema.$_createError("custom", value, local, state, prefs, { messages })
      };
      state.mainstay.tracer.entry(schema, state);
      const def = schema._definition;
      if (def.prepare && value !== void 0 && prefs.convert) {
        const prepared = def.prepare(value, helpers);
        if (prepared) {
          state.mainstay.tracer.value(state, "prepare", value, prepared.value);
          if (prepared.errors) {
            return internals.finalize(prepared.value, [].concat(prepared.errors), helpers);
          }
          value = prepared.value;
        }
      }
      if (def.coerce && value !== void 0 && prefs.convert && (!def.coerce.from || def.coerce.from.includes(typeof value))) {
        const coerced = def.coerce.method(value, helpers);
        if (coerced) {
          state.mainstay.tracer.value(state, "coerced", value, coerced.value);
          if (coerced.errors) {
            return internals.finalize(coerced.value, [].concat(coerced.errors), helpers);
          }
          value = coerced.value;
        }
      }
      const empty = schema._flags.empty;
      if (empty && empty.$_match(internals.trim(value, schema), state.nest(empty), Common.defaults)) {
        state.mainstay.tracer.value(state, "empty", value, void 0);
        value = void 0;
      }
      const presence = overrides.presence || schema._flags.presence || (schema._flags._endedSwitch ? null : prefs.presence);
      if (value === void 0) {
        if (presence === "forbidden") {
          return internals.finalize(value, null, helpers);
        }
        if (presence === "required") {
          return internals.finalize(value, [schema.$_createError("any.required", value, null, state, prefs)], helpers);
        }
        if (presence === "optional") {
          if (schema._flags.default !== Common.symbols.deepDefault) {
            return internals.finalize(value, null, helpers);
          }
          state.mainstay.tracer.value(state, "default", value, {});
          value = {};
        }
      } else if (presence === "forbidden") {
        return internals.finalize(value, [schema.$_createError("any.unknown", value, null, state, prefs)], helpers);
      }
      const errors = [];
      if (schema._valids) {
        const match = schema._valids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
          if (prefs.convert) {
            state.mainstay.tracer.value(state, "valids", value, match.value);
            value = match.value;
          }
          state.mainstay.tracer.filter(schema, state, "valid", match);
          return internals.finalize(value, null, helpers);
        }
        if (schema._flags.only) {
          const report = schema.$_createError("any.only", value, { valids: schema._valids.values({ display: true }) }, state, prefs);
          if (prefs.abortEarly) {
            return internals.finalize(value, [report], helpers);
          }
          errors.push(report);
        }
      }
      if (schema._invalids) {
        const match = schema._invalids.get(value, state, prefs, schema._flags.insensitive);
        if (match) {
          state.mainstay.tracer.filter(schema, state, "invalid", match);
          const report = schema.$_createError("any.invalid", value, { invalids: schema._invalids.values({ display: true }) }, state, prefs);
          if (prefs.abortEarly) {
            return internals.finalize(value, [report], helpers);
          }
          errors.push(report);
        }
      }
      if (def.validate) {
        const base = def.validate(value, helpers);
        if (base) {
          state.mainstay.tracer.value(state, "base", value, base.value);
          value = base.value;
          if (base.errors) {
            if (!Array.isArray(base.errors)) {
              errors.push(base.errors);
              return internals.finalize(value, errors, helpers);
            }
            if (base.errors.length) {
              errors.push(...base.errors);
              return internals.finalize(value, errors, helpers);
            }
          }
        }
      }
      if (!schema._rules.length) {
        return internals.finalize(value, errors, helpers);
      }
      return internals.rules(value, errors, helpers);
    };
    internals.rules = function(value, errors, helpers) {
      const { schema, state, prefs } = helpers;
      for (const rule of schema._rules) {
        const definition = schema._definition.rules[rule.method];
        if (definition.convert && prefs.convert) {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "full");
          continue;
        }
        let ret;
        let args = rule.args;
        if (rule._resolve.length) {
          args = Object.assign({}, args);
          for (const key of rule._resolve) {
            const resolver = definition.argsByName.get(key);
            const resolved = args[key].resolve(value, state, prefs);
            const normalized = resolver.normalize ? resolver.normalize(resolved) : resolved;
            const invalid = Common.validateArg(normalized, null, resolver);
            if (invalid) {
              ret = schema.$_createError("any.ref", resolved, { arg: key, ref: args[key], reason: invalid }, state, prefs);
              break;
            }
            args[key] = normalized;
          }
        }
        ret = ret || definition.validate(value, helpers, args, rule);
        const result = internals.rule(ret, rule);
        if (result.errors) {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "error");
          if (rule.warn) {
            state.mainstay.warnings.push(...result.errors);
            continue;
          }
          if (prefs.abortEarly) {
            return internals.finalize(value, result.errors, helpers);
          }
          errors.push(...result.errors);
        } else {
          state.mainstay.tracer.log(schema, state, "rule", rule.name, "pass");
          state.mainstay.tracer.value(state, "rule", value, result.value, rule.name);
          value = result.value;
        }
      }
      return internals.finalize(value, errors, helpers);
    };
    internals.rule = function(ret, rule) {
      if (ret instanceof Errors.Report) {
        internals.error(ret, rule);
        return { errors: [ret], value: null };
      }
      if (Array.isArray(ret) && ret[Common.symbols.errors]) {
        ret.forEach((report) => internals.error(report, rule));
        return { errors: ret, value: null };
      }
      return { errors: null, value: ret };
    };
    internals.error = function(report, rule) {
      if (rule.message) {
        report._setTemplate(rule.message);
      }
      return report;
    };
    internals.finalize = function(value, errors, helpers) {
      errors = errors || [];
      const { schema, state, prefs } = helpers;
      if (errors.length) {
        const failover = internals.default("failover", void 0, errors, helpers);
        if (failover !== void 0) {
          state.mainstay.tracer.value(state, "failover", value, failover);
          value = failover;
          errors = [];
        }
      }
      if (errors.length && schema._flags.error) {
        if (typeof schema._flags.error === "function") {
          errors = schema._flags.error(errors);
          if (!Array.isArray(errors)) {
            errors = [errors];
          }
          for (const error of errors) {
            assert(error instanceof Error || error instanceof Errors.Report, "error() must return an Error object");
          }
        } else {
          errors = [schema._flags.error];
        }
      }
      if (value === void 0) {
        const defaulted = internals.default("default", value, errors, helpers);
        state.mainstay.tracer.value(state, "default", value, defaulted);
        value = defaulted;
      }
      if (schema._flags.cast && value !== void 0) {
        const caster = schema._definition.cast[schema._flags.cast];
        if (caster.from(value)) {
          const casted = caster.to(value, helpers);
          state.mainstay.tracer.value(state, "cast", value, casted, schema._flags.cast);
          value = casted;
        }
      }
      if (schema.$_terms.externals && prefs.externals && prefs._externals !== false) {
        for (const { method } of schema.$_terms.externals) {
          state.mainstay.externals.push({ method, schema, state, label: Errors.label(schema._flags, state, prefs) });
        }
      }
      const result = { value, errors: errors.length ? errors : null };
      if (schema._flags.result) {
        result.value = schema._flags.result === "strip" ? void 0 : (
          /* raw */
          helpers.original
        );
        state.mainstay.tracer.value(state, schema._flags.result, value, result.value);
        state.shadow(value, schema._flags.result);
      }
      if (schema._cache && prefs.cache !== false && !schema._refs.length) {
        schema._cache.set(helpers.original, result);
      }
      if (value !== void 0 && !result.errors && schema._flags.artifact !== void 0) {
        state.mainstay.artifacts = state.mainstay.artifacts || /* @__PURE__ */ new Map();
        if (!state.mainstay.artifacts.has(schema._flags.artifact)) {
          state.mainstay.artifacts.set(schema._flags.artifact, []);
        }
        state.mainstay.artifacts.get(schema._flags.artifact).push(state.path);
      }
      return result;
    };
    internals.prefs = function(schema, prefs) {
      const isDefaultOptions = prefs === Common.defaults;
      if (isDefaultOptions && schema._preferences[Common.symbols.prefs]) {
        return schema._preferences[Common.symbols.prefs];
      }
      prefs = Common.preferences(prefs, schema._preferences);
      if (isDefaultOptions) {
        schema._preferences[Common.symbols.prefs] = prefs;
      }
      return prefs;
    };
    internals.default = function(flag, value, errors, helpers) {
      const { schema, state, prefs } = helpers;
      const source = schema._flags[flag];
      if (prefs.noDefaults || source === void 0) {
        return value;
      }
      state.mainstay.tracer.log(schema, state, "rule", flag, "full");
      if (!source) {
        return source;
      }
      if (typeof source === "function") {
        const args = source.length ? [clone(state.ancestors[0]), helpers] : [];
        try {
          return source(...args);
        } catch (err) {
          errors.push(schema.$_createError(`any.${flag}`, null, { error: err }, state, prefs));
          return;
        }
      }
      if (typeof source !== "object") {
        return source;
      }
      if (source[Common.symbols.literal]) {
        return source.literal;
      }
      if (Common.isResolvable(source)) {
        return source.resolve(value, state, prefs);
      }
      return clone(source);
    };
    internals.trim = function(value, schema) {
      if (typeof value !== "string") {
        return value;
      }
      const trim = schema.$_getRule("trim");
      if (!trim || !trim.args.enabled) {
        return value;
      }
      return value.trim();
    };
    internals.ignore = {
      active: false,
      debug: ignore,
      entry: ignore,
      filter: ignore,
      log: ignore,
      resolve: ignore,
      value: ignore
    };
    internals.errorsArray = function() {
      const errors = [];
      errors[Common.symbols.errors] = true;
      return errors;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/values.js
var require_values = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/values.js"(exports, module) {
    "use strict";
    var { assert, deepEqual } = require_lib();
    var Common = require_common();
    var internals = {};
    module.exports = internals.Values = class {
      constructor(values, refs) {
        this._values = new Set(values);
        this._refs = new Set(refs);
        this._lowercase = internals.lowercases(values);
        this._override = false;
      }
      get length() {
        return this._values.size + this._refs.size;
      }
      add(value, refs) {
        if (Common.isResolvable(value)) {
          if (!this._refs.has(value)) {
            this._refs.add(value);
            if (refs) {
              refs.register(value);
            }
          }
          return;
        }
        if (!this.has(value, null, null, false)) {
          this._values.add(value);
          if (typeof value === "string") {
            this._lowercase.set(value.toLowerCase(), value);
          }
        }
      }
      static merge(target, source, remove) {
        target = target || new internals.Values();
        if (source) {
          if (source._override) {
            return source.clone();
          }
          for (const item of [...source._values, ...source._refs]) {
            target.add(item);
          }
        }
        if (remove) {
          for (const item of [...remove._values, ...remove._refs]) {
            target.remove(item);
          }
        }
        return target.length ? target : null;
      }
      remove(value) {
        if (Common.isResolvable(value)) {
          this._refs.delete(value);
          return;
        }
        this._values.delete(value);
        if (typeof value === "string") {
          this._lowercase.delete(value.toLowerCase());
        }
      }
      has(value, state, prefs, insensitive) {
        return !!this.get(value, state, prefs, insensitive);
      }
      get(value, state, prefs, insensitive) {
        if (!this.length) {
          return false;
        }
        if (this._values.has(value)) {
          return { value };
        }
        if (typeof value === "string" && value && insensitive) {
          const found = this._lowercase.get(value.toLowerCase());
          if (found) {
            return { value: found };
          }
        }
        if (!this._refs.size && typeof value !== "object") {
          return false;
        }
        if (typeof value === "object") {
          for (const item of this._values) {
            if (deepEqual(item, value)) {
              return { value: item };
            }
          }
        }
        if (state) {
          for (const ref of this._refs) {
            const resolved = ref.resolve(value, state, prefs, null, { in: true });
            if (resolved === void 0) {
              continue;
            }
            const items = !ref.in || typeof resolved !== "object" ? [resolved] : Array.isArray(resolved) ? resolved : Object.keys(resolved);
            for (const item of items) {
              if (typeof item !== typeof value) {
                continue;
              }
              if (insensitive && value && typeof value === "string") {
                if (item.toLowerCase() === value.toLowerCase()) {
                  return { value: item, ref };
                }
              } else {
                if (deepEqual(item, value)) {
                  return { value: item, ref };
                }
              }
            }
          }
        }
        return false;
      }
      override() {
        this._override = true;
      }
      values(options) {
        if (options && options.display) {
          const values = [];
          for (const item of [...this._values, ...this._refs]) {
            if (item !== void 0) {
              values.push(item);
            }
          }
          return values;
        }
        return Array.from([...this._values, ...this._refs]);
      }
      clone() {
        const set = new internals.Values(this._values, this._refs);
        set._override = this._override;
        return set;
      }
      concat(source) {
        assert(!source._override, "Cannot concat override set of values");
        const set = new internals.Values([...this._values, ...source._values], [...this._refs, ...source._refs]);
        set._override = this._override;
        return set;
      }
      describe() {
        const normalized = [];
        if (this._override) {
          normalized.push({ override: true });
        }
        for (const value of this._values.values()) {
          normalized.push(value && typeof value === "object" ? { value } : value);
        }
        for (const value of this._refs.values()) {
          normalized.push(value.describe());
        }
        return normalized;
      }
    };
    internals.Values.prototype[Common.symbols.values] = true;
    internals.Values.prototype.slice = internals.Values.prototype.clone;
    internals.lowercases = function(from) {
      const map = /* @__PURE__ */ new Map();
      if (from) {
        for (const value of from) {
          if (typeof value === "string") {
            map.set(value.toLowerCase(), value);
          }
        }
      }
      return map;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/base.js
var require_base = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/base.js"(exports, module) {
    "use strict";
    var { assert, clone, deepEqual, merge } = require_lib();
    var Cache = require_cache();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Extend = require_extend();
    var Manifest = require_manifest();
    var Messages = require_messages();
    var Modify = require_modify();
    var Ref = require_ref();
    var Trace = require_trace();
    var Validator = require_validator();
    var Values = require_values();
    var internals = {
      standardTypes: /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "object", "array", "null"]),
      jsonSchemaTarget: "draft-2020-12",
      primitiveTypes: /* @__PURE__ */ new Set(["string", "number", "boolean"]),
      nullSchema: () => ({ type: "null" })
    };
    internals.Base = class {
      constructor(type) {
        this.type = type;
        this.$_root = null;
        this._definition = {};
        this._reset();
      }
      _reset() {
        this._ids = new Modify.Ids();
        this._preferences = null;
        this._refs = new Ref.Manager();
        this._cache = null;
        this._valids = null;
        this._invalids = null;
        this._flags = {};
        this._rules = [];
        this._singleRules = /* @__PURE__ */ new Map();
        this.$_terms = {};
        this.$_temp = {
          // Runtime state (not cloned)
          ruleset: null,
          // null: use last, false: error, number: start position
          whens: {}
          // Runtime cache of generated whens
        };
      }
      // Manifest
      describe() {
        assert(typeof Manifest.describe === "function", "Manifest functionality disabled");
        return Manifest.describe(this);
      }
      $_jsonSchema(mode, options = {}) {
        if (options.target !== void 0 && options.target !== internals.jsonSchemaTarget) {
          throw new Error(`Unsupported JSON Schema target: ${options.target}`);
        }
        const rootCall = !options.$defs;
        const defs = options.$defs ?? {};
        let schema = {};
        const isTypeAny = this.type === "any";
        const isOnly = this._flags.only;
        const valids = this._valids && Array.from(this._valids._values).filter((v) => v !== null);
        let typesOverlap = true;
        if (valids && valids.length && isOnly && !isTypeAny) {
          const types = new Set(valids.map((v) => typeof v));
          typesOverlap = types.has(this.type) || this.type === "date" && types.has("object");
        }
        if (!isTypeAny && typesOverlap && internals.standardTypes.has(this.type)) {
          schema.type = this.type;
        }
        if (this._flags.description) {
          schema.description = this._flags.description;
        }
        if (this._flags.default !== void 0 && typeof this._flags.default !== "function") {
          schema.default = this._flags.default;
        }
        const subOptions = { ...options, $defs: defs };
        if (this._definition.jsonSchema && typesOverlap) {
          schema = this._definition.jsonSchema(this, schema, mode, subOptions);
        }
        for (const rule of this._rules) {
          const definition = this._definition.rules[rule.name];
          if (definition.jsonSchema && typesOverlap && !rule._resolve.length) {
            schema = definition.jsonSchema(rule, schema, isOnly, mode, subOptions);
          }
        }
        if (this.$_terms.shared) {
          for (const shared of this.$_terms.shared) {
            defs[shared._flags.id] = shared.$_jsonSchema(mode, subOptions);
          }
        }
        if (rootCall && Object.keys(defs).length) {
          schema.$defs = defs;
        }
        if (this._valids) {
          const values = valids.filter((v) => typeof v !== "symbol");
          if (values.length) {
            if (this._flags.only) {
              schema.enum = values;
              const list = Common.intersect(new Set(values.map((v) => typeof v)), internals.primitiveTypes);
              if (list.size) {
                const types = [...list];
                schema.type = types.length === 1 ? types[0] : types;
              }
            } else {
              const otherTypes = values.filter((v) => typeof v !== this.type || isTypeAny);
              if (otherTypes.length && !(isTypeAny && !isOnly)) {
                if (!schema.anyOf) {
                  schema = {
                    anyOf: [schema]
                  };
                }
                schema.anyOf.push({ enum: otherTypes });
              }
            }
          }
        }
        if (this._valids && this._valids.has(null) && !(isTypeAny && !isOnly)) {
          if (this._valids.length === 1 && (isTypeAny || isOnly)) {
            schema.type = "null";
          } else if (schema.type) {
            schema.type = [schema.type, "null"];
          } else if (schema.anyOf) {
            schema.anyOf.unshift(internals.nullSchema());
          } else {
            schema = {
              anyOf: [
                internals.nullSchema(),
                schema
              ]
            };
          }
        }
        if (this.$_terms.whens) {
          const base = this.clone();
          base.$_terms.whens = null;
          const matches = [];
          for (const when of this.$_terms.whens) {
            const tests = when.is ? [when] : when.switch;
            for (let i = 0; i < tests.length; ++i) {
              const test = tests[i];
              if (test.then) {
                matches.push(base.concat(test.then).$_jsonSchema(mode, subOptions));
              }
              if (test.otherwise) {
                matches.push(base.concat(test.otherwise).$_jsonSchema(mode, subOptions));
              }
              if (!test.then || i === tests.length - 1 && !test.otherwise) {
                matches.push(base.$_jsonSchema(mode, subOptions));
              }
            }
          }
          const results = [];
          for (const match of matches) {
            if (!results.some((r) => deepEqual(r, match))) {
              results.push(match);
            }
          }
          return { anyOf: results };
        }
        return schema;
      }
      // Rules
      allow(...values) {
        Common.verifyFlat(values, "allow");
        return this._values(values, "_valids");
      }
      alter(targets) {
        assert(targets && typeof targets === "object" && !Array.isArray(targets), "Invalid targets argument");
        assert(!this._inRuleset(), "Cannot set alterations inside a ruleset");
        const obj = this.clone();
        obj.$_terms.alterations = obj.$_terms.alterations || [];
        for (const target of Object.keys(targets)) {
          const adjuster = targets[target];
          assert(typeof adjuster === "function", "Alteration adjuster for", target, "must be a function");
          obj.$_terms.alterations.push({ target, adjuster });
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      artifact(id) {
        assert(id !== void 0, "Artifact cannot be undefined");
        assert(!this._cache, "Cannot set an artifact with a rule cache");
        return this.$_setFlag("artifact", id);
      }
      cast(to) {
        assert(to === false || typeof to === "string", "Invalid to value");
        assert(to === false || this._definition.cast[to], "Type", this.type, "does not support casting to", to);
        return this.$_setFlag("cast", to === false ? void 0 : to);
      }
      default(value, options) {
        return this._default("default", value, options);
      }
      description(desc) {
        assert(desc && typeof desc === "string", "Description must be a non-empty string");
        return this.$_setFlag("description", desc);
      }
      empty(schema) {
        const obj = this.clone();
        if (schema !== void 0) {
          schema = obj.$_compile(schema, { override: false });
        }
        return obj.$_setFlag("empty", schema, { clone: false });
      }
      error(err) {
        assert(err, "Missing error");
        assert(err instanceof Error || typeof err === "function", "Must provide a valid Error object or a function");
        return this.$_setFlag("error", err);
      }
      example(example, options = {}) {
        assert(example !== void 0, "Missing example");
        Common.assertOptions(options, ["override"]);
        return this._inner("examples", example, { single: true, override: options.override });
      }
      external(method, description) {
        if (typeof method === "object") {
          assert(!description, "Cannot combine options with description");
          description = method.description;
          method = method.method;
        }
        assert(typeof method === "function", "Method must be a function");
        assert(description === void 0 || description && typeof description === "string", "Description must be a non-empty string");
        return this._inner("externals", { method, description }, { single: true });
      }
      failover(value, options) {
        return this._default("failover", value, options);
      }
      forbidden() {
        return this.presence("forbidden");
      }
      id(id) {
        if (!id) {
          return this.$_setFlag("id", void 0);
        }
        assert(typeof id === "string", "id must be a non-empty string");
        assert(/^[^\.]+$/.test(id), "id cannot contain period character");
        return this.$_setFlag("id", id);
      }
      invalid(...values) {
        return this._values(values, "_invalids");
      }
      label(name) {
        assert(name && typeof name === "string", "Label name must be a non-empty string");
        return this.$_setFlag("label", name);
      }
      meta(meta) {
        assert(meta !== void 0, "Meta cannot be undefined");
        return this._inner("metas", meta, { single: true });
      }
      note(...notes) {
        assert(notes.length, "Missing notes");
        for (const note of notes) {
          assert(note && typeof note === "string", "Notes must be non-empty strings");
        }
        return this._inner("notes", notes);
      }
      only(mode = true) {
        assert(typeof mode === "boolean", "Invalid mode:", mode);
        return this.$_setFlag("only", mode);
      }
      optional() {
        return this.presence("optional");
      }
      prefs(prefs) {
        assert(prefs, "Missing preferences");
        assert(prefs.context === void 0, "Cannot override context");
        assert(prefs.externals === void 0, "Cannot override externals");
        assert(prefs.warnings === void 0, "Cannot override warnings");
        assert(prefs.debug === void 0, "Cannot override debug");
        Common.checkPreferences(prefs);
        const obj = this.clone();
        obj._preferences = Common.preferences(obj._preferences, prefs);
        return obj;
      }
      presence(mode) {
        assert(["optional", "required", "forbidden"].includes(mode), "Unknown presence mode", mode);
        return this.$_setFlag("presence", mode);
      }
      raw(enabled = true) {
        return this.$_setFlag("result", enabled ? "raw" : void 0);
      }
      result(mode) {
        assert(["raw", "strip"].includes(mode), "Unknown result mode", mode);
        return this.$_setFlag("result", mode);
      }
      required() {
        return this.presence("required");
      }
      strict(enabled) {
        const obj = this.clone();
        const convert = enabled === void 0 ? false : !enabled;
        obj._preferences = Common.preferences(obj._preferences, { convert });
        return obj;
      }
      strip(enabled = true) {
        return this.$_setFlag("result", enabled ? "strip" : void 0);
      }
      tag(...tags) {
        assert(tags.length, "Missing tags");
        for (const tag of tags) {
          assert(tag && typeof tag === "string", "Tags must be non-empty strings");
        }
        return this._inner("tags", tags);
      }
      unit(name) {
        assert(name && typeof name === "string", "Unit name must be a non-empty string");
        return this.$_setFlag("unit", name);
      }
      valid(...values) {
        Common.verifyFlat(values, "valid");
        const obj = this.allow(...values);
        obj.$_setFlag("only", !!obj._valids, { clone: false });
        return obj;
      }
      when(condition, options) {
        const obj = this.clone();
        if (!obj.$_terms.whens) {
          obj.$_terms.whens = [];
        }
        const when = Compile.when(obj, condition, options);
        if (!["any", "link"].includes(obj.type)) {
          const conditions = when.is ? [when] : when.switch;
          for (const item of conditions) {
            assert(!item.then || item.then.type === "any" || item.then.type === obj.type, "Cannot combine", obj.type, "with", item.then && item.then.type);
            assert(!item.otherwise || item.otherwise.type === "any" || item.otherwise.type === obj.type, "Cannot combine", obj.type, "with", item.otherwise && item.otherwise.type);
          }
        }
        obj.$_terms.whens.push(when);
        return obj.$_mutateRebuild();
      }
      // Helpers
      cache(cache) {
        assert(!this._inRuleset(), "Cannot set caching inside a ruleset");
        assert(!this._cache, "Cannot override schema cache");
        assert(this._flags.artifact === void 0, "Cannot cache a rule with an artifact");
        const obj = this.clone();
        obj._cache = cache || Cache.provider.provision();
        obj.$_temp.ruleset = false;
        return obj;
      }
      clone() {
        const obj = Object.create(Object.getPrototypeOf(this));
        return this._assign(obj);
      }
      concat(source) {
        assert(Common.isSchema(source), "Invalid schema object");
        assert(this.type === "any" || source.type === "any" || source.type === this.type, "Cannot merge type", this.type, "with another type:", source.type);
        assert(!this._inRuleset(), "Cannot concatenate onto a schema with open ruleset");
        assert(!source._inRuleset(), "Cannot concatenate a schema with open ruleset");
        let obj = this.clone();
        if (this.type === "any" && source.type !== "any") {
          const tmpObj = source.clone();
          for (const key of Object.keys(obj)) {
            if (key !== "type") {
              tmpObj[key] = obj[key];
            }
          }
          obj = tmpObj;
        }
        obj._ids.concat(source._ids);
        obj._refs.register(source, Ref.toSibling);
        obj._preferences = obj._preferences ? Common.preferences(obj._preferences, source._preferences) : source._preferences;
        obj._valids = Values.merge(obj._valids, source._valids, source._invalids);
        obj._invalids = Values.merge(obj._invalids, source._invalids, source._valids);
        for (const name of source._singleRules.keys()) {
          if (obj._singleRules.has(name)) {
            obj._rules = obj._rules.filter((target) => target.keep || target.name !== name);
            obj._singleRules.delete(name);
          }
        }
        for (const test of source._rules) {
          if (!source._definition.rules[test.method].multi) {
            obj._singleRules.set(test.name, test);
          }
          obj._rules.push(test);
        }
        if (obj._flags.empty && source._flags.empty) {
          obj._flags.empty = obj._flags.empty.concat(source._flags.empty);
          const flags = Object.assign({}, source._flags);
          delete flags.empty;
          merge(obj._flags, flags);
        } else if (source._flags.empty) {
          obj._flags.empty = source._flags.empty;
          const flags = Object.assign({}, source._flags);
          delete flags.empty;
          merge(obj._flags, flags);
        } else {
          merge(obj._flags, source._flags);
        }
        for (const key of Object.keys(source.$_terms)) {
          const terms = source.$_terms[key];
          if (!terms) {
            if (!obj.$_terms[key]) {
              obj.$_terms[key] = terms;
            }
            continue;
          }
          if (!obj.$_terms[key]) {
            obj.$_terms[key] = terms.slice();
            continue;
          }
          obj.$_terms[key] = obj.$_terms[key].concat(terms);
        }
        if (this.$_root._tracer) {
          this.$_root._tracer._combine(obj, [this, source]);
        }
        return obj.$_mutateRebuild();
      }
      extend(options) {
        assert(!options.base, "Cannot extend type with another base");
        return Extend.type(this, options);
      }
      extract(path) {
        path = Array.isArray(path) ? path : path.split(".");
        return this._ids.reach(path);
      }
      fork(paths, adjuster) {
        assert(!this._inRuleset(), "Cannot fork inside a ruleset");
        let obj = this;
        for (let path of [].concat(paths)) {
          path = Array.isArray(path) ? path : path.split(".");
          obj = obj._ids.fork(path, adjuster, obj);
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      isAsync() {
        if (Boolean(this.$_terms.externals?.length)) {
          return true;
        }
        if (this.$_terms.whens) {
          for (const when of this.$_terms.whens) {
            if (when.then?.isAsync()) {
              return true;
            }
            if (when.otherwise?.isAsync()) {
              return true;
            }
            if (when.switch) {
              for (const item of when.switch) {
                if (item.then?.isAsync()) {
                  return true;
                }
                if (item.otherwise?.isAsync()) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      }
      rule(options) {
        const def = this._definition;
        Common.assertOptions(options, Object.keys(def.modifiers));
        assert(this.$_temp.ruleset !== false, "Cannot apply rules to empty ruleset or the last rule added does not support rule properties");
        const start = this.$_temp.ruleset === null ? this._rules.length - 1 : this.$_temp.ruleset;
        assert(start >= 0 && start < this._rules.length, "Cannot apply rules to empty ruleset");
        const obj = this.clone();
        for (let i = start; i < obj._rules.length; ++i) {
          const original = obj._rules[i];
          const rule = clone(original);
          for (const name of Object.keys(options)) {
            def.modifiers[name](rule, options[name]);
            assert(rule.name === original.name, "Cannot change rule name");
          }
          obj._rules[i] = rule;
          if (obj._singleRules.get(rule.name) === original) {
            obj._singleRules.set(rule.name, rule);
          }
        }
        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
      }
      get ruleset() {
        assert(!this._inRuleset(), "Cannot start a new ruleset without closing the previous one");
        const obj = this.clone();
        obj.$_temp.ruleset = obj._rules.length;
        return obj;
      }
      get $() {
        return this.ruleset;
      }
      tailor(targets) {
        targets = [].concat(targets);
        assert(!this._inRuleset(), "Cannot tailor inside a ruleset");
        let obj = this;
        if (this.$_terms.alterations) {
          for (const { target, adjuster } of this.$_terms.alterations) {
            if (targets.includes(target)) {
              obj = adjuster(obj);
              assert(Common.isSchema(obj), "Alteration adjuster for", target, "failed to return a schema object");
            }
          }
        }
        obj = obj.$_modify({ each: (item) => item.tailor(targets), ref: false });
        obj.$_temp.ruleset = false;
        return obj.$_mutateRebuild();
      }
      tracer() {
        return Trace.location ? Trace.location(this) : this;
      }
      validate(value, options) {
        return Validator.entry(value, this, options);
      }
      validateAsync(value, options) {
        return Validator.entryAsync(value, this, options);
      }
      // Extensions
      $_addRule(options) {
        if (typeof options === "string") {
          options = { name: options };
        }
        assert(options && typeof options === "object", "Invalid options");
        assert(options.name && typeof options.name === "string", "Invalid rule name");
        for (const key of Object.keys(options)) {
          assert(key[0] !== "_", "Cannot set private rule properties");
        }
        const rule = Object.assign({}, options);
        rule._resolve = [];
        rule.method = rule.method || rule.name;
        const definition = this._definition.rules[rule.method];
        const args = rule.args;
        assert(definition, "Unknown rule", rule.method);
        const obj = this.clone();
        if (args) {
          assert(Object.keys(args).length === 1 || Object.keys(args).length === this._definition.rules[rule.name].args.length, "Invalid rule definition for", this.type, rule.name);
          for (const key of Object.keys(args)) {
            let arg = args[key];
            if (definition.argsByName) {
              const resolver = definition.argsByName.get(key);
              if (resolver.ref && Common.isResolvable(arg)) {
                rule._resolve.push(key);
                obj.$_mutateRegister(arg);
              } else {
                if (resolver.normalize) {
                  arg = resolver.normalize(arg);
                  args[key] = arg;
                }
                if (resolver.assert) {
                  const error = Common.validateArg(arg, key, resolver);
                  assert(!error, error, "or reference");
                }
              }
            }
            if (arg === void 0) {
              delete args[key];
              continue;
            }
            args[key] = arg;
          }
        }
        if (!definition.multi) {
          obj._ruleRemove(rule.name, { clone: false });
          obj._singleRules.set(rule.name, rule);
        }
        if (obj.$_temp.ruleset === false) {
          obj.$_temp.ruleset = null;
        }
        if (definition.priority) {
          obj._rules.unshift(rule);
        } else {
          obj._rules.push(rule);
        }
        return obj;
      }
      $_compile(schema, options) {
        return Compile.schema(this.$_root, schema, options);
      }
      $_createError(code, value, local, state, prefs, options = {}) {
        const flags = options.flags !== false ? this._flags : {};
        const messages = options.messages ? Messages.merge(this._definition.messages, options.messages) : this._definition.messages;
        return new Errors.Report(code, value, local, flags, messages, state, prefs);
      }
      $_getFlag(name) {
        return this._flags[name];
      }
      $_getRule(name) {
        return this._singleRules.get(name);
      }
      $_mapLabels(path) {
        path = Array.isArray(path) ? path : path.split(".");
        return this._ids.labels(path);
      }
      $_match(value, state, prefs, overrides) {
        prefs = Object.assign({}, prefs);
        prefs.abortEarly = true;
        prefs._externals = false;
        state.snapshot();
        const result = !Validator.validate(value, this, state, prefs, overrides).errors;
        state.restore();
        return result;
      }
      $_modify(options) {
        Common.assertOptions(options, ["each", "once", "ref", "schema"]);
        return Modify.schema(this, options) || this;
      }
      $_mutateRebuild() {
        assert(!this._inRuleset(), "Cannot add this rule inside a ruleset");
        this._refs.reset();
        this._ids.reset();
        const each = (item, { source, name, path, key }) => {
          const family = this._definition[source][name] && this._definition[source][name].register;
          if (family !== false) {
            this.$_mutateRegister(item, { family, key });
          }
        };
        this.$_modify({ each });
        if (this._definition.rebuild) {
          this._definition.rebuild(this);
        }
        this.$_temp.ruleset = false;
        return this;
      }
      $_mutateRegister(schema, { family, key } = {}) {
        this._refs.register(schema, family);
        this._ids.register(schema, { key });
      }
      $_property(name) {
        return this._definition.properties[name];
      }
      $_reach(path) {
        return this._ids.reach(path);
      }
      $_rootReferences() {
        return this._refs.roots();
      }
      $_setFlag(name, value, options = {}) {
        assert(name[0] === "_" || !this._inRuleset(), "Cannot set flag inside a ruleset");
        const flag = this._definition.flags[name] || {};
        if (deepEqual(value, flag.default)) {
          value = void 0;
        }
        if (deepEqual(value, this._flags[name])) {
          return this;
        }
        const obj = options.clone !== false ? this.clone() : this;
        if (value !== void 0) {
          obj._flags[name] = value;
          obj.$_mutateRegister(value);
        } else {
          delete obj._flags[name];
        }
        if (name[0] !== "_") {
          obj.$_temp.ruleset = false;
        }
        return obj;
      }
      $_parent(method, ...args) {
        return this[method][Common.symbols.parent].call(this, ...args);
      }
      $_validate(value, state, prefs) {
        return Validator.validate(value, this, state, prefs);
      }
      // Internals
      _assign(target) {
        target.type = this.type;
        target.$_root = this.$_root;
        target.$_temp = Object.assign({}, this.$_temp);
        target.$_temp.whens = {};
        target._ids = this._ids.clone();
        target._preferences = this._preferences;
        target._valids = this._valids && this._valids.clone();
        target._invalids = this._invalids && this._invalids.clone();
        target._rules = this._rules.slice();
        target._singleRules = clone(this._singleRules, { shallow: true });
        target._refs = this._refs.clone();
        target._flags = Object.assign({}, this._flags);
        target._cache = null;
        target.$_terms = {};
        for (const key of Object.keys(this.$_terms)) {
          target.$_terms[key] = this.$_terms[key] ? this.$_terms[key].slice() : null;
        }
        target.$_super = {};
        if (this.$_super) {
          for (const override of Object.keys(this.$_super)) {
            target.$_super[override] = this._super[override].bind(target);
          }
        }
        return target;
      }
      _bare() {
        const obj = this.clone();
        obj._reset();
        const terms = obj._definition.terms;
        for (const name of Object.keys(terms)) {
          const term = terms[name];
          obj.$_terms[name] = term.init;
        }
        return obj.$_mutateRebuild();
      }
      _default(flag, value, options = {}) {
        Common.assertOptions(options, "literal");
        assert(value !== void 0, "Missing", flag, "value");
        assert(typeof value === "function" || !options.literal, "Only function value supports literal option");
        if (typeof value === "function" && options.literal) {
          value = {
            [Common.symbols.literal]: true,
            literal: value
          };
        }
        const obj = this.$_setFlag(flag, value);
        return obj;
      }
      _generate(value, state, prefs) {
        if (!this.$_terms.whens) {
          return { schema: this };
        }
        const whens = [];
        const ids = [];
        for (let i = 0; i < this.$_terms.whens.length; ++i) {
          const when = this.$_terms.whens[i];
          if (when.concat) {
            whens.push(when.concat);
            ids.push(`${i}.concat`);
            continue;
          }
          const input = when.ref ? when.ref.resolve(value, state, prefs) : value;
          const tests = when.is ? [when] : when.switch;
          const before = ids.length;
          for (let j = 0; j < tests.length; ++j) {
            const { is, then, otherwise } = tests[j];
            const baseId = `${i}${when.switch ? "." + j : ""}`;
            if (is.$_match(input, state.nest(is, `${baseId}.is`), prefs)) {
              if (then) {
                const localState = state.localize([...state.path, `${baseId}.then`], state.ancestors, state.schemas);
                const { schema: generated, id: id2 } = then._generate(value, localState, prefs);
                whens.push(generated);
                ids.push(`${baseId}.then${id2 ? `(${id2})` : ""}`);
                break;
              }
            } else if (otherwise) {
              const localState = state.localize([...state.path, `${baseId}.otherwise`], state.ancestors, state.schemas);
              const { schema: generated, id: id2 } = otherwise._generate(value, localState, prefs);
              whens.push(generated);
              ids.push(`${baseId}.otherwise${id2 ? `(${id2})` : ""}`);
              break;
            }
          }
          if (when.break && ids.length > before) {
            break;
          }
        }
        const id = ids.join(", ");
        state.mainstay.tracer.debug(state, "rule", "when", id);
        if (!id) {
          return { schema: this };
        }
        if (!state.mainstay.tracer.active && this.$_temp.whens[id]) {
          return { schema: this.$_temp.whens[id], id };
        }
        let obj = this;
        if (this._definition.generate) {
          obj = this._definition.generate(this, value, state, prefs);
        }
        for (const when of whens) {
          obj = obj.concat(when);
        }
        if (this.$_root._tracer) {
          this.$_root._tracer._combine(obj, [this, ...whens]);
        }
        this.$_temp.whens[id] = obj;
        return { schema: obj, id };
      }
      _inner(type, values, options = {}) {
        assert(!this._inRuleset(), `Cannot set ${type} inside a ruleset`);
        const obj = this.clone();
        if (!obj.$_terms[type] || options.override) {
          obj.$_terms[type] = [];
        }
        if (options.single) {
          obj.$_terms[type].push(values);
        } else {
          obj.$_terms[type].push(...values);
        }
        obj.$_temp.ruleset = false;
        return obj;
      }
      _inRuleset() {
        return this.$_temp.ruleset !== null && this.$_temp.ruleset !== false;
      }
      _ruleRemove(name, options = {}) {
        if (!this._singleRules.has(name)) {
          return this;
        }
        const obj = options.clone !== false ? this.clone() : this;
        obj._singleRules.delete(name);
        const filtered = [];
        for (let i = 0; i < obj._rules.length; ++i) {
          const test = obj._rules[i];
          if (test.name === name && !test.keep) {
            if (obj._inRuleset() && i < obj.$_temp.ruleset) {
              --obj.$_temp.ruleset;
            }
            continue;
          }
          filtered.push(test);
        }
        obj._rules = filtered;
        return obj;
      }
      _values(values, key) {
        Common.verifyFlat(values, key.slice(1, -1));
        const obj = this.clone();
        const override = values[0] === Common.symbols.override;
        if (override) {
          values = values.slice(1);
        }
        if (!obj[key] && values.length) {
          obj[key] = new Values();
        } else if (override) {
          obj[key] = values.length ? new Values() : null;
          obj.$_mutateRebuild();
        }
        if (!obj[key]) {
          return obj;
        }
        if (override) {
          obj[key].override();
        }
        for (const value of values) {
          assert(value !== void 0, "Cannot call allow/valid/invalid with undefined");
          assert(value !== Common.symbols.override, "Override must be the first value");
          const other = key === "_invalids" ? "_valids" : "_invalids";
          if (obj[other]) {
            obj[other].remove(value);
            if (!obj[other].length) {
              assert(key === "_valids" || !obj._flags.only, "Setting invalid value", value, "leaves schema rejecting all values due to previous valid rule");
              obj[other] = null;
            }
          }
          obj[key].add(value, obj._refs);
        }
        return obj;
      }
      // Standard Schema
      get "~standard"() {
        const mapToStandardError = (error) => {
          let issues;
          if (Errors.ValidationError.isError(error)) {
            issues = error.details.map(({ message, path }) => ({
              message,
              path
            }));
          } else {
            issues = [{
              message: error.message
            }];
          }
          return {
            issues
          };
        };
        const mapToStandardValue = (value) => ({ value });
        return {
          version: 1,
          vendor: "joi",
          validate: (value, options) => {
            const result = Validator.standard(value, this, options);
            if (result instanceof Promise) {
              return result.then(mapToStandardValue, mapToStandardError);
            }
            if (!result.error) {
              return mapToStandardValue(result.value);
            }
            return mapToStandardError(result.error);
          },
          jsonSchema: {
            input: (options) => this.$_jsonSchema("input", options),
            output: (options) => this.$_jsonSchema("output", options)
          }
        };
      }
    };
    internals.Base.prototype[Common.symbols.any] = {
      version: Common.version,
      compile: Compile.compile,
      root: "$_root"
    };
    internals.Base.prototype.isImmutable = true;
    internals.Base.prototype.deny = internals.Base.prototype.invalid;
    internals.Base.prototype.disallow = internals.Base.prototype.invalid;
    internals.Base.prototype.equal = internals.Base.prototype.valid;
    internals.Base.prototype.exist = internals.Base.prototype.required;
    internals.Base.prototype.not = internals.Base.prototype.invalid;
    internals.Base.prototype.options = internals.Base.prototype.prefs;
    internals.Base.prototype.preferences = internals.Base.prototype.prefs;
    module.exports = new internals.Base();
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/any.js
var require_any = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/any.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Base = require_base();
    var Common = require_common();
    var Messages = require_messages();
    module.exports = Base.extend({
      type: "any",
      flags: {
        only: { default: false }
      },
      terms: {
        alterations: { init: null },
        examples: { init: null },
        externals: { init: null },
        metas: { init: [] },
        notes: { init: [] },
        shared: { init: null },
        tags: { init: [] },
        whens: { init: null }
      },
      rules: {
        custom: {
          method(method, description) {
            assert(typeof method === "function", "Method must be a function");
            assert(description === void 0 || description && typeof description === "string", "Description must be a non-empty string");
            return this.$_addRule({ name: "custom", args: { method, description } });
          },
          validate(value, helpers, { method }) {
            try {
              return method(value, helpers);
            } catch (err) {
              return helpers.error("any.custom", { error: err });
            }
          },
          args: ["method", "description"],
          multi: true
        },
        messages: {
          method(messages) {
            return this.prefs({ messages });
          }
        },
        shared: {
          method(schema) {
            assert(Common.isSchema(schema) && schema._flags.id, "Schema must be a schema with an id");
            const obj = this.clone();
            obj.$_terms.shared = obj.$_terms.shared || [];
            obj.$_terms.shared.push(schema);
            obj.$_mutateRegister(schema);
            return obj;
          }
        },
        warning: {
          method(code, local) {
            assert(code && typeof code === "string", "Invalid warning code");
            return this.$_addRule({ name: "warning", args: { code, local }, warn: true });
          },
          validate(value, helpers, { code, local }) {
            return helpers.error(code, local);
          },
          args: ["code", "local"],
          multi: true
        }
      },
      modifiers: {
        keep(rule, enabled = true) {
          rule.keep = enabled;
        },
        message(rule, message) {
          rule.message = Messages.compile(message);
        },
        warn(rule, enabled = true) {
          rule.warn = enabled;
        }
      },
      manifest: {
        build(obj, desc) {
          for (const key of Object.keys(desc)) {
            const values = desc[key];
            if (["examples", "externals", "metas", "notes", "tags"].includes(key)) {
              for (const value of values) {
                obj = obj[key.slice(0, -1)](value);
              }
              continue;
            }
            if (key === "alterations") {
              const alter = {};
              for (const { target, adjuster } of values) {
                alter[target] = adjuster;
              }
              obj = obj.alter(alter);
              continue;
            }
            if (key === "whens") {
              for (const value of values) {
                const { ref, is, not, then, otherwise, concat } = value;
                if (concat) {
                  obj = obj.concat(concat);
                } else if (ref) {
                  obj = obj.when(ref, { is, not, then, otherwise, switch: value.switch, break: value.break });
                } else {
                  obj = obj.when(is, { then, otherwise, break: value.break });
                }
              }
              continue;
            }
            if (key === "shared") {
              for (const value of values) {
                obj = obj.shared(value);
              }
            }
          }
          return obj;
        }
      },
      messages: {
        "any.custom": "{{#label}} failed custom validation because {{#error.message}}",
        "any.default": "{{#label}} threw an error when running default method",
        "any.failover": "{{#label}} threw an error when running failover method",
        "any.invalid": "{{#label}} contains an invalid value",
        "any.only": '{{#label}} must be {if(#valids.length == 1, "", "one of ")}{{#valids}}',
        "any.ref": "{{#label}} {{#arg}} references {{:#ref}} which {{#reason}}",
        "any.required": "{{#label}} is required",
        "any.unknown": "{{#label}} is not allowed"
      }
    });
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/alternatives.js
var require_alternatives = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/alternatives.js"(exports, module) {
    "use strict";
    var { assert, merge } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Ref = require_ref();
    var internals = {};
    module.exports = Any.extend({
      type: "alternatives",
      flags: {
        match: { default: "any" }
        // 'any', 'one', 'all'
      },
      terms: {
        matches: { init: [], register: Ref.toSibling }
      },
      args(schema, ...schemas2) {
        if (schemas2.length === 1) {
          if (Array.isArray(schemas2[0])) {
            return schema.try(...schemas2[0]);
          }
        }
        return schema.try(...schemas2);
      },
      validate(value, helpers) {
        const { schema, error, state, prefs } = helpers;
        if (schema._flags.match) {
          const matched = [];
          const failed = [];
          for (let i = 0; i < schema.$_terms.matches.length; ++i) {
            const item = schema.$_terms.matches[i];
            const localState = state.nest(item.schema, `match.${i}`);
            localState.snapshot();
            const result = item.schema.$_validate(value, localState, prefs);
            if (!result.errors) {
              matched.push(result.value);
              localState.commit();
            } else {
              failed.push(result.errors);
              localState.restore();
            }
          }
          if (matched.length === 0) {
            const context = {
              details: failed.map((f) => Errors.details(f, { override: false }))
            };
            return { errors: error("alternatives.any", context) };
          }
          if (schema._flags.match === "one") {
            return matched.length === 1 ? { value: matched[0] } : { errors: error("alternatives.one") };
          }
          if (matched.length !== schema.$_terms.matches.length) {
            const context = {
              details: failed.map((f) => Errors.details(f, { override: false }))
            };
            return { errors: error("alternatives.all", context) };
          }
          const isAnyObj = (alternative) => {
            return alternative.$_terms.matches.some((v) => {
              return v.schema.type === "object" || v.schema.type === "alternatives" && isAnyObj(v.schema);
            });
          };
          return isAnyObj(schema) ? { value: matched.reduce((acc, v) => merge(acc, v, { mergeArrays: false })) } : { value: matched[matched.length - 1] };
        }
        const errors = [];
        for (let i = 0; i < schema.$_terms.matches.length; ++i) {
          const item = schema.$_terms.matches[i];
          if (item.schema) {
            const localState = state.nest(item.schema, `match.${i}`);
            localState.snapshot();
            const result = item.schema.$_validate(value, localState, prefs);
            if (!result.errors) {
              localState.commit();
              return result;
            }
            localState.restore();
            errors.push({ schema: item.schema, reports: result.errors });
            continue;
          }
          const input = item.ref ? item.ref.resolve(value, state, prefs) : value;
          const tests = item.is ? [item] : item.switch;
          for (let j = 0; j < tests.length; ++j) {
            const test = tests[j];
            const { is, then, otherwise } = test;
            const id = `match.${i}${item.switch ? "." + j : ""}`;
            if (!is.$_match(input, state.nest(is, `${id}.is`), prefs)) {
              if (otherwise) {
                return otherwise.$_validate(value, state.nest(otherwise, `${id}.otherwise`), prefs);
              }
            } else if (then) {
              return then.$_validate(value, state.nest(then, `${id}.then`), prefs);
            }
          }
        }
        return internals.errors(errors, helpers);
      },
      jsonSchema(schema, res, mode, options) {
        const matches = [];
        for (const match of schema.$_terms.matches) {
          if (match.schema) {
            matches.push(match.schema.$_jsonSchema(mode, options));
          } else {
            const tests = match.is ? [match] : match.switch;
            for (const test of tests) {
              if (test.then) {
                matches.push(test.then.$_jsonSchema(mode, options));
              }
              if (test.otherwise) {
                matches.push(test.otherwise.$_jsonSchema(mode, options));
              }
            }
          }
        }
        if (matches.length) {
          delete res.type;
          const matchMode = schema._flags.match ?? "any";
          if (matchMode === "one") {
            res.oneOf = matches;
          } else if (matchMode === "all") {
            res.allOf = matches;
          } else {
            res.anyOf = matches;
          }
        }
        return res;
      },
      rules: {
        conditional: {
          method(condition, options) {
            assert(!this._flags._endedSwitch, "Unreachable condition");
            assert(!this._flags.match, "Cannot combine match mode", this._flags.match, "with conditional rule");
            assert(options.break === void 0, "Cannot use break option with alternatives conditional");
            const obj = this.clone();
            const match = Compile.when(obj, condition, options);
            const conditions = match.is ? [match] : match.switch;
            for (const item of conditions) {
              if (item.then && item.otherwise) {
                obj.$_setFlag("_endedSwitch", true, { clone: false });
                break;
              }
            }
            obj.$_terms.matches.push(match);
            return obj.$_mutateRebuild();
          }
        },
        match: {
          method(mode) {
            assert(["any", "one", "all"].includes(mode), "Invalid alternatives match mode", mode);
            if (mode !== "any") {
              for (const match of this.$_terms.matches) {
                assert(match.schema, "Cannot combine match mode", mode, "with conditional rules");
              }
            }
            return this.$_setFlag("match", mode);
          }
        },
        try: {
          method(...schemas2) {
            assert(schemas2.length, "Missing alternative schemas");
            Common.verifyFlat(schemas2, "try");
            assert(!this._flags._endedSwitch, "Unreachable condition");
            const obj = this.clone();
            for (const schema of schemas2) {
              obj.$_terms.matches.push({ schema: obj.$_compile(schema) });
            }
            return obj.$_mutateRebuild();
          }
        }
      },
      overrides: {
        label(name) {
          const obj = this.$_parent("label", name);
          const each = (item, source) => {
            return source.path[0] !== "is" && typeof item._flags.label !== "string" ? item.label(name) : void 0;
          };
          return obj.$_modify({ each, ref: false });
        },
        isAsync() {
          if (this.$_terms.externals?.length) {
            return true;
          }
          for (const match of this.$_terms.matches) {
            if (match.schema?.isAsync()) {
              return true;
            }
            if (match.then?.isAsync()) {
              return true;
            }
            if (match.otherwise?.isAsync()) {
              return true;
            }
          }
          return false;
        }
      },
      rebuild(schema) {
        const each = (item) => {
          if (Common.isSchema(item) && item.type === "array") {
            schema.$_setFlag("_arrayItems", true, { clone: false });
          }
        };
        schema.$_modify({ each });
      },
      manifest: {
        build(obj, desc) {
          if (desc.matches) {
            for (const match of desc.matches) {
              const { schema, ref, is, not, then, otherwise } = match;
              if (schema) {
                obj = obj.try(schema);
              } else if (ref) {
                obj = obj.conditional(ref, { is, then, not, otherwise, switch: match.switch });
              } else {
                obj = obj.conditional(is, { then, otherwise });
              }
            }
          }
          return obj;
        }
      },
      messages: {
        "alternatives.all": "{{#label}} does not match all of the required types",
        "alternatives.any": "{{#label}} does not match any of the allowed types",
        "alternatives.match": "{{#label}} does not match any of the allowed types",
        "alternatives.one": "{{#label}} matches more than one allowed type",
        "alternatives.types": "{{#label}} must be one of {{#types}}"
      }
    });
    internals.errors = function(failures, { error, state }) {
      if (!failures.length) {
        return { errors: error("alternatives.any") };
      }
      if (failures.length === 1) {
        return { errors: failures[0].reports };
      }
      const valids = /* @__PURE__ */ new Set();
      const complex = [];
      for (const { reports, schema } of failures) {
        if (reports.length > 1) {
          return internals.unmatched(failures, error);
        }
        const report = reports[0];
        if (report instanceof Errors.Report === false) {
          return internals.unmatched(failures, error);
        }
        if (report.state.path.length !== state.path.length) {
          complex.push({ type: schema.type, report });
          continue;
        }
        if (report.code === "any.only") {
          for (const valid of report.local.valids) {
            valids.add(valid);
          }
          continue;
        }
        const [type, code] = report.code.split(".");
        if (code !== "base") {
          complex.push({ type: schema.type, report });
        } else if (report.code === "object.base") {
          valids.add(report.local.type);
        } else {
          valids.add(type);
        }
      }
      if (!complex.length) {
        return { errors: error("alternatives.types", { types: [...valids] }) };
      }
      if (complex.length === 1) {
        return { errors: complex[0].report };
      }
      return internals.unmatched(failures, error);
    };
    internals.unmatched = function(failures, error) {
      const errors = [];
      for (const failure of failures) {
        errors.push(...failure.reports);
      }
      return { errors: error("alternatives.match", Errors.details(errors, { override: false })) };
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/array.js
var require_array = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/array.js"(exports, module) {
    "use strict";
    var { assert, deepEqual, reach } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var internals = {};
    module.exports = Any.extend({
      type: "array",
      flags: {
        single: { default: false },
        sparse: { default: false }
      },
      terms: {
        items: { init: [], manifest: "schema" },
        ordered: { init: [], manifest: "schema" },
        _exclusions: { init: [] },
        _inclusions: { init: [] },
        _requireds: { init: [] }
      },
      coerce: {
        from: "object",
        method(value, { schema, state, prefs }) {
          if (!Array.isArray(value)) {
            return;
          }
          const sort = schema.$_getRule("sort");
          if (!sort) {
            return;
          }
          return internals.sort(schema, value, sort.args.options, state, prefs);
        }
      },
      validate(value, { schema, error }) {
        if (!Array.isArray(value)) {
          if (schema._flags.single) {
            const single = [value];
            single[Common.symbols.arraySingle] = true;
            return { value: single };
          }
          return { errors: error("array.base") };
        }
        if (!schema.$_getRule("items") && !schema.$_terms.externals) {
          return;
        }
        return { value: value.slice() };
      },
      jsonSchema(schema, res, mode, options) {
        const ordered = schema.$_terms.ordered;
        if (ordered.length) {
          res.prefixItems = ordered.map((item) => item.$_jsonSchema(mode, options));
        }
        if (schema.$_terms.items.length) {
          let items;
          if (schema.$_terms.items.length === 1) {
            items = schema.$_terms.items[0].$_jsonSchema(mode, options);
          } else {
            items = {
              anyOf: schema.$_terms.items.map((item) => item.$_jsonSchema(mode, options))
            };
          }
          if (ordered.length) {
            res.unevaluatedItems = items;
            internals.setOrderedMinItems(res, ordered);
          } else {
            res.items = items;
          }
        } else if (ordered.length) {
          res.unevaluatedItems = false;
          internals.setOrderedMinItems(res, ordered);
          res.maxItems = ordered.length;
        }
        const contains = [];
        for (const rule of schema._rules) {
          if (rule.name === "has" && !rule.args.schema._refs.refs.length) {
            contains.push(rule.args.schema.$_jsonSchema(mode, options));
          }
        }
        if (contains.length) {
          if (contains.length === 1) {
            res.contains = contains[0];
          } else {
            res.allOf = contains.map((item) => ({ contains: item }));
          }
        }
        if (schema._flags.single && schema.$_terms.items.length) {
          let items;
          if (schema.$_terms.items.length === 1) {
            items = schema.$_terms.items[0].$_jsonSchema(mode, options);
          } else {
            items = {
              anyOf: schema.$_terms.items.map((item) => item.$_jsonSchema(mode, options))
            };
          }
          res = {
            anyOf: [
              res,
              items
            ]
          };
        }
        return res;
      },
      rules: {
        has: {
          method(schema) {
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.$_addRule({ name: "has", args: { schema } });
            obj.$_mutateRegister(schema);
            return obj;
          },
          validate(value, { state, prefs, error }, { schema: has }) {
            const ancestors = [value, ...state.ancestors];
            for (let i = 0; i < value.length; ++i) {
              const localState = state.localize([...state.path, i], ancestors, has);
              if (has.$_match(value[i], localState, prefs)) {
                return value;
              }
            }
            const patternLabel = has._flags.label;
            if (patternLabel) {
              return error("array.hasKnown", { patternLabel });
            }
            return error("array.hasUnknown", null);
          },
          multi: true
        },
        items: {
          method(...schemas2) {
            Common.verifyFlat(schemas2, "items");
            const obj = this.$_addRule("items");
            for (let i = 0; i < schemas2.length; ++i) {
              const type = Common.tryWithPath(() => this.$_compile(schemas2[i]), i, { append: true });
              obj.$_terms.items.push(type);
            }
            return obj.$_mutateRebuild();
          },
          validate(value, { schema, error, state, prefs, errorsArray }) {
            const requireds = schema.$_terms._requireds.slice();
            const ordereds = schema.$_terms.ordered.slice();
            const inclusions = [...schema.$_terms._inclusions, ...requireds];
            const wasArray = !value[Common.symbols.arraySingle];
            delete value[Common.symbols.arraySingle];
            const errors = errorsArray();
            let il = value.length;
            for (let i = 0; i < il; ++i) {
              const item = value[i];
              let errored = false;
              let isValid = false;
              const key = wasArray ? i : new Number(i);
              const path = [...state.path, key];
              if (!schema._flags.sparse && item === void 0) {
                errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
                ordereds.shift();
                continue;
              }
              const ancestors = [value, ...state.ancestors];
              for (const exclusion of schema.$_terms._exclusions) {
                if (!exclusion.$_match(item, state.localize(path, ancestors, exclusion), prefs, { presence: "ignore" })) {
                  continue;
                }
                errors.push(error("array.excludes", { pos: i, value: item }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
                errored = true;
                ordereds.shift();
                break;
              }
              if (errored) {
                continue;
              }
              if (schema.$_terms.ordered.length) {
                if (ordereds.length) {
                  const ordered = ordereds.shift();
                  const res = ordered.$_validate(item, state.localize(path, ancestors, ordered), prefs);
                  if (!res.errors) {
                    if (ordered._flags.result === "strip") {
                      internals.fastSplice(value, i);
                      --i;
                      --il;
                    } else if (!schema._flags.sparse && res.value === void 0) {
                      errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                      if (prefs.abortEarly) {
                        return errors;
                      }
                      continue;
                    } else {
                      value[i] = res.value;
                    }
                  } else {
                    errors.push(...res.errors);
                    if (prefs.abortEarly) {
                      return errors;
                    }
                  }
                  continue;
                } else if (!schema.$_terms.items.length) {
                  errors.push(error("array.orderedLength", { pos: i, limit: schema.$_terms.ordered.length }));
                  if (prefs.abortEarly) {
                    return errors;
                  }
                  break;
                }
              }
              const requiredChecks = [];
              let jl = requireds.length;
              for (let j = 0; j < jl; ++j) {
                const localState = state.localize(path, ancestors, requireds[j]);
                localState.snapshot();
                const res = requireds[j].$_validate(item, localState, prefs);
                requiredChecks[j] = res;
                if (!res.errors) {
                  localState.commit();
                  value[i] = res.value;
                  isValid = true;
                  internals.fastSplice(requireds, j);
                  --j;
                  --jl;
                  if (!schema._flags.sparse && res.value === void 0) {
                    errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                    if (prefs.abortEarly) {
                      return errors;
                    }
                  }
                  break;
                }
                localState.restore();
              }
              if (isValid) {
                continue;
              }
              const stripUnknown = prefs.stripUnknown && !!prefs.stripUnknown.arrays || false;
              jl = inclusions.length;
              for (const inclusion of inclusions) {
                let res;
                const previousCheck = requireds.indexOf(inclusion);
                if (previousCheck !== -1) {
                  res = requiredChecks[previousCheck];
                } else {
                  const localState = state.localize(path, ancestors, inclusion);
                  localState.snapshot();
                  res = inclusion.$_validate(item, localState, prefs);
                  if (!res.errors) {
                    localState.commit();
                    if (inclusion._flags.result === "strip") {
                      internals.fastSplice(value, i);
                      --i;
                      --il;
                    } else if (!schema._flags.sparse && res.value === void 0) {
                      errors.push(error("array.sparse", { key, path, pos: i, value: void 0 }, state.localize(path)));
                      errored = true;
                    } else {
                      value[i] = res.value;
                    }
                    isValid = true;
                    break;
                  }
                  localState.restore();
                }
                if (jl === 1) {
                  if (stripUnknown) {
                    internals.fastSplice(value, i);
                    --i;
                    --il;
                    isValid = true;
                    break;
                  }
                  errors.push(...res.errors);
                  if (prefs.abortEarly) {
                    return errors;
                  }
                  errored = true;
                  break;
                }
              }
              if (errored) {
                continue;
              }
              if ((schema.$_terms._inclusions.length || schema.$_terms._requireds.length) && !isValid) {
                if (stripUnknown) {
                  internals.fastSplice(value, i);
                  --i;
                  --il;
                  continue;
                }
                errors.push(error("array.includes", { pos: i, value: item }, state.localize(path)));
                if (prefs.abortEarly) {
                  return errors;
                }
              }
            }
            if (requireds.length) {
              internals.fillMissedErrors(schema, errors, requireds, value, state, prefs);
            }
            if (ordereds.length) {
              internals.fillOrderedErrors(schema, errors, ordereds, value, state, prefs);
              if (!errors.length) {
                internals.fillDefault(ordereds, value, state, prefs);
              }
            }
            return errors.length ? errors : value;
          },
          priority: true,
          manifest: false
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value.length, limit, operator)) {
              return value;
            }
            return helpers.error("array." + name, { limit: args.limit, value });
          },
          jsonSchema(rule, res) {
            res.minItems = rule.args.limit;
            res.maxItems = rule.args.limit;
            return res;
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          },
          jsonSchema(rule, res) {
            res.maxItems = rule.args.limit;
            return res;
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          },
          jsonSchema(rule, res) {
            res.minItems = rule.args.limit;
            return res;
          }
        },
        ordered: {
          method(...schemas2) {
            Common.verifyFlat(schemas2, "ordered");
            const obj = this.$_addRule("items");
            for (let i = 0; i < schemas2.length; ++i) {
              const type = Common.tryWithPath(() => this.$_compile(schemas2[i]), i, { append: true });
              internals.validateSingle(type, obj);
              obj.$_mutateRegister(type);
              obj.$_terms.ordered.push(type);
            }
            return obj.$_mutateRebuild();
          }
        },
        single: {
          method(enabled) {
            const value = enabled === void 0 ? true : !!enabled;
            assert(!value || !this._flags._arrayItems, "Cannot specify single rule when array has array items");
            return this.$_setFlag("single", value);
          }
        },
        sort: {
          method(options = {}) {
            Common.assertOptions(options, ["by", "order"]);
            const settings = {
              order: options.order || "ascending"
            };
            if (options.by) {
              settings.by = Compile.ref(options.by, { ancestor: 0 });
              assert(!settings.by.ancestor, "Cannot sort by ancestor");
            }
            return this.$_addRule({ name: "sort", args: { options: settings } });
          },
          validate(value, { error, state, prefs, schema }, { options }) {
            const { value: sorted, errors } = internals.sort(schema, value, options, state, prefs);
            if (errors) {
              return errors;
            }
            for (let i = 0; i < value.length; ++i) {
              if (value[i] !== sorted[i]) {
                return error("array.sort", { order: options.order, by: options.by ? options.by.key : "value" });
              }
            }
            return value;
          },
          convert: true
        },
        sparse: {
          method(enabled) {
            const value = enabled === void 0 ? true : !!enabled;
            if (this._flags.sparse === value) {
              return this;
            }
            const obj = value ? this.clone() : this.$_addRule("items");
            return obj.$_setFlag("sparse", value, { clone: false });
          }
        },
        unique: {
          method(comparator, options = {}) {
            assert(!comparator || typeof comparator === "function" || typeof comparator === "string", "comparator must be a function or a string");
            Common.assertOptions(options, ["ignoreUndefined", "separator"]);
            const rule = { name: "unique", args: { options, comparator } };
            if (comparator) {
              if (typeof comparator === "string") {
                const separator = Common.default(options.separator, ".");
                rule.path = separator ? comparator.split(separator) : [comparator];
              } else {
                rule.comparator = comparator;
              }
            }
            return this.$_addRule(rule);
          },
          validate(value, { state, error, schema }, { comparator: raw, options }, { comparator, path }) {
            const found = {
              string: /* @__PURE__ */ Object.create(null),
              number: /* @__PURE__ */ Object.create(null),
              undefined: /* @__PURE__ */ Object.create(null),
              boolean: /* @__PURE__ */ Object.create(null),
              bigint: /* @__PURE__ */ Object.create(null),
              object: /* @__PURE__ */ new Map(),
              function: /* @__PURE__ */ new Map(),
              custom: /* @__PURE__ */ new Map()
            };
            const compare = comparator || deepEqual;
            const ignoreUndefined = options.ignoreUndefined;
            for (let i = 0; i < value.length; ++i) {
              const item = path ? reach(value[i], path) : value[i];
              const records = comparator ? found.custom : found[typeof item];
              assert(records, "Failed to find unique map container for type", typeof item);
              if (records instanceof Map) {
                const entries = records.entries();
                let current;
                while (!(current = entries.next()).done) {
                  if (compare(current.value[0], item)) {
                    const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                    const context = {
                      pos: i,
                      value: value[i],
                      dupePos: current.value[1],
                      dupeValue: value[current.value[1]]
                    };
                    if (path) {
                      context.path = raw;
                    }
                    return error("array.unique", context, localState);
                  }
                }
                records.set(item, i);
              } else {
                if ((!ignoreUndefined || item !== void 0) && records[item] !== void 0) {
                  const context = {
                    pos: i,
                    value: value[i],
                    dupePos: records[item],
                    dupeValue: value[records[item]]
                  };
                  if (path) {
                    context.path = raw;
                  }
                  const localState = state.localize([...state.path, i], [value, ...state.ancestors]);
                  return error("array.unique", context, localState);
                }
                records[item] = i;
              }
            }
            return value;
          },
          jsonSchema(rule, res) {
            if (!rule.args.comparator) {
              res.uniqueItems = true;
            }
            return res;
          },
          args: ["comparator", "options"],
          multi: true
        }
      },
      overrides: {
        isAsync() {
          if (this.$_terms.externals?.length) {
            return true;
          }
          for (const item of this.$_terms.items) {
            if (item.isAsync()) {
              return true;
            }
          }
          for (const item of this.$_terms.ordered) {
            if (item.isAsync()) {
              return true;
            }
          }
          return false;
        }
      },
      cast: {
        set: {
          from: Array.isArray,
          to(value, helpers) {
            return new Set(value);
          }
        }
      },
      rebuild(schema) {
        schema.$_terms._inclusions = [];
        schema.$_terms._exclusions = [];
        schema.$_terms._requireds = [];
        for (const type of schema.$_terms.items) {
          internals.validateSingle(type, schema);
          if (type._flags.presence === "required") {
            schema.$_terms._requireds.push(type);
          } else if (type._flags.presence === "forbidden") {
            schema.$_terms._exclusions.push(type);
          } else {
            schema.$_terms._inclusions.push(type);
          }
        }
        for (const type of schema.$_terms.ordered) {
          internals.validateSingle(type, schema);
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.items) {
            obj = obj.items(...desc.items);
          }
          if (desc.ordered) {
            obj = obj.ordered(...desc.ordered);
          }
          return obj;
        }
      },
      messages: {
        "array.base": "{{#label}} must be an array",
        "array.excludes": "{{#label}} contains an excluded value",
        "array.hasKnown": "{{#label}} does not contain at least one required match for type {:#patternLabel}",
        "array.hasUnknown": "{{#label}} does not contain at least one required match",
        "array.includes": "{{#label}} does not match any of the allowed types",
        "array.includesRequiredBoth": "{{#label}} does not contain {{#knownMisses}} and {{#unknownMisses}} other required value(s)",
        "array.includesRequiredKnowns": "{{#label}} does not contain {{#knownMisses}}",
        "array.includesRequiredUnknowns": "{{#label}} does not contain {{#unknownMisses}} required value(s)",
        "array.length": "{{#label}} must contain {{#limit}} items",
        "array.max": "{{#label}} must contain less than or equal to {{#limit}} items",
        "array.min": "{{#label}} must contain at least {{#limit}} items",
        "array.orderedLength": "{{#label}} must contain at most {{#limit}} items",
        "array.sort": "{{#label}} must be sorted in {#order} order by {{#by}}",
        "array.sort.mismatching": "{{#label}} cannot be sorted due to mismatching types",
        "array.sort.unsupported": "{{#label}} cannot be sorted due to unsupported type {#type}",
        "array.sparse": "{{#label}} must not be a sparse array item",
        "array.unique": "{{#label}} contains a duplicate value"
      }
    });
    internals.setOrderedMinItems = function(res, ordered) {
      const minItems = internals.orderedMinItems(ordered);
      if (minItems) {
        res.minItems = minItems;
      }
    };
    internals.orderedMinItems = function(ordered) {
      for (let i = ordered.length - 1; i >= 0; --i) {
        if (ordered[i]._flags.presence === "required") {
          return i + 1;
        }
      }
      return 0;
    };
    internals.fillMissedErrors = function(schema, errors, requireds, value, state, prefs) {
      const knownMisses = [];
      let unknownMisses = 0;
      for (const required of requireds) {
        const label = required._flags.label;
        if (label) {
          knownMisses.push(label);
        } else {
          ++unknownMisses;
        }
      }
      if (knownMisses.length) {
        if (unknownMisses) {
          errors.push(schema.$_createError("array.includesRequiredBoth", value, { knownMisses, unknownMisses }, state, prefs));
        } else {
          errors.push(schema.$_createError("array.includesRequiredKnowns", value, { knownMisses }, state, prefs));
        }
      } else {
        errors.push(schema.$_createError("array.includesRequiredUnknowns", value, { unknownMisses }, state, prefs));
      }
    };
    internals.fillOrderedErrors = function(schema, errors, ordereds, value, state, prefs) {
      const requiredOrdereds = [];
      for (const ordered of ordereds) {
        if (ordered._flags.presence === "required") {
          requiredOrdereds.push(ordered);
        }
      }
      if (requiredOrdereds.length) {
        internals.fillMissedErrors(schema, errors, requiredOrdereds, value, state, prefs);
      }
    };
    internals.fillDefault = function(ordereds, value, state, prefs) {
      const overrides = [];
      let trailingUndefined = true;
      for (let i = ordereds.length - 1; i >= 0; --i) {
        const ordered = ordereds[i];
        const ancestors = [value, ...state.ancestors];
        const override = ordered.$_validate(void 0, state.localize(state.path, ancestors, ordered), prefs).value;
        if (trailingUndefined) {
          if (override === void 0) {
            continue;
          }
          trailingUndefined = false;
        }
        overrides.unshift(override);
      }
      if (overrides.length) {
        value.push(...overrides);
      }
    };
    internals.fastSplice = function(arr, i) {
      let pos = i;
      while (pos < arr.length) {
        arr[pos++] = arr[pos];
      }
      --arr.length;
    };
    internals.validateSingle = function(type, obj) {
      if (type.type === "array" || type._flags._arrayItems) {
        assert(!obj._flags.single, "Cannot specify array item with single rule enabled");
        obj.$_setFlag("_arrayItems", true, { clone: false });
      }
    };
    internals.sort = function(schema, value, settings, state, prefs) {
      const order = settings.order === "ascending" ? 1 : -1;
      const aFirst = -1 * order;
      const bFirst = order;
      const sort = (a, b) => {
        let compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
          return compare;
        }
        if (settings.by) {
          a = settings.by.resolve(a, state, prefs);
          b = settings.by.resolve(b, state, prefs);
        }
        compare = internals.compare(a, b, aFirst, bFirst);
        if (compare !== null) {
          return compare;
        }
        const type = typeof a;
        if (type !== typeof b) {
          throw schema.$_createError("array.sort.mismatching", value, null, state, prefs);
        }
        if (type !== "number" && type !== "string") {
          throw schema.$_createError("array.sort.unsupported", value, { type }, state, prefs);
        }
        if (type === "number") {
          return (a - b) * order;
        }
        return a < b ? aFirst : bFirst;
      };
      try {
        return { value: value.slice().sort(sort) };
      } catch (err) {
        return { errors: err };
      }
    };
    internals.compare = function(a, b, aFirst, bFirst) {
      if (a === b) {
        return 0;
      }
      if (a === void 0) {
        return 1;
      }
      if (b === void 0) {
        return -1;
      }
      if (a === null) {
        return bFirst;
      }
      if (b === null) {
        return aFirst;
      }
      return null;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/boolean.js
var require_boolean = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/boolean.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var Values = require_values();
    var internals = {};
    internals.isBool = function(value) {
      return typeof value === "boolean";
    };
    module.exports = Any.extend({
      type: "boolean",
      flags: {
        sensitive: { default: false }
      },
      terms: {
        falsy: {
          init: null,
          manifest: "values"
        },
        truthy: {
          init: null,
          manifest: "values"
        }
      },
      coerce(value, { schema }) {
        if (typeof value === "boolean") {
          return;
        }
        if (typeof value === "string") {
          const trimmedValue = value.trim();
          const normalized = schema._flags.sensitive ? trimmedValue : trimmedValue.toLowerCase();
          value = normalized === "true" ? true : normalized === "false" ? false : value;
        }
        if (typeof value !== "boolean") {
          value = schema.$_terms.truthy && schema.$_terms.truthy.has(value, null, null, !schema._flags.sensitive) || (schema.$_terms.falsy && schema.$_terms.falsy.has(value, null, null, !schema._flags.sensitive) ? false : value);
        }
        return { value };
      },
      validate(value, { error }) {
        if (typeof value !== "boolean") {
          return { value, errors: error("boolean.base") };
        }
      },
      rules: {
        truthy: {
          method(...values) {
            Common.verifyFlat(values, "truthy");
            const obj = this.clone();
            obj.$_terms.truthy = obj.$_terms.truthy || new Values();
            for (let i = 0; i < values.length; ++i) {
              const value = values[i];
              assert(value !== void 0, "Cannot call truthy with undefined");
              obj.$_terms.truthy.add(value);
            }
            return obj;
          }
        },
        falsy: {
          method(...values) {
            Common.verifyFlat(values, "falsy");
            const obj = this.clone();
            obj.$_terms.falsy = obj.$_terms.falsy || new Values();
            for (let i = 0; i < values.length; ++i) {
              const value = values[i];
              assert(value !== void 0, "Cannot call falsy with undefined");
              obj.$_terms.falsy.add(value);
            }
            return obj;
          }
        },
        sensitive: {
          method(enabled = true) {
            return this.$_setFlag("sensitive", enabled);
          }
        }
      },
      cast: {
        number: {
          from: internals.isBool,
          to(value, helpers) {
            return value ? 1 : 0;
          }
        },
        string: {
          from: internals.isBool,
          to(value, helpers) {
            return value ? "true" : "false";
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.truthy) {
            obj = obj.truthy(...desc.truthy);
          }
          if (desc.falsy) {
            obj = obj.falsy(...desc.falsy);
          }
          return obj;
        }
      },
      messages: {
        "boolean.base": "{{#label}} must be a boolean"
      }
    });
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/date.js
var require_date = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/date.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var Template = require_template();
    var internals = {
      formats: ["iso", "javascript", "unix"]
    };
    internals.isDate = function(value) {
      return value instanceof Date;
    };
    module.exports = Any.extend({
      type: "date",
      coerce: {
        from: ["number", "string"],
        method(value, { schema }) {
          return { value: internals.parse(value, schema._flags.format) || value };
        }
      },
      validate(value, { schema, error, prefs }) {
        if (value instanceof Date && !isNaN(value.getTime())) {
          return;
        }
        const format = schema._flags.format;
        if (!prefs.convert || !format || typeof value !== "string") {
          return { value, errors: error("date.base") };
        }
        return { value, errors: error("date.format", { format }) };
      },
      jsonSchema(schema, res, mode, options) {
        res.type = "string";
        res.format = "date-time";
        return res;
      },
      rules: {
        compare: {
          method: false,
          validate(value, helpers, { date }, { name, operator, args }) {
            const to = date === "now" ? Date.now() : date.getTime();
            if (Common.compare(value.getTime(), to, operator)) {
              return value;
            }
            return helpers.error("date." + name, { limit: args.date, value });
          },
          args: [
            {
              name: "date",
              ref: true,
              normalize: (date) => {
                return date === "now" ? date : internals.parse(date);
              },
              assert: (date) => date !== null,
              message: "must have a valid date format"
            }
          ]
        },
        format: {
          method(format) {
            assert(internals.formats.includes(format), "Unknown date format", format);
            return this.$_setFlag("format", format);
          }
        },
        greater: {
          method(date) {
            return this.$_addRule({ name: "greater", method: "compare", args: { date }, operator: ">" });
          },
          jsonSchema(rule, res) {
            const date = rule.args.date;
            if (date instanceof Date) {
              res["x-constraint"] = { ...res["x-constraint"], greater: date.toISOString() };
            }
            return res;
          }
        },
        iso: {
          method() {
            return this.format("iso");
          }
        },
        less: {
          method(date) {
            return this.$_addRule({ name: "less", method: "compare", args: { date }, operator: "<" });
          },
          jsonSchema(rule, res) {
            const date = rule.args.date;
            if (date instanceof Date) {
              res["x-constraint"] = { ...res["x-constraint"], less: date.toISOString() };
            }
            return res;
          }
        },
        max: {
          method(date) {
            return this.$_addRule({ name: "max", method: "compare", args: { date }, operator: "<=" });
          },
          jsonSchema(rule, res) {
            const date = rule.args.date;
            if (date instanceof Date) {
              res["x-constraint"] = { ...res["x-constraint"], max: date.toISOString() };
            }
            return res;
          }
        },
        min: {
          method(date) {
            return this.$_addRule({ name: "min", method: "compare", args: { date }, operator: ">=" });
          },
          jsonSchema(rule, res) {
            const date = rule.args.date;
            if (date instanceof Date) {
              res["x-constraint"] = { ...res["x-constraint"], min: date.toISOString() };
            }
            return res;
          }
        },
        timestamp: {
          method(type = "javascript") {
            assert(["javascript", "unix"].includes(type), '"type" must be one of "javascript, unix"');
            return this.format(type);
          }
        }
      },
      cast: {
        number: {
          from: internals.isDate,
          to(value, helpers) {
            return value.getTime();
          }
        },
        string: {
          from: internals.isDate,
          to(value, { prefs }) {
            return Template.date(value, prefs);
          }
        }
      },
      messages: {
        "date.base": "{{#label}} must be a valid date",
        "date.format": '{{#label}} must be in {msg("date.format." + #format) || #format} format',
        "date.greater": "{{#label}} must be greater than {{:#limit}}",
        "date.less": "{{#label}} must be less than {{:#limit}}",
        "date.max": "{{#label}} must be less than or equal to {{:#limit}}",
        "date.min": "{{#label}} must be greater than or equal to {{:#limit}}",
        // Messages used in date.format
        "date.format.iso": "ISO 8601 date",
        "date.format.javascript": "timestamp or number of milliseconds",
        "date.format.unix": "timestamp or number of seconds"
      }
    });
    internals.parse = function(value, format) {
      if (value instanceof Date) {
        return value;
      }
      if (typeof value !== "string" && (isNaN(value) || !isFinite(value))) {
        return null;
      }
      if (/^\s*$/.test(value)) {
        return null;
      }
      if (format === "iso") {
        if (!Common.isIsoDate(value)) {
          return null;
        }
        return internals.date(value.toString());
      }
      const original = value;
      if (typeof value === "string" && /^[+-]?\d+(\.\d+)?$/.test(value)) {
        value = parseFloat(value);
      }
      if (format) {
        if (format === "javascript") {
          return internals.date(1 * value);
        }
        if (format === "unix") {
          return internals.date(1e3 * value);
        }
        if (typeof original === "string") {
          return null;
        }
      }
      return internals.date(value);
    };
    internals.date = function(value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date;
      }
      return null;
    };
  }
});

// node_modules/.pnpm/@hapi+topo@6.0.2/node_modules/@hapi/topo/lib/index.js
var require_lib4 = __commonJS({
  "node_modules/.pnpm/@hapi+topo@6.0.2/node_modules/@hapi/topo/lib/index.js"(exports) {
    "use strict";
    var { assert } = require_lib();
    var internals = {};
    exports.Sorter = class {
      constructor() {
        this._items = [];
        this.nodes = [];
      }
      add(nodes, options) {
        options = options ?? {};
        const before = [].concat(options.before ?? []);
        const after = [].concat(options.after ?? []);
        const group = options.group ?? "?";
        const sort = options.sort ?? 0;
        assert(!before.includes(group), `Item cannot come before itself: ${group}`);
        assert(!before.includes("?"), "Item cannot come before unassociated items");
        assert(!after.includes(group), `Item cannot come after itself: ${group}`);
        assert(!after.includes("?"), "Item cannot come after unassociated items");
        if (!Array.isArray(nodes)) {
          nodes = [nodes];
        }
        for (const node of nodes) {
          const item = {
            seq: this._items.length,
            sort,
            before,
            after,
            group,
            node
          };
          this._items.push(item);
        }
        if (!options.manual) {
          const valid = this._sort();
          assert(valid, "item", group !== "?" ? `added into group ${group}` : "", "created a dependencies error");
        }
        return this.nodes;
      }
      merge(others) {
        if (!Array.isArray(others)) {
          others = [others];
        }
        for (const other of others) {
          if (other) {
            for (const item of other._items) {
              this._items.push(Object.assign({}, item));
            }
          }
        }
        this._items.sort(internals.mergeSort);
        for (let i = 0; i < this._items.length; ++i) {
          this._items[i].seq = i;
        }
        const valid = this._sort();
        assert(valid, "merge created a dependencies error");
        return this.nodes;
      }
      sort() {
        const valid = this._sort();
        assert(valid, "sort created a dependencies error");
        return this.nodes;
      }
      _sort() {
        const graph = {};
        const graphAfters = /* @__PURE__ */ Object.create(null);
        const groups = /* @__PURE__ */ Object.create(null);
        for (const item of this._items) {
          const seq = item.seq;
          const group = item.group;
          groups[group] = groups[group] ?? [];
          groups[group].push(seq);
          graph[seq] = item.before;
          for (const after of item.after) {
            graphAfters[after] = graphAfters[after] ?? [];
            graphAfters[after].push(seq);
          }
        }
        for (const node in graph) {
          const expandedGroups = [];
          for (const graphNodeItem in graph[node]) {
            const group = graph[node][graphNodeItem];
            groups[group] = groups[group] ?? [];
            expandedGroups.push(...groups[group]);
          }
          graph[node] = expandedGroups;
        }
        for (const group in graphAfters) {
          if (groups[group]) {
            for (const node of groups[group]) {
              graph[node].push(...graphAfters[group]);
            }
          }
        }
        const ancestors = {};
        for (const node in graph) {
          const children = graph[node];
          for (const child of children) {
            ancestors[child] = ancestors[child] ?? [];
            ancestors[child].push(node);
          }
        }
        const visited = {};
        const sorted = [];
        for (let i = 0; i < this._items.length; ++i) {
          let next = i;
          if (ancestors[i]) {
            next = null;
            for (let j = 0; j < this._items.length; ++j) {
              if (visited[j] === true) {
                continue;
              }
              if (!ancestors[j]) {
                ancestors[j] = [];
              }
              const shouldSeeCount = ancestors[j].length;
              let seenCount = 0;
              for (let k = 0; k < shouldSeeCount; ++k) {
                if (visited[ancestors[j][k]]) {
                  ++seenCount;
                }
              }
              if (seenCount === shouldSeeCount) {
                next = j;
                break;
              }
            }
          }
          if (next !== null) {
            visited[next] = true;
            sorted.push(next);
          }
        }
        if (sorted.length !== this._items.length) {
          return false;
        }
        const seqIndex = {};
        for (const item of this._items) {
          seqIndex[item.seq] = item;
        }
        this._items = [];
        this.nodes = [];
        for (const value of sorted) {
          const sortedItem = seqIndex[value];
          this.nodes.push(sortedItem.node);
          this._items.push(sortedItem);
        }
        return true;
      }
    };
    internals.mergeSort = (a, b) => {
      return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/keys.js
var require_keys = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/keys.js"(exports, module) {
    "use strict";
    var { applyToDefaults, assert, clone: Clone } = require_lib();
    var Topo = require_lib4();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Ref = require_ref();
    var Template = require_template();
    var internals = {
      renameDefaults: {
        alias: false,
        // Keep old value in place
        multiple: false,
        // Allow renaming multiple keys into the same target
        override: false
        // Overrides an existing key
      }
    };
    module.exports = Any.extend({
      type: "_keys",
      properties: {
        typeof: "object"
      },
      flags: {
        unknown: { default: void 0 }
      },
      terms: {
        dependencies: { init: null },
        keys: { init: null, manifest: { mapped: { from: "schema", to: "key" } } },
        patterns: { init: null },
        renames: { init: null }
      },
      args(schema, keys) {
        return schema.keys(keys);
      },
      jsonSchema(schema, res, mode, options) {
        res.type = "object";
        if (schema.$_terms.keys) {
          res.properties = {};
          const required = [];
          for (const child of schema.$_terms.keys) {
            const jsonSchema = child.schema.$_jsonSchema(mode, options);
            res.properties[child.key] = jsonSchema;
            if (child.schema._flags.id) {
              options.$defs[child.schema._flags.id] = jsonSchema;
            }
            if (child.schema._flags.presence === "required" || mode === "output" && child.schema._flags.default !== void 0) {
              required.push(child.key);
            }
          }
          if (required.length) {
            res.required = required.sort();
          }
        }
        if (schema.$_terms.patterns) {
          const patternProperties = {};
          for (const pattern of schema.$_terms.patterns) {
            if (pattern.regex) {
              patternProperties[pattern.regex.source] = pattern.rule.$_jsonSchema(mode, options);
            } else {
              const isAny = pattern.schema.type === "any";
              if (isAny) {
                res.additionalProperties = pattern.rule.$_jsonSchema(mode, options);
              } else {
                patternProperties[".*"] = pattern.rule.$_jsonSchema(mode, options);
              }
            }
          }
          if (Object.keys(patternProperties).length) {
            res.patternProperties = patternProperties;
          }
        }
        if (res.additionalProperties === void 0) {
          const additionalProperties = schema._flags.unknown === true || schema._flags.unknown === void 0 && !schema.$_terms.keys && !schema.$_terms.patterns && !schema._flags.only;
          if (additionalProperties === false) {
            res.additionalProperties = false;
          }
        }
        return res;
      },
      validate(value, { schema, error, state, prefs }) {
        if (!value || typeof value !== schema.$_property("typeof") || Array.isArray(value)) {
          return { value, errors: error("object.base", { type: schema.$_property("typeof") }) };
        }
        if (!schema.$_terms.renames && !schema.$_terms.dependencies && !schema.$_terms.keys && // null allows any keys
        !schema.$_terms.patterns && !schema.$_terms.externals) {
          return;
        }
        value = internals.clone(value, prefs);
        const errors = [];
        if (schema.$_terms.renames && !internals.rename(schema, value, state, prefs, errors)) {
          return { value, errors };
        }
        if (!schema.$_terms.keys && // null allows any keys
        !schema.$_terms.patterns && !schema.$_terms.dependencies) {
          return { value, errors };
        }
        const unprocessed = new Set(Object.keys(value));
        if (schema.$_terms.keys) {
          const ancestors = [value, ...state.ancestors];
          for (const child of schema.$_terms.keys) {
            const key = child.key;
            const item = value[key];
            unprocessed.delete(key);
            const localState = state.localize([...state.path, key], ancestors, child);
            const result = child.schema.$_validate(item, localState, prefs);
            if (result.errors) {
              if (prefs.abortEarly) {
                return { value, errors: result.errors };
              }
              if (result.value !== void 0) {
                value[key] = result.value;
              }
              errors.push(...result.errors);
            } else if (child.schema._flags.result === "strip" || result.value === void 0 && item !== void 0) {
              delete value[key];
            } else if (result.value !== void 0) {
              value[key] = result.value;
            }
          }
        }
        if (unprocessed.size || schema._flags._hasPatternMatch) {
          const early = internals.unknown(schema, value, unprocessed, errors, state, prefs);
          if (early) {
            return early;
          }
        }
        if (schema.$_terms.dependencies) {
          for (const dep of schema.$_terms.dependencies) {
            if (dep.key !== null && internals.isPresent(dep.options)(dep.key.resolve(value, state, prefs, null, { shadow: false })) === false) {
              continue;
            }
            const failed = internals.dependencies[dep.rel](schema, dep, value, state, prefs);
            if (failed) {
              const report = schema.$_createError(failed.code, value, failed.context, state, prefs);
              if (prefs.abortEarly) {
                return { value, errors: report };
              }
              errors.push(report);
            }
          }
        }
        return { value, errors };
      },
      rules: {
        and: {
          method(...peers) {
            Common.verifyFlat(peers, "and");
            return internals.dependency(this, "and", null, peers);
          }
        },
        append: {
          method(schema) {
            if (schema === null || schema === void 0 || Object.keys(schema).length === 0) {
              return this;
            }
            return this.keys(schema);
          }
        },
        assert: {
          method(subject, schema, message) {
            if (!Template.isTemplate(subject)) {
              subject = Compile.ref(subject);
            }
            assert(message === void 0 || typeof message === "string", "Message must be a string");
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.$_addRule({ name: "assert", args: { subject, schema, message } });
            obj.$_mutateRegister(subject);
            obj.$_mutateRegister(schema);
            return obj;
          },
          validate(value, { error, prefs, state }, { subject, schema, message }) {
            const about = subject.resolve(value, state, prefs);
            const path = Ref.isRef(subject) ? subject.absolute(state) : [];
            if (schema.$_match(about, state.localize(path, [value, ...state.ancestors], schema), prefs)) {
              return value;
            }
            return error("object.assert", { subject, message });
          },
          args: ["subject", "schema", "message"],
          multi: true
        },
        instance: {
          method(constructor, name) {
            assert(typeof constructor === "function", "constructor must be a function");
            name = name || constructor.name;
            return this.$_addRule({ name: "instance", args: { constructor, name } });
          },
          validate(value, helpers, { constructor, name }) {
            if (value instanceof constructor) {
              return value;
            }
            return helpers.error("object.instance", { type: name, value });
          },
          args: ["constructor", "name"]
        },
        keys: {
          method(schema) {
            assert(schema === void 0 || typeof schema === "object", "Object schema must be a valid object");
            assert(!Common.isSchema(schema), "Object schema cannot be a joi schema");
            const obj = this.clone();
            if (!schema) {
              obj.$_terms.keys = null;
            } else if (!Object.keys(schema).length) {
              obj.$_terms.keys = new internals.Keys();
            } else {
              obj.$_terms.keys = obj.$_terms.keys ? obj.$_terms.keys.filter((child) => !schema.hasOwnProperty(child.key)) : new internals.Keys();
              for (const key of Object.keys(schema)) {
                Common.tryWithPath(() => obj.$_terms.keys.push({ key, schema: this.$_compile(schema[key]) }), key);
              }
            }
            return obj.$_mutateRebuild();
          }
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(Object.keys(value).length, limit, operator)) {
              return value;
            }
            return helpers.error("object." + name, { limit: args.limit, value });
          },
          jsonSchema(rule, res) {
            res.minProperties = rule.args.limit;
            res.maxProperties = rule.args.limit;
            return res;
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          },
          jsonSchema(rule, res) {
            res.maxProperties = rule.args.limit;
            return res;
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          },
          jsonSchema(rule, res) {
            res.minProperties = rule.args.limit;
            return res;
          }
        },
        nand: {
          method(...peers) {
            Common.verifyFlat(peers, "nand");
            return internals.dependency(this, "nand", null, peers);
          }
        },
        or: {
          method(...peers) {
            Common.verifyFlat(peers, "or");
            return internals.dependency(this, "or", null, peers);
          }
        },
        oxor: {
          method(...peers) {
            return internals.dependency(this, "oxor", null, peers);
          }
        },
        pattern: {
          method(pattern, schema, options = {}) {
            const isRegExp = pattern instanceof RegExp;
            if (!isRegExp) {
              pattern = this.$_compile(pattern, { appendPath: true });
            }
            assert(schema !== void 0, "Invalid rule");
            Common.assertOptions(options, ["fallthrough", "matches"]);
            if (isRegExp) {
              assert(!pattern.flags.includes("g") && !pattern.flags.includes("y"), "pattern should not use global or sticky mode");
            }
            schema = this.$_compile(schema, { appendPath: true });
            const obj = this.clone();
            obj.$_terms.patterns = obj.$_terms.patterns || [];
            const config2 = { [isRegExp ? "regex" : "schema"]: pattern, rule: schema };
            if (options.matches) {
              config2.matches = this.$_compile(options.matches);
              if (config2.matches.type !== "array") {
                config2.matches = config2.matches.$_root.array().items(config2.matches);
              }
              obj.$_mutateRegister(config2.matches);
              obj.$_setFlag("_hasPatternMatch", true, { clone: false });
            }
            if (options.fallthrough) {
              config2.fallthrough = true;
            }
            obj.$_terms.patterns.push(config2);
            obj.$_mutateRegister(schema);
            return obj;
          }
        },
        ref: {
          method() {
            return this.$_addRule("ref");
          },
          validate(value, helpers) {
            if (Ref.isRef(value)) {
              return value;
            }
            return helpers.error("object.refType", { value });
          }
        },
        regex: {
          method() {
            return this.$_addRule("regex");
          },
          validate(value, helpers) {
            if (value instanceof RegExp) {
              return value;
            }
            return helpers.error("object.regex", { value });
          }
        },
        rename: {
          method(from, to, options = {}) {
            assert(typeof from === "string" || from instanceof RegExp, "Rename missing the from argument");
            assert(typeof to === "string" || to instanceof Template, "Invalid rename to argument");
            assert(to !== from, "Cannot rename key to same name:", from);
            Common.assertOptions(options, ["alias", "ignoreUndefined", "override", "multiple"]);
            const obj = this.clone();
            obj.$_terms.renames = obj.$_terms.renames || [];
            for (const rename of obj.$_terms.renames) {
              assert(rename.from !== from, "Cannot rename the same key multiple times");
            }
            if (to instanceof Template) {
              obj.$_mutateRegister(to);
            }
            obj.$_terms.renames.push({
              from,
              to,
              options: applyToDefaults(internals.renameDefaults, options)
            });
            return obj;
          }
        },
        schema: {
          method(type = "any") {
            return this.$_addRule({ name: "schema", args: { type } });
          },
          validate(value, helpers, { type }) {
            if (Common.isSchema(value) && (type === "any" || value.type === type)) {
              return value;
            }
            return helpers.error("object.schema", { type });
          }
        },
        unknown: {
          method(allow) {
            return this.$_setFlag("unknown", allow !== false);
          }
        },
        with: {
          method(key, peers, options = {}) {
            return internals.dependency(this, "with", key, peers, options);
          }
        },
        without: {
          method(key, peers, options = {}) {
            return internals.dependency(this, "without", key, peers, options);
          }
        },
        xor: {
          method(...peers) {
            Common.verifyFlat(peers, "xor");
            return internals.dependency(this, "xor", null, peers);
          }
        }
      },
      overrides: {
        default(value, options) {
          if (value === void 0) {
            value = Common.symbols.deepDefault;
          }
          return this.$_parent("default", value, options);
        },
        isAsync() {
          if (this.$_terms.externals?.length) {
            return true;
          }
          if (this.$_terms.keys?.length) {
            for (const key of this.$_terms.keys) {
              if (key.schema.isAsync()) {
                return true;
              }
            }
          }
          if (this.$_terms.patterns?.length) {
            for (const pattern of this.$_terms.patterns) {
              if (pattern.rule.isAsync()) {
                return true;
              }
            }
          }
          return false;
        }
      },
      rebuild(schema) {
        if (schema.$_terms.keys) {
          const topo = new Topo.Sorter();
          for (const child of schema.$_terms.keys) {
            Common.tryWithPath(() => topo.add(child, { after: child.schema.$_rootReferences(), group: child.key }), child.key);
          }
          schema.$_terms.keys = new internals.Keys(...topo.nodes);
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.keys) {
            obj = obj.keys(desc.keys);
          }
          if (desc.dependencies) {
            for (const { rel, key = null, peers, options } of desc.dependencies) {
              obj = internals.dependency(obj, rel, key, peers, options);
            }
          }
          if (desc.patterns) {
            for (const { regex, schema, rule, fallthrough, matches } of desc.patterns) {
              obj = obj.pattern(regex || schema, rule, { fallthrough, matches });
            }
          }
          if (desc.renames) {
            for (const { from, to, options } of desc.renames) {
              obj = obj.rename(from, to, options);
            }
          }
          return obj;
        }
      },
      messages: {
        "object.and": "{{#label}} contains {{#presentWithLabels}} without its required peers {{#missingWithLabels}}",
        "object.assert": '{{#label}} is invalid because {if(#subject.key, `"` + #subject.key + `" failed to ` + (#message || "pass the assertion test"), #message || "the assertion failed")}',
        "object.base": "{{#label}} must be of type {{#type}}",
        "object.instance": "{{#label}} must be an instance of {{:#type}}",
        "object.length": '{{#label}} must have {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.max": '{{#label}} must have less than or equal to {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.min": '{{#label}} must have at least {{#limit}} key{if(#limit == 1, "", "s")}',
        "object.missing": "{{#label}} must contain at least one of {{#peersWithLabels}}",
        "object.nand": "{{:#mainWithLabel}} must not exist simultaneously with {{#peersWithLabels}}",
        "object.oxor": "{{#label}} contains a conflict between optional exclusive peers {{#peersWithLabels}}",
        "object.pattern.match": "{{#label}} keys failed to match pattern requirements",
        "object.refType": "{{#label}} must be a Joi reference",
        "object.regex": "{{#label}} must be a RegExp object",
        "object.rename.multiple": "{{#label}} cannot rename {{:#from}} because multiple renames are disabled and another key was already renamed to {{:#to}}",
        "object.rename.override": "{{#label}} cannot rename {{:#from}} because override is disabled and target {{:#to}} exists",
        "object.schema": "{{#label}} must be a Joi schema of {{#type}} type",
        "object.unknown": "{{#label}} is not allowed",
        "object.with": "{{:#mainWithLabel}} missing required peer {{:#peerWithLabel}}",
        "object.without": "{{:#mainWithLabel}} conflict with forbidden peer {{:#peerWithLabel}}",
        "object.xor": "{{#label}} contains a conflict between exclusive peers {{#peersWithLabels}}"
      }
    });
    internals.clone = function(value, prefs) {
      if (typeof value === "object") {
        if (prefs.nonEnumerables) {
          return Clone(value, { shallow: true });
        }
        const proto = Object.getPrototypeOf(value);
        const clone2 = Object.create(proto);
        Object.assign(clone2, value);
        if (Object.getPrototypeOf(clone2) !== proto) {
          Object.setPrototypeOf(clone2, proto);
        }
        return clone2;
      }
      const clone = function(...args) {
        return value.apply(this, args);
      };
      clone.prototype = Clone(value.prototype);
      Object.defineProperty(clone, "name", { value: value.name, writable: false });
      Object.defineProperty(clone, "length", { value: value.length, writable: false });
      Object.assign(clone, value);
      return clone;
    };
    internals.dependency = function(schema, rel, key, peers, options) {
      assert(key === null || typeof key === "string", rel, "key must be a strings");
      if (!options) {
        options = peers.length > 1 && typeof peers[peers.length - 1] === "object" ? peers.pop() : {};
      }
      Common.assertOptions(options, ["separator", "isPresent"]);
      peers = [].concat(peers);
      const separator = Common.default(options.separator, ".");
      const paths = [];
      for (const peer of peers) {
        assert(typeof peer === "string", rel, "peers must be strings");
        paths.push(Compile.ref(peer, { separator, ancestor: 0, prefix: false }));
      }
      if (key !== null) {
        key = Compile.ref(key, { separator, ancestor: 0, prefix: false });
      }
      const obj = schema.clone();
      obj.$_terms.dependencies = obj.$_terms.dependencies || [];
      obj.$_terms.dependencies.push(new internals.Dependency(rel, key, paths, peers, options));
      return obj;
    };
    internals.dependencies = {
      and(schema, dep, value, state, prefs) {
        const missing = [];
        const present = [];
        const count = dep.peers.length;
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false })) === false) {
            missing.push(peer.key);
          } else {
            present.push(peer.key);
          }
        }
        if (missing.length !== count && present.length !== count) {
          return {
            code: "object.and",
            context: {
              present,
              presentWithLabels: internals.keysToLabels(schema, present),
              missing,
              missingWithLabels: internals.keysToLabels(schema, missing)
            }
          };
        }
      },
      nand(schema, dep, value, state, prefs) {
        const present = [];
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false }))) {
            present.push(peer.key);
          }
        }
        if (present.length !== dep.peers.length) {
          return;
        }
        const main = dep.paths[0];
        const values = dep.paths.slice(1);
        return {
          code: "object.nand",
          context: {
            main,
            mainWithLabel: internals.keysToLabels(schema, main),
            peers: values,
            peersWithLabels: internals.keysToLabels(schema, values)
          }
        };
      },
      or(schema, dep, value, state, prefs) {
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false }))) {
            return;
          }
        }
        return {
          code: "object.missing",
          context: {
            peers: dep.paths,
            peersWithLabels: internals.keysToLabels(schema, dep.paths)
          }
        };
      },
      oxor(schema, dep, value, state, prefs) {
        const present = [];
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false }))) {
            present.push(peer.key);
          }
        }
        if (!present.length || present.length === 1) {
          return;
        }
        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: "object.oxor", context };
      },
      with(schema, dep, value, state, prefs) {
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false })) === false) {
            return {
              code: "object.with",
              context: {
                main: dep.key.key,
                mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                peer: peer.key,
                peerWithLabel: internals.keysToLabels(schema, peer.key)
              }
            };
          }
        }
      },
      without(schema, dep, value, state, prefs) {
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false }))) {
            return {
              code: "object.without",
              context: {
                main: dep.key.key,
                mainWithLabel: internals.keysToLabels(schema, dep.key.key),
                peer: peer.key,
                peerWithLabel: internals.keysToLabels(schema, peer.key)
              }
            };
          }
        }
      },
      xor(schema, dep, value, state, prefs) {
        const present = [];
        const isPresent = internals.isPresent(dep.options);
        for (const peer of dep.peers) {
          if (isPresent(peer.resolve(value, state, prefs, null, { shadow: false }))) {
            present.push(peer.key);
          }
        }
        if (present.length === 1) {
          return;
        }
        const context = { peers: dep.paths, peersWithLabels: internals.keysToLabels(schema, dep.paths) };
        if (present.length === 0) {
          return { code: "object.missing", context };
        }
        context.present = present;
        context.presentWithLabels = internals.keysToLabels(schema, present);
        return { code: "object.xor", context };
      }
    };
    internals.keysToLabels = function(schema, keys) {
      if (Array.isArray(keys)) {
        return keys.map((key) => schema.$_mapLabels(key));
      }
      return schema.$_mapLabels(keys);
    };
    internals.isPresent = function(options) {
      return typeof options.isPresent === "function" ? options.isPresent : (resolved) => resolved !== void 0;
    };
    internals.rename = function(schema, value, state, prefs, errors) {
      const renamed = {};
      for (const rename of schema.$_terms.renames) {
        const matches = [];
        const pattern = typeof rename.from !== "string";
        if (!pattern) {
          if (Object.prototype.hasOwnProperty.call(value, rename.from) && (value[rename.from] !== void 0 || !rename.options.ignoreUndefined)) {
            matches.push(rename);
          }
        } else {
          for (const from of Object.keys(value)) {
            if (value[from] === void 0 && rename.options.ignoreUndefined) {
              continue;
            }
            if (from === rename.to) {
              continue;
            }
            const match = rename.from.exec(from);
            if (!match) {
              continue;
            }
            matches.push({ from, to: rename.to, match });
          }
        }
        for (const match of matches) {
          const from = match.from;
          let to = match.to;
          if (to instanceof Template) {
            to = to.render(value, state, prefs, match.match);
          }
          if (from === to) {
            continue;
          }
          if (!rename.options.multiple && renamed[to]) {
            errors.push(schema.$_createError("object.rename.multiple", value, { from, to, pattern }, state, prefs));
            if (prefs.abortEarly) {
              return false;
            }
          }
          if (Object.prototype.hasOwnProperty.call(value, to) && !rename.options.override && !renamed[to]) {
            errors.push(schema.$_createError("object.rename.override", value, { from, to, pattern }, state, prefs));
            if (prefs.abortEarly) {
              return false;
            }
          }
          if (value[from] === void 0) {
            delete value[to];
          } else {
            value[to] = value[from];
          }
          renamed[to] = true;
          if (!rename.options.alias) {
            delete value[from];
          }
        }
      }
      return true;
    };
    internals.unknown = function(schema, value, unprocessed, errors, state, prefs) {
      if (schema.$_terms.patterns) {
        let hasMatches = false;
        const matches = schema.$_terms.patterns.map((pattern) => {
          if (pattern.matches) {
            hasMatches = true;
            return [];
          }
        });
        const ancestors = [value, ...state.ancestors];
        for (const key of unprocessed) {
          const item = value[key];
          const path = [...state.path, key];
          for (let i = 0; i < schema.$_terms.patterns.length; ++i) {
            const pattern = schema.$_terms.patterns[i];
            if (pattern.regex) {
              const match = pattern.regex.test(key);
              state.mainstay.tracer.debug(state, "rule", `pattern.${i}`, match ? "pass" : "error");
              if (!match) {
                continue;
              }
            } else {
              if (!pattern.schema.$_match(key, state.nest(pattern.schema, `pattern.${i}`), prefs)) {
                continue;
              }
            }
            unprocessed.delete(key);
            const localState = state.localize(path, ancestors, { schema: pattern.rule, key });
            const result = pattern.rule.$_validate(item, localState, prefs);
            if (result.errors) {
              if (prefs.abortEarly) {
                return { value, errors: result.errors };
              }
              errors.push(...result.errors);
            }
            if (pattern.matches) {
              matches[i].push(key);
            }
            value[key] = result.value;
            if (!pattern.fallthrough) {
              break;
            }
          }
        }
        if (hasMatches) {
          for (let i = 0; i < matches.length; ++i) {
            const match = matches[i];
            if (!match) {
              continue;
            }
            const stpm = schema.$_terms.patterns[i].matches;
            const localState = state.localize(state.path, ancestors, stpm);
            const result = stpm.$_validate(match, localState, prefs);
            if (result.errors) {
              const details = Errors.details(result.errors, { override: false });
              details.matches = match;
              const report = schema.$_createError("object.pattern.match", value, details, state, prefs);
              if (prefs.abortEarly) {
                return { value, errors: report };
              }
              errors.push(report);
            }
          }
        }
      }
      if (!unprocessed.size || !schema.$_terms.keys && !schema.$_terms.patterns) {
        return;
      }
      if (prefs.stripUnknown && typeof schema._flags.unknown === "undefined" || prefs.skipFunctions) {
        const stripUnknown = prefs.stripUnknown ? prefs.stripUnknown === true ? true : !!prefs.stripUnknown.objects : false;
        for (const key of unprocessed) {
          if (stripUnknown) {
            delete value[key];
            unprocessed.delete(key);
          } else if (typeof value[key] === "function") {
            unprocessed.delete(key);
          }
        }
      }
      const forbidUnknown = !Common.default(schema._flags.unknown, prefs.allowUnknown);
      if (forbidUnknown) {
        for (const unprocessedKey of unprocessed) {
          const localState = state.localize([...state.path, unprocessedKey], []);
          const report = schema.$_createError("object.unknown", value[unprocessedKey], { child: unprocessedKey }, localState, prefs, { flags: false });
          if (prefs.abortEarly) {
            return { value, errors: report };
          }
          errors.push(report);
        }
      }
    };
    internals.Dependency = class {
      constructor(rel, key, peers, paths, options) {
        this.rel = rel;
        this.key = key;
        this.peers = peers;
        this.paths = paths;
        this.options = options;
      }
      describe() {
        const desc = {
          rel: this.rel,
          peers: this.paths
        };
        if (this.key !== null) {
          desc.key = this.key.key;
        }
        if (this.peers[0].separator !== ".") {
          desc.options = { ...desc.options, separator: this.peers[0].separator };
        }
        if (this.options.isPresent) {
          desc.options = { ...desc.options, isPresent: this.options.isPresent };
        }
        return desc;
      }
    };
    internals.Keys = class extends Array {
      concat(source) {
        const result = this.slice();
        const keys = /* @__PURE__ */ new Map();
        for (let i = 0; i < result.length; ++i) {
          keys.set(result[i].key, i);
        }
        for (const item of source) {
          const key = item.key;
          const pos = keys.get(key);
          if (pos !== void 0) {
            result[pos] = { key, schema: result[pos].schema.concat(item.schema) };
          } else {
            result.push(item);
          }
        }
        return result;
      }
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/function.js
var require_function = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/function.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Keys = require_keys();
    module.exports = Keys.extend({
      type: "function",
      properties: {
        typeof: "function"
      },
      rules: {
        arity: {
          method(n) {
            assert(Number.isSafeInteger(n) && n >= 0, "n must be a positive integer");
            return this.$_addRule({ name: "arity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length === n) {
              return value;
            }
            return helpers.error("function.arity", { n });
          }
        },
        class: {
          method() {
            return this.$_addRule("class");
          },
          validate(value, helpers) {
            if (/^\s*class\s/.test(value.toString())) {
              return value;
            }
            return helpers.error("function.class", { value });
          }
        },
        minArity: {
          method(n) {
            assert(Number.isSafeInteger(n) && n > 0, "n must be a strict positive integer");
            return this.$_addRule({ name: "minArity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length >= n) {
              return value;
            }
            return helpers.error("function.minArity", { n });
          }
        },
        maxArity: {
          method(n) {
            assert(Number.isSafeInteger(n) && n >= 0, "n must be a positive integer");
            return this.$_addRule({ name: "maxArity", args: { n } });
          },
          validate(value, helpers, { n }) {
            if (value.length <= n) {
              return value;
            }
            return helpers.error("function.maxArity", { n });
          }
        }
      },
      messages: {
        "function.arity": "{{#label}} must have an arity of {{#n}}",
        "function.class": "{{#label}} must be a class",
        "function.maxArity": "{{#label}} must have an arity lesser or equal to {{#n}}",
        "function.minArity": "{{#label}} must have an arity greater or equal to {{#n}}"
      }
    });
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/link.js
var require_link = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/link.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var internals = {};
    module.exports = Any.extend({
      type: "link",
      properties: {
        schemaChain: true
      },
      terms: {
        link: { init: null, manifest: "single", register: false }
      },
      args(schema, ref) {
        return schema.ref(ref);
      },
      jsonSchema(schema, res, mode, options) {
        if (!schema.$_terms.link) {
          return res;
        }
        const { ref } = schema.$_terms.link[0];
        if (ref.ancestor === "root" || ref.ancestor > 0) {
          res.$ref = `#/${ref.path.map((p) => `properties/${p}`).join("/")}`;
          return res;
        }
        if (ref.path.length === 1) {
          res.$ref = `#/$defs/${ref.path[0]}`;
        } else {
          res.$ref = `#/${ref.path.slice(1).map((p) => `properties/${p}`).join("/")}`;
        }
        return res;
      },
      validate(value, { schema, state, prefs, error }) {
        assert(schema.$_terms.link, "Uninitialized link schema");
        const limit = schema._flags.maxRecursion;
        if (limit !== void 0 && state.schemas.filter((entry) => entry.schema === schema).length > limit) {
          return { value, errors: error("link.maxRecursion", { limit }) };
        }
        const linked = internals.generate(schema, value, state, prefs);
        const ref = schema.$_terms.link[0].ref;
        try {
          return linked.$_validate(value, state.nest(linked, `link:${ref.display}:${linked.type}`), prefs);
        } catch (err) {
          if (!(err instanceof RangeError)) {
            throw err;
          }
          return { value, errors: error("link.depth") };
        }
      },
      generate(schema, value, state, prefs) {
        return internals.generate(schema, value, state, prefs);
      },
      rules: {
        ref: {
          method(ref) {
            assert(!this.$_terms.link, "Cannot reinitialize schema");
            ref = Compile.ref(ref);
            assert(ref.type === "value" || ref.type === "local", "Invalid reference type:", ref.type);
            assert(ref.type === "local" || ref.ancestor === "root" || ref.ancestor > 0, "Link cannot reference itself");
            const obj = this.clone();
            obj.$_terms.link = [{ ref }];
            return obj;
          }
        },
        relative: {
          method(enabled = true) {
            return this.$_setFlag("relative", enabled);
          }
        },
        maxRecursion: {
          method(limit) {
            assert(Number.isSafeInteger(limit) && limit >= 1, "limit must be a positive integer");
            return this.$_setFlag("maxRecursion", limit);
          }
        }
      },
      messages: {
        "link.depth": "{{#label}} exceeds maximum recursion depth supported by the runtime",
        "link.maxRecursion": "{{#label}} exceeds maximum recursion depth of {{#limit}}"
      },
      overrides: {
        concat(source) {
          assert(this.$_terms.link, "Uninitialized link schema");
          assert(Common.isSchema(source), "Invalid schema object");
          assert(source.type !== "link", "Cannot merge type link with another link");
          const obj = this.clone();
          if (!obj.$_terms.whens) {
            obj.$_terms.whens = [];
          }
          obj.$_terms.whens.push({ concat: source });
          return obj.$_mutateRebuild();
        }
      },
      manifest: {
        build(obj, desc) {
          assert(desc.link, "Invalid link description missing link");
          return obj.ref(desc.link);
        }
      }
    });
    internals.generate = function(schema, value, state, prefs) {
      let linked = state.mainstay.links.get(schema);
      if (linked) {
        return linked._generate(value, state, prefs).schema;
      }
      const ref = schema.$_terms.link[0].ref;
      const { perspective, path } = internals.perspective(ref, state);
      internals.assert(perspective, "which is outside of schema boundaries", ref, schema, state, prefs);
      try {
        linked = path.length ? perspective.$_reach(path) : perspective;
      } catch {
        internals.assert(false, "to non-existing schema", ref, schema, state, prefs);
      }
      internals.assert(linked.type !== "link", "which is another link", ref, schema, state, prefs);
      if (!schema._flags.relative) {
        state.mainstay.links.set(schema, linked);
      }
      return linked._generate(value, state, prefs).schema;
    };
    internals.perspective = function(ref, state) {
      if (ref.type === "local") {
        for (const { schema, key } of state.schemas) {
          const id = schema._flags.id || key;
          if (id === ref.path[0]) {
            return { perspective: schema, path: ref.path.slice(1) };
          }
          if (schema.$_terms.shared) {
            for (const shared of schema.$_terms.shared) {
              if (shared._flags.id === ref.path[0]) {
                return { perspective: shared, path: ref.path.slice(1) };
              }
            }
          }
        }
        return { perspective: null, path: null };
      }
      if (ref.ancestor === "root") {
        return { perspective: state.schemas[state.schemas.length - 1].schema, path: ref.path };
      }
      return { perspective: state.schemas[ref.ancestor] && state.schemas[ref.ancestor].schema, path: ref.path };
    };
    internals.assert = function(condition, message, ref, schema, state, prefs) {
      if (condition) {
        return;
      }
      assert(false, `"${Errors.label(schema._flags, state, prefs)}" contains link reference "${ref.display}" ${message}`);
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/number.js
var require_number = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/number.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var Common = require_common();
    var internals = {
      numberRx: /^\s*[+-]?(?:(?:\d+(?:\.\d*)?)|(?:\.\d+))(?:e([+-]?\d+))?\s*$/i,
      precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/,
      exponentialPartRegex: /[eE][+-]?\d+$/,
      leadingSignAndZerosRegex: /^[+-]?(0*)?/,
      dotRegex: /\./,
      trailingZerosRegex: /0+$/,
      decimalPlaces(value) {
        const str = value.toString();
        const dindex = str.indexOf(".");
        const eindex = str.indexOf("e");
        return (dindex < 0 ? 0 : (eindex < 0 ? str.length : eindex) - dindex - 1) + (eindex < 0 ? 0 : Math.max(0, -parseInt(str.slice(eindex + 1))));
      }
    };
    module.exports = Any.extend({
      type: "number",
      flags: {
        unsafe: { default: false }
      },
      coerce: {
        from: "string",
        method(value, { schema, error }) {
          const matches = value.match(internals.numberRx);
          if (!matches) {
            return;
          }
          value = value.trim();
          const result = { value: parseFloat(value) };
          if (result.value === 0) {
            result.value = 0;
          }
          if (!schema._flags.unsafe) {
            if (value.match(/e/i)) {
              if (internals.extractSignificantDigits(value) !== internals.extractSignificantDigits(String(result.value))) {
                result.errors = error("number.unsafe");
                return result;
              }
            } else {
              const string = result.value.toString();
              if (string.match(/e/i)) {
                return result;
              }
              if (string !== internals.normalizeDecimal(value)) {
                result.errors = error("number.unsafe");
                return result;
              }
            }
          }
          return result;
        }
      },
      validate(value, { schema, error, prefs }) {
        if (value === Infinity || value === -Infinity) {
          return { value, errors: error("number.infinity") };
        }
        if (!Common.isNumber(value)) {
          return { value, errors: error("number.base") };
        }
        const result = { value };
        if (prefs.convert) {
          const rule = schema.$_getRule("precision");
          if (rule) {
            const precision = Math.pow(10, rule.args.limit);
            result.value = Math.round(result.value * precision) / precision;
          }
        }
        if (result.value === 0) {
          result.value = 0;
        }
        if (!schema._flags.unsafe && (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)) {
          result.errors = error("number.unsafe");
        }
        return result;
      },
      rules: {
        compare: {
          method: false,
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value, limit, operator)) {
              return value;
            }
            return helpers.error("number." + name, { limit: args.limit, value });
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.isNumber,
              message: "must be a number"
            }
          ]
        },
        greater: {
          method(limit) {
            return this.$_addRule({ name: "greater", method: "compare", args: { limit }, operator: ">" });
          },
          jsonSchema(rule, res) {
            res.exclusiveMinimum = rule.args.limit;
            return res;
          }
        },
        integer: {
          method() {
            return this.$_addRule("integer");
          },
          validate(value, helpers) {
            if (Math.trunc(value) - value === 0) {
              return value;
            }
            return helpers.error("number.integer");
          },
          jsonSchema(rule, res) {
            res.type = "integer";
            return res;
          }
        },
        less: {
          method(limit) {
            return this.$_addRule({ name: "less", method: "compare", args: { limit }, operator: "<" });
          },
          jsonSchema(rule, res) {
            res.exclusiveMaximum = rule.args.limit;
            return res;
          }
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "compare", args: { limit }, operator: "<=" });
          },
          jsonSchema(rule, res) {
            res.maximum = rule.args.limit;
            return res;
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "compare", args: { limit }, operator: ">=" });
          },
          jsonSchema(rule, res) {
            res.minimum = rule.args.limit;
            return res;
          }
        },
        multiple: {
          method(base) {
            const baseDecimalPlace = typeof base === "number" ? internals.decimalPlaces(base) : null;
            const pfactor = Math.pow(10, baseDecimalPlace);
            return this.$_addRule({
              name: "multiple",
              args: {
                base,
                baseDecimalPlace,
                pfactor
              }
            });
          },
          validate(value, helpers, { base, baseDecimalPlace, pfactor }, options) {
            const valueDecimalPlace = internals.decimalPlaces(value);
            if (valueDecimalPlace > baseDecimalPlace) {
              return helpers.error("number.multiple", { multiple: options.args.base, value });
            }
            return Math.round(pfactor * value) % Math.round(pfactor * base) === 0 ? value : helpers.error("number.multiple", { multiple: options.args.base, value });
          },
          jsonSchema(rule, res) {
            res.multipleOf = rule.args.base;
            return res;
          },
          args: [
            {
              name: "base",
              ref: true,
              assert: (value) => typeof value === "number" && isFinite(value) && value > 0,
              message: "must be a positive number"
            },
            "baseDecimalPlace",
            "pfactor"
          ],
          multi: true
        },
        negative: {
          method() {
            return this.sign("negative");
          }
        },
        port: {
          method() {
            return this.$_addRule("port");
          },
          validate(value, helpers) {
            if (Number.isSafeInteger(value) && value >= 0 && value <= 65535) {
              return value;
            }
            return helpers.error("number.port");
          },
          jsonSchema(rule, res) {
            res.type = "integer";
            res.minimum = 0;
            res.maximum = 65535;
            return res;
          }
        },
        positive: {
          method() {
            return this.sign("positive");
          }
        },
        precision: {
          method(limit) {
            assert(Number.isSafeInteger(limit), "limit must be an integer");
            return this.$_addRule({ name: "precision", args: { limit } });
          },
          validate(value, helpers, { limit }) {
            const places = value.toString().match(internals.precisionRx);
            const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
            if (decimals <= limit) {
              return value;
            }
            return helpers.error("number.precision", { limit, value });
          },
          convert: true
        },
        sign: {
          method(sign) {
            assert(["negative", "positive"].includes(sign), "Invalid sign", sign);
            return this.$_addRule({ name: "sign", args: { sign } });
          },
          validate(value, helpers, { sign }) {
            if (sign === "negative" && value < 0 || sign === "positive" && value > 0) {
              return value;
            }
            return helpers.error(`number.${sign}`);
          },
          jsonSchema(rule, res) {
            if (rule.args.sign === "positive") {
              res.exclusiveMinimum = 0;
            } else {
              res.exclusiveMaximum = 0;
            }
            return res;
          }
        },
        unsafe: {
          method(enabled = true) {
            assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_setFlag("unsafe", enabled);
          }
        }
      },
      cast: {
        string: {
          from: (value) => typeof value === "number",
          to(value, helpers) {
            return value.toString();
          }
        }
      },
      messages: {
        "number.base": "{{#label}} must be a number",
        "number.greater": "{{#label}} must be greater than {{#limit}}",
        "number.infinity": "{{#label}} cannot be infinity",
        "number.integer": "{{#label}} must be an integer",
        "number.less": "{{#label}} must be less than {{#limit}}",
        "number.max": "{{#label}} must be less than or equal to {{#limit}}",
        "number.min": "{{#label}} must be greater than or equal to {{#limit}}",
        "number.multiple": "{{#label}} must be a multiple of {{#multiple}}",
        "number.negative": "{{#label}} must be a negative number",
        "number.port": "{{#label}} must be a valid port",
        "number.positive": "{{#label}} must be a positive number",
        "number.precision": "{{#label}} must have no more than {{#limit}} decimal places",
        "number.unsafe": "{{#label}} must be a safe number"
      }
    });
    internals.extractSignificantDigits = function(value) {
      return value.replace(internals.exponentialPartRegex, "").replace(internals.dotRegex, "").replace(internals.trailingZerosRegex, "").replace(internals.leadingSignAndZerosRegex, "");
    };
    internals.normalizeDecimal = function(str) {
      str = str.replace(/^\+/, "").replace(/\.0*$/, "").replace(/^(-?)\.([^\.]*)$/, "$10.$2").replace(/^(-?)0+([0-9])/, "$1$2");
      if (str.includes(".") && str.endsWith("0")) {
        str = str.replace(/0+$/, "");
      }
      if (str === "-0") {
        return "0";
      }
      return str;
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/object.js
var require_object = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/object.js"(exports, module) {
    "use strict";
    var Keys = require_keys();
    module.exports = Keys.extend({
      type: "object",
      cast: {
        map: {
          from: (value) => value && typeof value === "object",
          to(value, helpers) {
            return new Map(Object.entries(value));
          }
        }
      }
    });
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/errors.js
var require_errors2 = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errorCode = exports.errorCodes = void 0;
    exports.errorCodes = {
      EMPTY_STRING: "Address must be a non-empty string",
      FORBIDDEN_UNICODE: "Address contains forbidden Unicode characters",
      MULTIPLE_AT_CHAR: "Address cannot contain more than one @ character",
      MISSING_AT_CHAR: "Address must contain one @ character",
      EMPTY_LOCAL: "Address local part cannot be empty",
      ADDRESS_TOO_LONG: "Address too long",
      LOCAL_TOO_LONG: "Address local part too long",
      EMPTY_LOCAL_SEGMENT: "Address local part contains empty dot-separated segment",
      INVALID_LOCAL_CHARS: "Address local part contains invalid character",
      DOMAIN_NON_EMPTY_STRING: "Domain must be a non-empty string",
      DOMAIN_TOO_LONG: "Domain too long",
      DOMAIN_INVALID_UNICODE_CHARS: "Domain contains forbidden Unicode characters",
      DOMAIN_INVALID_CHARS: "Domain contains invalid character",
      DOMAIN_INVALID_TLDS_CHARS: "Domain contains invalid tld character",
      DOMAIN_SEGMENTS_COUNT: "Domain lacks the minimum required number of segments",
      DOMAIN_SEGMENTS_COUNT_MAX: "Domain contains too many segments",
      DOMAIN_FORBIDDEN_TLDS: "Domain uses forbidden TLD",
      DOMAIN_EMPTY_SEGMENT: "Domain contains empty dot-separated segment",
      DOMAIN_LONG_SEGMENT: "Domain contains dot-separated segment that is too long"
    };
    function errorCode(code) {
      return { code, error: exports.errorCodes[code] };
    }
    exports.errorCode = errorCode;
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/domain.js
var require_domain = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/domain.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateDomainOptions = exports.isDomainValid = exports.analyzeDomain = void 0;
    var Url = __require("url");
    var errors_1 = require_errors2();
    var MIN_DOMAIN_SEGMENTS = 2;
    var NON_ASCII_RX = /[^\x00-\x7f]/;
    var DOMAIN_CONTROL_RX = /[\x00-\x20@\:\/\\#!\$&\'\(\)\*\+,;=\?]/;
    var TLD_SEGMENT_RX = /^[a-zA-Z](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
    var DOMAIN_SEGMENT_RX = /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
    var DOMAIN_UNDERSCORE_SEGMENT_RX = /^[a-zA-Z0-9_](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
    var URL_IMPL = Url.URL || URL;
    function isTldsAllow(tlds) {
      return !!tlds.allow;
    }
    function analyzeDomain(domain, options = {}) {
      if (!domain) {
        return (0, errors_1.errorCode)("DOMAIN_NON_EMPTY_STRING");
      }
      if (typeof domain !== "string") {
        throw new Error("Invalid input: domain must be a string");
      }
      if (domain.length > 256) {
        return (0, errors_1.errorCode)("DOMAIN_TOO_LONG");
      }
      const ascii = !NON_ASCII_RX.test(domain);
      if (!ascii) {
        if (options.allowUnicode === false) {
          return (0, errors_1.errorCode)("DOMAIN_INVALID_UNICODE_CHARS");
        }
        domain = domain.normalize("NFC");
      }
      if (DOMAIN_CONTROL_RX.test(domain)) {
        return (0, errors_1.errorCode)("DOMAIN_INVALID_CHARS");
      }
      domain = punycode(domain);
      if (options.allowFullyQualified && domain[domain.length - 1] === ".") {
        domain = domain.slice(0, -1);
      }
      const minDomainSegments = options.minDomainSegments || MIN_DOMAIN_SEGMENTS;
      const segments = domain.split(".");
      if (segments.length < minDomainSegments) {
        return (0, errors_1.errorCode)("DOMAIN_SEGMENTS_COUNT");
      }
      if (options.maxDomainSegments) {
        if (segments.length > options.maxDomainSegments) {
          return (0, errors_1.errorCode)("DOMAIN_SEGMENTS_COUNT_MAX");
        }
      }
      const tlds = options.tlds;
      if (tlds) {
        const tld = segments[segments.length - 1].toLowerCase();
        if (isTldsAllow(tlds)) {
          if (!tlds.allow.has(tld)) {
            return (0, errors_1.errorCode)("DOMAIN_FORBIDDEN_TLDS");
          }
        } else if (tlds.deny.has(tld)) {
          return (0, errors_1.errorCode)("DOMAIN_FORBIDDEN_TLDS");
        }
      }
      for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];
        if (!segment.length) {
          return (0, errors_1.errorCode)("DOMAIN_EMPTY_SEGMENT");
        }
        if (segment.length > 63) {
          return (0, errors_1.errorCode)("DOMAIN_LONG_SEGMENT");
        }
        if (i < segments.length - 1) {
          if (options.allowUnderscore) {
            if (!DOMAIN_UNDERSCORE_SEGMENT_RX.test(segment)) {
              return (0, errors_1.errorCode)("DOMAIN_INVALID_CHARS");
            }
          } else {
            if (!DOMAIN_SEGMENT_RX.test(segment)) {
              return (0, errors_1.errorCode)("DOMAIN_INVALID_CHARS");
            }
          }
        } else {
          if (!TLD_SEGMENT_RX.test(segment)) {
            return (0, errors_1.errorCode)("DOMAIN_INVALID_TLDS_CHARS");
          }
        }
      }
      return null;
    }
    exports.analyzeDomain = analyzeDomain;
    function isDomainValid(domain, options) {
      return !analyzeDomain(domain, options);
    }
    exports.isDomainValid = isDomainValid;
    function punycode(domain) {
      if (domain.includes("%")) {
        domain = domain.replace(/%/g, "%25");
      }
      try {
        return new URL_IMPL(`http://${domain}`).host;
      } catch (err) {
        return domain;
      }
    }
    function validateDomainOptions(options) {
      if (!options) {
        return;
      }
      if (typeof options.tlds !== "object") {
        throw new Error("Invalid options: tlds must be a boolean or an object");
      }
      if (isTldsAllow(options.tlds)) {
        if (options.tlds.allow instanceof Set === false) {
          throw new Error("Invalid options: tlds.allow must be a Set object or true");
        }
        if (options.tlds.deny) {
          throw new Error("Invalid options: cannot specify both tlds.allow and tlds.deny lists");
        }
      } else {
        if (options.tlds.deny instanceof Set === false) {
          throw new Error("Invalid options: tlds.deny must be a Set object");
        }
      }
    }
    exports.validateDomainOptions = validateDomainOptions;
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/email.js
var require_email = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/email.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmailValid = exports.analyzeEmail = void 0;
    var Util = __require("util");
    var domain_1 = require_domain();
    var errors_1 = require_errors2();
    var NON_ASCII_RX = /[^\x00-\x7f]/;
    var ENCODER_IMPL = new (Util.TextEncoder || TextEncoder)();
    function analyzeEmail(email, options) {
      return validateEmail(email, options);
    }
    exports.analyzeEmail = analyzeEmail;
    function isEmailValid(email, options) {
      return !validateEmail(email, options);
    }
    exports.isEmailValid = isEmailValid;
    function validateEmail(email, options = {}) {
      if (typeof email !== "string") {
        throw new Error("Invalid input: email must be a string");
      }
      if (!email) {
        return (0, errors_1.errorCode)("EMPTY_STRING");
      }
      const ascii = !NON_ASCII_RX.test(email);
      if (!ascii) {
        if (options.allowUnicode === false) {
          return (0, errors_1.errorCode)("FORBIDDEN_UNICODE");
        }
        email = email.normalize("NFC");
      }
      const parts = email.split("@");
      if (parts.length !== 2) {
        return parts.length > 2 ? (0, errors_1.errorCode)("MULTIPLE_AT_CHAR") : (0, errors_1.errorCode)("MISSING_AT_CHAR");
      }
      const [local, domain] = parts;
      if (!local) {
        return (0, errors_1.errorCode)("EMPTY_LOCAL");
      }
      if (!options.ignoreLength) {
        if (email.length > 254) {
          return (0, errors_1.errorCode)("ADDRESS_TOO_LONG");
        }
        if (ENCODER_IMPL.encode(local).length > 64) {
          return (0, errors_1.errorCode)("LOCAL_TOO_LONG");
        }
      }
      return validateLocal(local, ascii) || (0, domain_1.analyzeDomain)(domain, options);
    }
    function validateLocal(local, ascii) {
      const segments = local.split(".");
      for (const segment of segments) {
        if (!segment.length) {
          return (0, errors_1.errorCode)("EMPTY_LOCAL_SEGMENT");
        }
        if (ascii) {
          if (!ATEXT_RX.test(segment)) {
            return (0, errors_1.errorCode)("INVALID_LOCAL_CHARS");
          }
          continue;
        }
        for (const char of segment) {
          if (ATEXT_RX.test(char)) {
            continue;
          }
          const binary = toBinary(char);
          if (!ATOM_RX.test(binary)) {
            return (0, errors_1.errorCode)("INVALID_LOCAL_CHARS");
          }
        }
      }
      return null;
    }
    function toBinary(char) {
      return Array.from(ENCODER_IMPL.encode(char), (v) => String.fromCharCode(v)).join("");
    }
    var ATEXT_RX = /^[\w!#\$%&'\*\+\-/=\?\^`\{\|\}~]+$/;
    var ATOM_RX = new RegExp([
      //  %xC2-DF UTF8-tail
      "(?:[\\xc2-\\xdf][\\x80-\\xbf])",
      //  %xE0 %xA0-BF UTF8-tail              %xE1-EC 2( UTF8-tail )            %xED %x80-9F UTF8-tail              %xEE-EF 2( UTF8-tail )
      "(?:\\xe0[\\xa0-\\xbf][\\x80-\\xbf])|(?:[\\xe1-\\xec][\\x80-\\xbf]{2})|(?:\\xed[\\x80-\\x9f][\\x80-\\xbf])|(?:[\\xee-\\xef][\\x80-\\xbf]{2})",
      //  %xF0 %x90-BF 2( UTF8-tail )            %xF1-F3 3( UTF8-tail )            %xF4 %x80-8F 2( UTF8-tail )
      "(?:\\xf0[\\x90-\\xbf][\\x80-\\xbf]{2})|(?:[\\xf1-\\xf3][\\x80-\\xbf]{3})|(?:\\xf4[\\x80-\\x8f][\\x80-\\xbf]{2})"
    ].join("|"));
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/uri.js
var require_uri = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uriRegex = exports.ipVersions = void 0;
    var hoek_1 = require_lib();
    function generate() {
      const rfc39862 = {};
      const hexDigit = "\\dA-Fa-f";
      const hexDigitOnly = "[" + hexDigit + "]";
      const unreserved = "\\w-\\.~";
      const subDelims = "!\\$&'\\(\\)\\*\\+,;=";
      const pctEncoded = "%" + hexDigit;
      const pchar = unreserved + pctEncoded + subDelims + ":@";
      const pcharOnly = "[" + pchar + "]";
      const decOctect = "(?:0{0,2}\\d|0?[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])";
      rfc39862.ipv4address = "(?:" + decOctect + "\\.){3}" + decOctect;
      const h16 = hexDigitOnly + "{1,4}";
      const ls32 = "(?:" + h16 + ":" + h16 + "|" + rfc39862.ipv4address + ")";
      const IPv6SixHex = "(?:" + h16 + ":){6}" + ls32;
      const IPv6FiveHex = "::(?:" + h16 + ":){5}" + ls32;
      const IPv6FourHex = "(?:" + h16 + ")?::(?:" + h16 + ":){4}" + ls32;
      const IPv6ThreeHex = "(?:(?:" + h16 + ":){0,1}" + h16 + ")?::(?:" + h16 + ":){3}" + ls32;
      const IPv6TwoHex = "(?:(?:" + h16 + ":){0,2}" + h16 + ")?::(?:" + h16 + ":){2}" + ls32;
      const IPv6OneHex = "(?:(?:" + h16 + ":){0,3}" + h16 + ")?::" + h16 + ":" + ls32;
      const IPv6NoneHex = "(?:(?:" + h16 + ":){0,4}" + h16 + ")?::" + ls32;
      const IPv6NoneHex2 = "(?:(?:" + h16 + ":){0,5}" + h16 + ")?::" + h16;
      const IPv6NoneHex3 = "(?:(?:" + h16 + ":){0,6}" + h16 + ")?::";
      rfc39862.ipv4Cidr = "(?:\\d|[1-2]\\d|3[0-2])";
      rfc39862.ipv6Cidr = "(?:0{0,2}\\d|0?[1-9]\\d|1[01]\\d|12[0-8])";
      rfc39862.ipv6address = "(?:" + IPv6SixHex + "|" + IPv6FiveHex + "|" + IPv6FourHex + "|" + IPv6ThreeHex + "|" + IPv6TwoHex + "|" + IPv6OneHex + "|" + IPv6NoneHex + "|" + IPv6NoneHex2 + "|" + IPv6NoneHex3 + ")";
      rfc39862.ipvFuture = "v" + hexDigitOnly + "+\\.[" + unreserved + subDelims + ":]+";
      rfc39862.scheme = "[a-zA-Z][a-zA-Z\\d+-\\.]*";
      rfc39862.schemeRegex = new RegExp(rfc39862.scheme);
      const userinfo = "[" + unreserved + pctEncoded + subDelims + ":]*";
      const IPLiteral = "\\[(?:" + rfc39862.ipv6address + "|" + rfc39862.ipvFuture + ")\\]";
      const regName = "[" + unreserved + pctEncoded + subDelims + "]{1,255}";
      const host = "(?:" + IPLiteral + "|" + rfc39862.ipv4address + "|" + regName + ")";
      const port = "\\d*";
      const authority = "(?:" + userinfo + "@)?" + host + "(?::" + port + ")?";
      const authorityCapture = "(?:" + userinfo + "@)?(" + host + ")(?::" + port + ")?";
      const segment = pcharOnly + "*";
      const segmentNz = pcharOnly + "+";
      const segmentNzNc = "[" + unreserved + pctEncoded + subDelims + "@]+";
      const pathEmpty = "";
      const pathAbEmpty = "(?:\\/" + segment + ")*";
      const pathAbsolute = "\\/(?:" + segmentNz + pathAbEmpty + ")?";
      const pathRootless = segmentNz + pathAbEmpty;
      const pathNoScheme = segmentNzNc + pathAbEmpty;
      const pathAbNoAuthority = "(?:\\/\\/\\/" + segment + pathAbEmpty + ")";
      rfc39862.hierPart = "(?:(?:\\/\\/" + authority + pathAbEmpty + ")|" + pathAbsolute + "|" + pathRootless + "|" + pathAbNoAuthority + ")";
      rfc39862.hierPartCapture = "(?:(?:\\/\\/" + authorityCapture + pathAbEmpty + ")|" + pathAbsolute + "|" + pathRootless + ")";
      rfc39862.relativeRef = "(?:(?:\\/\\/" + authority + pathAbEmpty + ")|" + pathAbsolute + "|" + pathNoScheme + "|" + pathEmpty + ")";
      rfc39862.relativeRefCapture = "(?:(?:\\/\\/" + authorityCapture + pathAbEmpty + ")|" + pathAbsolute + "|" + pathNoScheme + "|" + pathEmpty + ")";
      rfc39862.query = "[" + pchar + "\\/\\?]*(?=#|$)";
      rfc39862.queryWithSquareBrackets = "[" + pchar + "\\[\\]\\/\\?]*(?=#|$)";
      rfc39862.fragment = "[" + pchar + "\\/\\?]*";
      return rfc39862;
    }
    var rfc3986 = generate();
    exports.ipVersions = {
      v4Cidr: rfc3986.ipv4Cidr,
      v6Cidr: rfc3986.ipv6Cidr,
      ipv4: rfc3986.ipv4address,
      ipv6: rfc3986.ipv6address,
      ipvfuture: rfc3986.ipvFuture
    };
    function createRegex(options) {
      const rfc = rfc3986;
      const query = options.allowQuerySquareBrackets ? rfc.queryWithSquareBrackets : rfc.query;
      const suffix = "(?:\\?" + query + ")?(?:#" + rfc.fragment + ")?";
      const relative = options.domain ? rfc.relativeRefCapture : rfc.relativeRef;
      if (options.relativeOnly) {
        return wrap(relative + suffix);
      }
      let customScheme = "";
      if (options.scheme) {
        (0, hoek_1.assert)(options.scheme instanceof RegExp || typeof options.scheme === "string" || Array.isArray(options.scheme), "scheme must be a RegExp, String, or Array");
        const schemes = [].concat(options.scheme);
        (0, hoek_1.assert)(schemes.length >= 1, "scheme must have at least 1 scheme specified");
        const selections = [];
        for (let i = 0; i < schemes.length; ++i) {
          const scheme2 = schemes[i];
          (0, hoek_1.assert)(scheme2 instanceof RegExp || typeof scheme2 === "string", "scheme at position " + i + " must be a RegExp or String");
          if (scheme2 instanceof RegExp) {
            selections.push(scheme2.source.toString());
          } else {
            (0, hoek_1.assert)(rfc.schemeRegex.test(scheme2), "scheme at position " + i + " must be a valid scheme");
            selections.push((0, hoek_1.escapeRegex)(scheme2));
          }
        }
        customScheme = selections.join("|");
      }
      const scheme = customScheme ? "(?:" + customScheme + ")" : rfc.scheme;
      const absolute = "(?:" + scheme + ":" + (options.domain ? rfc.hierPartCapture : rfc.hierPart) + ")";
      const prefix = options.allowRelative ? "(?:" + absolute + "|" + relative + ")" : absolute;
      return wrap(prefix + suffix, customScheme);
    }
    function wrap(raw, scheme = null) {
      raw = `(?=.)(?!https?:/(?:$|[^/]))(?!https?:///)(?!https?:[^/])${raw}`;
      return {
        raw,
        regex: new RegExp(`^${raw}$`),
        scheme
      };
    }
    var genericUriRegex = createRegex({});
    function uriRegex(options = {}) {
      if (options.scheme || options.allowRelative || options.relativeOnly || options.allowQuerySquareBrackets || options.domain) {
        return createRegex(options);
      }
      return genericUriRegex;
    }
    exports.uriRegex = uriRegex;
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/ip.js
var require_ip = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/ip.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ipRegex = void 0;
    var hoek_1 = require_lib();
    var uri_1 = require_uri();
    function ipRegex(options = {}) {
      const cidr = options.cidr || "optional";
      (0, hoek_1.assert)(["required", "optional", "forbidden"].includes(cidr), "options.cidr must be one of required, optional, forbidden");
      (0, hoek_1.assert)(options.version === void 0 || typeof options.version === "string" || Array.isArray(options.version), "options.version must be a string or an array of string");
      let versions = options.version || ["ipv4", "ipv6", "ipvfuture"];
      if (!Array.isArray(versions)) {
        versions = [versions];
      }
      (0, hoek_1.assert)(versions.length >= 1, "options.version must have at least 1 version specified");
      for (const version of versions) {
        (0, hoek_1.assert)(typeof version === "string" && version === version.toLowerCase(), "Invalid options.version value");
        (0, hoek_1.assert)(["ipv4", "ipv6", "ipvfuture"].includes(version), "options.version contains unknown version " + version + " - must be one of ipv4, ipv6, ipvfuture");
      }
      versions = Array.from(new Set(versions));
      const parts = versions.map((version) => {
        if (cidr === "forbidden") {
          return uri_1.ipVersions[version];
        }
        const cidrpart = `\\/${version === "ipv4" ? uri_1.ipVersions.v4Cidr : uri_1.ipVersions.v6Cidr}`;
        if (cidr === "required") {
          return `${uri_1.ipVersions[version]}${cidrpart}`;
        }
        return `${uri_1.ipVersions[version]}(?:${cidrpart})?`;
      });
      const raw = `(?:${parts.join("|")})`;
      const regex = new RegExp(`^${raw}$`);
      return { cidr, versions, regex, raw };
    }
    exports.ipRegex = ipRegex;
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/decode.js
var require_decode = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/decode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uriDecode = void 0;
    var HEX = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    var UTF8 = {
      accept: 12,
      reject: 0,
      data: [
        // Maps bytes to character to a transition
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        4,
        4,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        6,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        7,
        8,
        7,
        7,
        10,
        9,
        9,
        9,
        11,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        // Maps a state to a new state when adding a transition
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        12,
        0,
        0,
        0,
        0,
        24,
        36,
        48,
        60,
        72,
        84,
        96,
        0,
        12,
        12,
        12,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        24,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        24,
        24,
        24,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        24,
        24,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        48,
        48,
        48,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        48,
        48,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        48,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        // Maps the current transition to a mask that needs to apply to the byte
        127,
        63,
        63,
        63,
        0,
        31,
        15,
        15,
        15,
        7,
        7,
        7
      ]
    };
    function uriDecode(string) {
      let percentPos = string.indexOf("%");
      if (percentPos === -1) {
        return string;
      }
      let decoded = "";
      let last = 0;
      let codepoint = 0;
      let startOfOctets = percentPos;
      let state = UTF8.accept;
      while (percentPos > -1 && percentPos < string.length) {
        const high = resolveHex(string[percentPos + 1], 4);
        const low = resolveHex(string[percentPos + 2], 0);
        const byte = high | low;
        const type = UTF8.data[byte];
        state = UTF8.data[256 + state + type];
        codepoint = codepoint << 6 | byte & UTF8.data[364 + type];
        if (state === UTF8.accept) {
          decoded += string.slice(last, startOfOctets);
          decoded += codepoint <= 65535 ? String.fromCharCode(codepoint) : String.fromCharCode(55232 + (codepoint >> 10), 56320 + (codepoint & 1023));
          codepoint = 0;
          last = percentPos + 3;
          percentPos = string.indexOf("%", last);
          startOfOctets = percentPos;
          continue;
        }
        if (state === UTF8.reject) {
          return null;
        }
        percentPos += 3;
        if (percentPos >= string.length || string[percentPos] !== "%") {
          return null;
        }
      }
      return decoded + string.slice(last);
    }
    exports.uriDecode = uriDecode;
    function resolveHex(char, shift) {
      const i = HEX[char];
      return i === void 0 ? 255 : i << shift;
    }
  }
});

// node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/@hapi+address@5.1.1/node_modules/@hapi/address/dist/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uriDecode = exports.uriRegex = exports.ipRegex = exports.errorCodes = void 0;
    __exportStar(require_domain(), exports);
    __exportStar(require_email(), exports);
    var errors_1 = require_errors2();
    Object.defineProperty(exports, "errorCodes", { enumerable: true, get: function() {
      return errors_1.errorCodes;
    } });
    var ip_1 = require_ip();
    Object.defineProperty(exports, "ipRegex", { enumerable: true, get: function() {
      return ip_1.ipRegex;
    } });
    var uri_1 = require_uri();
    Object.defineProperty(exports, "uriRegex", { enumerable: true, get: function() {
      return uri_1.uriRegex;
    } });
    var decode_1 = require_decode();
    Object.defineProperty(exports, "uriDecode", { enumerable: true, get: function() {
      return decode_1.uriDecode;
    } });
  }
});

// node_modules/.pnpm/@hapi+tlds@1.1.7/node_modules/@hapi/tlds/dist/commonjs/tlds.js
var require_tlds = __commonJS({
  "node_modules/.pnpm/@hapi+tlds@1.1.7/node_modules/@hapi/tlds/dist/commonjs/tlds.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TLDS = void 0;
    exports.TLDS = [
      "AAA",
      "AARP",
      "ABB",
      "ABBOTT",
      "ABBVIE",
      "ABC",
      "ABLE",
      "ABOGADO",
      "ABUDHABI",
      "AC",
      "ACADEMY",
      "ACCENTURE",
      "ACCOUNTANT",
      "ACCOUNTANTS",
      "ACO",
      "ACTOR",
      "AD",
      "ADS",
      "ADULT",
      "AE",
      "AEG",
      "AERO",
      "AETNA",
      "AF",
      "AFL",
      "AFRICA",
      "AG",
      "AGAKHAN",
      "AGENCY",
      "AI",
      "AIG",
      "AIRBUS",
      "AIRFORCE",
      "AIRTEL",
      "AKDN",
      "AL",
      "ALIBABA",
      "ALIPAY",
      "ALLFINANZ",
      "ALLSTATE",
      "ALLY",
      "ALSACE",
      "ALSTOM",
      "AM",
      "AMAZON",
      "AMERICANEXPRESS",
      "AMERICANFAMILY",
      "AMEX",
      "AMFAM",
      "AMICA",
      "AMSTERDAM",
      "ANALYTICS",
      "ANDROID",
      "ANQUAN",
      "ANZ",
      "AO",
      "AOL",
      "APARTMENTS",
      "APP",
      "APPLE",
      "AQ",
      "AQUARELLE",
      "AR",
      "ARAB",
      "ARAMCO",
      "ARCHI",
      "ARMY",
      "ARPA",
      "ART",
      "ARTE",
      "AS",
      "ASDA",
      "ASIA",
      "ASSOCIATES",
      "AT",
      "ATHLETA",
      "ATTORNEY",
      "AU",
      "AUCTION",
      "AUDI",
      "AUDIBLE",
      "AUDIO",
      "AUSPOST",
      "AUTHOR",
      "AUTO",
      "AUTOS",
      "AW",
      "AWS",
      "AX",
      "AXA",
      "AZ",
      "AZURE",
      "BA",
      "BABY",
      "BAIDU",
      "BANAMEX",
      "BAND",
      "BANK",
      "BAR",
      "BARCELONA",
      "BARCLAYCARD",
      "BARCLAYS",
      "BAREFOOT",
      "BARGAINS",
      "BASEBALL",
      "BASKETBALL",
      "BAUHAUS",
      "BAYERN",
      "BB",
      "BBC",
      "BBT",
      "BBVA",
      "BCG",
      "BCN",
      "BD",
      "BE",
      "BEATS",
      "BEAUTY",
      "BEER",
      "BERLIN",
      "BEST",
      "BESTBUY",
      "BET",
      "BF",
      "BG",
      "BH",
      "BHARTI",
      "BI",
      "BIBLE",
      "BID",
      "BIKE",
      "BING",
      "BINGO",
      "BIO",
      "BIZ",
      "BJ",
      "BLACK",
      "BLACKFRIDAY",
      "BLOCKBUSTER",
      "BLOG",
      "BLOOMBERG",
      "BLUE",
      "BM",
      "BMS",
      "BMW",
      "BN",
      "BNPPARIBAS",
      "BO",
      "BOATS",
      "BOEHRINGER",
      "BOFA",
      "BOM",
      "BOND",
      "BOO",
      "BOOK",
      "BOOKING",
      "BOSCH",
      "BOSTIK",
      "BOSTON",
      "BOT",
      "BOUTIQUE",
      "BOX",
      "BR",
      "BRADESCO",
      "BRIDGESTONE",
      "BROADWAY",
      "BROKER",
      "BROTHER",
      "BRUSSELS",
      "BS",
      "BT",
      "BUILD",
      "BUILDERS",
      "BUSINESS",
      "BUY",
      "BUZZ",
      "BV",
      "BW",
      "BY",
      "BZ",
      "BZH",
      "CA",
      "CAB",
      "CAFE",
      "CAL",
      "CALL",
      "CALVINKLEIN",
      "CAM",
      "CAMERA",
      "CAMP",
      "CANON",
      "CAPETOWN",
      "CAPITAL",
      "CAPITALONE",
      "CAR",
      "CARAVAN",
      "CARDS",
      "CARE",
      "CAREER",
      "CAREERS",
      "CARS",
      "CASA",
      "CASE",
      "CASH",
      "CASINO",
      "CAT",
      "CATERING",
      "CATHOLIC",
      "CBA",
      "CBN",
      "CBRE",
      "CC",
      "CD",
      "CENTER",
      "CEO",
      "CERN",
      "CF",
      "CFA",
      "CFD",
      "CG",
      "CH",
      "CHANEL",
      "CHANNEL",
      "CHARITY",
      "CHASE",
      "CHAT",
      "CHEAP",
      "CHINTAI",
      "CHRISTMAS",
      "CHROME",
      "CHURCH",
      "CI",
      "CIPRIANI",
      "CIRCLE",
      "CISCO",
      "CITADEL",
      "CITI",
      "CITIC",
      "CITY",
      "CK",
      "CL",
      "CLAIMS",
      "CLEANING",
      "CLICK",
      "CLINIC",
      "CLINIQUE",
      "CLOTHING",
      "CLOUD",
      "CLUB",
      "CLUBMED",
      "CM",
      "CN",
      "CO",
      "COACH",
      "CODES",
      "COFFEE",
      "COLLEGE",
      "COLOGNE",
      "COM",
      "COMMBANK",
      "COMMUNITY",
      "COMPANY",
      "COMPARE",
      "COMPUTER",
      "COMSEC",
      "CONDOS",
      "CONSTRUCTION",
      "CONSULTING",
      "CONTACT",
      "CONTRACTORS",
      "COOKING",
      "COOL",
      "COOP",
      "CORSICA",
      "COUNTRY",
      "COUPON",
      "COUPONS",
      "COURSES",
      "CPA",
      "CR",
      "CREDIT",
      "CREDITCARD",
      "CREDITUNION",
      "CRICKET",
      "CROWN",
      "CRS",
      "CRUISE",
      "CRUISES",
      "CU",
      "CUISINELLA",
      "CV",
      "CW",
      "CX",
      "CY",
      "CYMRU",
      "CYOU",
      "CZ",
      "DAD",
      "DANCE",
      "DATA",
      "DATE",
      "DATING",
      "DATSUN",
      "DAY",
      "DCLK",
      "DDS",
      "DE",
      "DEAL",
      "DEALER",
      "DEALS",
      "DEGREE",
      "DELIVERY",
      "DELL",
      "DELOITTE",
      "DELTA",
      "DEMOCRAT",
      "DENTAL",
      "DENTIST",
      "DESI",
      "DESIGN",
      "DEV",
      "DHL",
      "DIAMONDS",
      "DIET",
      "DIGITAL",
      "DIRECT",
      "DIRECTORY",
      "DISCOUNT",
      "DISCOVER",
      "DISH",
      "DIY",
      "DJ",
      "DK",
      "DM",
      "DNP",
      "DO",
      "DOCS",
      "DOCTOR",
      "DOG",
      "DOMAINS",
      "DOT",
      "DOWNLOAD",
      "DRIVE",
      "DTV",
      "DUBAI",
      "DUPONT",
      "DURBAN",
      "DVAG",
      "DVR",
      "DZ",
      "EARTH",
      "EAT",
      "EC",
      "ECO",
      "EDEKA",
      "EDU",
      "EDUCATION",
      "EE",
      "EG",
      "EMAIL",
      "EMERCK",
      "ENERGY",
      "ENGINEER",
      "ENGINEERING",
      "ENTERPRISES",
      "EPSON",
      "EQUIPMENT",
      "ER",
      "ERICSSON",
      "ERNI",
      "ES",
      "ESQ",
      "ESTATE",
      "ET",
      "EU",
      "EUROVISION",
      "EUS",
      "EVENTS",
      "EXCHANGE",
      "EXPERT",
      "EXPOSED",
      "EXPRESS",
      "EXTRASPACE",
      "FAGE",
      "FAIL",
      "FAIRWINDS",
      "FAITH",
      "FAMILY",
      "FAN",
      "FANS",
      "FARM",
      "FARMERS",
      "FASHION",
      "FAST",
      "FEDEX",
      "FEEDBACK",
      "FERRARI",
      "FERRERO",
      "FI",
      "FIDELITY",
      "FIDO",
      "FILM",
      "FINAL",
      "FINANCE",
      "FINANCIAL",
      "FIRE",
      "FIRESTONE",
      "FIRMDALE",
      "FISH",
      "FISHING",
      "FIT",
      "FITNESS",
      "FJ",
      "FK",
      "FLICKR",
      "FLIGHTS",
      "FLIR",
      "FLORIST",
      "FLOWERS",
      "FLY",
      "FM",
      "FO",
      "FOO",
      "FOOD",
      "FOOTBALL",
      "FORD",
      "FOREX",
      "FORSALE",
      "FORUM",
      "FOUNDATION",
      "FOX",
      "FR",
      "FREE",
      "FRESENIUS",
      "FRL",
      "FROGANS",
      "FRONTIER",
      "FTR",
      "FUJITSU",
      "FUN",
      "FUND",
      "FURNITURE",
      "FUTBOL",
      "FYI",
      "GA",
      "GAL",
      "GALLERY",
      "GALLO",
      "GALLUP",
      "GAME",
      "GAMES",
      "GAP",
      "GARDEN",
      "GAY",
      "GB",
      "GBIZ",
      "GD",
      "GDN",
      "GE",
      "GEA",
      "GENT",
      "GENTING",
      "GEORGE",
      "GF",
      "GG",
      "GGEE",
      "GH",
      "GI",
      "GIFT",
      "GIFTS",
      "GIVES",
      "GIVING",
      "GL",
      "GLASS",
      "GLE",
      "GLOBAL",
      "GLOBO",
      "GM",
      "GMAIL",
      "GMBH",
      "GMO",
      "GMX",
      "GN",
      "GODADDY",
      "GOLD",
      "GOLDPOINT",
      "GOLF",
      "GOODYEAR",
      "GOOG",
      "GOOGLE",
      "GOP",
      "GOT",
      "GOV",
      "GP",
      "GQ",
      "GR",
      "GRAINGER",
      "GRAPHICS",
      "GRATIS",
      "GREEN",
      "GRIPE",
      "GROCERY",
      "GROUP",
      "GS",
      "GT",
      "GU",
      "GUCCI",
      "GUGE",
      "GUIDE",
      "GUITARS",
      "GURU",
      "GW",
      "GY",
      "HAIR",
      "HAMBURG",
      "HANGOUT",
      "HAUS",
      "HBO",
      "HDFC",
      "HDFCBANK",
      "HEALTH",
      "HEALTHCARE",
      "HELP",
      "HELSINKI",
      "HERE",
      "HERMES",
      "HIPHOP",
      "HISAMITSU",
      "HITACHI",
      "HIV",
      "HK",
      "HKT",
      "HM",
      "HN",
      "HOCKEY",
      "HOLDINGS",
      "HOLIDAY",
      "HOMEDEPOT",
      "HOMEGOODS",
      "HOMES",
      "HOMESENSE",
      "HONDA",
      "HORSE",
      "HOSPITAL",
      "HOST",
      "HOSTING",
      "HOT",
      "HOTELS",
      "HOTMAIL",
      "HOUSE",
      "HOW",
      "HR",
      "HSBC",
      "HT",
      "HU",
      "HUGHES",
      "HYATT",
      "HYUNDAI",
      "IBM",
      "ICBC",
      "ICE",
      "ICU",
      "ID",
      "IE",
      "IEEE",
      "IFM",
      "IKANO",
      "IL",
      "IM",
      "IMAMAT",
      "IMDB",
      "IMMO",
      "IMMOBILIEN",
      "IN",
      "INC",
      "INDUSTRIES",
      "INFINITI",
      "INFO",
      "ING",
      "INK",
      "INSTITUTE",
      "INSURANCE",
      "INSURE",
      "INT",
      "INTERNATIONAL",
      "INTUIT",
      "INVESTMENTS",
      "IO",
      "IPIRANGA",
      "IQ",
      "IR",
      "IRISH",
      "IS",
      "ISMAILI",
      "IST",
      "ISTANBUL",
      "IT",
      "ITAU",
      "ITV",
      "JAGUAR",
      "JAVA",
      "JCB",
      "JE",
      "JEEP",
      "JETZT",
      "JEWELRY",
      "JIO",
      "JLL",
      "JM",
      "JMP",
      "JNJ",
      "JO",
      "JOBS",
      "JOBURG",
      "JOT",
      "JOY",
      "JP",
      "JPMORGAN",
      "JPRS",
      "JUEGOS",
      "JUNIPER",
      "KAUFEN",
      "KDDI",
      "KE",
      "KERRYHOTELS",
      "KERRYPROPERTIES",
      "KFH",
      "KG",
      "KH",
      "KI",
      "KIA",
      "KIDS",
      "KIM",
      "KINDLE",
      "KITCHEN",
      "KIWI",
      "KM",
      "KN",
      "KOELN",
      "KOMATSU",
      "KOSHER",
      "KP",
      "KPMG",
      "KPN",
      "KR",
      "KRD",
      "KRED",
      "KUOKGROUP",
      "KW",
      "KY",
      "KYOTO",
      "KZ",
      "LA",
      "LACAIXA",
      "LAMBORGHINI",
      "LAMER",
      "LAND",
      "LANDROVER",
      "LANXESS",
      "LASALLE",
      "LAT",
      "LATINO",
      "LATROBE",
      "LAW",
      "LAWYER",
      "LB",
      "LC",
      "LDS",
      "LEASE",
      "LECLERC",
      "LEFRAK",
      "LEGAL",
      "LEGO",
      "LEXUS",
      "LGBT",
      "LI",
      "LIDL",
      "LIFE",
      "LIFEINSURANCE",
      "LIFESTYLE",
      "LIGHTING",
      "LIKE",
      "LILLY",
      "LIMITED",
      "LIMO",
      "LINCOLN",
      "LINK",
      "LIVE",
      "LIVING",
      "LK",
      "LLC",
      "LLP",
      "LOAN",
      "LOANS",
      "LOCKER",
      "LOCUS",
      "LOL",
      "LONDON",
      "LOTTE",
      "LOTTO",
      "LOVE",
      "LPL",
      "LPLFINANCIAL",
      "LR",
      "LS",
      "LT",
      "LTD",
      "LTDA",
      "LU",
      "LUNDBECK",
      "LUXE",
      "LUXURY",
      "LV",
      "LY",
      "MA",
      "MADRID",
      "MAIF",
      "MAISON",
      "MAKEUP",
      "MAN",
      "MANAGEMENT",
      "MANGO",
      "MAP",
      "MARKET",
      "MARKETING",
      "MARKETS",
      "MARRIOTT",
      "MARSHALLS",
      "MATTEL",
      "MBA",
      "MC",
      "MCKINSEY",
      "MD",
      "ME",
      "MED",
      "MEDIA",
      "MEET",
      "MELBOURNE",
      "MEME",
      "MEMORIAL",
      "MEN",
      "MENU",
      "MERCK",
      "MERCKMSD",
      "MG",
      "MH",
      "MIAMI",
      "MICROSOFT",
      "MIL",
      "MINI",
      "MINT",
      "MIT",
      "MITSUBISHI",
      "MK",
      "ML",
      "MLB",
      "MLS",
      "MM",
      "MMA",
      "MN",
      "MO",
      "MOBI",
      "MOBILE",
      "MODA",
      "MOE",
      "MOI",
      "MOM",
      "MONASH",
      "MONEY",
      "MONSTER",
      "MORMON",
      "MORTGAGE",
      "MOSCOW",
      "MOTO",
      "MOTORCYCLES",
      "MOV",
      "MOVIE",
      "MP",
      "MQ",
      "MR",
      "MS",
      "MSD",
      "MT",
      "MTN",
      "MTR",
      "MU",
      "MUSEUM",
      "MUSIC",
      "MV",
      "MW",
      "MX",
      "MY",
      "MZ",
      "NA",
      "NAB",
      "NAGOYA",
      "NAME",
      "NAVY",
      "NBA",
      "NC",
      "NE",
      "NEC",
      "NET",
      "NETBANK",
      "NETFLIX",
      "NETWORK",
      "NEUSTAR",
      "NEW",
      "NEWS",
      "NEXT",
      "NEXTDIRECT",
      "NEXUS",
      "NF",
      "NFL",
      "NG",
      "NGO",
      "NHK",
      "NI",
      "NICO",
      "NIKE",
      "NIKON",
      "NINJA",
      "NISSAN",
      "NISSAY",
      "NL",
      "NO",
      "NOKIA",
      "NORTON",
      "NOW",
      "NOWRUZ",
      "NOWTV",
      "NP",
      "NR",
      "NRA",
      "NRW",
      "NTT",
      "NU",
      "NYC",
      "NZ",
      "OBI",
      "OBSERVER",
      "OFFICE",
      "OKINAWA",
      "OLAYAN",
      "OLAYANGROUP",
      "OLLO",
      "OM",
      "OMEGA",
      "ONE",
      "ONG",
      "ONL",
      "ONLINE",
      "OOO",
      "OPEN",
      "ORACLE",
      "ORANGE",
      "ORG",
      "ORGANIC",
      "ORIGINS",
      "OSAKA",
      "OTSUKA",
      "OTT",
      "OVH",
      "PA",
      "PAGE",
      "PANASONIC",
      "PARIS",
      "PARS",
      "PARTNERS",
      "PARTS",
      "PARTY",
      "PAY",
      "PCCW",
      "PE",
      "PET",
      "PF",
      "PFIZER",
      "PG",
      "PH",
      "PHARMACY",
      "PHD",
      "PHILIPS",
      "PHONE",
      "PHOTO",
      "PHOTOGRAPHY",
      "PHOTOS",
      "PHYSIO",
      "PICS",
      "PICTET",
      "PICTURES",
      "PID",
      "PIN",
      "PING",
      "PINK",
      "PIONEER",
      "PIZZA",
      "PK",
      "PL",
      "PLACE",
      "PLAY",
      "PLAYSTATION",
      "PLUMBING",
      "PLUS",
      "PM",
      "PN",
      "PNC",
      "POHL",
      "POKER",
      "POLITIE",
      "PORN",
      "POST",
      "PR",
      "PRAXI",
      "PRESS",
      "PRIME",
      "PRO",
      "PROD",
      "PRODUCTIONS",
      "PROF",
      "PROGRESSIVE",
      "PROMO",
      "PROPERTIES",
      "PROPERTY",
      "PROTECTION",
      "PRU",
      "PRUDENTIAL",
      "PS",
      "PT",
      "PUB",
      "PW",
      "PWC",
      "PY",
      "QA",
      "QPON",
      "QUEBEC",
      "QUEST",
      "RACING",
      "RADIO",
      "RE",
      "READ",
      "REALESTATE",
      "REALTOR",
      "REALTY",
      "RECIPES",
      "RED",
      "REDUMBRELLA",
      "REHAB",
      "REISE",
      "REISEN",
      "REIT",
      "RELIANCE",
      "REN",
      "RENT",
      "RENTALS",
      "REPAIR",
      "REPORT",
      "REPUBLICAN",
      "REST",
      "RESTAURANT",
      "REVIEW",
      "REVIEWS",
      "REXROTH",
      "RICH",
      "RICHARDLI",
      "RICOH",
      "RIL",
      "RIO",
      "RIP",
      "RO",
      "ROCKS",
      "RODEO",
      "ROGERS",
      "ROOM",
      "RS",
      "RSVP",
      "RU",
      "RUGBY",
      "RUHR",
      "RUN",
      "RW",
      "RWE",
      "RYUKYU",
      "SA",
      "SAARLAND",
      "SAFE",
      "SAFETY",
      "SAKURA",
      "SALE",
      "SALON",
      "SAMSCLUB",
      "SAMSUNG",
      "SANDVIK",
      "SANDVIKCOROMANT",
      "SANOFI",
      "SAP",
      "SARL",
      "SAS",
      "SAVE",
      "SAXO",
      "SB",
      "SBI",
      "SBS",
      "SC",
      "SCB",
      "SCHAEFFLER",
      "SCHMIDT",
      "SCHOLARSHIPS",
      "SCHOOL",
      "SCHULE",
      "SCHWARZ",
      "SCIENCE",
      "SCOT",
      "SD",
      "SE",
      "SEARCH",
      "SEAT",
      "SECURE",
      "SECURITY",
      "SEEK",
      "SELECT",
      "SENER",
      "SERVICES",
      "SEVEN",
      "SEW",
      "SEX",
      "SEXY",
      "SFR",
      "SG",
      "SH",
      "SHANGRILA",
      "SHARP",
      "SHELL",
      "SHIA",
      "SHIKSHA",
      "SHOES",
      "SHOP",
      "SHOPPING",
      "SHOUJI",
      "SHOW",
      "SI",
      "SILK",
      "SINA",
      "SINGLES",
      "SITE",
      "SJ",
      "SK",
      "SKI",
      "SKIN",
      "SKY",
      "SKYPE",
      "SL",
      "SLING",
      "SM",
      "SMART",
      "SMILE",
      "SN",
      "SNCF",
      "SO",
      "SOCCER",
      "SOCIAL",
      "SOFTBANK",
      "SOFTWARE",
      "SOHU",
      "SOLAR",
      "SOLUTIONS",
      "SONG",
      "SONY",
      "SOY",
      "SPA",
      "SPACE",
      "SPORT",
      "SPOT",
      "SR",
      "SRL",
      "SS",
      "ST",
      "STADA",
      "STAPLES",
      "STAR",
      "STATEBANK",
      "STATEFARM",
      "STC",
      "STCGROUP",
      "STOCKHOLM",
      "STORAGE",
      "STORE",
      "STREAM",
      "STUDIO",
      "STUDY",
      "STYLE",
      "SU",
      "SUCKS",
      "SUPPLIES",
      "SUPPLY",
      "SUPPORT",
      "SURF",
      "SURGERY",
      "SUZUKI",
      "SV",
      "SWATCH",
      "SWISS",
      "SX",
      "SY",
      "SYDNEY",
      "SYSTEMS",
      "SZ",
      "TAB",
      "TAIPEI",
      "TALK",
      "TAOBAO",
      "TARGET",
      "TATAMOTORS",
      "TATAR",
      "TATTOO",
      "TAX",
      "TAXI",
      "TC",
      "TCI",
      "TD",
      "TDK",
      "TEAM",
      "TECH",
      "TECHNOLOGY",
      "TEL",
      "TEMASEK",
      "TENNIS",
      "TEVA",
      "TF",
      "TG",
      "TH",
      "THD",
      "THEATER",
      "THEATRE",
      "TIAA",
      "TICKETS",
      "TIENDA",
      "TIPS",
      "TIRES",
      "TIROL",
      "TJ",
      "TJMAXX",
      "TJX",
      "TK",
      "TKMAXX",
      "TL",
      "TM",
      "TMALL",
      "TN",
      "TO",
      "TODAY",
      "TOKYO",
      "TOOLS",
      "TOP",
      "TORAY",
      "TOSHIBA",
      "TOTAL",
      "TOURS",
      "TOWN",
      "TOYOTA",
      "TOYS",
      "TR",
      "TRADE",
      "TRADING",
      "TRAINING",
      "TRAVEL",
      "TRAVELERS",
      "TRAVELERSINSURANCE",
      "TRUST",
      "TRV",
      "TT",
      "TUBE",
      "TUI",
      "TUNES",
      "TUSHU",
      "TV",
      "TVS",
      "TW",
      "TZ",
      "UA",
      "UBANK",
      "UBS",
      "UG",
      "UK",
      "UNICOM",
      "UNIVERSITY",
      "UNO",
      "UOL",
      "UPS",
      "US",
      "UY",
      "UZ",
      "VA",
      "VACATIONS",
      "VANA",
      "VANGUARD",
      "VC",
      "VE",
      "VEGAS",
      "VENTURES",
      "VERISIGN",
      "VERSICHERUNG",
      "VET",
      "VG",
      "VI",
      "VIAJES",
      "VIDEO",
      "VIG",
      "VIKING",
      "VILLAS",
      "VIN",
      "VIP",
      "VIRGIN",
      "VISA",
      "VISION",
      "VIVA",
      "VIVO",
      "VLAANDEREN",
      "VN",
      "VODKA",
      "VOLVO",
      "VOTE",
      "VOTING",
      "VOTO",
      "VOYAGE",
      "VU",
      "WALES",
      "WALMART",
      "WALTER",
      "WANG",
      "WANGGOU",
      "WATCH",
      "WATCHES",
      "WEATHER",
      "WEATHERCHANNEL",
      "WEBCAM",
      "WEBER",
      "WEBSITE",
      "WED",
      "WEDDING",
      "WEIBO",
      "WEIR",
      "WF",
      "WHOSWHO",
      "WIEN",
      "WIKI",
      "WILLIAMHILL",
      "WIN",
      "WINDOWS",
      "WINE",
      "WINNERS",
      "WME",
      "WOODSIDE",
      "WORK",
      "WORKS",
      "WORLD",
      "WOW",
      "WS",
      "WTC",
      "WTF",
      "XBOX",
      "XEROX",
      "XIHUAN",
      "XIN",
      "XN--11B4C3D",
      "XN--1CK2E1B",
      "XN--1QQW23A",
      "XN--2SCRJ9C",
      "XN--30RR7Y",
      "XN--3BST00M",
      "XN--3DS443G",
      "XN--3E0B707E",
      "XN--3HCRJ9C",
      "XN--3PXU8K",
      "XN--42C2D9A",
      "XN--45BR5CYL",
      "XN--45BRJ9C",
      "XN--45Q11C",
      "XN--4DBRK0CE",
      "XN--4GBRIM",
      "XN--54B7FTA0CC",
      "XN--55QW42G",
      "XN--55QX5D",
      "XN--5SU34J936BGSG",
      "XN--5TZM5G",
      "XN--6FRZ82G",
      "XN--6QQ986B3XL",
      "XN--80ADXHKS",
      "XN--80AO21A",
      "XN--80AQECDR1A",
      "XN--80ASEHDB",
      "XN--80ASWG",
      "XN--8Y0A063A",
      "XN--90A3AC",
      "XN--90AE",
      "XN--90AIS",
      "XN--9DBQ2A",
      "XN--9ET52U",
      "XN--9KRT00A",
      "XN--B4W605FERD",
      "XN--BCK1B9A5DRE4C",
      "XN--C1AVG",
      "XN--C2BR7G",
      "XN--CCK2B3B",
      "XN--CCKWCXETD",
      "XN--CG4BKI",
      "XN--CLCHC0EA0B2G2A9GCD",
      "XN--CZR694B",
      "XN--CZRS0T",
      "XN--CZRU2D",
      "XN--D1ACJ3B",
      "XN--D1ALF",
      "XN--E1A4C",
      "XN--ECKVDTC9D",
      "XN--EFVY88H",
      "XN--FCT429K",
      "XN--FHBEI",
      "XN--FIQ228C5HS",
      "XN--FIQ64B",
      "XN--FIQS8S",
      "XN--FIQZ9S",
      "XN--FJQ720A",
      "XN--FLW351E",
      "XN--FPCRJ9C3D",
      "XN--FZC2C9E2C",
      "XN--FZYS8D69UVGM",
      "XN--G2XX48C",
      "XN--GCKR3F0F",
      "XN--GECRJ9C",
      "XN--GK3AT1E",
      "XN--H2BREG3EVE",
      "XN--H2BRJ9C",
      "XN--H2BRJ9C8C",
      "XN--HXT814E",
      "XN--I1B6B1A6A2E",
      "XN--IMR513N",
      "XN--IO0A7I",
      "XN--J1AEF",
      "XN--J1AMH",
      "XN--J6W193G",
      "XN--JLQ480N2RG",
      "XN--JVR189M",
      "XN--KCRX77D1X4A",
      "XN--KPRW13D",
      "XN--KPRY57D",
      "XN--KPUT3I",
      "XN--L1ACC",
      "XN--LGBBAT1AD8J",
      "XN--MGB9AWBF",
      "XN--MGBA3A3EJT",
      "XN--MGBA3A4F16A",
      "XN--MGBA7C0BBN0A",
      "XN--MGBAAM7A8H",
      "XN--MGBAB2BD",
      "XN--MGBAH1A3HJKRD",
      "XN--MGBAI9AZGQP6J",
      "XN--MGBAYH7GPA",
      "XN--MGBBH1A",
      "XN--MGBBH1A71E",
      "XN--MGBC0A9AZCG",
      "XN--MGBCA7DZDO",
      "XN--MGBCPQ6GPA1A",
      "XN--MGBERP4A5D4AR",
      "XN--MGBGU82A",
      "XN--MGBI4ECEXP",
      "XN--MGBPL2FH",
      "XN--MGBT3DHD",
      "XN--MGBTX2B",
      "XN--MGBX4CD0AB",
      "XN--MIX891F",
      "XN--MK1BU44C",
      "XN--MXTQ1M",
      "XN--NGBC5AZD",
      "XN--NGBE9E0A",
      "XN--NGBRX",
      "XN--NODE",
      "XN--NQV7F",
      "XN--NQV7FS00EMA",
      "XN--NYQY26A",
      "XN--O3CW4H",
      "XN--OGBPF8FL",
      "XN--OTU796D",
      "XN--P1ACF",
      "XN--P1AI",
      "XN--PGBS0DH",
      "XN--PSSY2U",
      "XN--Q7CE6A",
      "XN--Q9JYB4C",
      "XN--QCKA1PMC",
      "XN--QXA6A",
      "XN--QXAM",
      "XN--RHQV96G",
      "XN--ROVU88B",
      "XN--RVC1E0AM3E",
      "XN--S9BRJ9C",
      "XN--SES554G",
      "XN--T60B56A",
      "XN--TCKWE",
      "XN--TIQ49XQYJ",
      "XN--UNUP4Y",
      "XN--VERMGENSBERATER-CTB",
      "XN--VERMGENSBERATUNG-PWB",
      "XN--VHQUV",
      "XN--VUQ861B",
      "XN--W4R85EL8FHU5DNRA",
      "XN--W4RS40L",
      "XN--WGBH1C",
      "XN--WGBL6A",
      "XN--XHQ521B",
      "XN--XKC2AL3HYE2A",
      "XN--XKC2DL3A5EE0H",
      "XN--Y9A3AQ",
      "XN--YFRO4I67O",
      "XN--YGBI2AMMX",
      "XN--ZFR164B",
      "XXX",
      "XYZ",
      "YACHTS",
      "YAHOO",
      "YAMAXUN",
      "YANDEX",
      "YE",
      "YODOBASHI",
      "YOGA",
      "YOKOHAMA",
      "YOU",
      "YOUTUBE",
      "YT",
      "YUN",
      "ZA",
      "ZAPPOS",
      "ZARA",
      "ZERO",
      "ZIP",
      "ZM",
      "ZONE",
      "ZUERICH",
      "ZW"
    ];
  }
});

// node_modules/.pnpm/@hapi+tlds@1.1.7/node_modules/@hapi/tlds/dist/commonjs/index.js
var require_commonjs = __commonJS({
  "node_modules/.pnpm/@hapi+tlds@1.1.7/node_modules/@hapi/tlds/dist/commonjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tlds = void 0;
    var tlds_js_1 = require_tlds();
    exports.tlds = new Set(tlds_js_1.TLDS.map((tld) => tld.toLowerCase()));
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/string.js"(exports, module) {
    "use strict";
    var { assert, escapeRegex } = require_lib();
    var { isDomainValid, isEmailValid, ipRegex, uriRegex } = require_dist();
    var Tlds = require_commonjs();
    var Any = require_any();
    var Common = require_common();
    var internals = {
      tlds: Tlds.tlds instanceof Set ? { tlds: { allow: Tlds.tlds, deny: null } } : false,
      // $lab:coverage:ignore$
      base64Regex: {
        // paddingRequired
        true: {
          // urlSafe
          true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}==|[\w\-]{3}=)?$/,
          false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
        },
        false: {
          true: /^(?:[\w\-]{2}[\w\-]{2})*(?:[\w\-]{2}(==)?|[\w\-]{3}=?)?$/,
          false: /^(?:[A-Za-z0-9+\/]{2}[A-Za-z0-9+\/]{2})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/
        }
      },
      dataUriRegex: /^data:[\w+.-]+\/[\w+.-]+;((charset=[\w-]+|base64),)?(.*)$/,
      hexRegex: {
        withPrefix: /^0x[0-9a-f]+$/i,
        withOptionalPrefix: /^(?:0x)?[0-9a-f]+$/i,
        withoutPrefix: /^[0-9a-f]+$/i
      },
      ipRegex: ipRegex({ cidr: "forbidden" }).regex,
      isoDurationRegex: /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?$/,
      guidBrackets: {
        "{": "}",
        "[": "]",
        "(": ")",
        "": ""
      },
      guidVersions: {
        uuidv1: "1",
        uuidv2: "2",
        uuidv3: "3",
        uuidv4: "4",
        uuidv5: "5",
        uuidv6: "6",
        uuidv7: "7",
        uuidv8: "8"
      },
      guidSeparators: /* @__PURE__ */ new Set([void 0, true, false, "-", ":"]),
      normalizationForms: ["NFC", "NFD", "NFKC", "NFKD"]
    };
    module.exports = Any.extend({
      type: "string",
      flags: {
        insensitive: { default: false },
        truncate: { default: false }
      },
      terms: {
        replacements: { init: null }
      },
      coerce: {
        from: "string",
        method(value, { schema, state, prefs }) {
          const normalize = schema.$_getRule("normalize");
          if (normalize) {
            value = value.normalize(normalize.args.form);
          }
          const casing = schema.$_getRule("case");
          if (casing) {
            value = casing.args.direction === "upper" ? value.toLocaleUpperCase() : value.toLocaleLowerCase();
          }
          const trim = schema.$_getRule("trim");
          if (trim && trim.args.enabled) {
            value = value.trim();
          }
          if (schema.$_terms.replacements) {
            for (const replacement of schema.$_terms.replacements) {
              value = value.replace(replacement.pattern, replacement.replacement);
            }
          }
          const hex = schema.$_getRule("hex");
          if (hex && hex.args.options.byteAligned && value.length % 2 !== 0) {
            value = `0${value}`;
          }
          if (schema.$_getRule("isoDate")) {
            const iso = internals.isoDate(value);
            if (iso) {
              value = iso;
            }
          }
          if (schema._flags.truncate) {
            const rule = schema.$_getRule("max");
            if (rule) {
              let limit = rule.args.limit;
              if (Common.isResolvable(limit)) {
                limit = limit.resolve(value, state, prefs);
                if (!Common.limit(limit)) {
                  return { value, errors: schema.$_createError("any.ref", limit, { ref: rule.args.limit, arg: "limit", reason: "must be a positive integer" }, state, prefs) };
                }
              }
              value = value.slice(0, limit);
            }
          }
          return { value };
        }
      },
      validate(value, { schema, error }) {
        if (typeof value !== "string") {
          return { value, errors: error("string.base") };
        }
        if (value === "") {
          const min = schema.$_getRule("min");
          if (min && min.args.limit === 0) {
            return;
          }
          return { value, errors: error("string.empty") };
        }
      },
      jsonSchema(schema, res, mode, options) {
        const noEmpty = !schema._valids?.has("") && !schema._flags.only;
        if (noEmpty) {
          const min = schema.$_getRule("min");
          const length = schema.$_getRule("length");
          if ((!min || min.args.limit > 0) && (!length || length.args.limit > 0)) {
            res.minLength = 1;
          }
        }
        return res;
      },
      rules: {
        alphanum: {
          method() {
            return this.$_addRule("alphanum");
          },
          validate(value, helpers) {
            if (/^[a-zA-Z0-9]+$/.test(value)) {
              return value;
            }
            return helpers.error("string.alphanum");
          }
        },
        base64: {
          method(options = {}) {
            Common.assertOptions(options, ["paddingRequired", "urlSafe"]);
            options = { urlSafe: false, paddingRequired: true, ...options };
            assert(typeof options.paddingRequired === "boolean", "paddingRequired must be boolean");
            assert(typeof options.urlSafe === "boolean", "urlSafe must be boolean");
            return this.$_addRule({ name: "base64", args: { options } });
          },
          validate(value, helpers, { options }) {
            const regex = internals.base64Regex[options.paddingRequired][options.urlSafe];
            if (regex.test(value)) {
              return value;
            }
            return helpers.error("string.base64");
          },
          jsonSchema(rule, res) {
            res.format = "base64";
            return res;
          }
        },
        case: {
          method(direction) {
            assert(["lower", "upper"].includes(direction), "Invalid case:", direction);
            return this.$_addRule({ name: "case", args: { direction } });
          },
          validate(value, helpers, { direction }) {
            if (direction === "lower" && value === value.toLocaleLowerCase() || direction === "upper" && value === value.toLocaleUpperCase()) {
              return value;
            }
            return helpers.error(`string.${direction}case`);
          },
          convert: true
        },
        creditCard: {
          method() {
            return this.$_addRule("creditCard");
          },
          validate(value, helpers) {
            let i = value.length;
            let sum = 0;
            let mul = 1;
            while (i--) {
              const char = value.charAt(i) * mul;
              sum = sum + (char - (char > 9) * 9);
              mul = mul ^ 3;
            }
            if (sum > 0 && sum % 10 === 0) {
              return value;
            }
            return helpers.error("string.creditCard");
          }
        },
        dataUri: {
          method(options = {}) {
            Common.assertOptions(options, ["paddingRequired"]);
            options = { paddingRequired: true, ...options };
            assert(typeof options.paddingRequired === "boolean", "paddingRequired must be boolean");
            return this.$_addRule({ name: "dataUri", args: { options } });
          },
          validate(value, helpers, { options }) {
            const matches = value.match(internals.dataUriRegex);
            if (matches) {
              if (!matches[2]) {
                return value;
              }
              if (matches[2] !== "base64") {
                return value;
              }
              const base64regex = internals.base64Regex[options.paddingRequired].false;
              if (base64regex.test(matches[3])) {
                return value;
              }
            }
            return helpers.error("string.dataUri");
          },
          jsonSchema(rule, res) {
            res.format = "data-uri";
            return res;
          }
        },
        domain: {
          method(options) {
            if (options) {
              Common.assertOptions(options, ["allowFullyQualified", "allowUnicode", "allowUnderscore", "maxDomainSegments", "minDomainSegments", "tlds"]);
            }
            const address = internals.addressOptions(options);
            return this.$_addRule({ name: "domain", args: { options }, address });
          },
          validate(value, helpers, args, { address }) {
            if (isDomainValid(value, address)) {
              return value;
            }
            return helpers.error("string.domain");
          }
        },
        email: {
          method(options = {}) {
            Common.assertOptions(options, ["allowFullyQualified", "allowUnicode", "ignoreLength", "maxDomainSegments", "minDomainSegments", "multiple", "separator", "tlds"]);
            assert(options.multiple === void 0 || typeof options.multiple === "boolean", "multiple option must be an boolean");
            const address = internals.addressOptions(options);
            const regex = new RegExp(`\\s*[${options.separator ? escapeRegex(options.separator) : ","}]\\s*`);
            return this.$_addRule({ name: "email", args: { options }, regex, address });
          },
          validate(value, helpers, { options }, { regex, address }) {
            const emails = options.multiple ? value.split(regex) : [value];
            const invalids = [];
            for (const email of emails) {
              if (!isEmailValid(email, address)) {
                invalids.push(email);
              }
            }
            if (!invalids.length) {
              return value;
            }
            return helpers.error("string.email", { value, invalids });
          },
          jsonSchema(rule, res) {
            res.format = "email";
            return res;
          }
        },
        guid: {
          alias: "uuid",
          method(options = {}) {
            Common.assertOptions(options, ["version", "separator", "wrapper"]);
            assert(
              options.wrapper === void 0 || typeof options.wrapper === "boolean" || typeof options.wrapper === "string" && typeof internals.guidBrackets[options.wrapper] === "string",
              `"wrapper" must be true, false, or one of "${Object.keys(internals.guidBrackets).filter(Boolean).join('", "')}"`
            );
            let versionNumbers = "";
            if (options.version) {
              const versions = [].concat(options.version);
              assert(versions.length >= 1, "version must have at least 1 valid version specified");
              const set = /* @__PURE__ */ new Set();
              for (let i = 0; i < versions.length; ++i) {
                const version = versions[i];
                assert(typeof version === "string", "version at position " + i + " must be a string");
                const versionNumber = internals.guidVersions[version.toLowerCase()];
                assert(versionNumber, "version at position " + i + " must be one of " + Object.keys(internals.guidVersions).join(", "));
                assert(!set.has(versionNumber), "version at position " + i + " must not be a duplicate");
                versionNumbers += versionNumber;
                set.add(versionNumber);
              }
            }
            assert(internals.guidSeparators.has(options.separator), 'separator must be one of true, false, "-", or ":"');
            const separator = options.separator === void 0 ? "[:-]?" : options.separator === true ? "[:-]" : options.separator === false ? "[]?" : `\\${options.separator}`;
            let wrapperStart;
            let wrapperEnd;
            if (options.wrapper === void 0) {
              wrapperStart = "[\\[{\\(]?";
              wrapperEnd = "[\\]}\\)]?";
            } else if (options.wrapper === true) {
              wrapperStart = "[\\[{\\(]";
              wrapperEnd = "[\\]}\\)]";
            } else if (options.wrapper === false) {
              wrapperStart = "";
              wrapperEnd = "";
            } else {
              wrapperStart = escapeRegex(options.wrapper);
              wrapperEnd = escapeRegex(internals.guidBrackets[options.wrapper]);
            }
            const regex = new RegExp(
              `^(${wrapperStart})[0-9A-F]{8}(${separator})[0-9A-F]{4}\\2?[${versionNumbers || "0-9A-F"}][0-9A-F]{3}\\2?[${versionNumbers ? "89AB" : "0-9A-F"}][0-9A-F]{3}\\2?[0-9A-F]{12}(${wrapperEnd})$`,
              "i"
            );
            return this.$_addRule({ name: "guid", args: { options }, regex });
          },
          validate(value, helpers, args, { regex }) {
            const results = regex.exec(value);
            if (!results) {
              return helpers.error("string.guid");
            }
            const open = results[1];
            const close = results[results.length - 1];
            if ((open || close) && internals.guidBrackets[open] !== close) {
              return helpers.error("string.guid");
            }
            return value;
          },
          jsonSchema(rule, res) {
            res.format = "uuid";
            return res;
          }
        },
        hex: {
          method(options = {}) {
            Common.assertOptions(options, ["byteAligned", "prefix"]);
            options = { byteAligned: false, prefix: false, ...options };
            assert(typeof options.byteAligned === "boolean", "byteAligned must be boolean");
            assert(typeof options.prefix === "boolean" || options.prefix === "optional", 'prefix must be boolean or "optional"');
            return this.$_addRule({ name: "hex", args: { options } });
          },
          validate(value, helpers, { options }) {
            const re = options.prefix === "optional" ? internals.hexRegex.withOptionalPrefix : options.prefix === true ? internals.hexRegex.withPrefix : internals.hexRegex.withoutPrefix;
            if (!re.test(value)) {
              return helpers.error("string.hex");
            }
            if (options.byteAligned && value.length % 2 !== 0) {
              return helpers.error("string.hexAlign");
            }
            return value;
          },
          jsonSchema(rule, res) {
            res.format = "hex";
            return res;
          }
        },
        hostname: {
          method() {
            return this.$_addRule("hostname");
          },
          validate(value, helpers) {
            if (isDomainValid(value, { minDomainSegments: 1 }) || internals.ipRegex.test(value)) {
              return value;
            }
            return helpers.error("string.hostname");
          },
          jsonSchema(rule, res) {
            res.format = "hostname";
            return res;
          }
        },
        insensitive: {
          method() {
            return this.$_setFlag("insensitive", true);
          }
        },
        ip: {
          method(options = {}) {
            Common.assertOptions(options, ["cidr", "version"]);
            const { cidr, versions, regex } = ipRegex(options);
            const version = options.version ? versions : void 0;
            return this.$_addRule({ name: "ip", args: { options: { cidr, version } }, regex });
          },
          validate(value, helpers, { options }, { regex }) {
            if (regex.test(value)) {
              return value;
            }
            if (options.version) {
              return helpers.error("string.ipVersion", { value, cidr: options.cidr, version: options.version });
            }
            return helpers.error("string.ip", { value, cidr: options.cidr });
          },
          jsonSchema(rule, res) {
            const version = rule.args.options.version;
            if (version && version.length === 1) {
              res.format = version[0];
            } else {
              res.format = "ip";
            }
            return res;
          }
        },
        isoDate: {
          method() {
            return this.$_addRule("isoDate");
          },
          validate(value, { error }) {
            if (internals.isoDate(value)) {
              return value;
            }
            return error("string.isoDate");
          },
          jsonSchema(rule, res) {
            res.format = "date-time";
            return res;
          }
        },
        isoDuration: {
          method() {
            return this.$_addRule("isoDuration");
          },
          validate(value, helpers) {
            if (internals.isoDurationRegex.test(value)) {
              return value;
            }
            return helpers.error("string.isoDuration");
          },
          jsonSchema(rule, res) {
            res.format = "duration";
            return res;
          }
        },
        length: {
          method(limit, encoding) {
            return internals.length(this, "length", limit, "=", encoding);
          },
          validate(value, helpers, { limit, encoding }, { name, operator, args }) {
            const length = encoding ? Buffer && Buffer.byteLength(value, encoding) : value.length;
            if (Common.compare(length, limit, operator)) {
              return value;
            }
            return helpers.error("string." + name, { limit: args.limit, value, encoding });
          },
          jsonSchema(rule, res) {
            res.minLength = rule.args.limit;
            res.maxLength = rule.args.limit;
            return res;
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            },
            "encoding"
          ]
        },
        lowercase: {
          method() {
            return this.case("lower");
          }
        },
        max: {
          method(limit, encoding) {
            return internals.length(this, "max", limit, "<=", encoding);
          },
          jsonSchema(rule, res) {
            res.maxLength = rule.args.limit;
            return res;
          },
          args: ["limit", "encoding"]
        },
        min: {
          method(limit, encoding) {
            return internals.length(this, "min", limit, ">=", encoding);
          },
          jsonSchema(rule, res) {
            if (rule.args.limit > 0) {
              res.minLength = rule.args.limit;
            }
            return res;
          },
          args: ["limit", "encoding"]
        },
        normalize: {
          method(form = "NFC") {
            assert(internals.normalizationForms.includes(form), "normalization form must be one of " + internals.normalizationForms.join(", "));
            return this.$_addRule({ name: "normalize", args: { form } });
          },
          validate(value, { error }, { form }) {
            if (value === value.normalize(form)) {
              return value;
            }
            return error("string.normalize", { value, form });
          },
          convert: true
        },
        pattern: {
          alias: "regex",
          method(regex, options = {}) {
            assert(regex instanceof RegExp, "regex must be a RegExp");
            assert(!regex.flags.includes("g") && !regex.flags.includes("y"), "regex should not use global or sticky mode");
            if (typeof options === "string") {
              options = { name: options };
            }
            Common.assertOptions(options, ["invert", "name"]);
            const errorCode = ["string.pattern", options.invert ? ".invert" : "", options.name ? ".name" : ".base"].join("");
            return this.$_addRule({ name: "pattern", args: { regex, options }, errorCode });
          },
          validate(value, helpers, { regex, options }, { errorCode }) {
            const patternMatch = regex.test(value);
            if (patternMatch ^ options.invert) {
              return value;
            }
            return helpers.error(errorCode, { name: options.name, regex, value });
          },
          jsonSchema(rule, res) {
            const pattern = rule.args.regex.source;
            if (res.allOf) {
              res.allOf.push({ pattern });
            } else if (res.pattern !== void 0) {
              res.allOf = [{ pattern: res.pattern }, { pattern }];
              delete res.pattern;
            } else {
              res.pattern = pattern;
            }
            return res;
          },
          args: ["regex", "options"],
          multi: true
        },
        replace: {
          method(pattern, replacement) {
            if (typeof pattern === "string") {
              pattern = new RegExp(escapeRegex(pattern), "g");
            }
            assert(pattern instanceof RegExp, "pattern must be a RegExp");
            assert(typeof replacement === "string", "replacement must be a String");
            const obj = this.clone();
            if (!obj.$_terms.replacements) {
              obj.$_terms.replacements = [];
            }
            obj.$_terms.replacements.push({ pattern, replacement });
            return obj;
          }
        },
        token: {
          method() {
            return this.$_addRule("token");
          },
          validate(value, helpers) {
            if (/^\w+$/.test(value)) {
              return value;
            }
            return helpers.error("string.token");
          },
          jsonSchema(rule, res) {
            res.format = "token";
            return res;
          }
        },
        trim: {
          method(enabled = true) {
            assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_addRule({ name: "trim", args: { enabled } });
          },
          validate(value, helpers, { enabled }) {
            if (!enabled || value === value.trim()) {
              return value;
            }
            return helpers.error("string.trim");
          },
          convert: true
        },
        truncate: {
          method(enabled = true) {
            assert(typeof enabled === "boolean", "enabled must be a boolean");
            return this.$_setFlag("truncate", enabled);
          }
        },
        uppercase: {
          method() {
            return this.case("upper");
          }
        },
        uri: {
          method(options = {}) {
            Common.assertOptions(options, ["allowRelative", "allowQuerySquareBrackets", "domain", "relativeOnly", "scheme", "encodeUri"]);
            if (options.domain) {
              Common.assertOptions(options.domain, ["allowFullyQualified", "allowUnicode", "maxDomainSegments", "minDomainSegments", "tlds"]);
            }
            const { regex, scheme } = uriRegex(options);
            const domain = options.domain ? internals.addressOptions(options.domain) : null;
            return this.$_addRule({ name: "uri", args: { options }, regex, domain, scheme });
          },
          validate(value, helpers, { options }, { regex, domain, scheme }) {
            if (["http:/", "https:/"].includes(value)) {
              return helpers.error("string.uri");
            }
            let match = regex.exec(value);
            if (!match && helpers.prefs.convert && options.encodeUri) {
              const encoded = encodeURI(value);
              match = regex.exec(encoded);
              if (match) {
                value = encoded;
              }
            }
            if (match) {
              const matched = match[1] || match[2];
              if (domain && (!options.allowRelative || matched) && !isDomainValid(matched, domain)) {
                return helpers.error("string.domain", { value: matched });
              }
              return value;
            }
            if (options.relativeOnly) {
              return helpers.error("string.uriRelativeOnly");
            }
            if (options.scheme) {
              return helpers.error("string.uriCustomScheme", { scheme, value });
            }
            return helpers.error("string.uri");
          },
          jsonSchema(rule, res) {
            res.format = "uri";
            return res;
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.replacements) {
            for (const { pattern, replacement } of desc.replacements) {
              obj = obj.replace(pattern, replacement);
            }
          }
          return obj;
        }
      },
      messages: {
        "string.alphanum": "{{#label}} must only contain alpha-numeric characters",
        "string.base": "{{#label}} must be a string",
        "string.base64": "{{#label}} must be a valid base64 string",
        "string.creditCard": "{{#label}} must be a credit card",
        "string.dataUri": "{{#label}} must be a valid dataUri string",
        "string.domain": "{{#label}} must contain a valid domain name",
        "string.email": "{{#label}} must be a valid email",
        "string.empty": "{{#label}} is not allowed to be empty",
        "string.guid": "{{#label}} must be a valid GUID",
        "string.hex": "{{#label}} must only contain hexadecimal characters",
        "string.hexAlign": "{{#label}} hex decoded representation must be byte aligned",
        "string.hostname": "{{#label}} must be a valid hostname",
        "string.ip": "{{#label}} must be a valid ip address with a {{#cidr}} CIDR",
        "string.ipVersion": "{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR",
        "string.isoDate": "{{#label}} must be in iso format",
        "string.isoDuration": "{{#label}} must be a valid ISO 8601 duration",
        "string.length": "{{#label}} length must be {{#limit}} characters long",
        "string.lowercase": "{{#label}} must only contain lowercase characters",
        "string.max": "{{#label}} length must be less than or equal to {{#limit}} characters long",
        "string.min": "{{#label}} length must be at least {{#limit}} characters long",
        "string.normalize": "{{#label}} must be unicode normalized in the {{#form}} form",
        "string.token": "{{#label}} must only contain alpha-numeric and underscore characters",
        "string.pattern.base": "{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}",
        "string.pattern.name": "{{#label}} with value {:[.]} fails to match the {{#name}} pattern",
        "string.pattern.invert.base": "{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}",
        "string.pattern.invert.name": "{{#label}} with value {:[.]} matches the inverted {{#name}} pattern",
        "string.trim": "{{#label}} must not have leading or trailing whitespace",
        "string.uri": "{{#label}} must be a valid uri",
        "string.uriCustomScheme": "{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern",
        "string.uriRelativeOnly": "{{#label}} must be a valid relative uri",
        "string.uppercase": "{{#label}} must only contain uppercase characters"
      }
    });
    internals.addressOptions = function(options) {
      if (!options) {
        return internals.tlds || options;
      }
      assert(options.minDomainSegments === void 0 || Number.isSafeInteger(options.minDomainSegments) && options.minDomainSegments > 0, "minDomainSegments must be a positive integer");
      assert(options.maxDomainSegments === void 0 || Number.isSafeInteger(options.maxDomainSegments) && options.maxDomainSegments > 0, "maxDomainSegments must be a positive integer");
      if (options.tlds === false) {
        return options;
      }
      if (options.tlds === true || options.tlds === void 0) {
        assert(internals.tlds, "Built-in TLD list disabled");
        return Object.assign({}, options, internals.tlds);
      }
      assert(typeof options.tlds === "object", "tlds must be true, false, or an object");
      const deny = options.tlds.deny;
      if (deny) {
        if (Array.isArray(deny)) {
          options = Object.assign({}, options, { tlds: { deny: new Set(deny) } });
        }
        assert(options.tlds.deny instanceof Set, "tlds.deny must be an array, Set, or boolean");
        assert(!options.tlds.allow, "Cannot specify both tlds.allow and tlds.deny lists");
        internals.validateTlds(options.tlds.deny, "tlds.deny");
        return options;
      }
      const allow = options.tlds.allow;
      if (!allow) {
        return { ...options, tlds: false };
      }
      if (allow === true) {
        assert(internals.tlds, "Built-in TLD list disabled");
        return Object.assign({}, options, internals.tlds);
      }
      if (Array.isArray(allow)) {
        options = Object.assign({}, options, { tlds: { allow: new Set(allow) } });
      }
      assert(options.tlds.allow instanceof Set, "tlds.allow must be an array, Set, or boolean");
      internals.validateTlds(options.tlds.allow, "tlds.allow");
      return options;
    };
    internals.validateTlds = function(set, source) {
      for (const tld of set) {
        assert(isDomainValid(tld, { minDomainSegments: 1, maxDomainSegments: 1 }), `${source} must contain valid top level domain names`);
      }
    };
    internals.isoDate = function(value) {
      if (!Common.isIsoDate(value)) {
        return null;
      }
      if (/.*T.*[+-]\d\d$/.test(value)) {
        value += "00";
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString();
    };
    internals.length = function(schema, name, limit, operator, encoding) {
      assert(!encoding || Buffer && Buffer.isEncoding(encoding), "Invalid encoding:", encoding);
      return schema.$_addRule({ name, method: "length", args: { limit, encoding }, operator });
    };
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/symbol.js
var require_symbol = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/symbol.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var internals = {};
    internals.Map = class extends Map {
      slice() {
        return new internals.Map(this);
      }
    };
    module.exports = Any.extend({
      type: "symbol",
      terms: {
        map: { init: new internals.Map() }
      },
      coerce: {
        method(value, { schema, error }) {
          const lookup = schema.$_terms.map.get(value);
          if (lookup) {
            value = lookup;
          }
          if (!schema._flags.only || typeof value === "symbol") {
            return { value };
          }
          return { value, errors: error("symbol.map", { map: schema.$_terms.map }) };
        }
      },
      validate(value, { error }) {
        if (typeof value !== "symbol") {
          return { value, errors: error("symbol.base") };
        }
      },
      rules: {
        map: {
          method(iterable) {
            if (iterable && !iterable[Symbol.iterator] && typeof iterable === "object") {
              iterable = Object.entries(iterable);
            }
            assert(iterable && iterable[Symbol.iterator], "Iterable must be an iterable or object");
            const obj = this.clone();
            const symbols = [];
            for (const entry of iterable) {
              assert(entry && entry[Symbol.iterator], "Entry must be an iterable");
              const [key, value] = entry;
              assert(typeof key !== "object" && typeof key !== "function" && typeof key !== "symbol", "Key must not be of type object, function, or Symbol");
              assert(typeof value === "symbol", "Value must be a Symbol");
              obj.$_terms.map.set(key, value);
              symbols.push(value);
            }
            return obj.valid(...symbols);
          }
        }
      },
      manifest: {
        build(obj, desc) {
          if (desc.map) {
            obj = obj.map(desc.map);
          }
          return obj;
        }
      },
      jsonSchema(schema, json, mode, options) {
        const map = schema.$_terms.map;
        if (!map.size) {
          return {};
        }
        return {
          anyOf: Array.from(map.keys()).map((key) => ({ const: key }))
        };
      },
      messages: {
        "symbol.base": "{{#label}} must be a symbol",
        "symbol.map": "{{#label}} must be one of {{#map}}"
      }
    });
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/binary.js
var require_binary = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/types/binary.js"(exports, module) {
    "use strict";
    var { assert } = require_lib();
    var Any = require_any();
    var Common = require_common();
    module.exports = Any.extend({
      type: "binary",
      coerce: {
        from: ["string", "object"],
        method(value, { schema }) {
          if (typeof value === "string" || value !== null && value.type === "Buffer") {
            try {
              return { value: Buffer.from(value, schema._flags.encoding) };
            } catch {
            }
          }
        }
      },
      validate(value, { error }) {
        if (!Buffer.isBuffer(value)) {
          return { value, errors: error("binary.base") };
        }
      },
      jsonSchema(schema, res, mode, options) {
        res.type = "string";
        res.format = "binary";
        return res;
      },
      rules: {
        encoding: {
          method(encoding) {
            assert(Buffer.isEncoding(encoding), "Invalid encoding:", encoding);
            return this.$_setFlag("encoding", encoding);
          }
        },
        length: {
          method(limit) {
            return this.$_addRule({ name: "length", method: "length", args: { limit }, operator: "=" });
          },
          validate(value, helpers, { limit }, { name, operator, args }) {
            if (Common.compare(value.length, limit, operator)) {
              return value;
            }
            return helpers.error("binary." + name, { limit: args.limit, value });
          },
          jsonSchema(rule, res) {
            res.minLength = rule.args.limit;
            res.maxLength = rule.args.limit;
            return res;
          },
          args: [
            {
              name: "limit",
              ref: true,
              assert: Common.limit,
              message: "must be a positive integer"
            }
          ]
        },
        max: {
          method(limit) {
            return this.$_addRule({ name: "max", method: "length", args: { limit }, operator: "<=" });
          },
          jsonSchema(rule, res) {
            res.maxLength = rule.args.limit;
            return res;
          }
        },
        min: {
          method(limit) {
            return this.$_addRule({ name: "min", method: "length", args: { limit }, operator: ">=" });
          },
          jsonSchema(rule, res) {
            res.minLength = rule.args.limit;
            return res;
          }
        }
      },
      cast: {
        string: {
          from: (value) => Buffer.isBuffer(value),
          to(value, helpers) {
            return value.toString();
          }
        }
      },
      messages: {
        "binary.base": "{{#label}} must be a buffer or a string",
        "binary.length": "{{#label}} must be {{#limit}} bytes",
        "binary.max": "{{#label}} must be less than or equal to {{#limit}} bytes",
        "binary.min": "{{#label}} must be at least {{#limit}} bytes"
      }
    });
  }
});

// node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/index.js
var require_lib5 = __commonJS({
  "node_modules/.pnpm/joi@18.2.3/node_modules/joi/lib/index.js"(exports, module) {
    "use strict";
    var { assert, clone } = require_lib();
    var Cache = require_cache();
    var Common = require_common();
    var Compile = require_compile();
    var Errors = require_errors();
    var Extend = require_extend();
    var Manifest = require_manifest();
    var Ref = require_ref();
    var Template = require_template();
    var Trace = require_trace();
    var Schemas;
    var internals = {
      types: {
        alternatives: require_alternatives(),
        any: require_any(),
        array: require_array(),
        boolean: require_boolean(),
        date: require_date(),
        function: require_function(),
        link: require_link(),
        number: require_number(),
        object: require_object(),
        string: require_string(),
        symbol: require_symbol()
      },
      aliases: {
        alt: "alternatives",
        bool: "boolean",
        func: "function"
      }
    };
    if (Buffer) {
      internals.types.binary = require_binary();
    }
    internals.root = function() {
      const root = {
        _types: new Set(Object.keys(internals.types))
      };
      for (const type of root._types) {
        root[type] = function(...args) {
          assert(!args.length || ["alternatives", "link", "object"].includes(type), "The", type, "type does not allow arguments");
          return internals.generate(this, internals.types[type], args);
        };
      }
      for (const method of ["allow", "custom", "disallow", "equal", "exist", "forbidden", "invalid", "not", "only", "optional", "options", "prefs", "preferences", "required", "strip", "valid", "when"]) {
        root[method] = function(...args) {
          return this.any()[method](...args);
        };
      }
      Object.assign(root, internals.methods);
      for (const alias of Object.keys(internals.aliases)) {
        const target = internals.aliases[alias];
        root[alias] = root[target];
      }
      root.x = root.expression;
      if (Trace.setup) {
        Trace.setup(root);
      }
      return root;
    };
    internals.methods = {
      ValidationError: Errors.ValidationError,
      version: Common.version,
      cache: Cache.provider,
      assert(value, schema, ...args) {
        internals.assert(value, schema, true, args);
      },
      attempt(value, schema, ...args) {
        return internals.assert(value, schema, false, args);
      },
      build(desc) {
        assert(typeof Manifest.build === "function", "Manifest functionality disabled");
        return Manifest.build(this, desc);
      },
      checkPreferences(prefs) {
        Common.checkPreferences(prefs);
      },
      compile(schema, options) {
        return Compile.compile(this, schema, options);
      },
      defaults(modifier) {
        assert(typeof modifier === "function", "modifier must be a function");
        const joi = Object.assign({}, this);
        for (const type of joi._types) {
          const schema = modifier(joi[type]());
          assert(Common.isSchema(schema), "modifier must return a valid schema object");
          joi[type] = function(...args) {
            return internals.generate(this, schema, args);
          };
        }
        return joi;
      },
      expression(...args) {
        return new Template(...args);
      },
      extend(...extensions) {
        Common.verifyFlat(extensions, "extend");
        Schemas = Schemas || require_schemas();
        assert(extensions.length, "You need to provide at least one extension");
        this.assert(extensions, Schemas.extensions);
        const joi = Object.assign({}, this);
        joi._types = new Set(joi._types);
        for (let extension of extensions) {
          if (typeof extension === "function") {
            extension = extension(joi);
          }
          this.assert(extension, Schemas.extension);
          const expanded = internals.expandExtension(extension, joi);
          for (const item of expanded) {
            assert(joi[item.type] === void 0 || joi._types.has(item.type), "Cannot override name", item.type);
            const base = item.base || this.any();
            const schema = Extend.type(base, item);
            joi._types.add(item.type);
            joi[item.type] = function(...args) {
              return internals.generate(this, schema, args);
            };
          }
        }
        return joi;
      },
      isError: Errors.ValidationError.isError,
      isExpression: Template.isTemplate,
      isRef: Ref.isRef,
      isSchema: Common.isSchema,
      in(...args) {
        return Ref.in(...args);
      },
      override: Common.symbols.override,
      ref(...args) {
        return Ref.create(...args);
      },
      types() {
        const types = {};
        for (const type of this._types) {
          types[type] = this[type]();
        }
        for (const target of Object.keys(internals.aliases)) {
          types[target] = this[target]();
        }
        return types;
      }
    };
    internals.assert = function(value, schema, annotate, args) {
      const message = args[0] instanceof Error || typeof args[0] === "string" ? args[0] : null;
      const options = message !== null ? args[1] : args[0];
      const result = schema.validate(value, Common.preferences({ errors: { stack: true } }, options || {}));
      let error = result.error;
      if (!error) {
        return result.value;
      }
      if (message instanceof Error) {
        throw message;
      }
      const display = annotate && typeof error.annotate === "function" ? error.annotate() : error.message;
      if (error instanceof Errors.ValidationError === false) {
        error = clone(error);
      }
      error.message = message ? `${message} ${display}` : display;
      throw error;
    };
    internals.generate = function(root, schema, args) {
      assert(root, "Must be invoked on a Joi instance.");
      schema.$_root = root;
      if (!schema._definition.args || !args.length) {
        return schema;
      }
      return schema._definition.args(schema, ...args);
    };
    internals.expandExtension = function(extension, joi) {
      if (typeof extension.type === "string") {
        return [extension];
      }
      const extended = [];
      for (const type of joi._types) {
        if (extension.type.test(type)) {
          const item = Object.assign({}, extension);
          item.type = type;
          item.base = joi[type]();
          extended.push(item);
        }
      }
      return extended;
    };
    module.exports = internals.root();
  }
});

// server/index.ts
init_env();
import express from "express";
import cors from "cors";

// server/utils/logger.ts
init_env();
var Logger = class {
  isDevelopment = config.NODE_ENV === "development";
  formatMessage(level, message, context) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level}] ${message}${contextStr}`;
  }
  debug(message, context) {
    if (this.isDevelopment) {
      console.debug(this.formatMessage("DEBUG" /* DEBUG */, message, context));
    }
  }
  info(message, context) {
    console.info(this.formatMessage("INFO" /* INFO */, message, context));
  }
  warn(message, context) {
    console.warn(this.formatMessage("WARN" /* WARN */, message, context));
  }
  error(message, error, context) {
    const errorInfo = error ? `
${error.stack}` : "";
    console.error(this.formatMessage("ERROR" /* ERROR */, message, context) + errorInfo);
  }
};
var logger = new Logger();

// server/middleware/auth.ts
init_errors();
init_dist_node();
init_supabase();
function addRequestMetadata(req, res, next) {
  req.metadata = {
    requestId: v4_default(),
    timestamp: /* @__PURE__ */ new Date(),
    userAgent: req.get("user-agent") || "unknown",
    ipAddress: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown"
  };
  next();
}
async function authenticateToken(req, res, next) {
  const authHeader = req.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!token) {
    return next(new AuthenticationError("No authentication token provided"));
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return next(new AuthenticationError("Invalid or expired token"));
    }
    req.user = {
      userId: user.id,
      email: user.email || "",
      username: user.user_metadata?.username || "",
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + 3600
    };
    req.metadata.userId = user.id;
    next();
  } catch (error) {
    next(new AuthenticationError("Invalid or expired token"));
  }
}
async function optionalAuth(req, res, next) {
  const authHeader = req.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (token) {
    try {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        req.user = {
          userId: user.id,
          email: user.email || "",
          username: user.user_metadata?.username || "",
          iat: Math.floor(Date.now() / 1e3),
          exp: Math.floor(Date.now() / 1e3) + 3600
        };
        req.metadata.userId = user.id;
      }
    } catch {
    }
  }
  next();
}
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// server/middleware/errorHandler.ts
init_errors();

// server/utils/response.ts
function sendSuccess(res, data, statusCode = 200) {
  const response = {
    success: true,
    data,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    }
  };
  return res.status(statusCode).json(response);
}
function sendPaginated(res, items, total, page, pageSize, statusCode = 200) {
  const paginated = {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total
  };
  const response = {
    success: true,
    data: paginated,
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    }
  };
  return res.status(statusCode).json(response);
}
function sendError(res, firstParam, secondParam, thirdParam, fourthParam) {
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An error occurred";
  let details = fourthParam;
  if (typeof firstParam === "number") {
    statusCode = firstParam;
    code = typeof secondParam === "string" ? secondParam : "ERROR";
    message = thirdParam || "";
  } else {
    message = firstParam;
    statusCode = typeof secondParam === "number" ? secondParam : 400;
    if (statusCode === 401 || statusCode === 403) {
      code = "UNAUTHORIZED";
    } else if (statusCode === 404) {
      code = "NOT_FOUND";
    } else {
      code = "BAD_REQUEST";
    }
  }
  const response = {
    success: false,
    error: {
      code,
      message,
      details
    },
    meta: {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    }
  };
  return res.status(statusCode).json(response);
}

// server/middleware/errorHandler.ts
function errorHandler(err, req, res, next) {
  const requestId = req.metadata?.requestId;
  if (isAPIError(err)) {
    logger.warn(`API Error: ${err.code}`, {
      requestId,
      statusCode: err.statusCode,
      message: err.message
    });
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }
  if (err.name === "ValidationError") {
    logger.warn(`Validation Error: ${err.message}`, { requestId });
    return sendError(res, 400, "VALIDATION_ERROR", err.message);
  }
  if (err.name === "JsonWebTokenError") {
    logger.warn(`JWT Error: ${err.message}`, { requestId });
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    logger.warn("Token expired", { requestId });
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Token expired");
  }
  logger.error("Unexpected error", err, { requestId });
  return sendError(res, 500, "INTERNAL_SERVER_ERROR", err.message);
}

// server/routes/pages.ts
init_LinkPageService();
init_LinkRepository();
import { Router } from "express";

// server/utils/validators.ts
var import_joi = __toESM(require_lib5(), 1);
init_errors();
var schemas = {
  email: import_joi.default.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required"
  }),
  password: import_joi.default.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base": "Password must contain uppercase, lowercase, number and special character",
    "any.required": "Password is required"
  }),
  username: import_joi.default.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username must contain only letters and numbers",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 30 characters",
    "any.required": "Username is required"
  }),
  handle: import_joi.default.string().pattern(/^[a-z0-9_-]+$/).min(3).max(30).optional().allow("").messages({
    "string.pattern.base": "Handle must contain only lowercase letters, numbers, hyphens, and underscores",
    "string.min": "Handle must be at least 3 characters",
    "string.max": "Handle must not exceed 30 characters"
  }),
  url: import_joi.default.string().uri().required().messages({
    "string.uri": "Invalid URL format",
    "any.required": "URL is required"
  }),
  title: import_joi.default.string().min(1).max(255).required().messages({
    "string.min": "Title is required",
    "string.max": "Title must not exceed 255 characters",
    "any.required": "Title is required"
  }),
  description: import_joi.default.string().max(1e3).allow("").messages({
    "string.max": "Description must not exceed 1000 characters"
  }),
  hexColor: import_joi.default.string().pattern(/^#[0-9A-F]{6}$/i).messages({
    "string.pattern.base": "Invalid hex color format"
  })
};
var validateLinkPageCreate = (data) => {
  const schema = import_joi.default.object({
    handle: schemas.handle,
    title: schemas.title,
    description: schemas.description,
    theme: import_joi.default.string().valid("light", "dark", "custom")
  });
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join(".")] = detail.message;
      return acc;
    }, {});
    console.error("Validation failed for LinkPageCreate:", details);
    throw new ValidationError("Validation failed", details);
  }
  return value;
};
var validateLinkCreate = (data) => {
  const schema = import_joi.default.object({
    title: schemas.title,
    url: schemas.url,
    description: schemas.description,
    icon: import_joi.default.string().optional()
  });
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join(".")] = detail.message;
      return acc;
    }, {});
    throw new ValidationError("Validation failed", details);
  }
  return value;
};
var validateQRCodeCreate = (data) => {
  const schema = import_joi.default.object({
    format: import_joi.default.string().valid("png", "svg", "webp").default("png"),
    size: import_joi.default.number().min(100).max(1e3).default(300),
    errorCorrection: import_joi.default.string().valid("L", "M", "Q", "H").default("M"),
    designStyle: import_joi.default.string().valid("standard", "rounded", "gradient", "custom").default("standard")
  }).unknown(true);
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.reduce((acc, detail) => {
      acc[detail.path.join(".")] = detail.message;
      return acc;
    }, {});
    throw new ValidationError("Validation failed", details);
  }
  return value;
};

// server/routes/pages.ts
var router = Router();
router.post("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const data = validateLinkPageCreate(req.body);
  const page = await linkPageService.createPage(req.user.userId, data);
  sendSuccess(res, page, 201);
}));
router.get("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const result = await linkPageService.getUserPages(req.user.userId, skip, take);
  sendPaginated(res, result.pages, result.total, Math.floor(skip / take) + 1, take);
}));
router.get("/handle/:handle", optionalAuth, asyncHandler(async (req, res) => {
  const page = await linkPageService.getPageByHandle(req.params.handle);
  if (!page.isPublished && (!req.user || page.userId !== req.user.userId)) {
    return sendError(res, 404, "NOT_FOUND", "Page not found");
  }
  const links = await linkRepository.findByPageId(page.id);
  sendSuccess(res, { ...page, links });
}));
router.get("/:pageId", optionalAuth, asyncHandler(async (req, res) => {
  const page = await linkPageService.getPage(req.params.pageId);
  if (!page.isPublished && (!req.user || page.userId !== req.user.userId)) {
    return sendError(res, 404, "NOT_FOUND", "Page not found");
  }
  const links = await linkRepository.findByPageId(page.id);
  sendSuccess(res, { ...page, links });
}));
router.put("/:pageId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { title, description, bio, theme, customColors, avatar, bannerImage, socialLinks, design, links, slug } = req.body;
  const page = await linkPageService.updatePage(req.params.pageId, req.user.userId, {
    handle: slug,
    title,
    description,
    bio,
    theme,
    customColors,
    avatar,
    bannerImage,
    socialLinks,
    design
  });
  if (links && Array.isArray(links)) {
    await linkRepository.deleteByPageId(req.params.pageId);
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      await linkRepository.create({
        pageId: req.params.pageId,
        title: link.title,
        url: link.url,
        icon: link.icon,
        color: link.color,
        isActive: link.isActive !== false,
        order: link.order ?? i,
        clicks: link.clicks || 0
      });
    }
  }
  sendSuccess(res, page);
}));
router.post("/:pageId/publish", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const page = await linkPageService.publishPage(req.params.pageId, req.user.userId);
  sendSuccess(res, page);
}));
router.post("/:pageId/unpublish", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const page = await linkPageService.unpublishPage(req.params.pageId, req.user.userId);
  sendSuccess(res, page);
}));
router.get("/:pageId/stats", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const stats = await linkPageService.getPageStats(req.params.pageId, req.user.userId);
  sendSuccess(res, stats);
}));
router.delete("/:pageId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  await linkPageService.deletePage(req.params.pageId, req.user.userId);
  sendSuccess(res, { message: "Page deleted successfully" });
}));
var pages_default = router;

// server/routes/links.ts
import { Router as Router2 } from "express";

// server/services/LinkService.ts
init_LinkRepository();
init_LinkPageRepository();
init_AnalyticsRepository();
init_errors();
var LinkService = class {
  async createLink(pageId, userId, linkData) {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError("LinkPage");
    }
    if (page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    const pageLinks = await linkRepository.findByPageId(pageId);
    const maxOrder = pageLinks.length > 0 ? Math.max(...pageLinks.map((l) => l.order)) : -1;
    return linkRepository.create({
      pageId,
      title: linkData.title,
      url: linkData.url,
      description: linkData.description,
      icon: linkData.icon,
      order: maxOrder + 1,
      clicks: 0,
      isActive: true
    });
  }
  async getLink(linkId) {
    const link = await linkRepository.findById(linkId);
    if (!link) {
      throw new NotFoundError("Link");
    }
    return link;
  }
  async getPageLinks(pageId) {
    return linkRepository.findByPageId(pageId);
  }
  async updateLink(linkId, userId, updates) {
    const link = await this.getLink(linkId);
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this link");
    }
    const updated = await linkRepository.update(linkId, updates);
    if (!updated) {
      throw new NotFoundError("Link");
    }
    return updated;
  }
  async reorderLinks(pageId, userId, links) {
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    return linkRepository.reorder(pageId, links);
  }
  async toggleLink(linkId, userId) {
    const link = await this.getLink(linkId);
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this link");
    }
    const updated = await linkRepository.update(linkId, {
      isActive: !link.isActive
    });
    if (!updated) {
      throw new NotFoundError("Link");
    }
    return updated;
  }
  async deleteLink(linkId, userId) {
    const link = await this.getLink(linkId);
    const page = await linkPageRepository.findById(link.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this link");
    }
    const analytics = await analyticsRepository.findByLinkId(linkId);
    for (const entry of analytics) {
    }
    await linkRepository.delete(linkId);
  }
  async recordLinkClick(linkId, metadata) {
    const link = await this.getLink(linkId);
    const updated = await linkRepository.incrementClicks(linkId);
    const page = await linkPageRepository.findById(link.pageId);
    if (page) {
      const deviceType = this.detectDeviceType(metadata.userAgent);
      await analyticsRepository.create({
        pageId: link.pageId,
        linkId,
        type: "link_click",
        userAgent: metadata.userAgent,
        ipAddress: metadata.ipAddress,
        deviceType,
        referer: metadata.referer,
        timestamp: /* @__PURE__ */ new Date()
      });
    }
    return updated || link;
  }
  detectDeviceType(userAgent) {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return "mobile";
    if (/tablet|ipad/i.test(userAgent)) return "tablet";
    if (/windows|macintosh|linux/i.test(userAgent)) return "desktop";
    return "unknown";
  }
};
var linkService = new LinkService();

// server/routes/links.ts
var router2 = Router2();
router2.post("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { pageId, ...linkData } = req.body;
  const data = validateLinkCreate(linkData);
  const link = await linkService.createLink(pageId, req.user.userId, data);
  sendSuccess(res, link, 201);
}));
router2.get("/page/:pageId", asyncHandler(async (req, res) => {
  const links = await linkService.getPageLinks(req.params.pageId);
  sendSuccess(res, links);
}));
router2.put("/:linkId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { title, url, description, icon, isActive } = req.body;
  const link = await linkService.updateLink(req.params.linkId, req.user.userId, {
    title,
    url,
    description,
    icon,
    isActive
  });
  sendSuccess(res, link);
}));
router2.post("/:pageId/reorder", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { links } = req.body;
  if (!Array.isArray(links)) {
    return sendError(res, 400, "VALIDATION_ERROR", "links must be an array");
  }
  const updated = await linkService.reorderLinks(req.params.pageId, req.user.userId, links);
  sendSuccess(res, updated);
}));
router2.post("/:linkId/toggle", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const link = await linkService.toggleLink(req.params.linkId, req.user.userId);
  sendSuccess(res, link);
}));
router2.delete("/:linkId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  await linkService.deleteLink(req.params.linkId, req.user.userId);
  sendSuccess(res, { message: "Link deleted successfully" });
}));
router2.post("/:linkId/click", asyncHandler(async (req, res) => {
  const link = await linkService.recordLinkClick(req.params.linkId, {
    userAgent: req.metadata?.userAgent || "unknown",
    ipAddress: req.metadata?.ipAddress || "unknown",
    referer: req.get("referer")
  });
  sendSuccess(res, link);
}));
var links_default = router2;

// server/routes/qrcodes.ts
import { Router as Router3 } from "express";

// server/services/QRCodeService.ts
init_QRCodeRepository();
init_LinkPageRepository();
init_AnalyticsRepository();
init_errors();
init_env();
import crypto2 from "crypto";
var QRCodeService = class {
  async generateQRCode(pageId, userId, options) {
    let targetPageId = pageId;
    if (!targetPageId) {
      const userPages = await linkPageRepository.list(userId, 0, 1);
      if (userPages.pages.length === 0) {
        const { linkPageService: linkPageService2 } = await Promise.resolve().then(() => (init_LinkPageService(), LinkPageService_exports));
        const newPage = await linkPageService2.createPage(userId, {
          title: "My Link Page",
          description: "Automatically created for QR Code",
          theme: "dark"
        });
        targetPageId = newPage.id;
      } else {
        targetPageId = userPages.pages[0].id;
      }
    }
    const page = await linkPageRepository.findById(targetPageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    const code = this.generateUniqueCode(targetPageId, options.linkId);
    const redirectUrl = `${config.QR_REDIRECT_URL}/${code}`;
    try {
      const qrCode = await qrCodeRepository.create({
        pageId: targetPageId,
        linkId: options.linkId,
        code,
        format: options.format,
        size: options.size || 300,
        errorCorrection: options.errorCorrection || "M",
        designStyle: options.designStyle || "standard",
        redirectUrl,
        name: options.name,
        url: options.url,
        customization: options.customization
      });
      return qrCode;
    } catch (error) {
      console.error("Failed to create QR code record in DB:", error);
      throw error;
    }
  }
  async getQRCode(qrCodeId) {
    const qrCode = await qrCodeRepository.findById(qrCodeId);
    if (!qrCode) {
      throw new NotFoundError("QRCode");
    }
    return qrCode;
  }
  async getUserQRCodes(userId, skip = 0, take = 10) {
    const pagesResult = await linkPageRepository.list(userId, 0, 1e3);
    const pageIds = pagesResult.pages.map((p) => p.id);
    if (pageIds.length === 0) return { qrCodes: [], total: 0 };
    const allQrCodes = await qrCodeRepository.listByPageIds(pageIds);
    const paginated = allQrCodes.slice(skip, skip + take);
    return { qrCodes: paginated, total: allQrCodes.length };
  }
  async getPageQRCodes(pageId, userId, skip = 0, take = 10) {
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    return qrCodeRepository.list(pageId, skip, take);
  }
  async updateQRCode(qrCodeId, userId, updates) {
    const qrCode = await this.getQRCode(qrCodeId);
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this QR code");
    }
    if (updates.pageId) {
      const targetPage = await linkPageRepository.findById(updates.pageId);
      if (!targetPage || targetPage.userId !== userId) {
        throw new AuthorizationError("You do not own the target page");
      }
    }
    const updated = await qrCodeRepository.update(qrCodeId, {
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    });
    if (!updated) {
      throw new NotFoundError("QRCode");
    }
    return updated;
  }
  async toggleQRCode(qrCodeId, userId) {
    const qrCode = await this.getQRCode(qrCodeId);
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this QR code");
    }
    const currentIsActive = qrCode.isActive;
    return this.updateQRCode(qrCodeId, userId, { isActive: !currentIsActive });
  }
  async deleteQRCode(qrCodeId, userId) {
    const qrCode = await this.getQRCode(qrCodeId);
    const page = await linkPageRepository.findById(qrCode.pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this QR code");
    }
    await qrCodeRepository.delete(qrCodeId);
  }
  async resolveQRCode(code, metadata) {
    const qrCode = await qrCodeRepository.findByCode(code);
    if (!qrCode) {
      throw new NotFoundError("QRCode");
    }
    const deviceType = this.detectDeviceType(metadata.userAgent);
    await analyticsRepository.create({
      pageId: qrCode.pageId,
      linkId: qrCode.linkId,
      qrCodeId: qrCode.id,
      type: "qr_scan",
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: /* @__PURE__ */ new Date()
    });
    if (qrCode.linkId) {
      return `/l/${qrCode.linkId}`;
    }
    return `/p/${qrCode.pageId}`;
  }
  generateUniqueCode(pageId, linkId) {
    const data = `${pageId}${linkId || ""}${Date.now()}${Math.random()}`;
    const hash = crypto2.createHash("sha256").update(data).digest("hex");
    return hash.substring(0, 8);
  }
  detectDeviceType(userAgent) {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return "mobile";
    if (/tablet|ipad/i.test(userAgent)) return "tablet";
    if (/windows|macintosh|linux/i.test(userAgent)) return "desktop";
    return "unknown";
  }
};
var qrCodeService = new QRCodeService();

// server/routes/qrcodes.ts
var router3 = Router3();
router3.post("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { pageId, ...qrData } = req.body;
  const data = validateQRCodeCreate(qrData);
  const qrCode = await qrCodeService.generateQRCode(pageId, req.user.userId, data);
  sendSuccess(res, qrCode, 201);
}));
router3.get("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const result = await qrCodeService.getUserQRCodes(req.user.userId, skip, take);
  sendPaginated(res, result.qrCodes, result.total, Math.floor(skip / take) + 1, take);
}));
router3.get("/page/:pageId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 10, 100);
  const result = await qrCodeService.getPageQRCodes(req.params.pageId, req.user.userId, skip, take);
  sendPaginated(res, result.qrCodes, result.total, Math.floor(skip / take) + 1, take);
}));
router3.get("/:qrCodeId", asyncHandler(async (req, res) => {
  const qrCode = await qrCodeService.getQRCode(req.params.qrCodeId);
  sendSuccess(res, qrCode);
}));
router3.put("/:qrCodeId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { pageId, designStyle, customColors, customLogo, name, url, customization, errorCorrection, size, format, foregroundColor, backgroundColor, isActive } = req.body;
  const qrCode = await qrCodeService.updateQRCode(req.params.qrCodeId, req.user.userId, {
    pageId,
    designStyle,
    customColors: customColors || { dark: foregroundColor, light: backgroundColor },
    customLogo,
    name,
    url,
    customization,
    errorCorrection,
    size,
    format,
    isActive
  });
  sendSuccess(res, qrCode);
}));
router3.post("/:qrCodeId/toggle", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const qrCode = await qrCodeService.toggleQRCode(req.params.qrCodeId, req.user.userId);
  sendSuccess(res, qrCode);
}));
router3.delete("/:qrCodeId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  await qrCodeService.deleteQRCode(req.params.qrCodeId, req.user.userId);
  sendSuccess(res, { message: "QR code deleted successfully" });
}));
router3.get("/resolve/:code", asyncHandler(async (req, res) => {
  const targetUrl = await qrCodeService.resolveQRCode(req.params.code, {
    userAgent: req.metadata?.userAgent || "unknown",
    ipAddress: req.metadata?.ipAddress || "unknown",
    referer: req.get("referer")
  });
  res.redirect(302, targetUrl);
}));
var qrcodes_default = router3;

// server/routes/nfc.ts
import { Router as Router4 } from "express";

// server/services/NFCService.ts
init_NFCRepository();
init_LinkPageRepository();
init_errors();
var NFCService = class {
  async getUserCards(userId) {
    return nfcRepository.findByUserId(userId);
  }
  async getCard(cardId, userId) {
    const card = await nfcRepository.findById(cardId);
    if (!card) {
      throw new NotFoundError("NFC Card");
    }
    if (card.pageId) {
      const page = await linkPageRepository.findById(card.pageId);
      if (!page || page.userId !== userId) {
        throw new AuthorizationError("You do not own this NFC card");
      }
    } else {
      throw new AuthorizationError("Invalid NFC card association");
    }
    return card;
  }
  async createCard(userId, data) {
    let actualPageId = data.pageId;
    if (data.pageId === userId) {
      const result = await linkPageRepository.list(userId, 0, 1);
      if (result.pages.length > 0) {
        actualPageId = result.pages[0].id;
      } else {
        actualPageId = void 0;
      }
    }
    return nfcRepository.create({
      userId,
      pageId: actualPageId,
      title: data.title,
      description: data.description,
      tagId: data.tagId,
      isActive: data.isActive ?? true
    });
  }
  async updateCard(cardId, userId, updates) {
    await this.getCard(cardId, userId);
    const updated = await nfcRepository.update(cardId, updates);
    if (!updated) {
      throw new NotFoundError("NFC Card");
    }
    return updated;
  }
  async deleteCard(cardId, userId) {
    await this.getCard(cardId, userId);
    await nfcRepository.delete(cardId);
  }
  async toggleActive(cardId, userId) {
    const card = await this.getCard(cardId, userId);
    const updated = await nfcRepository.update(cardId, {
      isActive: !card.isActive
    });
    if (!updated) {
      throw new NotFoundError("NFC Card");
    }
    return updated;
  }
  async writeTag(cardId, userId, tagId) {
    await this.getCard(cardId, userId);
    await nfcRepository.update(cardId, { tagId });
    return {
      success: true,
      message: "Successfully linked and wrote to NFC tag",
      tagId,
      writtenData: {
        id: tagId,
        type: "NDEF",
        records: [
          {
            tnf: 1,
            type: "U",
            payload: `https://linkora.com/n/${cardId}`
            // Example payload
          }
        ]
      }
    };
  }
  async saveDesign(cardId, userId, cardDesign) {
    await this.getCard(cardId, userId);
    const updated = await nfcRepository.saveDesign(cardId, cardDesign);
    if (!updated) throw new NotFoundError("NFC Card");
    return updated;
  }
};
var nfcService = new NFCService();

// server/routes/nfc.ts
var router4 = Router4();
router4.get("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const cards = await nfcService.getUserCards(req.user.userId);
  sendSuccess(res, { items: cards });
}));
router4.post("/", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const card = await nfcService.createCard(req.user.userId, req.body);
  sendSuccess(res, card, 201);
}));
router4.get("/:id", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const card = await nfcService.getCard(req.params.id, req.user.userId);
  sendSuccess(res, card);
}));
router4.put("/:id", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const card = await nfcService.updateCard(req.params.id, req.user.userId, req.body);
  sendSuccess(res, card);
}));
router4.delete("/:id", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  await nfcService.deleteCard(req.params.id, req.user.userId);
  sendSuccess(res, null, 204);
}));
router4.put("/:id/toggle", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const card = await nfcService.toggleActive(req.params.id, req.user.userId);
  sendSuccess(res, card);
}));
router4.post("/:id/write", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { tagId } = req.body;
  if (!tagId) {
    return sendError(res, 400, "VALIDATION_ERROR", "tagId is required");
  }
  const result = await nfcService.writeTag(req.params.id, req.user.userId, tagId);
  sendSuccess(res, result);
}));
router4.put("/:id/design", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const { cardDesign } = req.body;
  if (!cardDesign) {
    return sendError(res, 400, "VALIDATION_ERROR", "cardDesign is required");
  }
  const card = await nfcService.saveDesign(req.params.id, req.user.userId, cardDesign);
  sendSuccess(res, card);
}));
var nfc_default = router4;

// server/routes/analytics.ts
import { Router as Router5 } from "express";

// server/services/AnalyticsService.ts
init_AnalyticsRepository();
init_LinkPageRepository();
init_errors();
var AnalyticsService = class {
  async getPageAnalytics(pageId, userId, skip = 0, take = 100) {
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    return analyticsRepository.findByPageId(pageId, skip, take);
  }
  async getPageStats(pageId, userId) {
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    const stats = await analyticsRepository.getStats(pageId);
    const deviceStats = await analyticsRepository.getDeviceStats(pageId);
    return {
      summary: stats,
      devices: deviceStats,
      topReferrers: this.getTopReferrers(pageId),
      topCountries: this.getTopCountries(pageId)
    };
  }
  async recordPageView(pageId, metadata) {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError("LinkPage");
    }
    const deviceType = this.detectDeviceType(metadata.userAgent);
    return analyticsRepository.create({
      pageId,
      type: "page_view",
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: /* @__PURE__ */ new Date()
    });
  }
  async recordNFCTap(pageId, metadata) {
    const page = await linkPageRepository.findById(pageId);
    if (!page) {
      throw new NotFoundError("LinkPage");
    }
    const deviceType = this.detectDeviceType(metadata.userAgent);
    return analyticsRepository.create({
      pageId,
      type: "nfc_tap",
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      deviceType,
      referer: metadata.referer,
      timestamp: /* @__PURE__ */ new Date()
    });
  }
  async getTopReferrers(pageId, limit = 10) {
    const { analytics } = await analyticsRepository.findByPageId(pageId, 0, 1e4);
    const referrerCounts = {};
    for (const entry of analytics) {
      if (entry.referer) {
        referrerCounts[entry.referer] = (referrerCounts[entry.referer] || 0) + 1;
      }
    }
    return Object.entries(referrerCounts).map(([referrer, count]) => ({ referrer, count })).sort((a, b) => b.count - a.count).slice(0, limit);
  }
  getTopCountries(pageId, limit = 10) {
    return [];
  }
  detectDeviceType(userAgent) {
    if (/mobile|android|iphone|ipod/i.test(userAgent)) return "mobile";
    if (/tablet|ipad/i.test(userAgent)) return "tablet";
    if (/windows|macintosh|linux/i.test(userAgent)) return "desktop";
    return "unknown";
  }
  async getRetentionMetrics(pageId, userId) {
    const page = await linkPageRepository.findById(pageId);
    if (!page || page.userId !== userId) {
      throw new AuthorizationError("You do not own this page");
    }
    return {
      dayOneRetention: 0,
      daySevenRetention: 0,
      thirtyDayRetention: 0
    };
  }
};
var analyticsService = new AnalyticsService();

// server/routes/analytics.ts
var router5 = Router5();
router5.get("/page/:pageId", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const skip = parseInt(req.query.skip) || 0;
  const take = Math.min(parseInt(req.query.take) || 100, 500);
  const result = await analyticsService.getPageAnalytics(
    req.params.pageId,
    req.user.userId,
    skip,
    take
  );
  sendPaginated(res, result.analytics, result.total, Math.floor(skip / take) + 1, take);
}));
router5.get("/page/:pageId/stats", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const stats = await analyticsService.getPageStats(req.params.pageId, req.user.userId);
  sendSuccess(res, stats);
}));
router5.get("/page/:pageId/retention", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const metrics = await analyticsService.getRetentionMetrics(req.params.pageId, req.user.userId);
  sendSuccess(res, metrics);
}));
router5.post("/page/:pageId/view", asyncHandler(async (req, res) => {
  const analytics = await analyticsService.recordPageView(req.params.pageId, {
    userAgent: req.metadata?.userAgent || "unknown",
    ipAddress: req.metadata?.ipAddress || "unknown",
    referer: req.get("referer")
  });
  sendSuccess(res, analytics, 201);
}));
router5.post("/page/:pageId/nfc-tap", asyncHandler(async (req, res) => {
  const analytics = await analyticsService.recordNFCTap(req.params.pageId, {
    userAgent: req.metadata?.userAgent || "unknown",
    ipAddress: req.metadata?.ipAddress || "unknown",
    referer: req.get("referer")
  });
  sendSuccess(res, analytics, 201);
}));
var analytics_default = router5;

// server/routes/dashboard.ts
import { Router as Router6 } from "express";
init_supabase();
var router6 = Router6();
router6.get("/stats", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const userId = req.user.userId;
  const { data: pages } = await supabase.from("link_pages").select("id").eq("user_id", userId).is("deleted_at", null);
  const pageIds = (pages || []).map((p) => p.id);
  let qrCount = 0;
  if (pageIds.length > 0) {
    const { count } = await supabase.from("qr_codes").select("id", { count: "exact", head: true }).in("page_id", pageIds);
    qrCount = count || 0;
  }
  let scansCount = 0;
  if (pageIds.length > 0) {
    const { count } = await supabase.from("analytics_events").select("id", { count: "exact", head: true }).in("page_id", pageIds);
    scansCount = count || 0;
  }
  let clickCount = 0;
  if (pageIds.length > 0) {
    const { data: linksData } = await supabase.from("links").select("click_count").in("page_id", pageIds).is("deleted_at", null);
    clickCount = (linksData || []).reduce((sum, l) => sum + (l.click_count || 0), 0);
  }
  sendSuccess(res, {
    pagesCount: pageIds.length,
    qrCount,
    scansCount,
    clickCount,
    storageUsage: 0
  });
}));
router6.get("/activity", authenticateToken, asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 401, "AUTHENTICATION_ERROR", "Not authenticated");
  }
  const userId = req.user.userId;
  const { data: recentPages } = await supabase.from("link_pages").select("id, title, username, created_at, updated_at, is_published").eq("user_id", userId).is("deleted_at", null).order("updated_at", { ascending: false }).limit(5);
  const { data: pages } = await supabase.from("link_pages").select("id").eq("user_id", userId).is("deleted_at", null);
  const pageIds = (pages || []).map((p) => p.id);
  let recentQRs = [];
  if (pageIds.length > 0) {
    const { data } = await supabase.from("qr_codes").select("id, name, created_at").in("page_id", pageIds).order("created_at", { ascending: false }).limit(3);
    recentQRs = data || [];
  }
  const activities = [
    ...(recentPages || []).map((p) => ({
      id: p.id,
      type: "page",
      title: p.title,
      handle: p.username,
      isPublished: p.is_published,
      createdAt: p.updated_at || p.created_at
    })),
    ...recentQRs.map((q) => ({
      id: q.id,
      type: "qr",
      title: q.name || "QR Code",
      createdAt: q.created_at
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  sendSuccess(res, { activities });
}));
var dashboard_default = router6;

// server/routes/admin.ts
init_supabase();
import { Router as Router7 } from "express";

// server/middleware/admin.ts
init_supabase();
var ROLE_HIERARCHY = {
  super_admin: 6,
  admin: 5,
  editor: 4,
  designer: 3,
  support: 2,
  viewer: 1
};
function requireMinRole(minRole) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }
      const token = authHeader.split(" ")[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }
      const { data: profile, error: profileError } = await supabase.from("users").select("id, role, email").eq("id", user.id).single();
      if (profileError || !profile) {
        return res.status(401).json({ success: false, error: "User not found" });
      }
      const userRole = profile.role || "user";
      const userLevel = ROLE_HIERARCHY[userRole] || 0;
      const requiredLevel = ROLE_HIERARCHY[minRole] || 0;
      if (userLevel < requiredLevel) {
        return res.status(403).json({ success: false, error: `Minimum role required: ${minRole}` });
      }
      req.adminUser = { id: profile.id, role: userRole, email: profile.email };
      next();
    } catch (err) {
      return res.status(500).json({ success: false, error: "Authorization failed" });
    }
  };
}

// server/routes/admin.ts
var router7 = Router7();
router7.get("/dashboard/stats", requireMinRole("viewer"), async (req, res) => {
  try {
    const [usersRes, pagesRes, qrRes, nfcRes, designsRes, submissionsRes, suggestionsRes, reportsRes] = await Promise.all([
      supabase.from("users").select("id, role, is_suspended, created_at", { count: "exact" }),
      supabase.from("link_pages").select("id, is_published, view_count, click_count", { count: "exact" }),
      supabase.from("qr_codes").select("id, scan_count, is_active", { count: "exact" }),
      supabase.from("nfc_tags").select("id, is_active, scan_count", { count: "exact" }),
      supabase.from("design_marketplace").select("id, type, status, download_count", { count: "exact" }),
      supabase.from("community_submissions").select("id, status", { count: "exact" }),
      supabase.from("suggestions").select("id, status, vote_count", { count: "exact" }),
      supabase.from("bug_reports").select("id, status, priority", { count: "exact" })
    ]);
    const users = usersRes.data || [];
    const pages = pagesRes.data || [];
    const qrs = qrRes.data || [];
    const nfcs = nfcRes.data || [];
    const designs = designsRes.data || [];
    const submissions = submissionsRes.data || [];
    const suggestions = suggestionsRes.data || [];
    const bugs = reportsRes.data || [];
    const now = /* @__PURE__ */ new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 864e5);
    const dailyRegistrations = users.filter((u) => new Date(u.created_at) >= today).length;
    const weeklyRegistrations = users.filter((u) => new Date(u.created_at) >= weekAgo).length;
    const totalViews = pages.reduce((s, p) => s + (p.view_count || 0), 0);
    const totalScans = qrs.reduce((s, q) => s + (q.scan_count || 0), 0) + nfcs.reduce((s, n) => s + (n.scan_count || 0), 0);
    const recentActivityRes = await supabase.from("activity_logs").select("*, users!activity_logs_user_id_fkey(display_name, avatar_url)").order("created_at", { ascending: false }).limit(20);
    const recentSubmissions = await supabase.from("community_submissions").select("id, title, type, status, created_at, users!community_submissions_user_id_fkey(display_name, avatar_url)").order("created_at", { ascending: false }).limit(10);
    const recentSuggestions = await supabase.from("suggestions").select("id, title, category, status, vote_count, created_at, users!suggestions_user_id_fkey(display_name)").order("created_at", { ascending: false }).limit(10);
    sendSuccess(res, {
      totalUsers: usersRes.count || 0,
      activeUsers: users.filter((u) => !u.is_suspended).length,
      premiumUsers: users.filter((u) => u.role === "admin" || u.role === "super_admin").length,
      totalPages: pagesRes.count || 0,
      totalQRCodes: qrRes.count || 0,
      totalNFCCards: nfcRes.count || 0,
      totalDesigns: designsRes.count || 0,
      totalSubmissions: submissionsRes.count || 0,
      totalSuggestions: suggestionsRes.count || 0,
      totalBugReports: reportsRes.count || 0,
      totalViews,
      totalScans,
      dailyRegistrations,
      weeklyRegistrations,
      recentActivity: recentActivityRes.data || [],
      recentSubmissions: recentSubmissions.data || [],
      recentSuggestions: recentSuggestions.data || [],
      designsByType: designs.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
      }, {}),
      submissionsByStatus: submissions.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {}),
      bugsByPriority: bugs.reduce((acc, b) => {
        acc[b.priority] = (acc[b.priority] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) {
    sendError(res, "Failed to load dashboard stats");
  }
});
router7.get("/dashboard/analytics", requireMinRole("viewer"), async (req, res) => {
  try {
    const { period = "daily", days = 30 } = req.query;
    const since = new Date(Date.now() - Number(days) * 864e5).toISOString();
    const { data: registrations } = await supabase.from("users").select("created_at").gte("created_at", since).order("created_at");
    const { data: events } = await supabase.from("analytics_events").select("created_at, event_type").gte("created_at", since).order("created_at");
    const { data: activity } = await supabase.from("activity_logs").select("created_at, action").gte("created_at", since).order("created_at");
    sendSuccess(res, {
      registrations: registrations || [],
      events: events || [],
      activity: activity || [],
      period
    });
  } catch (err) {
    sendError(res, "Failed to load analytics");
  }
});
router7.get("/users", requireMinRole("support"), async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20, sort = "created_at", order = "desc" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("users").select("*", { count: "exact" });
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%,username.ilike.%${search}%`);
    }
    if (role) query = query.eq("role", role);
    if (status === "suspended") query = query.eq("is_suspended", true);
    if (status === "active") query = query.eq("is_suspended", false);
    const { data, count, error } = await query.order(sort, { ascending: order === "asc" }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { users: data || [], total: count || 0, page: Number(page), limit: Number(limit) });
  } catch (err) {
    sendError(res, "Failed to load users");
  }
});
router7.put("/users/:id/role", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ["super_admin", "admin", "editor", "support", "designer", "viewer", "user"];
    if (!validRoles.includes(role)) return sendError(res, "Invalid role", 400);
    const { data, error } = await supabase.from("users").update({ role }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "update",
      entity_type: "user",
      entity_id: id,
      details: { field: "role", value: role }
    });
    sendSuccess(res, { user: data });
  } catch (err) {
    sendError(res, "Failed to update user role");
  }
});
router7.put("/users/:id/suspend", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { suspend, reason } = req.body;
    const { data, error } = await supabase.from("users").update({
      is_suspended: suspend,
      suspended_at: suspend ? (/* @__PURE__ */ new Date()).toISOString() : null,
      suspended_reason: suspend ? reason : null
    }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: suspend ? "update" : "update",
      entity_type: "user",
      entity_id: id,
      details: { action: suspend ? "suspended" : "unsuspended", reason }
    });
    sendSuccess(res, { user: data });
  } catch (err) {
    sendError(res, "Failed to update user status");
  }
});
router7.delete("/users/:id", requireMinRole("super_admin"), async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.adminUser.id) return sendError(res, "Cannot delete yourself", 400);
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "delete",
      entity_type: "user",
      entity_id: id
    });
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete user");
  }
});
router7.get("/designs", requireMinRole("viewer"), async (req, res) => {
  try {
    const { search, type, category, status, is_premium, is_featured, page = 1, limit = 20, sort = "created_at", order = "desc" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("design_marketplace").select("*, users!design_marketplace_author_id_fkey(display_name, avatar_url)", { count: "exact" });
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category", category);
    if (status) query = query.eq("status", status);
    if (is_premium !== void 0) query = query.eq("is_premium", is_premium === "true");
    if (is_featured !== void 0) query = query.eq("is_featured", is_featured === "true");
    const { data, count, error } = await query.order(sort, { ascending: order === "asc" }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { designs: data || [], total: count || 0, page: Number(page), limit: Number(limit) });
  } catch (err) {
    sendError(res, "Failed to load designs");
  }
});
router7.get("/designs/:id", requireMinRole("viewer"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("design_marketplace").select("*, users!design_marketplace_author_id_fkey(display_name, avatar_url)").eq("id", id).single();
    if (error || !data) return sendError(res, "Design not found", 404);
    sendSuccess(res, { design: data });
  } catch (err) {
    sendError(res, "Failed to load design");
  }
});
router7.post("/designs", requireMinRole("editor"), async (req, res) => {
  try {
    const body = req.body;
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data, error } = await supabase.from("design_marketplace").insert({
      ...body,
      slug,
      author_id: req.adminUser.id
    }).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "create",
      entity_type: "template",
      entity_id: data.id,
      details: { title: data.title, type: data.type }
    });
    sendSuccess(res, { design: data });
  } catch (err) {
    sendError(res, "Failed to create design");
  }
});
router7.put("/designs/:id", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("design_marketplace").update({ ...req.body, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "update",
      entity_type: "template",
      entity_id: id
    });
    sendSuccess(res, { design: data });
  } catch (err) {
    sendError(res, "Failed to update design");
  }
});
router7.delete("/designs/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("design_marketplace").delete().eq("id", id);
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "delete",
      entity_type: "template",
      entity_id: id
    });
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete design");
  }
});
router7.put("/designs/:id/feature", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;
    const { data, error } = await supabase.from("design_marketplace").update({ is_featured }).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { design: data });
  } catch (err) {
    sendError(res, "Failed to update design");
  }
});
router7.get("/submissions", requireMinRole("support"), async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 20, sort = "created_at", order = "desc" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("community_submissions").select("*, users!community_submissions_user_id_fkey(display_name, avatar_url, username)", { count: "exact" });
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);
    const { data, count, error } = await query.order(sort, { ascending: order === "asc" }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { submissions: data || [], total: count || 0, page: Number(page), limit: Number(limit) });
  } catch (err) {
    sendError(res, "Failed to load submissions");
  }
});
router7.get("/submissions/:id", requireMinRole("support"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("community_submissions").select("*, users!community_submissions_user_id_fkey(display_name, avatar_url, username)").eq("id", id).single();
    if (error || !data) return sendError(res, "Submission not found", 404);
    sendSuccess(res, { submission: data });
  } catch (err) {
    sendError(res, "Failed to load submission");
  }
});
router7.put("/submissions/:id/approve", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reply } = req.body;
    const submission = await supabase.from("community_submissions").select("*").eq("id", id).single();
    if (!submission.data) return sendError(res, "Submission not found", 404);
    const sub = submission.data;
    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const marketplaceEntry = await supabase.from("design_marketplace").insert({
      title: sub.title,
      slug,
      description: sub.description,
      type: sub.type,
      category: sub.category,
      tags: sub.tags,
      thumbnail_url: sub.thumbnail_url,
      preview_url: sub.preview_urls?.[0],
      file_url: sub.file_url,
      file_size: sub.file_size,
      file_type: sub.file_type,
      version: sub.version,
      author_id: sub.user_id,
      is_premium: sub.license === "premium",
      is_published: true,
      status: "published"
    }).select().single();
    const { data, error } = await supabase.from("community_submissions").update({
      status: "approved",
      admin_reply,
      reviewer_id: req.adminUser.id,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
      published_at: (/* @__PURE__ */ new Date()).toISOString(),
      marketplace_id: marketplaceEntry.data?.id
    }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("notifications").insert({
      user_id: sub.user_id,
      title: "Template Approved!",
      message: `Your template "${sub.title}" has been approved and published to the marketplace.`,
      type: "success",
      category: "community",
      reference_type: "submission",
      reference_id: id
    });
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "approve",
      entity_type: "submission",
      entity_id: id
    });
    sendSuccess(res, { submission: data });
  } catch (err) {
    sendError(res, "Failed to approve submission");
  }
});
router7.put("/submissions/:id/reject", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reply, reason } = req.body;
    const submission = await supabase.from("community_submissions").select("*").eq("id", id).single();
    if (!submission.data) return sendError(res, "Submission not found", 404);
    const { data, error } = await supabase.from("community_submissions").update({
      status: "rejected",
      admin_reply: admin_reply || reason,
      reviewer_id: req.adminUser.id,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("notifications").insert({
      user_id: submission.data.user_id,
      title: "Template Rejected",
      message: `Your template "${submission.data.title}" was not approved. ${admin_reply || ""}`,
      type: "warning",
      category: "community",
      reference_type: "submission",
      reference_id: id
    });
    sendSuccess(res, { submission: data });
  } catch (err) {
    sendError(res, "Failed to reject submission");
  }
});
router7.put("/submissions/:id/changes", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    const submission = await supabase.from("community_submissions").select("*").eq("id", id).single();
    if (!submission.data) return sendError(res, "Submission not found", 404);
    const { data, error } = await supabase.from("community_submissions").update({
      status: "needs_changes",
      admin_notes,
      reviewer_id: req.adminUser.id,
      reviewed_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (error) throw error;
    await supabase.from("notifications").insert({
      user_id: submission.data.user_id,
      title: "Changes Requested",
      message: `Your template "${submission.data.title}" needs changes. ${admin_notes || ""}`,
      type: "info",
      category: "community",
      reference_type: "submission",
      reference_id: id
    });
    sendSuccess(res, { submission: data });
  } catch (err) {
    sendError(res, "Failed to update submission");
  }
});
router7.put("/submissions/:id", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, category, tags, metadata, status, admin_notes } = req.body;
    const updatePayload = {};
    if (title !== void 0) updatePayload.title = title;
    if (description !== void 0) updatePayload.description = description;
    if (type !== void 0) updatePayload.type = type;
    if (category !== void 0) updatePayload.category = category;
    if (tags !== void 0) updatePayload.tags = tags;
    if (metadata !== void 0) updatePayload.metadata = metadata;
    if (status !== void 0) updatePayload.status = status;
    if (admin_notes !== void 0) updatePayload.admin_notes = admin_notes;
    const { data, error } = await supabase.from("community_submissions").update(updatePayload).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { submission: data });
  } catch (err) {
    sendError(res, "Failed to update submission");
  }
});
router7.get("/suggestions", requireMinRole("support"), async (req, res) => {
  try {
    const { status, category, sort = "created_at", page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("suggestions").select("*, users!suggestions_user_id_fkey(display_name, avatar_url)", { count: "exact" });
    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    const sortField = sort === "votes" ? "vote_count" : sort;
    const { data, count, error } = await query.order(sortField, { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { suggestions: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load suggestions");
  }
});
router7.put("/suggestions/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, admin_reply } = req.body;
    const suggestion = await supabase.from("suggestions").select("*").eq("id", id).single();
    if (!suggestion.data) return sendError(res, "Suggestion not found", 404);
    const { data, error } = await supabase.from("suggestions").update({ status, admin_notes, admin_reply, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    if (admin_reply) {
      await supabase.from("notifications").insert({
        user_id: suggestion.data.user_id,
        title: "Suggestion Updated",
        message: `Your suggestion "${suggestion.data.title}" has been updated. ${admin_reply}`,
        type: "info",
        category: "system",
        reference_type: "suggestion",
        reference_id: id
      });
    }
    sendSuccess(res, { suggestion: data });
  } catch (err) {
    sendError(res, "Failed to update suggestion");
  }
});
router7.get("/bugs", requireMinRole("support"), async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("bug_reports").select("*, users!bug_reports_user_id_fkey(display_name, avatar_url, email)", { count: "exact" });
    if (status) query = query.eq("status", status);
    if (priority) query = query.eq("priority", priority);
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { bugs: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load bug reports");
  }
});
router7.put("/bugs/:id", requireMinRole("editor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("bug_reports").update({ ...req.body, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { bug: data });
  } catch (err) {
    sendError(res, "Failed to update bug report");
  }
});
router7.get("/messages", requireMinRole("support"), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("contact_messages").select("*", { count: "exact" });
    if (status) query = query.eq("status", status);
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { messages: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load messages");
  }
});
router7.put("/messages/:id", requireMinRole("support"), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_reply } = req.body;
    const update = { status };
    if (admin_reply) {
      update.admin_reply = admin_reply;
      update.replied_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    const { data, error } = await supabase.from("contact_messages").update(update).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { message: data });
  } catch (err) {
    sendError(res, "Failed to update message");
  }
});
router7.get("/announcements", requireMinRole("support"), async (req, res) => {
  try {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    sendSuccess(res, { announcements: data || [] });
  } catch (err) {
    sendError(res, "Failed to load announcements");
  }
});
router7.post("/announcements", requireMinRole("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase.from("announcements").insert({ ...req.body, created_by: req.adminUser.id }).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "create",
      entity_type: "announcement",
      entity_id: data.id
    });
    sendSuccess(res, { announcement: data });
  } catch (err) {
    sendError(res, "Failed to create announcement");
  }
});
router7.put("/announcements/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("announcements").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { announcement: data });
  } catch (err) {
    sendError(res, "Failed to update announcement");
  }
});
router7.delete("/announcements/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) throw error;
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete announcement");
  }
});
router7.get("/activity", requireMinRole("support"), async (req, res) => {
  try {
    const { action, entity_type, user_id, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("activity_logs").select("*, users!activity_logs_user_id_fkey(display_name, avatar_url)", { count: "exact" });
    if (action) query = query.eq("action", action);
    if (entity_type) query = query.eq("entity_type", entity_type);
    if (user_id) query = query.eq("user_id", user_id);
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { logs: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load activity logs");
  }
});
router7.get("/settings", requireMinRole("admin"), async (req, res) => {
  try {
    const { category } = req.query;
    let query = supabase.from("site_settings").select("*");
    if (category) query = query.eq("category", category);
    const { data, error } = await query.order("key");
    if (error) throw error;
    sendSuccess(res, { settings: data || [] });
  } catch (err) {
    sendError(res, "Failed to load settings");
  }
});
router7.put("/settings", requireMinRole("admin"), async (req, res) => {
  try {
    const { settings } = req.body;
    const updates = Object.entries(settings).map(
      ([key, value]) => supabase.from("site_settings").upsert({ key, value, updated_by: req.adminUser.id, updated_at: (/* @__PURE__ */ new Date()).toISOString() }, { onConflict: "key" })
    );
    await Promise.all(updates);
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "update",
      entity_type: "settings",
      details: { keys: Object.keys(settings) }
    });
    sendSuccess(res, { updated: true });
  } catch (err) {
    sendError(res, "Failed to update settings");
  }
});
router7.get("/features", requireMinRole("support"), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("feature_requests").select("*, users!feature_requests_user_id_fkey(display_name, avatar_url)", { count: "exact" });
    if (status) query = query.eq("status", status);
    const { data, count, error } = await query.order("vote_count", { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { features: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load feature requests");
  }
});
router7.put("/features/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("feature_requests").update({ ...req.body, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    sendSuccess(res, { feature: data });
  } catch (err) {
    sendError(res, "Failed to update feature request");
  }
});
router7.get("/reports", requireMinRole("support"), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("template_reports").select("*, users!template_reports_reporter_id_fkey(display_name), design_marketplace!template_reports_template_id_fkey(title)", { count: "exact" });
    if (status) query = query.eq("status", status);
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(offset, offset + Number(limit) - 1);
    if (error) throw error;
    sendSuccess(res, { reports: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load reports");
  }
});
router7.get("/backups", requireMinRole("admin"), async (req, res) => {
  try {
    const { data, error } = await supabase.from("backups").select("*").order("created_at", { ascending: false }).limit(20);
    if (error) throw error;
    sendSuccess(res, { backups: data || [] });
  } catch (err) {
    sendError(res, "Failed to load backups");
  }
});
router7.post("/backups", requireMinRole("super_admin"), async (req, res) => {
  try {
    const { name, type } = req.body;
    const { data, error } = await supabase.from("backups").insert({
      name: name || `Backup ${(/* @__PURE__ */ new Date()).toISOString()}`,
      type: type || "database",
      status: "completed",
      created_by: req.adminUser.id
    }).select().single();
    if (error) throw error;
    await supabase.from("activity_logs").insert({
      user_id: req.adminUser.id,
      action: "export",
      entity_type: "settings",
      details: { backup_id: data.id, type }
    });
    sendSuccess(res, { backup: data });
  } catch (err) {
    sendError(res, "Failed to create backup");
  }
});
router7.get("/notifications/:userId", requireMinRole("support"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    sendSuccess(res, { notifications: data || [] });
  } catch (err) {
    sendError(res, "Failed to load notifications");
  }
});
router7.post("/notifications", requireMinRole("admin"), async (req, res) => {
  try {
    const { user_id, title, message, type, category, target } = req.body;
    if (target === "all") {
      const { data: users } = await supabase.from("users").select("id");
      if (users) {
        const notifications = users.map((u) => ({ user_id: u.id, title, message, type: type || "info", category: category || "announcement" }));
        await supabase.from("notifications").insert(notifications);
      }
    } else if (target === "premium") {
      const { data: users } = await supabase.from("users").select("id").in("role", ["admin", "super_admin"]);
      if (users) {
        const notifications = users.map((u) => ({ user_id: u.id, title, message, type: type || "info", category: category || "announcement" }));
        await supabase.from("notifications").insert(notifications);
      }
    } else if (user_id) {
      await supabase.from("notifications").insert({ user_id, title, message, type: type || "info", category: category || "system" });
    }
    sendSuccess(res, { sent: true });
  } catch (err) {
    sendError(res, "Failed to send notification");
  }
});
var admin_default = router7;

// server/routes/assets.ts
init_supabase();
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/", async (req, res) => {
  try {
    const { asset_type, category, subcategory, search, tags, module, premium, featured, visibility, sort = "created_at", order = "desc", page = 1, limit = 50, pinned } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("assets").select("*", { count: "exact" });
    if (asset_type) query = query.eq("asset_type", asset_type);
    if (category) query = query.eq("category", category);
    if (subcategory) query = query.eq("subcategory", subcategory);
    if (premium === "true") query = query.eq("is_premium", true);
    if (premium === "false") query = query.eq("is_premium", false);
    if (featured === "true") query = query.eq("is_featured", true);
    if (visibility) query = query.eq("visibility", visibility);
    if (pinned === "true") query = query.eq("is_pinned", true);
    if (module) query = query.contains("supported_modules", [module]);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (tags) {
      const tagArr = tags.split(",");
      query = query.overlaps("tags", tagArr);
    }
    const sortField = sort === "usage" ? "usage_count" : sort === "name" ? "name" : sort === "updated" ? "updated_at" : "created_at";
    query = query.order(sortField, { ascending: order === "asc" });
    query = query.range(offset, offset + Number(limit) - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    sendSuccess(res, { assets: data || [], total: count || 0, page: Number(page), limit: Number(limit) });
  } catch (err) {
    sendError(res, "Failed to load assets");
  }
});
router8.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase.from("assets").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    sendSuccess(res, { asset: data });
  } catch (err) {
    sendError(res, "Asset not found", 404);
  }
});
router8.post("/", requireMinRole("editor"), async (req, res) => {
  try {
    const { name, slug, description, asset_type, subcategory, category, data, tags, version, is_premium, is_featured, visibility, supported_modules, preview_url, thumbnail_url, preview_html, file_type, file_size } = req.body;
    const assetSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data: asset, error } = await supabase.from("assets").insert({
      name,
      slug: assetSlug,
      description,
      asset_type,
      subcategory: subcategory || "general",
      category: category || "general",
      data: data || {},
      tags: tags || [],
      version: version || "1.0.0",
      is_premium: is_premium || false,
      is_featured: is_featured || false,
      visibility: visibility || "public",
      supported_modules: supported_modules || [],
      preview_url,
      thumbnail_url,
      preview_html,
      file_type,
      file_size: file_size || 0,
      created_by: req.adminUser?.id
    }).select().single();
    if (error) throw error;
    sendSuccess(res, { asset });
  } catch (err) {
    sendError(res, err.message || "Failed to create asset");
  }
});
router8.put("/:id", requireMinRole("editor"), async (req, res) => {
  try {
    const updates = {};
    const allowed = ["name", "slug", "description", "asset_type", "subcategory", "category", "data", "tags", "version", "is_premium", "is_featured", "is_active", "is_pinned", "visibility", "supported_modules", "preview_url", "thumbnail_url", "preview_html", "file_type", "file_size"];
    for (const key of allowed) {
      if (req.body[key] !== void 0) updates[key] = req.body[key];
    }
    updates.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const { data, error } = await supabase.from("assets").update(updates).eq("id", req.params.id).select().single();
    if (error) throw error;
    sendSuccess(res, { asset: data });
  } catch (err) {
    sendError(res, "Failed to update asset");
  }
});
router8.delete("/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { count } = await supabase.from("asset_usage").select("*", { count: "exact", head: true }).eq("asset_id", req.params.id);
    if (count && count > 0) {
      return sendError(res, `This asset is used by ${count} template(s). Remove it from templates first or force delete.`, 409);
    }
    const { error } = await supabase.from("assets").delete().eq("id", req.params.id);
    if (error) throw error;
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete asset");
  }
});
router8.delete("/:id/force", requireMinRole("admin"), async (req, res) => {
  try {
    await supabase.from("asset_usage").delete().eq("asset_id", req.params.id);
    await supabase.from("asset_collection_items").delete().eq("asset_id", req.params.id);
    await supabase.from("asset_versions").delete().eq("asset_id", req.params.id);
    await supabase.from("asset_favorites").delete().eq("asset_id", req.params.id);
    const { error } = await supabase.from("assets").delete().eq("id", req.params.id);
    if (error) throw error;
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to force delete asset");
  }
});
router8.post("/bulk", requireMinRole("editor"), async (req, res) => {
  try {
    const { ids, action, value } = req.body;
    if (!ids || !Array.isArray(ids) || !action) return sendError(res, "Missing ids or action");
    let updates = {};
    if (action === "premium") updates.is_premium = value;
    if (action === "featured") updates.is_featured = value;
    if (action === "active") updates.is_active = value;
    if (action === "visibility") updates.visibility = value;
    if (action === "pinned") updates.is_pinned = value;
    if (action === "category") updates.category = value;
    if (action === "delete") {
      await supabase.from("assets").delete().in("id", ids);
      return sendSuccess(res, { deleted: ids.length });
    }
    updates.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const { error } = await supabase.from("assets").update(updates).in("id", ids);
    if (error) throw error;
    sendSuccess(res, { updated: ids.length });
  } catch (err) {
    sendError(res, "Bulk operation failed");
  }
});
router8.get("/:id/versions", async (req, res) => {
  try {
    const { data, error } = await supabase.from("asset_versions").select("*").eq("asset_id", req.params.id).order("version_number", { ascending: false });
    if (error) throw error;
    sendSuccess(res, { versions: data || [] });
  } catch (err) {
    sendError(res, "Failed to load versions");
  }
});
router8.post("/:id/versions", requireMinRole("editor"), async (req, res) => {
  try {
    const { data: asset } = await supabase.from("assets").select("id, data, version, name").eq("id", req.params.id).single();
    if (!asset) return sendError(res, "Asset not found", 404);
    const { count } = await supabase.from("asset_versions").select("*", { count: "exact", head: true }).eq("asset_id", req.params.id);
    const versionNumber = (count || 0) + 1;
    const { data, error } = await supabase.from("asset_versions").insert({
      asset_id: req.params.id,
      version_number: versionNumber,
      data: asset.data,
      name: asset.name,
      description: req.body.description || `Version ${versionNumber}`,
      created_by: req.adminUser?.id
    }).select().single();
    if (error) throw error;
    sendSuccess(res, { version: data });
  } catch (err) {
    sendError(res, "Failed to create version");
  }
});
router8.post("/:id/versions/restore/:versionId", requireMinRole("editor"), async (req, res) => {
  try {
    const { data: version } = await supabase.from("asset_versions").select("*").eq("id", req.params.versionId).eq("asset_id", req.params.id).single();
    if (!version) return sendError(res, "Version not found", 404);
    const { error } = await supabase.from("assets").update({ data: version.data, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", req.params.id);
    if (error) throw error;
    sendSuccess(res, { restored: true });
  } catch (err) {
    sendError(res, "Failed to restore version");
  }
});
router8.get("/:id/usage", async (req, res) => {
  try {
    const { data, count } = await supabase.from("asset_usage").select("*", { count: "exact" }).eq("asset_id", req.params.id).order("used_at", { ascending: false }).limit(50);
    sendSuccess(res, { usage: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load usage");
  }
});
router8.post("/track", async (req, res) => {
  try {
    const { asset_id, entity_type, entity_id } = req.body;
    if (!asset_id || !entity_type || !entity_id) return sendError(res, "Missing required fields");
    await supabase.from("asset_usage").insert({ asset_id, entity_type, entity_id });
    await supabase.rpc("increment_column", { table_name: "assets", column_name: "usage_count", row_id: asset_id }).then(() => {
    }).catch(() => {
      supabase.from("assets").update({ usage_count: 0 }).eq("id", asset_id);
    });
    sendSuccess(res, { tracked: true });
  } catch (err) {
    sendError(res, "Failed to track usage");
  }
});
router8.get("/collections/all", async (req, res) => {
  try {
    const { data, error } = await supabase.from("asset_collections").select("*").eq("is_active", true).order("sort_order");
    if (error) throw error;
    sendSuccess(res, { collections: data || [] });
  } catch (err) {
    sendError(res, "Failed to load collections");
  }
});
router8.post("/collections", requireMinRole("editor"), async (req, res) => {
  try {
    const { name, slug, description, icon, color, is_premium } = req.body;
    const collectionSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase.from("asset_collections").insert({ name, slug: collectionSlug, description, icon, color, is_premium, created_by: req.adminUser?.id }).select().single();
    if (error) throw error;
    sendSuccess(res, { collection: data });
  } catch (err) {
    sendError(res, "Failed to create collection");
  }
});
router8.put("/collections/:id", requireMinRole("editor"), async (req, res) => {
  try {
    const { data, error } = await supabase.from("asset_collections").update(req.body).eq("id", req.params.id).select().single();
    if (error) throw error;
    sendSuccess(res, { collection: data });
  } catch (err) {
    sendError(res, "Failed to update collection");
  }
});
router8.delete("/collections/:id", requireMinRole("admin"), async (req, res) => {
  try {
    const { error } = await supabase.from("asset_collections").delete().eq("id", req.params.id);
    if (error) throw error;
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete collection");
  }
});
router8.post("/collections/:id/assets", requireMinRole("editor"), async (req, res) => {
  try {
    const { asset_ids } = req.body;
    const items = asset_ids.map((aid, i) => ({ collection_id: req.params.id, asset_id: aid, sort_order: i }));
    const { error } = await supabase.from("asset_collection_items").upsert(items);
    if (error) throw error;
    sendSuccess(res, { added: asset_ids.length });
  } catch (err) {
    sendError(res, "Failed to add assets to collection");
  }
});
router8.delete("/collections/:id/assets/:assetId", requireMinRole("editor"), async (req, res) => {
  try {
    const { error } = await supabase.from("asset_collection_items").delete().eq("collection_id", req.params.id).eq("asset_id", req.params.assetId);
    if (error) throw error;
    sendSuccess(res, { removed: true });
  } catch (err) {
    sendError(res, "Failed to remove asset from collection");
  }
});
router8.get("/export/:collectionId", requireMinRole("editor"), async (req, res) => {
  try {
    const { data: collection } = await supabase.from("asset_collections").select("*").eq("id", req.params.collectionId).single();
    if (!collection) return sendError(res, "Collection not found", 404);
    const { data: items } = await supabase.from("asset_collection_items").select("asset_id, sort_order").eq("collection_id", req.params.collectionId);
    if (!items || items.length === 0) return sendSuccess(res, { export: { collection, assets: [] } });
    const { data: assets } = await supabase.from("assets").select("*").in("id", items.map((i) => i.asset_id));
    sendSuccess(res, { export: { collection, assets: assets || [] } });
  } catch (err) {
    sendError(res, "Failed to export");
  }
});
router8.post("/import", requireMinRole("editor"), async (req, res) => {
  try {
    const { collection, assets } = req.body;
    if (!assets || !Array.isArray(assets)) return sendError(res, "Missing assets array");
    let collectionId = collection?.id;
    if (collection) {
      const { data: existingCol } = await supabase.from("asset_collections").select("id").eq("slug", collection.slug).single();
      if (existingCol) {
        collectionId = existingCol.id;
      } else {
        const { data: newCol } = await supabase.from("asset_collections").insert({ ...collection, created_by: req.adminUser?.id }).select().single();
        collectionId = newCol?.id;
      }
    }
    const importedIds = [];
    for (const asset of assets) {
      const { slug, ...rest } = asset;
      const assetSlug = (slug || rest.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data: existing } = await supabase.from("assets").select("id").eq("slug", assetSlug).single();
      if (existing) {
        importedIds.push(existing.id);
        continue;
      }
      const { data: created } = await supabase.from("assets").insert({ ...rest, slug: assetSlug, created_by: req.adminUser?.id }).select().single();
      if (created) importedIds.push(created.id);
    }
    if (collectionId && importedIds.length > 0) {
      const items = importedIds.map((aid, i) => ({ collection_id: collectionId, asset_id: aid, sort_order: i }));
      await supabase.from("asset_collection_items").upsert(items);
    }
    sendSuccess(res, { imported: importedIds.length });
  } catch (err) {
    sendError(res, "Failed to import");
  }
});
router8.get("/stats/overview", requireMinRole("viewer"), async (req, res) => {
  try {
    const { count: total } = await supabase.from("assets").select("*", { count: "exact", head: true });
    const { data: byType } = await supabase.from("assets").select("asset_type").then((r) => {
      const map = {};
      r.data?.forEach((a) => {
        map[a.asset_type] = (map[a.asset_type] || 0) + 1;
      });
      return { data: map };
    });
    const { count: collections } = await supabase.from("asset_collections").select("*", { count: "exact", head: true });
    const { data: topUsed } = await supabase.from("assets").select("name, usage_count, asset_type").order("usage_count", { ascending: false }).limit(10);
    sendSuccess(res, { total: total || 0, byType: byType || {}, collections: collections || 0, topUsed: topUsed || [] });
  } catch (err) {
    sendError(res, "Failed to load stats");
  }
});
var assets_default = router8;

// server/routes/upload.ts
init_supabase();
import { Router as Router9 } from "express";
var router9 = Router9();
router9.post("/image", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, "Unauthorized", 401);
    const { file, name, isPublic } = req.body;
    if (!file) return sendError(res, "No file data provided");
    const buffer = Buffer.from(file, "base64");
    const ext = name?.split(".").pop() || "png";
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("uploads").upload(filePath, buffer, { contentType: `image/${ext}`, upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(filePath);
    const { data: fileRecord } = await supabase.from("uploaded_files").insert({
      user_id: user.id,
      name: name || filePath.split("/").pop(),
      url: urlData.publicUrl,
      mime_type: `image/${ext}`,
      file_size: buffer.length,
      is_public: isPublic !== false,
      bucket: "uploads",
      path: filePath
    }).select().single();
    sendSuccess(res, { file: fileRecord || { url: urlData.publicUrl, path: filePath } });
  } catch (err) {
    sendError(res, err.message || "Upload failed");
  }
});
router9.post("/file", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, "Unauthorized", 401);
    const { file, name, mimeType, isPublic } = req.body;
    if (!file) return sendError(res, "No file data provided");
    const buffer = Buffer.from(file, "base64");
    const ext = name?.split(".").pop() || "bin";
    const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("uploads").upload(filePath, buffer, { contentType: mimeType || "application/octet-stream", upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(filePath);
    const { data: fileRecord } = await supabase.from("uploaded_files").insert({
      user_id: user.id,
      name: name || filePath.split("/").pop(),
      url: urlData.publicUrl,
      mime_type: mimeType || `application/${ext}`,
      file_size: buffer.length,
      is_public: isPublic === true,
      bucket: "uploads",
      path: filePath
    }).select().single();
    sendSuccess(res, { file: fileRecord || { url: urlData.publicUrl, path: filePath } });
  } catch (err) {
    sendError(res, err.message || "Upload failed");
  }
});
router9.get("/files", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, "Unauthorized", 401);
    const { page = 1, limit = 50, bucket } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = supabase.from("uploaded_files").select("*", { count: "exact" }).eq("user_id", user.id);
    if (bucket) query = query.eq("bucket", bucket);
    query = query.order("created_at", { ascending: false }).range(offset, offset + Number(limit) - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    sendSuccess(res, { files: data || [], total: count || 0 });
  } catch (err) {
    sendError(res, "Failed to load files");
  }
});
router9.delete("/files/:id", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, "Unauthorized", 401);
    const { data: file } = await supabase.from("uploaded_files").select("*").eq("id", req.params.id).eq("user_id", user.id).single();
    if (!file) return sendError(res, "File not found", 404);
    if (file.path) {
      await supabase.storage.from(file.bucket || "uploads").remove([file.path]);
    }
    await supabase.from("uploaded_files").delete().eq("id", req.params.id);
    sendSuccess(res, { deleted: true });
  } catch (err) {
    sendError(res, "Failed to delete file");
  }
});
router9.put("/files/:id", authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, "Unauthorized", 401);
    const { name, isPublic } = req.body;
    const updates = {};
    if (name !== void 0) updates.name = name;
    if (isPublic !== void 0) updates.is_public = isPublic;
    updates.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const { data, error } = await supabase.from("uploaded_files").update(updates).eq("id", req.params.id).eq("user_id", user.id).select().single();
    if (error) throw error;
    sendSuccess(res, { file: data });
  } catch (err) {
    sendError(res, "Failed to update file");
  }
});
var upload_default = router9;

// server/index.ts
var app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      config.CORS_ORIGIN,
      "http://localhost:8887",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(addRequestMetadata);
app.get("/health", (req, res) => {
  sendSuccess(res, { status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/version", (req, res) => {
  sendSuccess(res, { version: "1.0.0", environment: config.NODE_ENV });
});
app.use("/api/pages", pages_default);
app.use("/api/links", links_default);
app.use("/api/qrcodes", qrcodes_default);
app.use("/api/qr", qrcodes_default);
app.use("/api/nfc", nfc_default);
app.use("/api/analytics", analytics_default);
app.use("/api/dashboard", dashboard_default);
app.use("/api/admin", admin_default);
app.use("/api/assets", assets_default);
app.use("/api/upload", upload_default);
app.get("/r/:code", (req, res) => {
  res.status(302).redirect("/");
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});
app.use(errorHandler);
if (process.env.VERCEL !== "1") {
  const PORT = config.PORT;
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      environment: config.NODE_ENV,
      corsOrigin: config.CORS_ORIGIN
    });
  });
  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });
  process.on("SIGINT", () => {
    logger.info("SIGINT signal received: closing HTTP server");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });
}
var index_default = app;
export {
  index_default as default
};
