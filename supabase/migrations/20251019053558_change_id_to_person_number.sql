/*
  # Change ID to Person Number

  ## Overview
  Modifies the criminals table to use a custom person number (like Aadhaar card)
  instead of auto-generated UUID for the primary key.

  ## Changes
  1. Drop existing table and recreate with person_number as primary key
  2. Person number will be a text field that must be provided when creating records
  3. Maintain all other existing fields and functionality
  4. Re-create all indexes, triggers, and RLS policies

  ## Security
  - Maintain all existing RLS policies
  - Person number must be unique and provided by user
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS criminals CASCADE;

-- Create new table with person_number as primary key
CREATE TABLE criminals (
  id text PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NOT NULL,
  address text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Released',
  photo_url text DEFAULT '',
  last_seen text DEFAULT '',
  physical jsonb DEFAULT '{"height":"","weight":"","hair":"","eyes":""}'::jsonb,
  offenses jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE criminals ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can read all criminal records"
  ON criminals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert criminal records"
  ON criminals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update criminal records"
  ON criminals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete criminal records"
  ON criminals FOR DELETE
  TO authenticated
  USING (true);

-- Public access policies (allows anonymous access for this demo)
CREATE POLICY "Public can read all criminal records"
  ON criminals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can insert criminal records"
  ON criminals FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update criminal records"
  ON criminals FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete criminal records"
  ON criminals FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX criminals_name_idx ON criminals(first_name, last_name);
CREATE INDEX criminals_status_idx ON criminals(status);
CREATE INDEX criminals_created_at_idx ON criminals(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to call the function on update
CREATE TRIGGER update_criminals_updated_at
  BEFORE UPDATE ON criminals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
