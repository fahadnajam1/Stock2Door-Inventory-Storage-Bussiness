/*
  # Create Contact Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Contact person's name
      - `email` (text) - Contact email address
      - `company` (text) - Company name (optional)
      - `message` (text) - Message content
      - `created_at` (timestamptz) - Submission timestamp
      - `status` (text) - Submission status (new, contacted, resolved)
  
  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert submissions
    - Admin access would be managed separately (not part of this promotional site)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);