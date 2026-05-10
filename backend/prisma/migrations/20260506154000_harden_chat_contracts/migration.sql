-- Add idempotency key for client retries.
ALTER TABLE "ChatMessage" ADD COLUMN "clientId" TEXT;

-- Fast timeline reads per user.
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "ChatMessage"("userId", "createdAt");

-- Ignore duplicated sends from the same user/client message id.
CREATE UNIQUE INDEX "ChatMessage_userId_clientId_key" ON "ChatMessage"("userId", "clientId");
