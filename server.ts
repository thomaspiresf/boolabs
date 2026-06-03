import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { defaultPosts } from "./src/lib/defaultPosts";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "boolabs-super-secret-key-2026";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Supabase if variables are configured in the environment
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const isSupabaseEnabled = !!(supabaseUrl && supabaseKey);
  const supabase = isSupabaseEnabled ? createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }) : null;

  // Seed first admin user to Supabase on startup
  const seedSupabaseUsersIfEmpty = async () => {
    if (!isSupabaseEnabled || !supabase) return;
    try {
      const { data, error } = await supabase.from("admin_users").select("id").limit(1);
      if (!error && (!data || data.length === 0)) {
        console.log("Seeding initial admin user kelvim@boolabs.com.br to Supabase...");
        const defaultPassword = process.env.BLOG_ADMIN_PASSWORD || "booadmin123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await supabase.from("admin_users").insert([{
          id: "u1",
          email: "kelvim@boolabs.com.br",
          password: hashedPassword,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error("Failed checking / seeding admin users in Supabase on startup:", err);
    }
  };

  // Seed default blog posts to Supabase on startup
  const seedSupabaseBlogPostsIfEmpty = async () => {
    if (!isSupabaseEnabled || !supabase) return;
    try {
      const { data: existingRows, error } = await supabase.from("blog_posts").select("id");
      if (!error) {
        const count = existingRows ? existingRows.length : 0;
        if (count === 0) {
          console.log("Seeding initial blog posts to Supabase...");
          const dbPosts = defaultPosts.map(mapApiPostToDb);
          await supabase.from("blog_posts").insert(dbPosts);
          console.log(`Seeded ${dbPosts.length} blog posts to Supabase successfully.`);
        } else if (count < defaultPosts.length) {
          console.log(`Supabase has ${count} blog posts, but default list holds ${defaultPosts.length}. Seeding outstanding posts...`);
          const existingIds = new Set((existingRows || []).map(r => r.id));
          const outstanding = defaultPosts.filter(p => !existingIds.has(p.id));
          if (outstanding.length > 0) {
            const dbOutstanding = outstanding.map(mapApiPostToDb);
            await supabase.from("blog_posts").insert(dbOutstanding);
            console.log(`Seeded ${dbOutstanding.length} outstanding posts to Supabase.`);
          }
        }
      }
    } catch (err) {
      console.error("Failed seeding blog posts in Supabase on startup:", err);
    }
  };

  if (isSupabaseEnabled) {
    console.log("Supabase initialized successfully on back-end server.");
    seedSupabaseUsersIfEmpty();
    seedSupabaseBlogPostsIfEmpty();
  } else {
    console.log("Supabase credentials missing. Applet continuing in local JSON database mode.");
  }

  // User database mapping helpers
  function mapDbUserToApi(dbUser: any) {
    if (!dbUser) return null;
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password,
      createdAt: dbUser.created_at || dbUser.createdAt || new Date().toISOString()
    };
  }

  function mapApiUserToDb(apiUser: any) {
    if (!apiUser) return null;
    return {
      id: apiUser.id || Math.random().toString(36).substring(2, 9),
      email: apiUser.email,
      password: apiUser.password,
      created_at: apiUser.createdAt || new Date().toISOString()
    };
  }

  // Data mapping helpers to normalize camelCase to database snake_case and back
  function mapDbPostToApi(dbPost: any) {
    if (!dbPost) return null;
    return {
      id: dbPost.id,
      slug: dbPost.slug,
      title: dbPost.title,
      excerpt: dbPost.excerpt,
      content: dbPost.content,
      coverImage: dbPost.cover_image,
      author: dbPost.author,
      category: dbPost.category,
      tags: dbPost.tags || [],
      featured: !!dbPost.featured,
      published: !!dbPost.published,
      publishedAt: dbPost.published_at || dbPost.created_at || new Date().toISOString(),
      seoTitle: dbPost.seo_title,
      seoDescription: dbPost.seo_description,
      readingTime: dbPost.reading_time || Math.ceil((dbPost.content || "").length / 1000) || 5
    };
  }

  function mapApiPostToDb(apiPost: any) {
    if (!apiPost) return null;
    return {
      id: apiPost.id || Math.random().toString(36).substring(2, 9),
      slug: apiPost.slug || apiPost.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      title: apiPost.title,
      excerpt: apiPost.excerpt,
      content: apiPost.content,
      cover_image: apiPost.coverImage,
      author: apiPost.author || 'Thomas Pires',
      category: apiPost.category,
      tags: apiPost.tags || [],
      featured: !!apiPost.featured,
      published: !!apiPost.published,
      published_at: apiPost.publishedAt || new Date().toISOString(),
      seo_title: apiPost.seoTitle || apiPost.title,
      seo_description: apiPost.seoDescription || apiPost.excerpt
    };
  }

  function mapDbLeadToApi(dbLead: any) {
    if (!dbLead) return null;
    return {
      id: dbLead.id,
      name: dbLead.name,
      email: dbLead.email,
      message: dbLead.message,
      cta: dbLead.cta,
      timestamp: dbLead.timestamp || dbLead.created_at || new Date().toISOString(),
      status: dbLead.status || 'Novo',
      notes: dbLead.notes || ''
    };
  }

  function mapApiLeadToDb(apiLead: any) {
    if (!apiLead) return null;
    return {
      id: apiLead.id || Math.random().toString(36).substring(2, 9),
      name: apiLead.name,
      email: apiLead.email,
      message: apiLead.message || '',
      cta: apiLead.cta || 'Organizar meus dados',
      timestamp: apiLead.timestamp || new Date().toISOString(),
      status: apiLead.status || 'Novo',
      notes: apiLead.notes || ''
    };
  }

  // Helper to send email to user
  const sendEmail = async (to: string, subject: string, html: string, text: string) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'no-reply@boolabs.com.br';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"boo - Plataforma" <${smtpFrom}>`,
          to,
          subject,
          text,
          html,
        });
        console.log(`[EMAIL] Email sent successfully to ${to}`);
        return true;
      } catch (err) {
        console.error(`[EMAIL] Error sending email to ${to}:`, err);
        return false;
      }
    } else {
      console.log(`\n======================================================`);
      console.log(`[SIMULATED E-MAIL DISPATCH] (SMTP NOT CONFIGURED)`);
      console.log(`Para: ${to}`);
      console.log(`Assunto: ${subject}`);
      console.log(`Mensagem de Texto:`);
      console.log(text);
      console.log(`======================================================\n`);
      return true;
    }
  };

  // JSON Body Parser for blog content & base64 cover images
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  // File system persistent path for blog JSON, leads JSON and admin users JSON
  const DATA_DIR = path.join(process.cwd(), "data");
  const DATA_FILE = path.join(DATA_DIR, "blog-posts.json");
  const LEADS_FILE = path.join(DATA_DIR, "leads.json");
  const ADMIN_USERS_FILE = path.join(DATA_DIR, "admin-users.json");

  // In-memory array initialize
  let postsList = [...defaultPosts];
  let leadsList: any[] = [];
  let adminUsersList: any[] = [];
  let activeResetTokens: Record<string, string> = {};

  // Load from files if exists, or seed if empty
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, "utf-8");
      postsList = JSON.parse(fileData);
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPosts, null, 2), "utf-8");
    }

    if (fs.existsSync(LEADS_FILE)) {
      const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
      leadsList = JSON.parse(leadsData);
    } else {
      fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
    }

    if (fs.existsSync(ADMIN_USERS_FILE)) {
      const usersData = fs.readFileSync(ADMIN_USERS_FILE, "utf-8");
      adminUsersList = JSON.parse(usersData);
    } else {
      const initialUser = {
        id: "u1",
        email: "kelvim@boolabs.com.br",
        password: process.env.BLOG_ADMIN_PASSWORD || "booadmin123",
        createdAt: new Date().toISOString()
      };
      fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify([initialUser], null, 2), "utf-8");
      adminUsersList = [initialUser];
    }
  } catch (err) {
    console.error("Failed to initialize file databases, using in-memory:", err);
  }

  // Helper to save current postsList state
  const savePosts = () => {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(postsList, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write blog posts updates to disk:", err);
    }
  };

  // Helper to save admin users state
  const saveAdminUsers = () => {
    try {
      fs.writeFileSync(ADMIN_USERS_FILE, JSON.stringify(adminUsersList, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write admin users state to disk:", err);
    }
  };

  // Helper to save current leadsList state
  const saveLeads = () => {
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(leadsList, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write leads updates to disk:", err);
    }
  };

  // API: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API: Supabase Connection Test Dynamic Diagnostics
  app.get("/api/supabase-status", async (req, res) => {
    const maskedUrl = supabaseUrl 
      ? (supabaseUrl.length > 20 ? `${supabaseUrl.substring(0, 15)}...` : supabaseUrl)
      : "Not Provided";
    const maskedKey = supabaseKey 
      ? (supabaseKey.length > 12 ? `${supabaseKey.substring(0, 6)}...${supabaseKey.substring(supabaseKey.length - 6)}` : "Provided")
      : "Not Provided";

    const statusInfo: any = {
      isConfigured: isSupabaseEnabled,
      url: maskedUrl,
      keyProvided: !!supabaseKey,
      keySnippet: maskedKey,
      tablesStatus: {}
    };

    if (!isSupabaseEnabled || !supabase) {
      res.json({
        success: false,
        message: "A integração com o Supabase está inativa porque a URL ou a Chave de Serviço (Service Role Key) não foram configuradas nas variáveis de ambiente (.env).",
        status: statusInfo
      });
      return;
    }

    try {
      // 1. Test leads table read
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("id")
        .limit(1);

      statusInfo.tablesStatus.leads = {
        accessible: !leadsError,
        error: leadsError ? leadsError.message : null,
        rowsCount: leadsData ? leadsData.length : 0
      };

      // 2. Test blog_posts table read
      const { data: postsData, error: postsError } = await supabase
        .from("blog_posts")
        .select("id")
        .limit(1);

      statusInfo.tablesStatus.blog_posts = {
        accessible: !postsError,
        error: postsError ? postsError.message : null,
        rowsCount: postsData ? postsData.length : 0
      };

      // 3. Test admin_users table read
      const { data: usersData, error: usersError } = await supabase
        .from("admin_users")
        .select("id")
        .limit(1);

      statusInfo.tablesStatus.admin_users = {
        accessible: !usersError,
        error: usersError ? usersError.message : null,
        rowsCount: usersData ? usersData.length : 0
      };

      const success = !leadsError && !postsError && !usersError;
      res.json({
        success,
        message: success 
          ? "Conexão com o Supabase estabelecida com sucesso! Todas as 3 tabelas estão acessíveis no banco de dados." 
          : "Cliente Supabase inicializado, mas ocorreu uma falha de acesso a uma ou mais tabelas. Verifique se a query SQL foi executada corretamente no dashboard e se as tabelas (leads, blog_posts, admin_users) existem.",
        status: statusInfo
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Erro interno no servidor ao tentar se comunicar com o Supabase.",
        error: err.message,
        status: statusInfo
      });
    }
  });

  // ========== BLOG CMS SERVER ENDPOINTS ==========

  const getEmailFromToken = (token: string) => {
    if (!token) return null;
    try {
      // First try to verify as a secure JWT
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.email) return decoded.email;
    } catch (err) {
      // Fallback for legacy base64 tokens during transition
      if (token.startsWith("token_user:")) {
        try {
          const base64Email = token.split("token_user:")[1];
          return Buffer.from(base64Email, "base64").toString("utf-8");
        } catch {
          return null;
        }
      }
      return null;
    }
    return null;
  };

  // Authentication Middleware
  const authMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Acesso não autorizado. Por favor, faça login." });
      return;
    }
    const token = authHeader.split("Bearer ")[1];
    const email = getEmailFromToken(token);
    if (!email) {
      res.status(401).json({ error: "Sessão inválida. Por favor, faça login novamente." });
      return;
    }

    let userExists = false;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        if (!error && data) {
          userExists = true;
        }
      } catch (err) {
        console.error("Auth verification error via Supabase:", err);
      }
    }

    // Fallback to local
    if (!userExists) {
      userExists = adminUsersList.some(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (userExists) {
      req.adminUserEmail = email;
      next();
    } else {
      res.status(401).json({ error: "Usuário revogado ou sem acesso ativo." });
    }
  };

  // Auth Login API
  app.post("/api/blog/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, error: "Email e senha são obrigatórios." });
      return;
    }

    if (!email.toLowerCase().endsWith("@boolabs.com.br")) {
      res.status(403).json({ success: false, error: "Acesso negado. Apenas emails corporativos (@boolabs.com.br) são permitidos." });
      return;
    }

    let foundUser: any = null;

    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email.toLowerCase())
          .maybeSingle();
        if (!error && data) {
          foundUser = data;
        }
      } catch (err) {
        console.error("Supabase login query error:", err);
      }
    }

    // Fallback or double check in memory
    if (!foundUser) {
      foundUser = adminUsersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (foundUser) {
      // Compare password
      let isValid = false;
      if (foundUser.password.startsWith("$2a$") || foundUser.password.startsWith("$2b$")) {
        isValid = await bcrypt.compare(password, foundUser.password);
      } else {
        // Fallback for old plain-text passwords
        isValid = (foundUser.password === password);
      }

      if (isValid) {
        // Sign secure JWT token
        const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token });
      } else {
        res.status(401).json({ success: false, error: "Email ou senha incorretos." });
      }
    } else {
      res.status(401).json({ success: false, error: "Email ou senha incorretos." });
    }
  });

  // Verify Session Token API
  app.post("/api/blog/auth/verify", async (req, res) => {
    const { token } = req.body;
    if (!token) {
      res.json({ valid: false });
      return;
    }
    const email = getEmailFromToken(token);
    if (!email) {
      res.json({ valid: false });
      return;
    }

    let userExists = false;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", email)
          .maybeSingle();
        if (!error && data) userExists = true;
      } catch (err) {
        console.error("verify Supabase checking error:", err);
      }
    }
    if (!userExists) {
      userExists = adminUsersList.some(u => u.email.toLowerCase() === email.toLowerCase());
    }

    res.json({ valid: userExists, email });
  });

  // ========== ADMIN USERS CRUD ENDPOINTS ==========

  // 1. Get all users
  app.get("/api/admin-users", authMiddleware, async (req: any, res) => {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("*")
          .order("created_at", { ascending: true });
        if (error) throw error;
        res.json((data || []).map(mapDbUserToApi));
        return;
      } catch (err) {
        console.error("Supabase user fetch error:", err);
      }
    }
    res.json(adminUsersList);
  });

  // 2. Create user
  app.post("/api/admin-users", authMiddleware, async (req: any, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email e Senha são obrigatórios." });
      return;
    }

    if (!email.toLowerCase().endsWith("@boolabs.com.br")) {
      res.status(403).json({ error: "O e-mail deve ser corporativo (@boolabs.com.br)." });
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseEnabled && supabase) {
      try {
        const dbRow = mapApiUserToDb(newUser);
        const { error } = await supabase
          .from("admin_users")
          .insert([dbRow]);
        if (error) throw error;
        res.status(201).json(newUser);
        return;
      } catch (err: any) {
        console.error("Supabase user create error:", err);
        res.status(400).json({ error: err.message || "Erro ao salvar no Supabase." });
        return;
      }
    }

    // Check for unique email locally
    const exists = adminUsersList.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      res.status(400).json({ error: "Este email já possui acesso cadastrado." });
      return;
    }

    adminUsersList.unshift(newUser);
    saveAdminUsers();
    res.status(201).json(newUser);
  });

  // 3. Update user
  app.put("/api/admin-users/:id", authMiddleware, async (req: any, res) => {
    const userId = req.params.id;
    const { email, password } = req.body;

    if (isSupabaseEnabled && supabase) {
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existing) {
          const mergedApi = { 
            ...mapDbUserToApi(existing), 
            ...(email ? { email: email.toLowerCase() } : {}), 
            ...(password ? { password } : {}) 
          };
          const dbRow = mapApiUserToDb(mergedApi);

          const { error: updateErr } = await supabase
            .from("admin_users")
            .update(dbRow)
            .eq("id", userId);

          if (updateErr) throw updateErr;
          res.json(mergedApi);
          return;
        }
      } catch (err: any) {
        console.error("Supabase user update error:", err);
        res.status(500).json({ error: err.message });
        return;
      }
    }

    const idx = adminUsersList.findIndex(u => u.id === userId);
    if (idx === -1) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    if (email) {
      const emailLower = email.toLowerCase();
      const anotherExists = adminUsersList.some((u, uIdx) => u.email.toLowerCase() === emailLower && uIdx !== idx);
      if (anotherExists) {
        res.status(400).json({ error: "Este email já possui acesso cadastrado." });
        return;
      }
      adminUsersList[idx].email = emailLower;
    }
    if (password) adminUsersList[idx].password = password;

    saveAdminUsers();
    res.json(adminUsersList[idx]);
  });

  // 4. Delete user
  app.delete("/api/admin-users/:id", authMiddleware, async (req: any, res) => {
    const userId = req.params.id;

    if (isSupabaseEnabled && supabase) {
      try {
        const { error } = await supabase
          .from("admin_users")
          .delete()
          .eq("id", userId);
        if (error) throw error;
        res.json({ success: true });
        return;
      } catch (err: any) {
        console.error("Supabase user delete error:", err);
        res.status(500).json({ error: err.message });
        return;
      }
    }

    const initialLen = adminUsersList.length;
    adminUsersList = adminUsersList.filter(u => u.id !== userId);
    if (adminUsersList.length === initialLen) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }
    saveAdminUsers();
    res.json({ success: true });
  });

  // 5. Send password reset email link
  app.post("/api/admin-users/reset-password", authMiddleware, async (req: any, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email é obrigatório para a redefinição." });
      return;
    }

    const emailLower = email.toLowerCase();
    let userExists = false;

    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", emailLower)
          .maybeSingle();
        if (!error && data) {
          userExists = true;
        }
      } catch (err) {
        console.error("Supabase user search for reset error:", err);
      }
    } else {
      userExists = adminUsersList.some(u => u.email.toLowerCase() === emailLower);
    }

    if (!userExists) {
      res.status(404).json({ error: "Este e-mail não está cadastrado como administrador da plataforma." });
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
    activeResetTokens[resetToken] = emailLower;
    console.log(`[AUTH] Password reset security code generated for ${emailLower}. Code: ${resetToken}`);

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${appUrl}/admin?reset_token=${resetToken}`;

    if (isSupabaseEnabled && supabase) {
      try {
        const passwordSeed = Math.random().toString(36).substring(2, 12);
        if (supabase.auth.admin) {
          await supabase.auth.admin.createUser({
            email: emailLower,
            password: passwordSeed,
            email_confirm: true
          });
          console.log(`[AUTH-SUPABASE-RESET] Ensured user ${emailLower} is created in Supabase Auth.`);
        } else {
          await supabase.auth.signUp({
            email: emailLower,
            password: passwordSeed,
          });
          console.log(`[AUTH-SUPABASE-RESET] Ensured user ${emailLower} is signed up in Supabase Auth.`);
        }
      } catch (err: any) {
        console.log(`[AUTH-SUPABASE-RESET] Info: User check in Supabase Auth logged:`, err.message || err);
      }

      try {
        console.log(`[AUTH-SUPABASE-RESET] Triggering Supabase recovery email for ${emailLower} redirecting to ${resetLink}`);
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailLower, {
          redirectTo: resetLink
        });
        if (resetError) throw resetError;

        res.json({
          success: true,
          message: `As instruções de redefinição foram disparadas pelo Supabase diretamente para o e-mail administrativo ${emailLower}.`,
        });
        return;
      } catch (supaMailErr: any) {
        console.error(`[AUTH-SUPABASE-RESET] Supabase failed sending recovery email:`, supaMailErr);
        res.status(500).json({ error: `O Supabase não conseguiu enviar o e-mail: ${supaMailErr.message || supaMailErr}. Verifique suas configurações de autenticação no painel do Supabase.` });
        return;
      }
    }

    const mailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
    .logo { font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 24px; }
    .title { font-size: 20px; color: #0f172a; font-weight: 600; margin-bottom: 16px; }
    .button-container { margin: 32px 0; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; transition: background-color 0.2s; }
    .token-box { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; font-family: monospace; font-size: 16px; border-radius: 8px; display: inline-block; letter-spacing: 1px; color: #1e293b; margin: 16px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo" style="font-weight: bold; font-family: sans-serif; font-size: 24px; letter-spacing: -0.5px; color: #0f172a;">boo</div>
    <div class="title" style="font-size: 20px; margin-top: 20px; margin-bottom: 15px; font-weight: bold; color: #1e293b;">Seu Acesso Administrativo foi Redefinido</div>
    <p>Olá,</p>
    <p>Um administrador da plataforma da <strong>boo</strong> iniciou um processo de redefinição de senha para sua conta administrativa.</p>
    <p>Por favor, clique no botão seguro abaixo para cadastrar suas novas credenciais de acesso:</p>
    <div class="button-container" style="margin: 25px 0;">
      <a href="${resetLink}" class="btn" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Cadastrar Nova Senha</a>
    </div>
    <p>Caso o botão acima não funcione, você também pode preencher o formulário usando o código de autorização abaixo no formulário da página corporativa:</p>
    <div class="token-box" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; display: inline-block; color: #1e293b;">${resetToken}</div>
    <p>Ou copie o link completo abaixo no seu navegador:</p>
    <p style="font-size: 12px; word-break: break-all; color: #2563eb; font-family: monospace;">${resetLink}</p>
    <div class="footer" style="margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px; font-size: 11px; color: #94a3b8;">
      <p>Este link seguro é de uso único por motivos de segurança cibernética corporativa.</p>
      <p>© 2026 boo inc. Plataforma de Governança Fiscal e Integração de Dados.</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailText = `
boo - Definição de Senha Administrativa

Um administrador iniciou uma redefinição de senha para sua conta na plataforma.

Acesse o link a seguir para cadastrar uma nova senha personalizada:
${resetLink}

Ou utilize a seguinte chave de segurança caso o formulário solicite:
Código: ${resetToken}
    `;

    sendEmail(emailLower, "Definição de nova senha administrativa - boo", mailHtml, mailText);

    res.json({
      success: true,
      message: `As instruções de redefinição e cadastramento de nova senha foram enviadas com sucesso para o e-mail ${emailLower}.`,
    });
  });

  // 6. Public request password reset (unauthenticated)
  app.post("/api/blog/auth/request-reset", async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email é obrigatório." });
      return;
    }
    const emailLower = email.toLowerCase();
    
    let userExists = false;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", emailLower)
          .maybeSingle();
        if (!error && data) userExists = true;
      } catch (err) {
        console.error("Supabase search error for auth request:", err);
      }
    } else {
      userExists = adminUsersList.some(u => u.email.toLowerCase() === emailLower);
    }

    if (!userExists) {
      res.status(404).json({ error: "Este endereço de e-mail não está cadastrado como administrador da plataforma." });
      return;
    }

    const resetToken = Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
    activeResetTokens[resetToken] = emailLower;
    console.log(`[AUTH] Public reset security code generated for ${emailLower}. Code: ${resetToken}`);

    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const resetLink = `${appUrl}/admin?reset_token=${resetToken}`;

    if (isSupabaseEnabled && supabase) {
      try {
        const passwordSeed = Math.random().toString(36).substring(2, 12);
        if (supabase.auth.admin) {
          await supabase.auth.admin.createUser({
            email: emailLower,
            password: passwordSeed,
            email_confirm: true
          });
          console.log(`[AUTH-SUPABASE-RESET] Ensured user ${emailLower} exists in Supabase Auth.`);
        } else {
          await supabase.auth.signUp({
            email: emailLower,
            password: passwordSeed,
          });
          console.log(`[AUTH-SUPABASE-RESET] Ensured user ${emailLower} signed up in Supabase Auth clone.`);
        }
      } catch (err: any) {
        console.log(`[AUTH-SUPABASE-RESET] Info: User check in Supabase Auth logged:`, err.message || err);
      }

      try {
        console.log(`[AUTH-SUPABASE-RESET] Triggering Supabase recovery email for ${emailLower} redirecting to ${resetLink}`);
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(emailLower, {
          redirectTo: resetLink
        });
        if (resetError) throw resetError;

        res.json({
          success: true,
          message: `As instruções de redefinição de segurança foram enviadas com sucesso pelo Supabase para o seu e-mail corporativo.`,
          email: emailLower
        });
        return;
      } catch (supaMailErr: any) {
        console.error(`[AUTH-SUPABASE-RESET] Supabase failed sending recovery email:`, supaMailErr);
        res.status(500).json({ error: `O Supabase não conseguiu enviar o e-mail: ${supaMailErr.message || supaMailErr}. Verifique suas configurações de autenticação no painel do Supabase.` });
        return;
      }
    }

    const mailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
    .logo { font-size: 24px; font-weight: bold; color: #0f172a; margin-bottom: 24px; }
    .title { font-size: 20px; color: #0f172a; font-weight: 600; margin-bottom: 16px; }
    .button-container { margin: 32px 0; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; padding: 12px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; transition: background-color 0.2s; }
    .token-box { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px; font-family: monospace; font-size: 16px; border-radius: 8px; display: inline-block; letter-spacing: 1px; color: #1e293b; margin: 16px 0; }
    .footer { margin-top: 40px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo" style="font-weight: bold; font-family: sans-serif; font-size: 24px; letter-spacing: -0.5px; color: #0f172a;">boo</div>
    <div class="title" style="font-size: 20px; margin-top: 20px; margin-bottom: 15px; font-weight: bold; color: #1e293b;">Recuperação de Acesso Administrativo</div>
    <p>Olá,</p>
    <p>Uma solicitação de redefinição de senha para sua conta de acesso à plataforma da <strong>boo</strong> foi iniciada com sucesso.</p>
    <p>Se você não solicitou este procedimento, por favor desconsidere este e-mail de segurança. Caso contrário, clique no botão abaixo para definir sua nova credencial de acesso:</p>
    <div class="button-container" style="margin: 25px 0;">
      <a href="${resetLink}" class="btn" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
    </div>
    <p>Se preferir, você também pode preencher os formulários utilizando o código de autorização abaixo:</p>
    <div class="token-box" style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; display: inline-block; color: #1e293b;">${resetToken}</div>
    <p>Ou copie o link completo abaixo no seu navegador:</p>
    <p style="font-size: 12px; word-break: break-all; color: #2563eb; font-family: monospace;">${resetLink}</p>
    <div class="footer" style="margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 15px; font-size: 11px; color: #94a3b8;">
      <p>Este link seguro é de uso único e expirará automaticamente após ser utilizado por motivos de segurança.</p>
      <p>© 2026 boo inc. Plataforma de Governança Fiscal e Integração de Dados.</p>
    </div>
  </div>
</body>
</html>
    `;

    const mailText = `
boo - Recuperação de Acesso Administrativo

Acesse o link a seguir para cadastrar uma nova senha:
${resetLink}

Ou utilize a seguinte chave de segurança caso o formulário solicite:
Código: ${resetToken}
    `;

    sendEmail(emailLower, "Recuperação de Acesso Administrativo - boo", mailHtml, mailText);

    res.json({
      success: true,
      message: `As instruções de redefinição de segurança foram enviadas com sucesso para o endereço de e-mail informado. Por favor, verifique sua caixa de entrada.`,
      email: emailLower
    });
  });

  // 7. Public confirm password reset using token (unauthenticated)
  app.post("/api/blog/auth/reset-password-confirm", async (req: any, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ error: "Token e nova senha são obrigatórios." });
      return;
    }

    const email = activeResetTokens[token];
    if (!email) {
      res.status(400).json({ error: "Token de redefinição inválido, expirado ou já utilizado." });
      return;
    }

    let updated = false;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    if (isSupabaseEnabled && supabase) {
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .maybeSingle();

        if (!fetchErr && existing) {
          const mergedApi = { 
            ...mapDbUserToApi(existing), 
            password: hashedPassword 
          };
          const dbRow = mapApiUserToDb(mergedApi);
          const { error: updateErr } = await supabase
            .from("admin_users")
            .update(dbRow)
            .eq("email", email);

          if (!updateErr) {
            updated = true;

            // Sync user password to Supabase Auth
            if (supabase.auth.admin) {
              try {
                const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers();
                if (!listErr && users) {
                  const matchedAuthUser = (users as any[]).find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
                  if (matchedAuthUser) {
                    await supabase.auth.admin.updateUserById(matchedAuthUser.id, {
                      password: newPassword
                    });
                    console.log(`[AUTH-SUPABASE-RESET] Successfully updated/synchronized user password in Supabase Auth for ${email}`);
                  }
                }
              } catch (syncErr: any) {
                console.warn(`[AUTH-SUPABASE-RESET] Warning: Supabase Auth password synchronization failed:`, syncErr.message || syncErr);
              }
            }
          }
        }
      } catch (err) {
        console.error("Supabase user reset confirm error:", err);
      }
    }

    if (!updated) {
      const idx = adminUsersList.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx !== -1) {
        adminUsersList[idx].password = hashedPassword;
        saveAdminUsers();
        updated = true;
      }
    }

    if (updated) {
      delete activeResetTokens[token];
      res.json({ success: true, message: "Sua senha foi redefinida com sucesso! Você já pode fazer o login normalmente com a nova senha." });
    } else {
      res.status(500).json({ error: "Erro interno ao atualizar a senha do usuário." });
    }
  });

  // 1. Get all posts
  app.get("/api/blog/posts", async (req, res) => {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("published_at", { ascending: false });
        if (error) throw error;
        res.json((data || []).map(mapDbPostToApi));
        return;
      } catch (err) {
        console.error("Supabase fetch posts error, falling back to local database:", err);
      }
    }
    res.json(postsList);
  });

  // 2. Get single post by tag, id, etc.
  app.get("/api/blog/posts/:id", async (req, res) => {
    const postId = req.params.id;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", postId)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          res.json(mapDbPostToApi(data));
          return;
        }
      } catch (err) {
        console.error("Supabase single post error:", err);
      }
    }
    const post = postsList.find(p => p.id === postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  });

  // 3. Get single post by slug
  app.get("/api/blog/posts/by-slug/:slug", async (req, res) => {
    const postSlug = req.params.slug;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", postSlug)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          res.json(mapDbPostToApi(data));
          return;
        }
      } catch (err) {
        console.error("Supabase by slug error:", err);
      }
    }
    const post = postsList.find(p => p.slug === postSlug);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(post);
  });

  // 4. Create post (Protected)
  app.post("/api/blog/posts", authMiddleware, async (req, res) => {
    const newPost = req.body;
    if (!newPost || !newPost.title || !newPost.content) {
      res.status(400).json({ error: "Invalid post payload. Title and content are required." });
      return;
    }

    const id = newPost.id || Math.random().toString(36).substring(2, 9);
    const slug = newPost.slug || newPost.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const completedPost = { ...newPost, id, slug, publishedAt: newPost.publishedAt || new Date().toISOString() };

    if (isSupabaseEnabled && supabase) {
      try {
        const dbRow = mapApiPostToDb(completedPost);
        const { error } = await supabase
          .from("blog_posts")
          .insert([dbRow]);
        if (error) throw error;
        res.status(201).json(completedPost);
        return;
      } catch (err) {
        console.error("Supabase create post error:", err);
      }
    }

    postsList.unshift(completedPost);
    savePosts();
    res.status(201).json(completedPost);
  });

  // 5. Update post (Protected)
  app.put("/api/blog/posts/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", postId)
          .maybeSingle();
        if (fetchErr) throw fetchErr;

        if (existing) {
          const mergedApi = { ...mapDbPostToApi(existing), ...req.body };
          const dbRow = mapApiPostToDb(mergedApi);
          
          const { error: updateErr } = await supabase
            .from("blog_posts")
            .update(dbRow)
            .eq("id", postId);
          
          if (updateErr) throw updateErr;
          res.json(mergedApi);
          return;
        }
      } catch (err) {
        console.error("Supabase update post error:", err);
      }
    }

    const idx = postsList.findIndex(p => p.id === postId);
    if (idx === -1) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    const updatedPost = { ...postsList[idx], ...req.body };
    postsList[idx] = updatedPost;
    savePosts();
    res.json(updatedPost);
  });

  // 6. Delete post (Protected)
  app.delete("/api/blog/posts/:id", authMiddleware, async (req, res) => {
    const postId = req.params.id;
    if (isSupabaseEnabled && supabase) {
      try {
        const { error } = await supabase
          .from("blog_posts")
          .delete()
          .eq("id", postId);
        if (error) throw error;
        res.json({ success: true });
        return;
      } catch (err) {
        console.error("Supabase delete error:", err);
      }
    }

    const initialLen = postsList.length;
    postsList = postsList.filter(p => p.id !== postId);
    if (postsList.length === initialLen) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    savePosts();
    res.json({ success: true });
  });

  // ========== LEAD CONTACTS CRM ENDPOINTS ==========

  // 1. Get all leads (Protected)
  app.get("/api/leads", authMiddleware, async (req, res) => {
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("timestamp", { ascending: false });
        if (error) throw error;
        res.json((data || []).map(mapDbLeadToApi));
        return;
      } catch (err) {
        console.error("Supabase leads fetch error:", err);
      }
    }
    res.json(leadsList);
  });

  // 2. Submit new lead (Public)
  app.post("/api/leads", async (req, res) => {
    const { name, email, message, cta } = req.body;
    if (!name || !email) {
      res.status(400).json({ error: "Nome e Email são obrigatórios." });
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const completedLead = {
      id,
      name,
      email,
      message: message || "",
      cta: cta || "Organizar meus dados",
      timestamp: new Date().toISOString(),
      status: "Novo",
      notes: ""
    };

    if (isSupabaseEnabled && supabase) {
      try {
        const dbRow = mapApiLeadToDb(completedLead);
        const { error } = await supabase
          .from("leads")
          .insert([dbRow]);
        if (error) throw error;
        res.status(201).json(completedLead);
        return;
      } catch (err) {
        console.error("Supabase lead create error:", err);
      }
    }

    leadsList.unshift(completedLead);
    saveLeads();
    res.status(201).json(completedLead);
  });

  // 3. Update lead status or notes (Protected)
  app.put("/api/leads/:id", authMiddleware, async (req, res) => {
    const leadId = req.params.id;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("leads")
          .select("*")
          .eq("id", leadId)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existing) {
          const mergedApi = { ...mapDbLeadToApi(existing), ...req.body };
          const dbRow = mapApiLeadToDb(mergedApi);

          const { error: updateErr } = await supabase
            .from("leads")
            .update(dbRow)
            .eq("id", leadId);

          if (updateErr) throw updateErr;
          res.json(mergedApi);
          return;
        }
      } catch (err) {
        console.error("Supabase lead update error:", err);
      }
    }

    const idx = leadsList.findIndex(l => l.id === leadId);
    if (idx === -1) {
      res.status(404).json({ error: "Lead não encontrado" });
      return;
    }
    leadsList[idx] = { ...leadsList[idx], ...req.body };
    saveLeads();
    res.json(leadsList[idx]);
  });

  // 4. Delete lead (Protected)
  app.delete("/api/leads/:id", authMiddleware, async (req, res) => {
    const leadId = req.params.id;
    if (isSupabaseEnabled && supabase) {
      try {
        const { error } = await supabase
          .from("leads")
          .delete()
          .eq("id", leadId);
        if (error) throw error;
        res.json({ success: true });
        return;
      } catch (err) {
        console.error("Supabase lead delete error:", err);
      }
    }

    const initialLen = leadsList.length;
    leadsList = leadsList.filter(l => l.id !== leadId);
    if (leadsList.length === initialLen) {
      res.status(404).json({ error: "Lead não encontrado" });
      return;
    }
    saveLeads();
    res.json({ success: true });
  });

  // 7. Dynamic SEO Sitemap for Blog Articles
  app.get("/sitemap-blog.xml", async (req, res) => {
    const baseUrl = req.get("host") ? `${req.protocol}://${req.get("host")}` : "https://boolabs.com.br";
    
    let activePosts = postsList;
    if (isSupabaseEnabled && supabase) {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true);
        if (!error && data) {
          activePosts = data.map(mapDbPostToApi);
        }
      } catch (err) {
        console.error("Supabase sitemap fetch error:", err);
      }
    }

    const publishedPosts = activePosts.filter(p => p.published);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Core blog path
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/blog</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
    
    // Core routes
    publishedPosts.forEach(post => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(post.publishedAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });
    
    xml += `</urlset>\n`;
    
    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
