# PLAN-supabase-integration.md

> 🤖 **Agent:** `backend-specialist` + `security-auditor`  
> **Project Type:** WEB (Next.js 14 App Router)  
> **Principle:** Frontend is fixed. Backend conforms.  
> **Supabase Project:** `hhaccmbgciaaqhcffzmh` (Zealy/Storely project)  
> **ENV:** `.env.local` ✅ already configured

---

## Overview

Wire the existing Storely frontend to Supabase for authentication and data persistence. Zero UI changes. Every frontend action maps to a Supabase operation. The schema is already deployed and RLS is already enabled on all `storely_*` tables.

---

## Success Criteria

| # | Criterion | How to Verify |
|---|-----------|---------------|
| 1 | Login form calls `supabase.auth.signInWithPassword()` | Sign in and land on `/dashboard` with session |
| 2 | Signup link creates a new Supabase user + profile row | New row in `storely_profiles` after signup |
| 3 | Middleware redirects unauthenticated users from `/dashboard/*` to `/login` | Visiting `/dashboard` without session → `/login` |
| 4 | Logout button calls `supabase.auth.signOut()` | Session cleared, redirect to `/login` |
| 5 | Store creation guard on first login | If no store → upsert into `storely_stores` |
| 6 | Products page reads from and writes to `storely_products` | Add product → row appears in Supabase table |
| 7 | Orders page reads from `storely_orders` | Data displayed = DB data, not mock |
| 8 | Customers page reads from `storely_customers` | Same as above |
| 9 | Discounts page reads/writes `storely_discounts` | Create discount → row in DB |
| 10 | Settings page writes `storely_stores` + `storely_store_settings` | Save → DB updated |
| 11 | RLS isolation — user A cannot read user B's data | Verified by multi-user test |

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | Already in use |
| Auth | Supabase Auth (email/password) | Matches login form fields |
| DB Client | `@supabase/ssr` (server), `@supabase/supabase-js` (client) | Already installed per hooks |
| Storage | Supabase Storage | For product image uploads |
| Middleware | Next.js `middleware.ts` | Already exists — extend it |
| State | React hooks (`useState`, `useCallback`) | Already pattern in codebase |

---

## Existing Infrastructure Inventory

```
src/
├── app/
│   ├── login/page.tsx           ← Form with email+password. Button does router.push('/dashboard') — NEEDS auth call
│   ├── dashboard/
│   │   ├── layout.tsx           ← LogOut button does router.push('/login') — NEEDS signOut call
│   │   ├── page.tsx             ← Static setup checklist (no data binding needed)
│   │   ├── products/page.tsx    ← Uses mock data from @/data/products — NEEDS Supabase swap
│   │   ├── orders/page.tsx      ← Uses mock data — NEEDS Supabase swap
│   │   ├── customers/page.tsx   ← Uses mock data — NEEDS Supabase swap
│   │   ├── discounts/page.tsx   ← Uses mock data — NEEDS Supabase swap
│   │   ├── settings/page.tsx    ← handleSave() is a setTimeout — NEEDS Supabase write
│   │   └── online-store/        ← StoreContext (in-memory) — NEEDS persistence
├── context/StoreContext.tsx     ← In-memory store builder state — NEEDS Supabase persistence
├── hooks/useSupabaseData.ts     ← Already has hooks for all modules (KEEP, extend)
├── middleware.ts                ← Rate-limiting only — NEEDS auth guard added
└── lib/
    └── utils.ts                 ← Minimal — supabase client helpers needed
```

---

## Supabase Schema Summary (Already Deployed)

```
storely_profiles      → Links to auth.users (id = auth user id)
storely_stores        → One per vendor. owner_id → auth.users.id
storely_products      → store_id FK
storely_orders        → store_id FK
storely_customers     → store_id FK
storely_discounts     → store_id FK
storely_domains       → store_id FK
storely_store_settings→ store_id PK (one-to-one)
storely_product_images→ product_id FK
storely_order_items   → order_id FK
```

> All `storely_*` tables have RLS enabled ✅

