export interface Link {
  id: number;
  code: string;
  url: string;
  click_count: number;
  created_at: string;
  last_clicked_at: string | null;
}
