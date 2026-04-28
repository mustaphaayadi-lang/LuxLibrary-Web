import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fgaiyhazcoztorowtgmr.supabase.co'
const SUPABASE_KEY = 'sb_publishable_sYbrzzRMl4sAEWs-hRoG2A_boYEaVDf'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)