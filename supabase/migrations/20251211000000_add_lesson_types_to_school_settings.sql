-- Migration: Add lesson_types column to school_settings table (if not exists)
-- Description: Adds a JSONB column to store configurable lesson types for the school.
-- Date: 2025-12-11

-- Check if column exists first to be idempotent-ish (though distinct migrations are better, this is safe)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'school_settings'
        AND column_name = 'lesson_types'
    ) THEN
        ALTER TABLE "school_settings" ADD COLUMN "lesson_types" JSONB DEFAULT '["Kite", "Wing", "Surf"]'::jsonb;
    END IF;
END $$;

-- Update RLS if needed?
-- Managers should be able to update this (FR022).
-- Existing RLS might cover it, or we need a new policy.
-- Assuming "manager" role can update "school_settings".

-- Verify RLS for school_settings
-- Enable RLS
ALTER TABLE "school_settings" ENABLE ROW LEVEL SECURITY;

-- Allow read for authenticated users (instructors need to see lesson types too)
CREATE POLICY "Allow read access for authenticated users" ON "school_settings"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Allow update for managers only
CREATE POLICY "Allow update access for managers" ON "school_settings"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'manager'
)
WITH CHECK (
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'manager'
);

-- Insert default row if empty (assuming one school setting row for now)
INSERT INTO "school_settings" (id, lesson_types)
SELECT 1, '["Kite", "Wing", "Surf"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM "school_settings");
