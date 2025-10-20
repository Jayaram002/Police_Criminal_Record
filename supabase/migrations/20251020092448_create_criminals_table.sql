/*
  # Create Criminal Records Database

  ## Overview
  Creates a comprehensive database structure for managing criminal records with personal information,
  physical descriptions, offense history, and status tracking.

  ## New Tables
  - `criminals`
    - `id` (text, primary key) - Person Number (like Aadhaar card number)
    - `first_name` (text) - Criminal's first name
    - `last_name` (text) - Criminal's last name
    - `dob` (date) - Date of birth
    - `address` (text) - Last known address
    - `status` (text) - Current status (Incarcerated, On Parole, Released, Wanted)
    - `photo_url` (text) - URL to photo
    - `last_seen` (text) - Last seen location/date information
    - `physical` (jsonb) - Physical description (height, weight, hair, eyes)
    - `offenses` (jsonb) - Array of offense records with crime, date, and severity
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on `criminals` table
  - Add policies for authenticated users to read all criminal records
  - Add policies for authenticated users to insert new records
  - Add policies for authenticated users to update existing records
  - Add policies for authenticated users to delete records
  - Add policies for anonymous users (public access for demo)

  ## Indexes
  - Index on first_name and last_name for search performance
  - Index on status for filtering
  - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS criminals (
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

ALTER TABLE criminals ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX IF NOT EXISTS criminals_name_idx ON criminals(first_name, last_name);
CREATE INDEX IF NOT EXISTS criminals_status_idx ON criminals(status);
CREATE INDEX IF NOT EXISTS criminals_created_at_idx ON criminals(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_criminals_updated_at ON criminals;
CREATE TRIGGER update_criminals_updated_at
  BEFORE UPDATE ON criminals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
