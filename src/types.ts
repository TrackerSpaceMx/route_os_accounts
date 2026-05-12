export interface Account {
  id: number;
  slug: string;
  name: string;
  company: string;
  rfc: string;
  address: string;
  api_key: string;
  secret_key: string;
  created_at: Date;
}