---

## Task Breakdown

---

### PHASE 0 — FOUNDATION (Blocking all others)

#### T-01: Create Supabase Client Helpers

**Agent:** `backend-specialist`  
**Priority:** P0 | **Dependencies:** None | **Duration:** ~5 min

**INPUT:** `.env.local` configured  
**OUTPUT:** `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`  
**VERIFY:** Import in a page without TypeScript error

```
src/lib/supabase/
├── client.ts   → createBrowserClient() for "use client" components
└── server.ts   → createServerClient() with cookie handling for Server Components + middleware
```

---

#### T-02: Extend Middleware for Auth Guard

**Agent:** `security-auditor`  
**Priority:** P0 | **Dependencies:** T-01 | **Duration:** ~10 min

**INPUT:** `src/middleware.ts` (rate-limiting only)  
**OUTPUT:** Middleware that:
1. Keeps rate-limiting logic
2. Refreshes Supabase session via `createServerClient` + cookies
3. Redirects unauthenticated `/dashboard/*` → `/login`
4. Redirects authenticated users on `/login` → `/dashboard`

**VERIFY:**
- `/dashboard` without session → `/login` ✅
- `/login` while authenticated → `/dashboard` ✅

---

### PHASE 1 — AUTHENTICATION

#### T-03: Wire Login Form

**Agent:** `backend-specialist`  
**Priority:** P1 | **Dependencies:** T-01, T-02 | **Duration:** ~15 min

**File:** `src/app/login/page.tsx`  

**Frontend gaps (no layout change):**
1. Add `name="email"` to email input
2. Swap `onClick → router.push('/dashboard')` to `supabase.auth.signInWithPassword({ email, password })`
3. On success: `router.push('/dashboard')`
4. On error: set error state, display inline under button
5. Add loading state: `"Log In"` → `"Logging in..."`

**VERIFY:** Valid credentials → session set → `/dashboard` ✅

---

#### T-04: Signup Route + Auth Trigger

**Agent:** `backend-specialist`  
**Priority:** P1 | **Dependencies:** T-01 | **Duration:** ~20 min

**OUTPUT:**
1. `src/app/signup/page.tsx` — mirrors login layout, adds confirm-password field
2. On submit: `supabase.auth.signUp({ email, password })`
3. Auth trigger (upsert in Supabase):

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.storely_profiles (id, email, role)
  VALUES (new.id, new.email, 'vendor')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**VERIFY:** Signup → `storely_profiles` row created ✅

---

#### T-05: Wire Logout Button

**Agent:** `backend-specialist`  
**Priority:** P1 | **Dependencies:** T-01, T-02 | **Duration:** ~5 min

**File:** `src/app/dashboard/layout.tsx` (line 326)

**OUTPUT:** Replace `router.push('/login')` with:
```typescript
await supabase.auth.signOut()
router.push('/login')
```

**VERIFY:** Logout → session cleared → redirect to `/login` ✅

---

### PHASE 2 — STORE GUARD

#### T-06: Auto-Create Store on First Login

**Agent:** `backend-specialist`  
**Priority:** P2 | **Dependencies:** T-03, T-04 | **Duration:** ~15 min

**Problem:** `storely_stores` has 0 rows. All modules need `store_id`.

**File:** `src/app/dashboard/layout.tsx`

**OUTPUT:**
1. Call `useVendorStore()` on mount
2. If `store === null && !loading` → insert:
```typescript
await supabase.from('storely_stores').insert({
  owner_id: user.id,
  name: 'My Store',
  slug: `store-${user.id.slice(0, 8)}`,
})
```
3. Pass `store.id` via context or prop drilling to child pages

**VERIFY:** New user login → `storely_stores` gets a row ✅

---

### PHASE 3 — DATA MODULES (parallel after T-06)

#### T-07: Products — Replace Mock with Supabase

**Agent:** `backend-specialist`  
**Priority:** P3 | **Dependencies:** T-06 | **Duration:** ~30 min

**File:** `src/app/dashboard/products/page.tsx`

