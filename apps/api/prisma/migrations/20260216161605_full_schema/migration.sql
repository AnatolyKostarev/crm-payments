/*
  Warnings:

  - A unique constraint covering the columns `[telegram_chat_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REVISION', 'IN_REGISTRY', 'PAID');

-- CreateEnum
CREATE TYPE "ApprovalCondition" AS ENUM ('ALWAYS', 'AMOUNT_ABOVE', 'AMOUNT_BELOW');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION');

-- CreateEnum
CREATE TYPE "RegistryStatus" AS ENUM ('FORMED', 'PAID');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPROVAL_REQUIRED', 'PAYMENT_APPROVED', 'PAYMENT_REJECTED', 'PAYMENT_REVISION', 'PAYMENT_IN_REGISTRY', 'PAYMENT_PAID');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telegram_chat_id" TEXT;

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "role_id" TEXT,
    "invited_by" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inn" TEXT NOT NULL,
    "kpp" TEXT,
    "bank_name" TEXT,
    "bik" TEXT,
    "account" TEXT,
    "tenant_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "contractor_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_requests" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "purpose" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'DRAFT',
    "author_id" TEXT NOT NULL,
    "contractor_id" TEXT NOT NULL,
    "contract_id" TEXT,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_routes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "approval_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_steps" (
    "id" TEXT NOT NULL,
    "step_order" INTEGER NOT NULL,
    "approver_id" TEXT NOT NULL,
    "condition" "ApprovalCondition" NOT NULL DEFAULT 'ALWAYS',
    "threshold" DOUBLE PRECISION,
    "route_id" TEXT NOT NULL,

    CONSTRAINT "approval_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "step_order" INTEGER NOT NULL,
    "decision" "ApprovalDecision" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "payment_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "decided_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_registries" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" "RegistryStatus" NOT NULL DEFAULT 'FORMED',
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_registries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registry_items" (
    "id" TEXT NOT NULL,
    "registry_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,

    CONSTRAINT "registry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "payment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_tenant_id_name_key" ON "roles"("tenant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_role_id_key" ON "user_roles"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "invites"("token");

-- CreateIndex
CREATE INDEX "invites_token_idx" ON "invites"("token");

-- CreateIndex
CREATE INDEX "invites_tenant_id_idx" ON "invites"("tenant_id");

-- CreateIndex
CREATE INDEX "contractors_tenant_id_idx" ON "contractors"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_tenant_id_inn_key" ON "contractors"("tenant_id", "inn");

-- CreateIndex
CREATE INDEX "contracts_tenant_id_idx" ON "contracts"("tenant_id");

-- CreateIndex
CREATE INDEX "contracts_contractor_id_idx" ON "contracts"("contractor_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_requests_number_key" ON "payment_requests"("number");

-- CreateIndex
CREATE INDEX "payment_requests_tenant_id_status_idx" ON "payment_requests"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "payment_requests_tenant_id_author_id_idx" ON "payment_requests"("tenant_id", "author_id");

-- CreateIndex
CREATE INDEX "payment_requests_tenant_id_contractor_id_idx" ON "payment_requests"("tenant_id", "contractor_id");

-- CreateIndex
CREATE INDEX "approval_routes_tenant_id_idx" ON "approval_routes"("tenant_id");

-- CreateIndex
CREATE INDEX "approval_steps_route_id_idx" ON "approval_steps"("route_id");

-- CreateIndex
CREATE INDEX "approvals_payment_id_idx" ON "approvals"("payment_id");

-- CreateIndex
CREATE INDEX "approvals_approver_id_decision_idx" ON "approvals"("approver_id", "decision");

-- CreateIndex
CREATE UNIQUE INDEX "payment_registries_number_key" ON "payment_registries"("number");

-- CreateIndex
CREATE INDEX "payment_registries_tenant_id_idx" ON "payment_registries"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "registry_items_registry_id_payment_id_key" ON "registry_items"("registry_id", "payment_id");

-- CreateIndex
CREATE INDEX "attachments_payment_id_idx" ON "attachments"("payment_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_chat_id_key" ON "users"("telegram_chat_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_contractor_id_fkey" FOREIGN KEY ("contractor_id") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_routes" ADD CONSTRAINT "approval_routes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_steps" ADD CONSTRAINT "approval_steps_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "approval_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_registries" ADD CONSTRAINT "payment_registries_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registry_items" ADD CONSTRAINT "registry_items_registry_id_fkey" FOREIGN KEY ("registry_id") REFERENCES "payment_registries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registry_items" ADD CONSTRAINT "registry_items_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