**Changes (no UI diff):**
1. Remove `import { products } from '@/data/products'`
2. Replace `useState(dashboardProducts)` with `useProducts(store?.id)` 
3. `handleAddProduct()` → `supabase.from('storely_products').insert({ store_id, name, price, status: 'active', slug, stock_quantity: 10 })`
4. If images → upload to Storage bucket `product-images`, insert URLs into `storely_product_images`
5. `handleEditProduct()` → `.update({ name, price }).eq('id', id)`
6. `handleDeleteSelected()` → `.delete().in('id', selectedProducts)`
7. All calls end with `refetch()`

**Field map:**
| UI | DB |
|----|----|
| `name` | `name` |
| `price` | `price` |
| `status` | `status` |
| `inventory` | `stock_quantity` formatted as "N In stock" |
| `sales` | `0` (no sales tracking in schema — keep static) |

**VERIFY:** Add product → row in `storely_products` → refresh still shows it ✅

---

#### T-08: Orders — Replace Mock with Supabase

**Agent:** `backend-specialist`  
**Priority:** P3 | **Dependencies:** T-06 | **Duration:** ~20 min

**File:** `src/app/dashboard/orders/page.tsx`

**OUTPUT:** Replace mock with `useOrders(store?.id)`. Map columns:

| UI | DB |
|----|----|
| `orderNumber` | `order_number` |
| `status` | `status` |
| `customer` | join `storely_customers(first_name, last_name)` |
| `total` | `total` |
| `date` | `created_at` |
| `payment` | `payment_status` |

**VERIFY:** Orders page shows live DB data ✅

---

#### T-09: Customers — Replace Mock with Supabase

**Agent:** `backend-specialist`  
**Priority:** P3 | **Dependencies:** T-06 | **Duration:** ~15 min

**File:** `src/app/dashboard/customers/page.tsx`

**OUTPUT:** Replace mock with `useCustomers(store?.id)`. Map:

| UI | DB |
|----|----|
| `name` | `first_name + last_name` |
| `email` | `email` |
| `orders` | `orders_count` |
| `spent` | `total_spent` |
| `joined` | `created_at` |

**VERIFY:** Customers page shows live DB data ✅

---

#### T-10: Discounts — Replace Mock + Wire Create/Delete

**Agent:** `backend-specialist`  
**Priority:** P3 | **Dependencies:** T-06 | **Duration:** ~20 min

**File:** `src/app/dashboard/discounts/page.tsx`

**OUTPUT:**
1. Replace mock with `useDiscounts(store?.id)`
2. Create → `supabase.from('storely_discounts').insert({ store_id, code, type, value })`
3. Delete → `.delete().eq('id', id)`

**VERIFY:** Create discount → row in `storely_discounts` ✅

---

#### T-11: Settings — Wire Save to Supabase

**Agent:** `backend-specialist`  
**Priority:** P3 | **Dependencies:** T-06 | **Duration:** ~15 min

**File:** `src/app/dashboard/settings/page.tsx`

**OUTPUT:**
1. Fetch store on mount via `useVendorStore()`
2. Pre-populate "Store Name" from `store.name`, "Support Email" from `store.email`
3. `handleSave()` → `supabase.from('storely_stores').update({ name, email }).eq('id', store.id)`
4. Keep `toast.success()` on success (already in UI)

**VERIFY:** Change name → save → refresh → name persists ✅

---

#### T-12: Store Builder — Persist StoreContext

**Agent:** `backend-specialist`  
**Priority:** P3 (lower urgency) | **Dependencies:** T-06 | **Duration:** ~25 min

**File:** `src/context/StoreContext.tsx`

**OUTPUT:**
1. On mount: fetch `storely_store_settings.page_config` and hydrate state
2. After mutations: debounced autosave (1500ms) to `storely_store_settings.page_config` as JSONB
3. All in-memory operations remain unchanged

**VERIFY:** Edit section → refresh → changes persist ✅

---

### PHASE 4 — SECURITY & CLEANUP

#### T-13: Audit RLS Policies

**Agent:** `security-auditor`  
**Priority:** P4 | **Dependencies:** All above | **Duration:** ~15 min

**OUTPUT:** Verify all `storely_*` tables have correct RLS policies. Template:
```sql
CREATE POLICY "vendor_own_store_access" ON storely_products
  FOR ALL USING (
    store_id IN (
      SELECT id FROM storely_stores WHERE owner_id = auth.uid()
    )
  );
```
Run `get_advisors` security check and fix all missing policies.

**VERIFY:** User A cannot query User B's products ✅

---

#### T-14: Remove Mock Data Import

**Agent:** `backend-specialist`  
**Priority:** P4 | **Dependencies:** T-07 | **Duration:** ~5 min

Remove `import { products } from '@/data/products'` and `dashboardProducts` from products page.

---

#### T-15: Environment Security Check

**Agent:** `security-auditor`  
**Priority:** P4 | **Dependencies:** None | **Duration:** ~5 min

1. Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` is publishable key only ✅ (`sb_publishable_...`)
2. Confirm `.env.local` is in `.gitignore`
3. No service_role key exposed client-side

---

## File Change Map

| File | Change Type | Tasks |
|------|-------------|-------|
| `src/lib/supabase/client.ts` | Create | T-01 |
| `src/lib/supabase/server.ts` | Create | T-01 |
| `src/middleware.ts` | Extend | T-02 |
| `src/app/login/page.tsx` | Wire auth | T-03 |
| `src/app/signup/page.tsx` | Create | T-04 |
| `src/app/dashboard/layout.tsx` | Wire logout + store guard | T-05, T-06 |
| `src/app/dashboard/products/page.tsx` | Swap mock → Supabase | T-07, T-14 |
| `src/app/dashboard/orders/page.tsx` | Swap mock → Supabase | T-08 |
| `src/app/dashboard/customers/page.tsx` | Swap mock → Supabase | T-09 |
| `src/app/dashboard/discounts/page.tsx` | Swap mock → Supabase | T-10 |
| `src/app/dashboard/settings/page.tsx` | Wire save | T-11 |
| `src/context/StoreContext.tsx` | Add persistence | T-12 |
| Supabase DB | Auth trigger migration | T-04 |
| Supabase DB | RLS policy audit | T-13 |

---

## Execution Order

```
T-01 → T-02 → T-03 → T-05
              T-03 → T-06 → T-07, T-08, T-09, T-10, T-11, T-12 (parallel)
T-04 → T-06
T-13 (after data modules)
T-14 (after T-07)
T-15 (anytime)
```

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| `storely_stores` has no row for test accounts | T-06 upserts on first dashboard load |
| Auth trigger missing → profile not created | T-04 creates trigger via migration |
| Product image upload fails | try/catch, toast error, save product without image |
| StoreContext autosave = too many DB calls | 1500ms debounce |
| RLS missing for a module | T-13 audits all tables |

---

## Phase X: Verification Checklist

### Auth
- [ ] Login with valid credentials → `/dashboard`
- [ ] Login with wrong password → error message shown
- [ ] Signup → `storely_profiles` row created
- [ ] Logout → session cleared, redirect to `/login`
- [ ] Direct nav to `/dashboard` without session → `/login`

### Data Modules
- [ ] Add product → row in `storely_products`
- [ ] Edit product → row updated in DB
- [ ] Delete product → row removed from DB
- [ ] Orders page displays live DB data
- [ ] Customers page displays live DB data
- [ ] Create discount → row in `storely_discounts`
- [ ] Settings save → `storely_stores` updated
- [ ] Store builder change → persists after refresh

### Security
- [ ] User A cannot see User B's products
- [ ] `.env.local` in `.gitignore`
- [ ] No service_role key in client code
- [ ] RLS advisors return 0 critical issues

### Build
- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run lint` — no lint errors

---

## ✅ PHASE X COMPLETE (fill after all checks pass)

- Lint: ⬜ Pending
- Security: ⬜ Pending
- Build: ⬜ Pending
- Date: -
